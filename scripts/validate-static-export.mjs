import { createReadStream, existsSync, rmSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const root = path.resolve("out");
const officialOrigin = "https://casasmilagres.com.br";
const publicPages = [
  "/",
  "/casas/",
  "/casas/casa-turquesa-05/",
  "/casas/casa-corais-milagres/",
  "/contato/",
];
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveStaticPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]).replace(/\\/g, "/");
  let candidate = path.normalize(path.join(root, decoded));
  if (!candidate.startsWith(root)) return null;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    candidate = path.join(candidate, "index.html");
  }
  return candidate;
}

function createStaticServer() {
  return http.createServer((request, response) => {
    const filePath = resolveStaticPath(request.url || "/");

    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
      const notFoundPath = path.join(root, "404.html");
      response.writeHead(404, { "content-type": mimeTypes[".html"] });
      createReadStream(notFoundPath).pipe(response);
      return;
    }

    response.writeHead(200, {
      "content-type":
        mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  });
}

async function fetchText(url) {
  const response = await fetch(url);
  return {
    status: response.status,
    text: await response.text(),
  };
}

async function fetchStatus(url) {
  const response = await fetch(url);
  await response.arrayBuffer();
  return response.status;
}

class CDP {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.id = 0;
    this.pending = new Map();
    this.handlers = [];
  }

  async connect() {
    this.ws = new WebSocket(this.webSocketUrl);
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("CDP websocket timeout")), 10_000);
      this.ws.onopen = () => {
        clearTimeout(timeout);
        resolve();
      };
      this.ws.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("CDP websocket error"));
      };
    });

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error)
          reject(new Error(message.error.message || JSON.stringify(message.error)));
        else resolve(message.result);
        return;
      }
      if (message.method) this.handlers.forEach((handler) => handler(message));
    };
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timeout`));
      }, 15_000);

      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timeout);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      });
    });
  }

  on(handler) {
    this.handlers.push(handler);
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

async function waitForDebugging(port) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await sleep(125);
  }
  throw new Error("Edge remote debugging did not start");
}

async function newTarget(port, url) {
  let response = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`,
    { method: "PUT" },
  );
  if (!response.ok) {
    response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`);
  }
  if (!response.ok) throw new Error(`Could not create Edge target: ${response.status}`);
  return response.json();
}

async function evalValue(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime evaluation failed");
  }
  return result.result.value;
}

async function navigate(cdp, url, waitMs = 1800) {
  await cdp.send("Page.navigate", { url });
  await sleep(waitMs);
}

async function waitFor(cdp, expression, timeoutMs = 6000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await evalValue(cdp, expression)) return true;
    await sleep(200);
  }
  return false;
}

function findEdge() {
  return [
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    process.env.MSEDGE_PATH,
  ]
    .filter(Boolean)
    .find((candidate) => existsSync(candidate));
}

async function runBrowserTests(baseUrl, report) {
  const edgePath = findEdge();
  if (!edgePath) {
    report.fail("browser interactive tests", "Microsoft Edge not found");
    return;
  }

  const debugPort = 9500 + Math.floor(Math.random() * 300);
  const profilePath = path.join(
    process.env.TEMP || ".",
    `casas-milagres-edge-${Date.now()}`,
  );
  const edge = spawn(
    edgePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-extensions",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profilePath}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let cdp;

  try {
    await waitForDebugging(debugPort);
    const target = await newTarget(debugPort, `${baseUrl}/`);
    cdp = new CDP(target.webSocketDebuggerUrl);
    const consoleIssues = [];
    const networkIssues = [];

    await cdp.connect();
    cdp.on((message) => {
      if (message.method === "Runtime.exceptionThrown") consoleIssues.push("exception");
      if (
        message.method === "Log.entryAdded" &&
        ["error", "warning"].includes(message.params.entry.level)
      ) {
        consoleIssues.push(message.params.entry.text);
      }
      if (
        message.method === "Runtime.consoleAPICalled" &&
        ["error", "warning"].includes(message.params.type)
      ) {
        consoleIssues.push(message.params.type);
      }
      if (message.method === "Network.responseReceived") {
        const { status, url } = message.params.response;
        if (status >= 400 && url.startsWith(baseUrl)) {
          networkIssues.push(`${status} ${new URL(url).pathname}`);
        }
      }
      if (message.method === "Network.loadingFailed" && !message.params.canceled) {
        networkIssues.push(message.params.errorText || "failed request");
      }
    });

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    await cdp.send("Log.enable");
    await sleep(1200);

    const slider = await evalValue(
      cdp,
      `new Promise((resolve) => {
      const track = document.querySelector('div[style*="translateX"]');
      const before = track ? getComputedStyle(track).transform : "";
      const button = [...document.querySelectorAll('button[aria-label]')]
        .find((item) => (item.getAttribute('aria-label') || "").includes("xima imagem"));
      if (!track || !button) return resolve({ ok: false, reason: "missing slider controls" });
      button.click();
      setTimeout(() => resolve({ ok: before !== getComputedStyle(track).transform }), 700);
    })`,
    );
    if (slider.ok) report.pass("slider desktop", "transform changed");
    else report.fail("slider desktop", slider.reason);

    const lightbox = await evalValue(
      cdp,
      `new Promise((resolve) => {
      const open = [...document.querySelectorAll('button[aria-label]')]
        .find((item) => (item.getAttribute('aria-label') || "").startsWith("Ver todas as fotos"));
      if (!open) return resolve({ ok: false, reason: "open button missing" });
      open.click();
      setTimeout(() => {
        const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
        const close = document.querySelector('button[aria-label="Fechar galeria"]');
        if (!dialog || !close) return resolve({ ok: false, reason: "dialog missing" });
        close.click();
        setTimeout(() => resolve({ ok: !document.querySelector('[role="dialog"][aria-modal="true"]') }), 250);
      }, 350);
    })`,
    );
    if (lightbox.ok) report.pass("lightbox", "opens and closes");
    else report.fail("lightbox", lightbox.reason);

    for (const width of [320, 360, 390, 430]) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      });
      await navigate(cdp, `${baseUrl}/`, 900);
      const mobileGuestField = await evalValue(
        cdp,
        `(() => {
          const input = document.querySelector('input[aria-label="Quantidade de hóspedes"]');
          if (!input) return { ok: false, reason: "guest input missing" };
          const rect = input.getBoundingClientRect();
          return {
            ok:
              rect.left >= 0 &&
              rect.right <= window.innerWidth &&
              Number.parseFloat(getComputedStyle(input).fontSize) >= 16 &&
              input.inputMode === "numeric",
            left: rect.left,
            right: rect.right,
            viewport: window.innerWidth,
            fontSize: getComputedStyle(input).fontSize,
            inputMode: input.inputMode,
          };
        })()`,
      );
      if (mobileGuestField.ok) {
        report.pass(`guest field mobile ${width}px`, "fits viewport with numeric input");
      } else {
        report.fail(`guest field mobile ${width}px`, JSON.stringify(mobileGuestField));
      }
    }

    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await navigate(cdp, `${baseUrl}/`);
    const mobileMenu = await evalValue(
      cdp,
      `new Promise((resolve) => {
      const button = document.querySelector('button[aria-controls="mobile-menu"]');
      const menu = document.querySelector('#mobile-menu');
      if (!button || !menu) return resolve({ ok: false });
      button.click();
      setTimeout(() => {
        const style = getComputedStyle(menu);
        resolve({
          ok: button.getAttribute('aria-expanded') === "true" &&
            Number(style.opacity) > 0.9 &&
            document.body.style.overflow === "hidden",
        });
      }, 350);
    })`,
    );
    if (mobileMenu.ok) report.pass("mobile menu", "opens on mobile viewport");
    else report.fail("mobile menu", JSON.stringify(mobileMenu));
    await evalValue(
      cdp,
      `document.querySelector('button[aria-controls="mobile-menu"]')?.click(); true`,
    );

    await cdp.send("Emulation.clearDeviceMetricsOverride");
    await navigate(cdp, `${baseUrl}/contato/?utm=static#consultar`, 2600);
    await waitFor(
      cdp,
      `[...document.querySelectorAll('button[aria-label]')]
      .some((item) => (item.getAttribute('aria-label') || "").includes("Selecionar data de entrada"))`,
    );

    const calendar = await evalValue(
      cdp,
      `new Promise((resolve) => {
      const byLabel = (label) => [...document.querySelectorAll('button[aria-label]')]
        .find((item) => (item.getAttribute('aria-label') || "").includes(label));
      const trigger = byLabel("Selecionar data de entrada");
      if (!trigger) return resolve({ ok: false, reason: "date trigger missing" });
      trigger.click();

      let attempts = 0;
      const findDates = () => {
        const blocked = byLabel("10/09/2026 indispon");
        const checkIn = byLabel("16/09/2026 dispon");
        const checkOut = byLabel("20/09/2026 dispon");
        if (checkIn && checkOut) {
          if (blocked) return resolve({ ok: false, reason: "unexpected blocked date" });
          checkIn.click();
          setTimeout(() => {
            checkOut.click();
            setTimeout(() => {
              resolve({
                  ok: document.body.textContent.includes("16/09/2026") &&
                  document.body.textContent.includes("20/09/2026"),
                selected: document.body.textContent.includes("16/09/2026"),
                blockedPresent: !!blocked,
              });
            }, 350);
          }, 150);
          return;
        }

        const nextMonth = [...document.querySelectorAll('button[aria-label]')]
          .find((item) => (item.getAttribute('aria-label') || "").includes("ximo m"));
        if (!nextMonth || attempts > 12) {
          return resolve({
            ok: false,
            blockedPresent: !!blocked,
            checkIn: !!checkIn,
            checkOut: !!checkOut,
            attempts,
          });
        }
        attempts += 1;
        nextMonth.click();
        setTimeout(findDates, 120);
      };

      setTimeout(findDates, 250);
    })`,
    );
    if (calendar.ok)
      report.pass(
        "availability calendar",
        "opens compact selector with no test blocks and selects range",
      );
    else report.fail("availability calendar", JSON.stringify(calendar));

    const guestEditing = await evalValue(
      cdp,
      `new Promise(async (resolve) => {
      const adults = document.querySelector('input[name="adults"]');
      const children = document.querySelector('input[name="children"]');
      const submit = document.querySelector('button[type="submit"]');
      if (!adults || !children || !submit) {
        return resolve({ ok: false, reason: "guest fields missing" });
      }

      const inputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      const setValue = (element, value) => {
        inputSetter.call(element, value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      };
      const pause = (duration = 100) => new Promise((done) => setTimeout(done, duration));

      adults.focus();
      setValue(adults, "");
      await pause();
      const adultsCanBeEmpty = adults.value === "";
      adults.blur();
      await pause();
      const adultsBlurToMinimum = adults.value === "1";

      setValue(adults, "5");
      await pause();
      const adultsCanBeReplaced = adults.value === "5";

      children.focus();
      setValue(children, "");
      await pause();
      const childrenCanBeEmpty = children.value === "";
      setValue(children, "3");
      await pause();
      const childrenCanBeReplaced = children.value === "3";
      setValue(children, "");
      await pause();
      children.blur();
      await pause();
      const childrenBlurToMinimum = children.value === "0";

      setValue(children, "2");
      setValue(adults, "14");
      await pause(180);
      const capacityBlocked =
        submit.disabled === true &&
        (document.body.textContent || "").includes("recebe até 14 hóspedes");

      setValue(adults, "-1");
      adults.focus();
      adults.blur();
      await pause();
      const negativeCorrected = adults.value === "1";

      setValue(adults, "5");
      setValue(children, "2");
      await pause(180);

      resolve({
        ok:
          adultsCanBeEmpty &&
          adultsBlurToMinimum &&
          adultsCanBeReplaced &&
          childrenCanBeEmpty &&
          childrenCanBeReplaced &&
          childrenBlurToMinimum &&
          capacityBlocked &&
          negativeCorrected &&
          adults.value === "5" &&
          children.value === "2",
        adultsCanBeEmpty,
        adultsBlurToMinimum,
        adultsCanBeReplaced,
        childrenCanBeEmpty,
        childrenCanBeReplaced,
        childrenBlurToMinimum,
        capacityBlocked,
        negativeCorrected,
        finalAdults: adults.value,
        finalChildren: children.value,
      });
    })`,
    );
    if (guestEditing.ok) {
      report.pass("guest input editing", "empty state, replacement, blur and capacity");
    } else {
      report.fail("guest input editing", JSON.stringify(guestEditing));
    }

    await evalValue(
      cdp,
      `(() => {
        const adults = document.querySelector('input[name="adults"]');
        if (!adults) return false;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        setter.call(adults, "3");
        adults.dispatchEvent(new Event("input", { bubbles: true }));
        adults.dispatchEvent(new Event("change", { bubbles: true }));
        adults.focus();
        return true;
      })()`,
    );
    await sleep(120);
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "a",
      code: "KeyA",
      modifiers: 2,
    });
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "a",
      code: "KeyA",
      modifiers: 2,
    });
    await cdp.send("Input.insertText", { text: "8" });
    await sleep(180);
    const keyboardReplacement = await evalValue(
      cdp,
      `(() => {
        const adults = document.querySelector('input[name="adults"]');
        const children = document.querySelector('input[name="children"]');
        if (!adults || !children) return { ok: false, reason: "guest fields missing" };
        const observedValue = adults.value;
        const replaced = observedValue === "8";
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        const setValue = (element, value) => {
          setter.call(element, value);
          element.dispatchEvent(new Event("input", { bubbles: true }));
          element.dispatchEvent(new Event("change", { bubbles: true }));
        };
        setValue(adults, "5");
        setValue(children, "2");
        return { ok: replaced, value: observedValue };
      })()`,
    );
    if (keyboardReplacement.ok) {
      report.pass("guest keyboard replacement", "3 to 8 with Ctrl+A");
    } else {
      report.fail("guest keyboard replacement", JSON.stringify(keyboardReplacement));
    }
    await sleep(180);

    const formResult = await evalValue(
      cdp,
      `new Promise((resolve) => {
      window.__opened = null;
      window.open = (url, target, features) => {
        window.__opened = { url, target, features };
        return null;
      };
      const form = document.querySelector('form');
      const name = document.querySelector('input[autocomplete="name"]');
      const notes = document.querySelector('textarea');
      const preReservation = [...document.querySelectorAll('button')]
        .find((item) => item.textContent.includes("dados de pré-reserva"));
      preReservation?.click();
      setTimeout(() => {
      const cpf = document.querySelector('input[placeholder="000.000.000-00"]');
      const birth = document.querySelector('input[autocomplete="bday"]');
      if (!form || !name || !cpf || !birth || !notes) {
        return resolve({ ok: false, reason: "form fields missing" });
      }
      const inputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      const textSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
      const setValue = (element, value) => {
        const setter = element.tagName === "TEXTAREA" ? textSetter : inputSetter;
        setter.call(element, value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      };
      setValue(name, "Joao da Silva");
      setValue(cpf, "52998224725");
      setValue(birth, "15051990");
      setValue(notes, "Teste export estatico");
      setTimeout(() => {
        form.requestSubmit();
        setTimeout(() => resolve({ ok: !!window.__opened, opened: window.__opened }), 600);
      }, 120);
      }, 120);
    })`,
    );
    const decodedWhatsApp = formResult.opened?.url
      ? decodeURIComponent(formResult.opened.url)
      : "";
    const validWhatsApp =
      formResult.ok &&
      /^https:\/\/wa\.me\/\d{12,13}\?text=/.test(formResult.opened.url || "") &&
      decodedWhatsApp.includes("CPF: 529.982.247-25") &&
      decodedWhatsApp.includes("Nascimento: 15/05/1990") &&
      decodedWhatsApp.includes("Adultos: 5") &&
      decodedWhatsApp.includes("Crianças: 2");
    if (validWhatsApp) report.pass("WhatsApp form", "opens encoded professional message");
    else report.fail("WhatsApp form", JSON.stringify(formResult));

    await navigate(
      cdp,
      `${baseUrl}/contato/?casa=casa-turquesa-05&checkIn=2026-09-16&checkOut=2026-09-24&adults=20#consultar`,
      2600,
    );
    await waitFor(cdp, `document.querySelector('select')?.value === "casa-turquesa-05"`);
    const bookingRules = await evalValue(
      cdp,
      `new Promise((resolve) => {
        setTimeout(() => {
          const text = document.body.textContent || "";
          const adults = document.querySelector('input[name="adults"]');
          const submit = document.querySelector('button[type="submit"]');
          resolve({
            ok:
              text.includes("4 noites") &&
              adults?.value === "14" &&
              submit?.disabled === true,
            hasNightError: text.includes("4 noites"),
            adultValue: adults?.value || null,
            submitDisabled: submit?.disabled === true,
          });
        }, 500);
      })`,
    );
    if (bookingRules.ok) {
      report.pass("booking rule validation", "blocks long stays and clamps guests");
    } else {
      report.fail("booking rule validation", JSON.stringify(bookingRules));
    }

    await navigate(cdp, `${baseUrl}/casas/casa-turquesa-05/`, 2600);
    await waitFor(cdp, `document.querySelector('select')?.value === "casa-turquesa-05"`);
    const housePage = await evalValue(
      cdp,
      `({
      hasCalendar: [...document.querySelectorAll('button[aria-label]')]
        .some((item) => (item.getAttribute('aria-label') || "").includes("Selecionar data de entrada")),
      hasMap: [...document.querySelectorAll('a')].some((item) => item.href.startsWith("https://www.google.com/maps")) &&
        [...document.querySelectorAll('a')].some((item) => item.href.startsWith("https://waze.com/")),
      hasAutoHouse: document.querySelector('select')?.value === "casa-turquesa-05",
      hasHero: !!document.querySelector('img[src*="casa-01"]') || !!document.querySelector('video'),
    })`,
    );
    if (
      housePage.hasCalendar &&
      housePage.hasMap &&
      housePage.hasAutoHouse &&
      housePage.hasHero
    ) {
      report.pass(
        "house detail",
        "compact date selector, map, auto house and hero present",
      );
    } else {
      report.fail("house detail", JSON.stringify(housePage));
    }

    for (const expectedLocation of [
      {
        slug: "casa-turquesa-05",
        residence: "Huna Residence",
        googlePlace: "Huna+Residence",
        coordinates: "-9.3054049,-35.4063443",
      },
      {
        slug: "casa-corais-milagres",
        residence: "Naluum Residence",
        googlePlace: "Naluum+Residence",
        coordinates: "-9.2933771,-35.3972914",
      },
    ]) {
      await navigate(cdp, `${baseUrl}/casas/${expectedLocation.slug}/`, 1800);
      const mapLocation = await evalValue(
        cdp,
        `(() => {
          const googleLink = [...document.querySelectorAll('a')]
            .find((item) => item.textContent.includes("Google Maps"));
          const wazeLink = [...document.querySelectorAll('a')]
            .find((item) => item.textContent.includes("Waze"));
          const mapFrame = document.querySelector('iframe[title^="Mapa de"]');
          const expected = ${JSON.stringify(expectedLocation)};
          const embeddedQuery = mapFrame
            ? new URL(mapFrame.src).searchParams.get("q")
            : null;
          const wazeCoordinates = wazeLink
            ? new URL(wazeLink.href).searchParams.get("ll")
            : null;
          return {
            ok:
              googleLink?.href.includes(expected.googlePlace) &&
              wazeCoordinates === expected.coordinates &&
              embeddedQuery === expected.coordinates &&
              (document.body.textContent || "").includes(expected.residence),
            googleUrl: googleLink?.href || null,
            wazeCoordinates,
            embeddedQuery,
            hasResidence: (document.body.textContent || "").includes(expected.residence),
          };
        })()`,
      );
      if (mapLocation.ok) {
        report.pass(`exact map ${expectedLocation.slug}`, expectedLocation.residence);
      } else {
        report.fail(`exact map ${expectedLocation.slug}`, JSON.stringify(mapLocation));
      }
    }

    const badConsole = consoleIssues.filter(
      (issue) =>
        !/favicon|Tracking Prevention blocked access to storage|google\.com\/maps|google\.com\/gen_204/i.test(
          issue,
        ),
    );
    const badNetwork = [...new Set(networkIssues)].filter(
      (issue) => !issue.includes("/404"),
    );
    if (badConsole.length) {
      report.fail("browser console", badConsole.slice(0, 5).join(" | "));
    } else {
      report.pass("browser console", "no app warnings/errors captured");
    }
    if (badNetwork.length) {
      report.fail("browser network", badNetwork.slice(0, 8).join(" | "));
    } else {
      report.pass("browser network", "no broken same-origin requests captured");
    }
  } finally {
    if (cdp) cdp.close();
    edge.kill();
    try {
      rmSync(profilePath, { recursive: true, force: true });
    } catch {}
  }
}

async function runHttpTests(baseUrl, report) {
  const routes = [
    "/",
    "/?utm=static",
    "/#consultar",
    "/casas/",
    "/casas/casa-turquesa-05/",
    "/casas/casa-corais-milagres/",
    "/casas/casa-turquesa-05/?canal=teste#consultar",
    "/contato/",
    "/acomodacoes/",
    "/acomodacoes/casa-turquesa-05/",
    "/hospedagens/",
    "/hospedagens/casa-corais-milagres/",
    "/sobre/",
    "/404.html",
  ];

  for (const route of routes) {
    const response = await fetchText(`${baseUrl}${route}`);
    const ok = response.status === 200 && /<!DOCTYPE html>/i.test(response.text);
    if (ok) report.pass(`refresh ${route}`, "HTML");
    else report.fail(`refresh ${route}`, `status=${response.status}`);
  }

  for (const file of [
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
    "/icon.svg",
    "/.nojekyll",
    "/.htaccess",
    "/_redirects",
  ]) {
    const status = await fetchStatus(`${baseUrl}${file}`);
    if (status === 200) report.pass(`static file ${file}`, "200");
    else report.fail(`static file ${file}`, `status=${status}`);
  }

  const sitemapResponse = await fetchText(`${baseUrl}/sitemap.xml`);
  const sitemapUrls = [...sitemapResponse.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  const sitemapDates = [
    ...sitemapResponse.text.matchAll(/<lastmod>([^<]+)<\/lastmod>/g),
  ].map((match) => match[1]);
  const expectedSitemapUrls = publicPages.map((page) =>
    new URL(page, officialOrigin).toString(),
  );
  const validSitemap =
    sitemapResponse.status === 200 &&
    JSON.stringify(sitemapUrls) === JSON.stringify(expectedSitemapUrls) &&
    sitemapDates.length === expectedSitemapUrls.length &&
    sitemapDates.every((date) => !Number.isNaN(Date.parse(date)));
  if (validSitemap) {
    report.pass(
      "sitemap content",
      `${sitemapUrls.length} canonical URLs with lastModified`,
    );
  } else {
    report.fail("sitemap content", JSON.stringify({ sitemapUrls, sitemapDates }));
  }

  const robotsResponse = await fetchText(`${baseUrl}/robots.txt`);
  const validRobots =
    robotsResponse.status === 200 &&
    /User-Agent:\s*\*/i.test(robotsResponse.text) &&
    /Allow:\s*\//i.test(robotsResponse.text) &&
    robotsResponse.text.includes(`Sitemap: ${officialOrigin}/sitemap.xml`);
  if (validRobots) {
    report.pass("robots content", "crawl allowed and canonical sitemap declared");
  } else {
    report.fail("robots content", robotsResponse.text.trim());
  }

  const pages = publicPages;
  const assets = new Set();
  const links = new Set();
  const attrPattern = /(?:href|src)=["']([^"']+)["']/gi;

  for (const page of pages) {
    const { text } = await fetchText(`${baseUrl}${page}`);
    const canonical = text.match(/<link rel="canonical" href="([^"]+)"\s*\/?\s*>/i)?.[1];
    const expectedCanonical = new URL(page, officialOrigin).toString();
    if (canonical === expectedCanonical) {
      report.pass(`canonical ${page}`, expectedCanonical);
    } else {
      report.fail(`canonical ${page}`, canonical || "missing");
    }

    let match;
    while ((match = attrPattern.exec(text))) {
      const raw = match[1];
      if (
        !raw ||
        raw.startsWith("data:") ||
        raw.startsWith("mailto:") ||
        raw.startsWith("tel:") ||
        raw.startsWith("https://wa.me") ||
        raw.startsWith("https://www.instagram.com") ||
        raw.startsWith("https://www.google.com") ||
        raw.startsWith("https://waze.com")
      ) {
        continue;
      }

      const url = new URL(raw, `${baseUrl}${page}`);
      if (url.origin !== baseUrl) continue;
      if (url.hash) url.hash = "";

      if (
        url.pathname.startsWith("/_next/") ||
        /\.(css|js|ico|svg|png|jpe?g|webp|avif|woff2?)$/i.test(url.pathname)
      ) {
        assets.add(url.pathname + url.search);
      } else {
        links.add(url.pathname + url.search);
      }
    }
  }

  for (const asset of assets) {
    const status = await fetchStatus(`${baseUrl}${asset}`);
    if (status !== 200) report.fail(`asset ${asset}`, `status=${status}`);
  }
  report.pass("asset crawl", `${assets.size} assets checked`);

  for (const link of links) {
    const status = await fetchStatus(`${baseUrl}${link}`);
    if (status !== 200 && status !== 404)
      report.fail(`internal link ${link}`, `status=${status}`);
  }
  report.pass("internal link crawl", `${links.size} links checked`);
}

async function main() {
  if (!existsSync(root)) throw new Error("out/ does not exist. Run npm run build first.");

  const results = [];
  const report = {
    pass(name, detail = "") {
      results.push({ name, ok: true, detail });
    },
    fail(name, detail = "") {
      results.push({ name, ok: false, detail });
    },
  };

  const server = createStaticServer();
  const port = await new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server.address().port)),
  );
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await runHttpTests(baseUrl, report);
    await runBrowserTests(baseUrl, report);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  const failed = results.filter((result) => !result.ok);
  for (const result of results) {
    console.log(
      `${result.ok ? "PASS" : "FAIL"} ${result.name}${result.detail ? ` - ${result.detail}` : ""}`,
    );
  }
  console.log(`SUMMARY ${results.length - failed.length}/${results.length} passed`);
  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

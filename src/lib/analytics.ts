type TrackEventPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, payload: TrackEventPayload = {}) {
  if (process.env.NODE_ENV !== "development") return;

  const safePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => !["cpf", "name", "birthDate"].includes(key)),
  );

  console.debug("[analytics]", eventName, safePayload);
}

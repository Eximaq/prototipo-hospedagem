# Arquitetura de Disponibilidade

## Fluxo de Dados

```text
ICS Casa Turquesa ──┐
                    ├── parseICS() ── mergeUnavailableRanges()
ICS Casa Corais ────┘                         │
                                             ↓
                              generated/availability.json
                                             ↓
                                    site estático / WhatsApp
```

O parsing acontece antes do build ou em um job seguro. O front-end nunca baixa
ICS e continua compatível com `output: "export"`, Apache, Nginx, cPanel, GitHub
Pages, Cloudflare Pages, Netlify e Vercel.

## Convenção de Datas

Todo intervalo usa `[startDate, endDate)` internamente e `{ start, end }` no JSON
público. `start` é a primeira noite ocupada e `end` é a data de saída, exclusiva.
Uma reserva de `2026-09-10` a `2026-09-15` bloqueia as noites de 10 a 14; o dia
15 pode ser uma nova entrada.

Datas de dia inteiro são preservadas como datas locais. Eventos com timezone são
convertidos para `America/Sao_Paulo`. Os utilitários evitam interpretar
`YYYY-MM-DD` diretamente como um instante UTC.

## Parser

`src/lib/availability/parse-ical.ts` usa `node-ical` apenas no ambiente Node. A
biblioteca foi escolhida para tratar RFC 5545, CRLF, linhas dobradas, parâmetros,
DATE, DATE-TIME, timezones, `RRULE`, `EXDATE` e overrides de recorrência sem um
parser manual frágil. A versão `0.26.0` foi fixada por ser compatível com Node 20+
e fornecer tipos TypeScript.

Eventos `STATUS:CANCELLED` são descartados por uma única regra central. Os demais
eventos válidos viram apenas intervalos. Recorrências sem fim são expandidas em
uma janela limitada a cinco anos antes e cinco anos depois da data de geração;
essa janela pode ser sobrescrita em testes ou jobs específicos.

## Fontes de Calendário

O contrato `CalendarSource` desacopla origem e processamento:

- `LocalICSCalendarSource`: lê snapshots privados de desenvolvimento.
- `RemoteICSCalendarSource`: lê uma URL privada em script Node ou CI.

Trocar arquivo local por Amenitiz/Airbnb remoto não exige alteração em nenhum
componente React.

## Normalização e Merge

`mergeUnavailableRanges()` ordena e une sobreposições e intervalos adjacentes.
As casas são processadas de forma independente: `casa-01` nunca recebe eventos
de `casa-02`, e vice-versa.

O JSON público tem este formato:

```json
{
  "updatedAt": "2026-08-19T12:00:00.000Z",
  "houses": {
    "casa-01": {
      "houseId": "casa-01",
      "updatedAt": "2026-08-19T12:00:00.000Z",
      "unavailableRanges": [
        { "start": "2026-09-10", "end": "2026-09-15" }
      ]
    }
  }
}
```

Nenhum UID, resumo, descrição, nome, e-mail, telefone, plataforma ou URL é
serializado. Bloqueios manuais de `src/data/reservations.ts` são mesclados apenas
em memória durante o build.

## Segurança

Snapshots reais ficam em `calendar-fixtures/*.ics` e são ignorados pelo Git.
URLs remotas usam somente `CASA_TURQUESA_ICAL_URL` e `CASA_CORAIS_ICAL_URL`, sem
prefixo `NEXT_PUBLIC_`. Erros e resumos do gerador mostram apenas a casa e as
contagens, nunca conteúdo ou endereço do calendário.

## Sincronização Remota e Fallback

`npm run availability:sync` lê as variáveis privadas, aplica timeout de 15
segundos e valida status HTTP, tipo de conteúdo, envelope iCalendar, eventos e
datas. As duas casas são processadas em memória antes de qualquer escrita.

O gerador cria um arquivo temporário e só então faz a substituição atômica. Se
uma das casas falhar, nenhuma alteração parcial é publicada e o último
`availability.json` válido permanece intacto. Isso evita interpretar falhas de
rede como disponibilidade total.

## Automação

Um GitHub Actions, cron, Worker, Function ou servidor autorizado poderá:

1. Ler os dois links iCal dos secrets.
2. Executar `npm run availability:sync`.
3. Validar o JSON normalizado em memória.
4. Executar `npm run build`.
5. Publicar somente `out/`.

O site não exige SSR, API Route, Server Action, middleware, banco de dados ou
Node.js no servidor de hospedagem.

O workflow de referência roda uma vez por hora. Hospedagens estáticas que não
executam jobs devem receber um novo `out/` produzido pelo CI ou por outra máquina.

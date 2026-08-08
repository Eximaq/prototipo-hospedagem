# Arquitetura de Disponibilidade

## Convenção de Datas

Todo intervalo de reserva usa a convenção `[startDate, endDate)`.

- `startDate` é a primeira noite ocupada.
- `endDate` é a data de saída, exclusiva.
- Uma reserva de `2026-09-10` a `2026-09-15` bloqueia os dias 10, 11, 12, 13 e 14.
- O dia `2026-09-15` volta a ficar disponível como nova entrada.

As comparações usam utilitários de data local em `src/lib/availability/date-utils.ts`.
O projeto evita `new Date("YYYY-MM-DD")` para não sofrer deslocamento por UTC.

## Modelo Unificado

O tipo `Reservation` fica em `src/lib/availability/types.ts`.

Ele representa reservas confirmadas, bloqueios administrativos, reservas diretas,
eventos importados de Airbnb, Booking, Vrbo, Google Calendar, iCal genérico ou
outra origem futura.

O calendário público nunca precisa receber nome de hóspede, e-mail, telefone,
CPF, código privado ou observações internas. A UI consome apenas:

- `houseId`
- `unavailableRanges`

## Providers

A interface central é:

```ts
interface AvailabilityProvider {
  getReservations(houseId: string): Promise<Reservation[]>;
}
```

Providers preparados:

- `LocalAvailabilityProvider`
- `ICalAvailabilityProvider`
- `AirbnbAvailabilityProvider`
- `BookingAvailabilityProvider`
- `VrboAvailabilityProvider`
- `GoogleCalendarAvailabilityProvider`

Airbnb, Booking, Vrbo e Google Calendar estão preparados inicialmente para ICS/iCal.
Não existe scraping, login automatizado, endpoint privado ou falsa atualização em
tempo real.

## iCal / ICS

`parseICalendar(content, houseId, source)` interpreta `VEVENT`, `UID`, `DTSTART`,
`DTEND`, `STATUS:CANCELLED`, linhas dobradas e datas com ou sem timezone.

Eventos cancelados são ignorados. Eventos duplicados podem ser deduplicados por
`externalId`, `source`, `houseId` e intervalo.

## Merge

`mergeAvailabilitySources()` recebe reservas de múltiplas origens e cria uma visão
consolidada. Qualquer origem bloqueante torna o intervalo indisponível.

Status bloqueantes ficam centralizados em `BLOCKING_STATUSES`:

- `confirmed`
- `blocked`

`pending` não bloqueia por padrão, mas pode bloquear com `pendingBlocks: true`.
`cancelled` nunca bloqueia.

## Cache Estático

O front-end estático usa:

- `src/data/reservations.ts` para bloqueios manuais locais.
- `src/generated/availability.json` para reservas externas já normalizadas.

No modo atual, o arquivo gerado pode ficar vazio e o site continua funcionando.

## Modo Estático

O site continua com `output: "export"` e não depende de:

- SSR
- API Routes
- Server Actions
- middleware
- banco de dados
- cookies de servidor
- infraestrutura da Vercel

A pasta `out/` continua publicável em hospedagem estática.

## Modo Automático Futuro

Um processo externo poderá executar:

1. Ler URLs privadas iCal em variáveis de ambiente.
2. Baixar calendários Airbnb, Booking, Vrbo ou Google Calendar.
3. Interpretar ICS.
4. Normalizar reservas.
5. Gerar `src/generated/availability.json`.
6. Executar `npm run build`.
7. Publicar `out/`.

Esse processo pode rodar em GitHub Actions, cron job, Cloudflare Worker, Vercel
Function, Netlify Function, servidor próprio ou outro backend autorizado.

## Segurança

Links iCal podem funcionar como credenciais. Por isso:

- Não ficam em componentes React.
- Não são enviados para o navegador.
- Não usam prefixo `NEXT_PUBLIC_`.
- Devem ficar em `.env.local`, CI/CD secrets ou ambiente de servidor.

O arquivo `.env.example` contém apenas placeholders.

## Painel Administrativo Futuro

A arquitetura já separa disponibilidade pública, reservas normalizadas e providers.
Um painel futuro poderá criar reservas diretas, bloquear datas, cancelar reservas
e visualizar origem sem refazer o calendário público.

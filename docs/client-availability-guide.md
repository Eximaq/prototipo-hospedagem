# Guia de Disponibilidade para o Cliente

## Bloquear Datas Manualmente

Edite `src/data/reservations.ts` e adicione uma reserva com:

- `houseId`: `casa-01` para Casa Turquesa ou `casa-02` para Casa Corais Milagres.
- `startDate`: primeira noite bloqueada.
- `endDate`: data de saída, exclusiva.
- `source`: `manual` ou `direct`.
- `status`: `confirmed` ou `blocked`.

Exemplo:

```ts
{
  id: "manual-casa-01-2026-12-20",
  houseId: "casa-01",
  startDate: "2026-12-20",
  endDate: "2026-12-26",
  source: "manual",
  status: "blocked"
}
```

Esse exemplo bloqueia as noites de 20 a 25 de dezembro. O dia 26 é check-out.

## Desbloquear Datas

Para desbloquear, remova o item de `src/data/reservations.ts` ou altere:

```ts
status: "cancelled"
```

Reservas canceladas não bloqueiam o calendário.

## Reserva x Consulta

Enviar mensagem pelo WhatsApp não bloqueia datas automaticamente.

Uma consulta vira bloqueio somente quando:

- uma reserva confirmada for cadastrada manualmente;
- uma reserva direta for confirmada no futuro painel;
- uma reserva vier de Airbnb, Booking, Vrbo, Google Calendar ou outro iCal.

## Configurar Airbnb

No futuro, obtenha o link iCal oficial exportado pelo Airbnb e salve em ambiente
privado:

```env
AIRBNB_CASA_TURQUESA_ICAL_URL=
AIRBNB_CASA_CORAIS_ICAL_URL=
```

Depois habilite o calendário correspondente em `src/data/external-calendars.ts`.

## Configurar Booking

Use o calendário iCal disponibilizado pela propriedade no Booking.com, quando
existir, e salve em:

```env
BOOKING_CASA_TURQUESA_ICAL_URL=
BOOKING_CASA_CORAIS_ICAL_URL=
```

Não use scraping nem automação de painel.

## Adicionar Outro iCal

Adicione um item em `src/data/external-calendars.ts` com:

- `provider: "ical"`
- `houseId`
- `envVar`
- `enabled: true`

O link real fica fora do código, em variável de ambiente privada.

## Como a Sincronização Funciona

O site publicado é estático. Ele não busca calendários privados no navegador.

O fluxo futuro é:

1. Um processo externo roda `npm run sync:calendars`.
2. O script lê URLs privadas do ambiente.
3. Baixa os arquivos ICS.
4. Gera `src/generated/availability.json`.
5. O build cria a pasta `out/`.
6. O servidor publica apenas arquivos estáticos.

Calendários iCal não são instantâneos. Atrasos dependem de Airbnb, Booking, Vrbo
ou do provedor usado. A frequência futura pode ser 15 minutos, 30 minutos ou 1
hora, conforme infraestrutura.

## Automação Futura

Um GitHub Actions futuro poderá:

1. Rodar periodicamente.
2. Executar `npm run sync:calendars`.
3. Executar `npm run build`.
4. Publicar `out/`.

Credenciais reais devem ficar em GitHub Secrets ou ambiente equivalente.

## Onde Alterar Dados Importantes

- WhatsApp: `src/data/site-config.ts`
- Casas: `src/data/houses.ts`
- Bloqueios manuais: `src/data/reservations.ts`
- Calendários externos: `src/data/external-calendars.ts`
- Cache gerado: `src/generated/availability.json`
- Coordenadas, links Google Maps/Waze e endereço: `src/data/houses.ts`
- Hero com imagem ou vídeo: `src/data/houses.ts`

## Vídeos no Hero

Cada casa aceita:

```ts
hero: {
  type: "video",
  image: "/images/casa/poster.jpg",
  video: {
    mp4: "/videos/casa/video.mp4",
    webm: "/videos/casa/video.webm",
    poster: "/images/casa/poster.jpg"
  }
}
```

Use vídeos curtos, sem áudio, otimizados e com poster. O site respeita
`prefers-reduced-motion` exibindo imagem fallback quando necessário.

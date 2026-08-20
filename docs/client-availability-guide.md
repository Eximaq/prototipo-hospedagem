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

## Atualizar os Arquivos iCal Manualmente

Obtenha os novos arquivos exportados pelo sistema responsável pelas reservas e
substitua, sem alterar os nomes:

```text
calendar-fixtures/casa-turquesa.ics
calendar-fixtures/casa-corais.ics
```

Execute:

```bash
npm run availability:generate
npm run build
```

Confira no terminal as contagens de eventos e períodos de cada casa. O comando
não imprime UID, descrição, hóspede ou link privado. Os arquivos `.ics` são locais
e ignorados pelo Git; somente `src/generated/availability.json` deve ser publicado.

## Como a Sincronização Funciona

O site publicado é estático. Ele não busca calendários privados no navegador.

Para a sincronização futura, configure os links em um ambiente privado:

```env
CASA_TURQUESA_ICAL_URL=
CASA_CORAIS_ICAL_URL=
```

O fluxo é:

1. Um processo externo lê as duas variáveis privadas.
2. Executa `npm run availability:sync`.
3. Baixa e interpreta os arquivos ICS.
4. Gera `src/generated/availability.json`.
5. O build cria a pasta `out/`.
6. O servidor publica apenas arquivos estáticos.

Se qualquer calendário falhar, o JSON anterior é mantido integralmente. Assim,
uma indisponibilidade temporária do provedor não transforma datas ocupadas em
datas livres.

Calendários iCal não são instantâneos. Atrasos dependem do provedor usado. A
automação inicial roda uma vez por hora e essa frequência pode ser alterada.

## Automação Futura

Um GitHub Actions, cron, Cloudflare, Vercel, Netlify ou servidor próprio poderá:

1. Rodar periodicamente.
2. Executar `npm run availability:sync`.
3. Executar `npm run build`.
4. Publicar `out/`.

Credenciais reais devem ficar em GitHub Secrets ou ambiente equivalente. Nunca
use `NEXT_PUBLIC_`, `public/`, código React ou `localStorage` para links iCal.

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

# Casas Milagres

Site institucional e comercial para apresentar duas casas de temporada em São Miguel dos Milagres, Alagoas: Casa Turquesa e Casa Corais Milagres.

O projeto foi desenvolvido para valorizar a experiência visual das hospedagens, organizar as informações essenciais de cada casa e facilitar o contato direto pelo WhatsApp. A navegação prioriza fotos, capacidade, comodidades, localização, detalhes das acomodações e um fluxo simples de consulta de disponibilidade.

## Principais Recursos

- Página inicial com hero visual, apresentação das casas e chamada para consulta.
- Páginas individuais para cada casa, com galeria, diferenciais, regras e localização.
- Formulário de disponibilidade integrado ao WhatsApp com mensagem preenchida automaticamente.
- Estrutura responsiva para celular, tablet e desktop.
- SEO configurado com metadados, Open Graph, sitemap e robots.
- Conteúdo organizado em arquivos de dados para facilitar manutenção.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

Inicie o ambiente local:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Validação

Execute as verificações antes de publicar alterações:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Estrutura de Conteúdo

As configurações gerais ficam em `src/data/site-config.ts`, incluindo nome do site, telefone, WhatsApp, e-mail, cidade, URL pública e imagem Open Graph.

As informações das casas ficam em `src/data/houses.ts`, com nome, slug, localização, descrições, capacidade, comodidades, regras, links e galerias.

As imagens públicas ficam em `public/images` e são referenciadas pelos dados das casas e pelas seções do site.

## Disponibilidade e Reservas

A disponibilidade fica isolada em `src/lib/availability`. O calendário público
consome somente ranges indisponíveis por casa e não conhece Airbnb, Booking,
Vrbo, iCal, dados privados ou origem da reserva.

Arquivos principais:

- `src/data/reservations.ts`: bloqueios e reservas manuais locais.
- `src/data/external-calendars.ts`: configuração de canais externos sem URLs privadas.
- `src/generated/availability.json`: cache estático futuro mantido pela sincronização.
- `scripts/sync-calendars.ts`: script Node/CI para baixar ICS e gerar cache.
- `docs/availability-architecture.md`: arquitetura técnica.
- `docs/client-availability-guide.md`: guia operacional para o cliente.

O intervalo interno usa `[startDate, endDate)`: a saída é exclusiva. Enviar uma
mensagem pelo WhatsApp é consulta, não bloqueio automático de datas.

Para uma sincronização futura, preencha variáveis privadas em `.env.local` ou no
ambiente de CI e execute:

```bash
npm run sync:calendars
npm run build
```

O front-end continua 100% estático; calendários automáticos exigem um processo
externo como GitHub Actions, cron, Worker ou função serverless.

## Publicação

O projeto está configurado para Static Export do Next.js e não exige Node.js,
PHP, API, SSR ou runtime Next.js no servidor. Ao executar:

```bash
npm run build
```

o Next.js gera a pasta `out/`, pronta para publicação em hospedagens estáticas
ou compartilhadas.

O script `postbuild` prepara a pasta `out/` para servidores estáticos simples,
mantendo `.nojekyll` para GitHub Pages e criando aliases de payloads internos do
Next usados em navegação client-side. Esses arquivos são estáticos e não exigem
Node.js no servidor.

### URL pública opcional

O site funciona mesmo sem domínio conhecido durante o build. Para gerar
canonical, sitemap e robots com URLs absolutas, configure antes do build:

```bash
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br npm run build
```

Em Windows PowerShell:

```powershell
$env:NEXT_PUBLIC_SITE_URL="https://seudominio.com.br"; npm run build
```

Para GitHub Pages em subpasta, configure também:

```powershell
$env:NEXT_PUBLIC_BASE_PATH="/nome-do-repositorio"; npm run build
```

Nesse caso, use `NEXT_PUBLIC_SITE_URL` já com a URL final completa, por exemplo
`https://usuario.github.io/nome-do-repositorio`. O arquivo `public/.nojekyll` é
copiado para `out/.nojekyll` para preservar os assets preparados em `out/_next/`.

### 1. Hospedagem cPanel / Apache

Envie o conteúdo de `out/` para a pasta pública do domínio, normalmente
`public_html/`. O arquivo `public/.htaccess` é copiado para `out/.htaccess` e
mantém redirecionamentos 301 opcionais para rotas antigas em Apache, como
HostGator, Hostinger/cPanel, Locaweb/cPanel, GoDaddy/cPanel e KingHost.

O site não depende do `.htaccess` para carregar as páginas principais; ele serve
apenas como melhoria para redirects server-side.

### 2. Nginx ou servidor estático

Use `out/` como diretório raiz do site. Com `trailingSlash: true`, cada rota
interna é exportada como `index.html` dentro da respectiva pasta, por exemplo:

```text
out/casas/index.html
out/casas/casa-turquesa-05/index.html
out/contato/index.html
```

Em Nginx, uma configuração simples é:

```nginx
root /caminho/para/out;
index index.html;

location / {
  try_files $uri $uri/ =404;
}

error_page 404 /404.html;
```

Não é necessária regra de fallback SPA para o funcionamento normal, porque as
rotas internas existem como arquivos HTML reais.

### 3. Netlify / Cloudflare Pages / Vercel

Use:

```text
Build command: npm run build
Output directory: out
```

O arquivo `public/_redirects` é copiado para `out/_redirects` e serve como
configuração opcional de redirects para Netlify e Cloudflare Pages. Na Vercel,
publique como projeto estático usando `out/` como saída.

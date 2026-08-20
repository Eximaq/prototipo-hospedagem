# Casas Milagres

Site institucional e comercial das casas de temporada **Casa Turquesa** e
**Casa Corais Milagres**, em São Miguel dos Milagres, Alagoas.

O projeto apresenta as propriedades, fotos, capacidade, comodidades, regras e
localização. O visitante consulta datas disponíveis, informa os hóspedes e envia
o pedido pelo WhatsApp. O site não confirma nem cria reservas automaticamente.

## Funcionalidades

- Página inicial com apresentação das duas casas.
- Páginas individuais com galerias, lightbox, diferenciais e localização.
- Calendário independente para cada propriedade.
- Bloqueio de datas importadas de calendários iCalendar/ICS.
- Validação de períodos que atravessam datas ocupadas.
- Cálculo de noites, adultos e crianças.
- Formulário integrado ao WhatsApp com mensagem preenchida automaticamente.
- Layout responsivo para celular, tablet e desktop.
- SEO com metadados, Open Graph, sitemap e robots.
- Exportação totalmente estática para `out/`.

## Tecnologias

- Next.js 16 com App Router e Static Export.
- React 19.
- TypeScript.
- Tailwind CSS.
- Framer Motion.
- Lucide React.
- Vitest.
- `node-ical` para interpretar calendários ICS antes do build.

## Requisitos

- Node.js 20 ou superior.
- npm.

Não é necessário instalar PHP, banco de dados ou servidor Next.js para hospedar
o resultado final.

## Início Rápido

### 1. Instalar as dependências

Na pasta do projeto, execute:

```bash
npm install
```

### 2. Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

O desenvolvimento usa o último arquivo válido disponível em
`src/generated/availability.json`. Portanto, não é necessário acessar os
calendários remotos toda vez que o servidor local for iniciado.

## Como o Projeto Funciona

O conteúdo das casas fica separado da interface. As páginas leem arquivos em
`src/data`, enquanto a disponibilidade pública vem de um JSON previamente
normalizado.

```text
Dados das casas + imagens + availability.json
                    ↓
              Next.js build
                    ↓
                  out/
                    ↓
           hospedagem estática
```

O navegador nunca interpreta arquivos ICS. Ele recebe apenas os intervalos de
datas indisponíveis que já foram processados antes do build.

## Calendários e Disponibilidade

Existem dois modos de atualizar a disponibilidade.

### Desenvolvimento com arquivos locais

Os snapshots locais ficam em:

```text
calendar-fixtures/casa-turquesa.ics
calendar-fixtures/casa-corais.ics
```

Esses arquivos são privados e estão ignorados pelo Git. Para gerar a
disponibilidade a partir deles:

```bash
npm run availability:generate
```

Depois, inicie o site normalmente:

```bash
npm run dev
```

### Produção com calendários remotos

As URLs privadas devem existir somente em `.env.local` ou nos secrets do
ambiente de CI/CD:

```env
CASA_TURQUESA_ICAL_URL=
CASA_CORAIS_ICAL_URL=
```

Nunca use URLs reais no README, no código, em componentes React ou em variáveis
com prefixo `NEXT_PUBLIC_`.

Para baixar e processar os dois calendários:

```bash
npm run availability:sync
```

O sincronizador:

1. Lê as duas URLs privadas.
2. Aplica timeout ao download.
3. Valida status HTTP e tipo de conteúdo.
4. Rejeita respostas vazias, HTML e calendários inválidos.
5. Interpreta datas, timezones, recorrências e cancelamentos.
6. Une intervalos sobrepostos ou adjacentes.
7. Gera `src/generated/availability.json`.

### Proteção contra falhas

A atualização é transacional. Os dois calendários precisam baixar, interpretar e
validar corretamente antes que o JSON anterior seja substituído.

Se uma das casas falhar, o último `availability.json` válido permanece intacto.
Isso evita que uma falha de rede faça datas ocupadas aparecerem como livres.

Os logs exibem somente o nome da casa e as quantidades de eventos e períodos.
URLs, tokens, UIDs e informações privadas não são registrados.

### Formato público

O front-end recebe uma estrutura semelhante a:

```json
{
  "updatedAt": "2026-08-19T12:00:00.000Z",
  "houses": {
    "casa-01": {
      "houseId": "casa-01",
      "updatedAt": "2026-08-19T12:00:00.000Z",
      "unavailableRanges": [
        {
          "start": "2026-09-10",
          "end": "2026-09-15"
        }
      ]
    }
  }
}
```

Os intervalos usam a convenção `[start, end)`: `start` é a primeira noite
ocupada e `end` é a data de saída, que não fica bloqueada.

## Variáveis de Ambiente

Use `.env.example` como referência. Para criar uma configuração local:

```bash
cp .env.example .env.local
```

No PowerShell:

```powershell
Copy-Item .env.example .env.local
```

| Variável                 | Visibilidade | Finalidade                                       |
| ------------------------ | ------------ | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`   | Pública      | URL final usada em canonical, sitemap e robots.  |
| `NEXT_PUBLIC_BASE_PATH`  | Pública      | Subpasta usada em hospedagens como GitHub Pages. |
| `CASA_TURQUESA_ICAL_URL` | Privada      | Calendário ICS da Casa Turquesa.                 |
| `CASA_CORAIS_ICAL_URL`   | Privada      | Calendário ICS da Casa Corais.                   |

`.env.local` está no `.gitignore` e não deve ser commitado.

## Comandos Disponíveis

| Comando                         | Função                                               |
| ------------------------------- | ---------------------------------------------------- |
| `npm run dev`                   | Inicia o servidor local de desenvolvimento.          |
| `npm run build`                 | Gera o site estático usando o JSON atual.            |
| `npm run build:production`      | Sincroniza os calendários remotos e executa o build. |
| `npm run availability:generate` | Gera disponibilidade usando os arquivos locais.      |
| `npm run availability:sync`     | Sincroniza os calendários remotos privados.          |
| `npm run sync:calendars`        | Alias compatível para `availability:sync`.           |
| `npm run lint`                  | Verifica problemas de código com ESLint.             |
| `npm run typecheck`             | Valida os tipos TypeScript.                          |
| `npm test`                      | Executa os testes automatizados.                     |
| `npm run validate:static`       | Testa rotas, assets e funcionalidades de `out/`.     |
| `npm run format`                | Formata os arquivos com Prettier.                    |

## Build de Produção

Para sincronizar os calendários e gerar a versão final em uma única operação:

```bash
npm run build:production
```

Para fazer as etapas separadamente:

```bash
npm run availability:sync
npm run build
```

O resultado fica em:

```text
out/
```

O projeto mantém `output: "export"` e `trailingSlash: true`. Cada rota é gerada
como HTML estático, por exemplo:

```text
out/index.html
out/casas/index.html
out/casas/casa-turquesa-05/index.html
out/casas/casa-corais-milagres/index.html
out/contato/index.html
```

O `postbuild` prepara aliases de navegação, mantém `.nojekyll` e copia os arquivos
necessários para hospedagens estáticas.

## Validação Antes de Publicar

Execute:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run validate:static
```

Para uma publicação que também atualiza os calendários:

```bash
npm run availability:sync
npm run build
npm run validate:static
```

## Estrutura do Projeto

```text
.
├── .github/workflows/          # Automação de sincronização e deploy
├── calendar-fixtures/          # Snapshots ICS locais ignorados pelo Git
├── docs/                       # Documentação técnica e operacional
├── public/                     # Imagens e arquivos públicos estáticos
├── scripts/                    # Geração, sincronização e validação
├── src/
│   ├── app/                    # Rotas e páginas do Next.js
│   ├── components/             # Componentes visuais e formulários
│   ├── data/                   # Conteúdo das casas e configurações
│   ├── generated/              # JSON público de disponibilidade
│   ├── lib/availability/       # Parser, merge, providers e regras de datas
│   └── types/                  # Tipos compartilhados
├── next.config.ts
└── package.json
```

## Onde Atualizar o Conteúdo

- Configuração geral, telefone e WhatsApp: `src/data/site-config.ts`.
- Informações, regras e galerias das casas: `src/data/houses.ts`.
- Bloqueios manuais: `src/data/reservations.ts`.
- Imagens: `public/images`.
- Disponibilidade gerada: `src/generated/availability.json`.
- Configuração dos calendários: `scripts/availability-config.ts`.

Não edite manualmente o JSON gerado quando a alteração puder ser feita pela fonte
ICS ou por `src/data/reservations.ts`.

## Publicação

### HostGator, Hostinger ou cPanel

Execute a sincronização e o build em uma máquina confiável ou no CI:

```bash
npm run build:production
```

Envie **o conteúdo de `out/`** para `public_html/`. A hospedagem recebe apenas o
site estático e não precisa conhecer as URLs dos calendários.

O arquivo `.htaccess` incluído em `out/` adiciona suporte a redirects opcionais
em servidores Apache.

### GitHub Pages

O workflow `.github/workflows/sync-availability.yml`:

1. Executa uma vez por hora ou manualmente.
2. Instala as dependências.
3. Executa os testes.
4. Sincroniza os dois calendários usando GitHub Secrets.
5. Gera `out/`.
6. Publica o artefato no GitHub Pages.

Cadastre no repositório:

```text
CASA_TURQUESA_ICAL_URL
CASA_CORAIS_ICAL_URL
```

Depois habilite **Settings → Pages → Source → GitHub Actions**.

### Cloudflare Pages, Netlify ou Vercel

Configure os dois secrets privados no ambiente de build e use:

```text
Build command: npm run build:production
Output directory: out
```

Se a plataforma não executar builds agendados, utilize GitHub Actions, cron ou
um deploy hook para iniciar uma nova sincronização e publicação.

### Nginx ou servidor estático

Use `out/` como diretório raiz:

```nginx
root /caminho/para/out;
index index.html;

location / {
  try_files $uri $uri/ =404;
}

error_page 404 /404.html;
```

Não é necessário fallback de SPA, porque as rotas existem como arquivos HTML.

## Segurança e Privacidade

- Arquivos ICS reais não ficam em `public/`.
- `.env.local` e `calendar-fixtures/*.ics` são ignorados pelo Git.
- O navegador nunca acessa os calendários privados.
- Tokens não aparecem em logs, HTML ou JavaScript público.
- O JSON público não contém nome, e-mail, telefone, UID ou descrição de reserva.
- Uma consulta pelo WhatsApp não bloqueia datas.
- iCalendar não deve ser tratado como sincronização instantânea.

## Solução de Problemas

### O site abre, mas as datas parecem antigas

Atualize a fonte e gere novamente:

```bash
npm run availability:sync
npm run build
```

### A sincronização informa configuração ausente

Confira se `.env.local` contém as duas variáveis privadas ou se os secrets foram
configurados no CI/CD.

### A sincronização falhou

O JSON anterior é preservado automaticamente. Verifique a validade dos links,
a conexão de rede e tente novamente. Não substitua o JSON por um calendário vazio.

### A pasta `out/` não existe

Execute:

```bash
npm run build
```

### O GitHub Pages não publica

Confira se GitHub Pages está configurado para usar GitHub Actions e se os dois
secrets privados foram cadastrados.

## Documentação Complementar

- `docs/availability-architecture.md`: arquitetura e convenção de datas.
- `docs/production-availability-sync.md`: sincronização e deploy de produção.
- `docs/client-availability-guide.md`: manutenção da disponibilidade.
- `docs/client-content-pending.md`: conteúdos pendentes do cliente.

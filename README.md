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
npm run build
```

## Estrutura de Conteúdo

As configurações gerais ficam em `src/data/site-config.ts`, incluindo nome do site, telefone, WhatsApp, e-mail, cidade, URL pública e imagem Open Graph.

As informações das casas ficam em `src/data/houses.ts`, com nome, slug, localização, descrições, capacidade, comodidades, regras, links e galerias.

As imagens públicas ficam em `public/images` e são referenciadas pelos dados das casas e pelas seções do site.

## Publicação

O projeto é compatível com hospedagens que suportam Next.js, como Vercel, Netlify com runtime Next ou servidor Node.

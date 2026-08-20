# Sincronização de Disponibilidade em Produção

## Modos de Operação

Desenvolvimento offline usa os snapshots privados ignorados pelo Git:

```bash
npm run availability:generate
npm run dev
```

Produção baixa os calendários privados e somente depois gera o site:

```bash
npm run availability:sync
npm run build
```

O atalho equivalente é:

```bash
npm run build:production
```

`npm run build` permanece independente de rede e usa o último
`src/generated/availability.json` válido.

## Configuração Privada

Crie `.env.local` apenas na máquina que executa a sincronização:

```env
CASA_TURQUESA_ICAL_URL=
CASA_CORAIS_ICAL_URL=
```

Preencha os valores localmente. O arquivo é ignorado pelo Git. Em CI/CD, use
secrets com os mesmos nomes e não crie `.env.local`.

As variáveis não têm prefixo `NEXT_PUBLIC_`. Elas são lidas somente pelo script
Node e nunca ficam disponíveis para componentes React ou para o navegador.

## Proteção Contra Falhas

A sincronização é transacional:

1. Carrega as duas URLs em memória.
2. Baixa cada ICS com timeout de 15 segundos.
3. Confere status HTTP e `Content-Type`, quando informado.
4. Rejeita corpo vazio, HTML, estrutura sem `VCALENDAR`, calendário sem eventos
   ou evento com datas inválidas.
5. Interpreta cancelamentos, recorrências e timezones.
6. Mescla os intervalos de cada casa.
7. Escreve um arquivo temporário.
8. Substitui `availability.json` somente depois que as duas casas passam.

Se qualquer etapa falhar, o comando retorna erro e mantém integralmente o último
JSON válido. Ele nunca transforma uma falha de rede em calendário vazio.

Os logs mostram apenas casa, quantidade de eventos e períodos. URL, token, UID,
descrição e dados de hóspedes não são registrados.

## HostGator e cPanel

Uma hospedagem estática não precisa receber os links iCal. O processo pode rodar
na máquina de desenvolvimento ou em um CI:

```text
availability:sync → build → out/ → upload para public_html
```

Depois do upload, Apache ou cPanel serve somente os arquivos de `out/`. Para
atualizações automáticas, um job externo deve repetir sincronização, build e
publicação; o navegador não consegue atualizar o calendário sozinho.

## GitHub Actions e GitHub Pages

`.github/workflows/sync-availability.yml` roda manualmente ou uma vez por hora.
Adicione os secrets nas configurações do repositório e habilite GitHub Pages com
origem **GitHub Actions**. O workflow testa, sincroniza, gera `out/` e publica o
artefato no ambiente `github-pages`.

Uma hora é uma frequência inicial conservadora. iCal não é atualização em tempo
real e o cron pode ser alterado conforme o comportamento do provedor.

## Cloudflare Pages, Netlify e Vercel

Nesses serviços, configure os dois secrets no ambiente de build e use:

```text
Build command: npm run build:production
Output directory: out
```

Um deploy comum só atualiza o calendário quando um novo build acontece. Para
atualização periódica, use o agendador do provedor, um deploy hook chamado por
cron ou GitHub Actions. O resultado publicado continua totalmente estático.

## Monitoramento

Uma execução bem-sucedida informa, por casa:

```text
Casa Turquesa: N eventos encontrados; M períodos indisponíveis após normalização.
Casa Corais: N eventos encontrados; M períodos indisponíveis após normalização.
```

Em falha, a mensagem identifica somente a casa e confirma a preservação do JSON
anterior. O `updatedAt` global e o de cada casa permitem monitorar a idade dos
dados sem exibir esse horário ao visitante.

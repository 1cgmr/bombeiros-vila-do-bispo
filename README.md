# Website Institucional — Bombeiros Voluntários de Vila do Bispo

Fundação técnica do website institucional da Associação Humanitária dos Bombeiros Voluntários de Vila do Bispo. O projeto é voluntário, não comercial e deve manter um custo recorrente de software e alojamento de **0 €/mês** (o domínio fica fora desta restrição).

> Estado: fundação técnica. As páginas finais, o design, os formulários e os conteúdos institucionais ainda não estão implementados.

## Arquitetura

O repositório contém duas aplicações npm independentes:

- `web/`: Next.js com App Router, React, TypeScript estrito e Tailwind CSS. Lê conteúdo publicado do Sanity sem token privado.
- `studio/`: Sanity Studio em TypeScript, ligado ao projeto institucional existente e preparado para edição em português europeu.

O Sanity Content Lake é a fonte de verdade para conteúdo institucional editável. A Associação edita e publica esse conteúdo através do Sanity Studio; a publicação normal de conteúdo não exige GitHub, alterações ao código, uma nova compilação do Studio ou intervenção do programador. GitHub e o futuro projeto Vercel permanecem infraestrutura técnica do programador.

Consulte [docs/architecture.md](docs/architecture.md) para os limites e o fluxo completos.

## Pré-requisitos

- Node.js `24.19.0` (ficheiro `.nvmrc`; Node 24)
- npm 10 ou superior
- acesso à Internet para instalar dependências e consultar o dataset público
- para editar conteúdo no Studio, uma conta autorizada no projeto Sanity institucional

Versões de Node anteriores a 22.12 não satisfazem os requisitos da versão selecionada do Sanity. Use a versão indicada antes de executar os comandos abaixo.

## Aplicação pública (`web/`)

```powershell
cd web
Copy-Item .env.example .env.local
npm install
npm run dev
```

Abra `http://localhost:3000`.

Comandos disponíveis:

```powershell
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

## Sanity Studio (`studio/`)

```powershell
cd studio
npm install
npm run dev
```

O Studio local é normalmente apresentado em `http://localhost:3333`. A autenticação no browser é feita com uma conta Sanity autorizada. Não são necessários tokens administrativos permanentes.

Comandos disponíveis:

```powershell
npm run dev
npm run lint
npm run typecheck
npm run schema:validate
npm run build
```

## Configuração Sanity existente

Estes identificadores são públicos e não são segredos:

- projeto: `n3esjk8x`
- dataset: `production`
- organização: `ooc17hxso`

O projeto e o dataset já existem. Não devem ser recriados.

## Variáveis de ambiente

Copie `web/.env.example` para `web/.env.local`. Nesta fase existem apenas identificadores públicos:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=n3esjk8x
NEXT_PUBLIC_SANITY_DATASET=production
```

O ficheiro `.env.local` é ignorado pelo Git. Não existem tokens Sanity nesta fase e nenhum segredo deve ser colocado em ficheiros versionados.

## Materiais de referência

- `docs/reference/Proposta_Site_Bombeiros_Vila_do_Bispo.pdf`: referência funcional; a antiga opção WordPress está substituída pela arquitetura Next.js + Sanity.
- `docs/reference/WhatsApp Image 2026-09-02 at 13.54.52.jpeg`: direção visual apenas; os dados, imagens e contactos apresentados não são considerados factos validados.

Todo o conteúdo oficial deve ser confirmado pela Direção/Comando antes de ser publicado. Consulte [docs/official-content-checklist.md](docs/official-content-checklist.md).

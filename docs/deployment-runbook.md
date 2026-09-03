# Runbook de execução e deployment

## Estado atual

- Frontend: alojado no Vercel a partir de `web/` e da branch `main`.
- Studio: alojado pelo Sanity em `https://bombeiros-vila-do-bispo.sanity.studio`.
- Content Lake: projeto `n3esjk8x`, dataset público `production`.
- Domínio de produção: ainda não configurado.

## Execução local

Use Node `24.19.0`.

Aplicação pública:

```powershell
cd web
Copy-Item .env.example .env.local
npm install
npm run dev
```

Sanity Studio:

```powershell
cd studio
npm install
npm run dev
```

O Studio poderá pedir autenticação no browser a um utilizador autorizado do projeto.

Para operações CLI autenticadas:

```powershell
cd studio
npx sanity login
```

Concluir a autenticação no browser. Nunca copiar passwords, cookies, códigos de recuperação ou tokens para o terminal, documentação ou código. Não é necessário um token administrativo permanente.

## Alterações ao schema e deployment do Studio

Antes de publicar alterações ao schema ou à experiência editorial:

```powershell
cd studio
npm install
npm run lint
npm run typecheck
npm run schema:validate
npm run build
npx sanity deploy --schema-required
```

O `appId` do Studio está registado em `sanity.cli.ts`, pelo que deployments seguintes atualizam a mesma aplicação. O deployment publica o bundle do Studio e o schema; não publica conteúdo editorial e não cria um projeto Vercel.

## Publicação normal de conteúdo

1. Abrir `https://bombeiros-vila-do-bispo.sanity.studio`.
2. Autenticar com a conta institucional autorizada.
3. Escolher a área editorial em português.
4. Criar ou abrir o conteúdo, preencher apenas informação oficialmente confirmada e resolver os erros de validação.
5. Selecionar **Publicar**.

Editar e publicar conteúdo normal **não requer** Git, GitHub, Codex, Vercel ou novo deployment do Studio. Apenas alterações ao schema ou à interface editorial exigem novo deployment do Studio.

## TypeGen e consultas do frontend

Depois de alterar um schema ou uma consulta GROQ:

```powershell
cd studio
npm run typegen
git diff -- ../web/src/sanity/sanity.types.ts
```

O comando extrai o schema para `studio/.sanity/schema.json` (ignorado pelo Git), analisa as consultas em `web/src` e recria o ficheiro versionado `web/src/sanity/sanity.types.ts`. Builds normais do frontend usam este ficheiro e não necessitam de autenticação Sanity.

## Deployment do frontend

O Vercel usa a integração GitHub existente e `web/` como Root Directory:

- branches que não sejam `main` produzem Preview Deployments;
- merges em `main` produzem o Production Deployment;
- não é necessário `VERCEL_TOKEN` nem GitHub Actions.

Publicar conteúdo no Sanity é independente deste fluxo. Um deployment do frontend só é necessário quando o código da aplicação muda.

## Três operações distintas

| Operação | Quando é necessária | O que altera |
| --- | --- | --- |
| Publicar conteúdo | Edição editorial normal | Documentos no Content Lake |
| Deploy do Studio | Alterações a schemas ou à interface editorial | Aplicação alojada em `sanity.studio` e schema registado |
| Deploy do frontend | Alterações ao website | Aplicação Next.js no Vercel |

## Recuperação

- Código e esquema: histórico Git e branches protegidas por revisão.
- Conteúdo: histórico de documentos do Sanity e exportações periódicas do dataset numa fase operacional posterior.
- Antes de alterações destrutivas ao esquema, efetuar exportação e ensaiar migrações.

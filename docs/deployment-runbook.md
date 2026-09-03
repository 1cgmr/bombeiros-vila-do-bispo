# Runbook de execução e deployment

## Estado desta fase

Não foi efetuado qualquer deployment, importação no Vercel ou configuração de domínio. O Studio e a aplicação pública funcionam localmente.

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

O Studio poderá pedir autenticação no browser a um utilizador autorizado do projeto. Usar apenas `npx sanity login` quando uma operação CLI autenticada for necessária; nunca copiar passwords, cookies ou tokens para o terminal, documentação ou código.

## Deployment futuro da aplicação pública

Só importar o repositório no Vercel depois de a fundação Next.js compilar com sucesso:

1. Autorizar a integração GitHub no Vercel, se necessário.
2. Importar `1cgmr/bombeiros-vila-do-bispo`.
3. Escolher `web` como Root Directory e manter a deteção Next.js.
4. Configurar as duas variáveis públicas Sanity em Preview e Production.
5. Confirmar `main` como Production Branch.
6. Validar Preview Deployment antes do merge e Production Deployment depois do merge.
7. Adicionar o domínio oficial e confirmar HTTPS numa fase posterior.

Não é necessário `VERCEL_TOKEN` nem GitHub Actions para este fluxo.

## Deployment futuro do Studio

Após validação humana do hostname e autenticação CLI:

```powershell
cd studio
npx sanity login
npm run build
npx sanity deploy
```

O deployment publica apenas a aplicação/configuração do Studio. Alterações futuras ao esquema exigem novo deployment do Studio; criar, editar e publicar conteúdo normal não exige alterações ao código nem novo deployment.

## Recuperação

- Código e esquema: histórico Git e branches protegidas por revisão.
- Conteúdo: histórico de documentos do Sanity e exportações periódicas do dataset numa fase operacional posterior.
- Antes de alterações destrutivas ao esquema, efetuar exportação e ensaiar migrações.

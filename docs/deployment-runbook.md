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

Para testar os formulários, acrescente ao ficheiro local ignorado `web/.env.local`:

```text
RESEND_API_KEY=<chave de envio do Resend>
RESEND_FROM_EMAIL=<endereço autorizado pelo Resend>
```

Nunca use o prefixo `NEXT_PUBLIC_` nestas variáveis e nunca copie valores reais para `.env.example`, documentação ou Git.

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

## Formulários e Resend

O projeto Vercel de `web/` necessita de `RESEND_API_KEY` e `RESEND_FROM_EMAIL` nos ambientes Preview e Production. Alterações a variáveis aplicam-se a deployments seguintes, pelo que deve criar um novo deployment depois de as configurar.

Crie no Resend uma chave com permissão apenas de envio e, quando disponível, restrita ao domínio verificado. `RESEND_FROM_EMAIL` deve conter apenas o endereço, por exemplo `formularios@dominio-verificado.pt`; o nome público do remetente é acrescentado pela aplicação.

O remetente `onboarding@resend.dev` serve apenas para desenvolvimento: só pode enviar para o endereço associado à conta Resend. Para enviar a outros destinatários é obrigatório verificar um domínio ou subdomínio no Resend e configurar os respetivos registos DNS. A passagem para o remetente institucional exige apenas alterar `RESEND_FROM_EMAIL`, sem alteração de código.

### Configuração editorial e teste inicial

Depois de publicar o schema do Studio, abra os documentos existentes `Formação -> Apresentação` e `Recrutamento`. Configure os dois objetos de formulário de forma independente e introduza temporariamente `cgmr.321@gmail.com` como destinatário em ambos. Este endereço não é um valor inicial do schema nem configuração da aplicação.

Mantenha `Formulário ativo` desligado até estarem preenchidos e aprovados o título, os textos, o aviso de privacidade, o destinatário, o prefixo do assunto, as etiquetas e as mensagens. Para um teste Preview controlado, publique temporariamente a ativação de um formulário de cada vez, confirme a receção e o Reply-To, e volte a desativá-lo se a publicação em produção ainda não estiver aprovada.

O dataset Sanity é partilhado pelos deployments e é público; o destinatário editorial pode ser consultado diretamente no Content Lake, embora nunca seja incluído no payload do componente cliente. Substitua o endereço pessoal temporário por um endereço institucional antes da ativação definitiva.

### Ativação em produção

Antes de ativar os formulários em Production:

1. Publicar um aviso de privacidade aprovado; não inventar texto jurídico.
2. Verificar o domínio/subdomínio remetente no Resend.
3. Configurar as duas variáveis em Vercel Production e efetuar novo deployment.
4. Substituir o destinatário temporário pelos endereços institucionais confirmados.
5. Confirmar um envio de cada formulário, o conteúdo recebido e o Reply-To.

As submissões não são guardadas no Sanity ou numa base de dados. O Resend processa e conserva dados de envio de acordo com as condições da conta; esta utilização deve constar da validação de privacidade institucional. Proteções adicionais contra abuso só devem ser avaliadas se o uso real demonstrar essa necessidade.

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

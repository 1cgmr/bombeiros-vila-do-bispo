# Arquitetura

## Objetivo

Manter duas aplicações pequenas e independentes no mesmo repositório, sem base de dados adicional nem infraestrutura desnecessária.

```text
Editor institucional
        |
        v
Sanity Studio (Sanity hosting) ---> Sanity Content Lake
                                  |
                                  | conteúdo publicado, leitura pública
                                  v
Visitante ----------------------> Next.js (web/) ---> Vercel
```

Os pedidos de contacto de Formação e Recrutamento seguem um fluxo adicional, sem aplicação ou persistência separada:

```text
Visitante -> formulário Next.js -> POST /api/contact -> Resend -> email configurado
                                      |
                                      +-> configuração publicada no Sanity
```

## Componentes

- **`web/`** — Next.js App Router, React, TypeScript estrito e Tailwind CSS. Server Components por omissão. Usa `@sanity/client` apenas para ler conteúdo publicado.
- **`studio/`** — Sanity Studio, TypeScript, Structure Tool e localização pt-PT. Está configurado para o projeto existente `n3esjk8x` e dataset público `production`, e está alojado em `https://bombeiros-vila-do-bispo.sanity.studio`.
- **GitHub** — controlo de versões e revisão técnica sob a conta do programador.
- **Vercel** — alojamento ativo da aplicação `web/`, através da integração Git nativa com a branch de produção `main`.
- **Sanity-managed hosting** — alojamento ativo do Studio; não existe um segundo projeto Vercel para o CMS.

## Decisões de fronteira

- O Sanity é a fonte de verdade para conteúdo institucional editável; o código contém apenas estrutura, apresentação e valores técnicos públicos.
- A leitura de conteúdo publicado do dataset público não usa token.
- As consultas GROQ ficam organizadas por domínio em `web/src/sanity/queries/`; funções pequenas chamam diretamente o cliente Sanity, sem abstrações genéricas de CMS.
- O TypeGen oficial do Sanity extrai o schema do Studio e gera `web/src/sanity/sanity.types.ts`, que é versionado e não exige autenticação durante builds normais do frontend.
- Documentos singleton e páginas institucionais ausentes resultam em `null`; coleções vazias resultam em `[]`. A apresentação futura deve tratar estes estados sem inventar conteúdo.
- Rascunhos, visual editing, Presentation Tool e revalidação por webhook ficam para fases posteriores.
- Os formulários de Formação e Recrutamento usam um único Route Handler no projeto `web/`. O browser identifica apenas o formulário; o servidor resolve o destinatário na configuração publicada do respetivo singleton e envia a mensagem através do Resend.
- As submissões não são guardadas no Sanity nem noutra base de dados. A validação no servidor, um campo honeypot e limites de tamanho constituem a proteção proporcional inicial contra abuso.
- `RESEND_API_KEY` e `RESEND_FROM_EMAIL` são configuração exclusiva do servidor. O destinatário e os textos são conteúdo editorial do Sanity; o remetente técnico não é editável no CMS.
- O WordPress referido na proposta está explicitamente substituído por Next.js + Sanity; mantém-se apenas o requisito de autonomia editorial.
- A interface pública usa tokens semânticos navy, dourado, branco, neutros e vermelho de emergência, inferidos da direção visual aprovada. Estes valores podem ser afinados quando forem fornecidas normas formais de identidade.
- O layout público é mobile-first, usa Server Components por omissão e restringe JavaScript do cliente ao menu móvel.
- A geração de imagens usa o helper oficial do Sanity e a otimização do Next.js; Portable Text é renderizado por uma lista fechada de componentes acessíveis.

## Custo

A arquitetura deve permanecer dentro dos planos gratuitos de GitHub, Vercel e Sanity em utilização normal. Nenhum componente desta fundação implica um serviço pago.

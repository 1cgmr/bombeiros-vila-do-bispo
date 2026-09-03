# Arquitetura

## Objetivo

Manter duas aplicações pequenas e independentes no mesmo repositório, sem base de dados adicional nem infraestrutura desnecessária.

```text
Editor institucional
        |
        v
Sanity Studio (studio/) ---> Sanity Content Lake
                                  |
                                  | conteúdo publicado, leitura pública
                                  v
Visitante ----------------> Next.js (web/) ---> Vercel (fase posterior)
```

## Componentes

- **`web/`** — Next.js App Router, React, TypeScript estrito e Tailwind CSS. Server Components por omissão. Usa `@sanity/client` apenas para ler conteúdo publicado.
- **`studio/`** — Sanity Studio, TypeScript, Structure Tool e localização pt-PT. Está configurado para o projeto existente `n3esjk8x` e dataset público `production`.
- **GitHub** — controlo de versões e revisão técnica sob a conta do programador.
- **Vercel** — alojamento futuro apenas da aplicação `web/`, através da integração Git nativa. Não está configurado nesta fase.
- **Sanity-managed hosting** — alojamento futuro do Studio. Não há deployment nesta fase.

## Decisões de fronteira

- O Sanity é a fonte de verdade para conteúdo institucional editável; o código contém apenas estrutura, apresentação e valores técnicos públicos.
- A leitura de conteúdo publicado do dataset público não usa token.
- Rascunhos, visual editing, Presentation Tool e revalidação por webhook ficam para fases posteriores.
- Formulários, email e anti-spam não pertencem a esta fase. Quando forem implementados, os dados pessoais não serão guardados no dataset público.
- O WordPress referido na proposta está explicitamente substituído por Next.js + Sanity; mantém-se apenas o requisito de autonomia editorial.
- Os valores cromáticos da identidade ainda não estão fixados. Os tokens semânticos existem, mas usam uma base visual neutra até serem confirmadas normas oficiais.

## Custo

A arquitetura deve permanecer dentro dos planos gratuitos de GitHub, Vercel e Sanity em utilização normal. Nenhum componente desta fundação implica um serviço pago.

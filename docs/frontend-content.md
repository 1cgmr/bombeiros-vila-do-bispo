# Conteúdo Sanity no frontend

## Organização

As consultas GROQ e as funções de acesso ficam em `web/src/sanity/queries/`, separadas por domínio:

- `site-settings.ts` e `homepage.ts`;
- `services.ts`, `vehicles.ts` e `training.ts`;
- `news.ts` e `galleries.ts`;
- `institutional-pages.ts` e `institutional-documents.ts`;
- `recruitment.ts`, `membership.ts`, `donations.ts` e `contact.ts`;
- `partners.ts` e `governance.ts`.

Os componentes e páginas públicas chamam estas funções diretamente. A cadeia intencional é:

```text
componente ou página
        ↓
função de consulta por domínio
        ↓
cliente Sanity
        ↓
Content Lake
```

Não existe uma abstração genérica de CMS, repository pattern ou service locator.

## Leitura pública

O cliente usa a perspetiva `published`, o CDN e os identificadores públicos de projeto/dataset. Não utiliza token privado. As consultas têm projeções explícitas e nunca pedem rascunhos.

Alguns dados exigem confirmação editorial antes de serem devolvidos:

- o documento de contactos só é devolvido quando está confirmado para publicação;
- canais de contacto são filtrados pela autorização pública;
- formas de donativo e indicadores são filtrados pela confirmação;
- quotas e especificações de viaturas só são projetadas quando confirmadas;
- parceiros têm de estar ativos;
- notícias com data futura ficam fora das listagens e dos detalhes públicos.

## Tipos gerados

O TypeGen oficial lê os schemas do Studio e as consultas definidas com `defineQuery`. O resultado versionado é `web/src/sanity/sanity.types.ts`; a sobrecarga gerada do cliente infere automaticamente o resultado de cada `fetch`.

Regenerar depois de alterar schemas ou consultas:

```powershell
cd studio
npm run typegen
```

Durante trabalho iterativo pode usar `npm run typegen:watch`. O ficheiro `studio/.sanity/schema.json` é um artefacto local ignorado; o ficheiro TypeScript gerado deve ser incluído no commit. O build de produção do frontend não executa TypeGen e não precisa de autenticação.

## Conteúdo ausente

As consultas de documentos únicos e detalhes devolvem `null` quando o conteúdo ainda não está publicado. As consultas de coleções devolvem `[]` quando não existem itens. Isto cobre, entre outros casos:

- página inicial ou configurações ainda inexistentes;
- contactos ou páginas institucionais ainda não publicados;
- ausência de artigos, serviços, viaturas, formações ou galerias;
- referências opcionais ou imagens em falta.

Os componentes omitem secções opcionais vazias ou mostram estados públicos neutros nas páginas em que a ausência de conteúdo precisa de ser explicada. Nunca inventam contactos, datas, nomes, números, regras ou outros factos institucionais como fallback.

## Formulários de contacto

As páginas de Formação e Recrutamento projetam apenas a configuração necessária para apresentar o respetivo formulário: estado, textos, etiquetas e regras de visibilidade. O destinatário e o prefixo técnico do assunto não são incluídos nesta projeção nem passados ao componente cliente.

O endpoint `POST /api/contact` aceita apenas os identificadores `training` e `recruitment`. O servidor associa-os aos singletons estáveis, volta a consultar a configuração publicada sem CDN e valida as regras editoriais antes de enviar por Resend. Campos de destinatário, remetente ou Reply-To enviados pelo browser são pedidos inválidos.

Os dados pessoais da submissão não são escritos no Content Lake. O formulário fica totalmente oculto quando a configuração está ausente, inativa ou não contém o aviso de privacidade aprovado.

## Camada pública

O App Router implementa a navegação institucional completa em `web/src/app/`. A homepage combina `homepage`, serviços, notícias e contactos publicados. Os componentes reutilizáveis de conteúdo e layout ficam em `web/src/components/`; os utilitários de navegação, metadata e normalização segura ficam em `web/src/lib/`.

- `PortableTextRenderer` aceita apenas os tipos previstos no schema e ignora tipos desconhecidos; ligações externas usam `noopener noreferrer`.
- `SanityImage` aplica crop/hotspot, dimensões responsivas, texto alternativo editorial e carregamento prioritário apenas na imagem principal da homepage.
- `buildMetadata` aplica SEO editorial, `noIndex`, Open Graph e canonical quando existe um URL base válido.
- `sitemap.ts` combina rotas fixas com slugs publicados; `robots.ts` bloqueia indexação em Vercel Preview.
- A navegação é estrutural e permanece disponível mesmo quando o CMS está vazio.

As rotas de detalhe devolvem 404 para slugs inexistentes. A homepage esconde estatísticas, serviços, missão, notícias e contactos normais quando não existe informação publicada para essas áreas.

O layout define revalidação incremental a cada cinco minutos. Assim, a publicação normal no Studio atualiza o site sem alteração de código nem novo deployment; pode existir um atraso curto devido ao CDN e ao ciclo de revalidação.

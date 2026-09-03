# Conteúdo Sanity no frontend

## Organização

As consultas GROQ e as funções de acesso ficam em `web/src/sanity/queries/`, separadas por domínio:

- `site-settings.ts` e `homepage.ts`;
- `services.ts`, `vehicles.ts` e `training.ts`;
- `news.ts` e `galleries.ts`;
- `institutional-pages.ts` e `institutional-documents.ts`;
- `recruitment.ts`, `membership.ts`, `donations.ts` e `contact.ts`;
- `partners.ts` e `governance.ts`.

Os componentes e páginas futuros devem chamar estas funções diretamente. A cadeia intencional é:

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

O TypeGen oficial lê os schemas do Studio e as 20 consultas definidas com `defineQuery`. O resultado versionado é `web/src/sanity/sanity.types.ts`; a sobrecarga gerada do cliente infere automaticamente o resultado de cada `fetch`.

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

Os componentes futuros devem omitir secções ou mostrar estados técnicos neutros. Nunca devem inventar contactos, datas, nomes, números, regras ou outros factos institucionais como fallback.

# Modelo de conteúdo Sanity

## Princípios

- O dataset `production` contém apenas conteúdo institucional público.
- Não são guardadas submissões de formulários, dados privados ou informação operacional sensível.
- As etiquetas, descrições e mensagens de validação do Studio usam português europeu (`pt-PT`); os identificadores técnicos usam inglês.
- O modelo é estruturado e previsível. Não existe um construtor genérico de páginas.
- Nenhum documento ou facto institucional é criado automaticamente pelo código.

## Documentos singleton

Cada singleton tem um ID estável igual ao respetivo tipo, abre diretamente no Studio e não pode ser criado de forma genérica, duplicado, eliminado ou despublicado.

| Tipo / ID | Etiqueta | Finalidade e campos principais |
| --- | --- | --- |
| `siteSettings` | Configurações do Site | Nome oficial/curto, descrição institucional, logótipo acessível, URL oficial e SEO por omissão. |
| `homepage` | Página Inicial | Hero, três chamadas de ação, indicadores confirmados, missão, serviços em destaque, configuração das notícias recentes, chamada de apoio e SEO. |
| `recruitmentInformation` | Recrutamento | Introdução, elegibilidade, requisitos, etapas, expectativas, FAQ, introdução ao futuro formulário, resumo de privacidade e SEO. |
| `membershipInformation` | Informação para Sócios | Introdução, elegibilidade, benefícios, processo, quotas confirmadas, FAQ, introdução ao futuro formulário e SEO. |
| `donationInformation` | Donativos | Introdução, formas de ajudar, métodos de donativo estruturados e SEO. |
| `contactInformation` | Contactos | Confirmação editorial, morada, email, telefone, canais adicionais, horário, mapa, redes sociais, aviso de emergência e SEO. |

## Páginas institucionais controladas

`institutionalPage` não é uma coleção de páginas livres. O Studio expõe apenas quatro documentos fixos:

| ID estável | Navegação editorial |
| --- | --- |
| `institutionalPage.association` | Associação → Apresentação |
| `institutionalPage.fireBrigade` | Corpo de Bombeiros → Apresentação |
| `institutionalPage.privacyPolicy` | Associação → Política de Privacidade |
| `institutionalPage.accessibilityStatement` | Associação → Declaração de Acessibilidade |

Campos: título, introdução, imagem acessível, Portable Text controlado, referências ordenadas a documentos institucionais e SEO. Estes documentos usam as mesmas proteções de ações dos singletons.

## Coleções

| Tipo | Finalidade | Campos principais e relações |
| --- | --- | --- |
| `newsArticle` | Notícias e atividades | Título, slug único no tipo, resumo, imagem, conteúdo, data de publicação, categorias, autor opcional e SEO. Referencia `newsCategory[]` e opcionalmente `person`. |
| `newsCategory` | Classificação editorial | Nome, slug único no tipo e descrição. |
| `service` | Serviços públicos | Título, slug, resumo, imagem ou símbolo controlado, conteúdo, disponibilidade, contactos, ordem e SEO. Pode ser referenciado por `homepage`. |
| `vehicle` | Frota pública | Designação, categoria controlada, imagens, descrição, especificações aprovadas e ordem. Não contempla dados operacionais sensíveis. |
| `training` | Oferta e ações formativas | Título, slug, resumo, descrição, datas opcionais, local, destinatários, inscrição, estado e SEO. |
| `gallery` | Álbuns fotográficos | Título, slug, data, descrição, capa, imagens ordenadas e SEO. |
| `institutionalDocument` | PDFs oficiais | Título, categoria, ficheiro PDF, data, referência e resumo acessível em Portable Text. Pode ser referenciado por páginas e pelo editor de texto. |
| `person` | Pessoas apresentadas publicamente | Nome autorizado, fotografia, biografia e contactos profissionais expressamente autorizados. |
| `governingBody` | Comando e órgãos sociais | Tipo, designação, datas de mandato, descrição e cargos ordenados. Cada cargo referencia `person`. |
| `partner` | Parceiros públicos | Nome, logótipo, website HTTPS, descrição, ordem e estado de visibilidade. |

## Objetos reutilizáveis

Os objetos não têm ciclo de vida independente e ficam embebidos no documento que os utiliza.

| Tipo | Utilização |
| --- | --- |
| `accessibleImage` | Imagem com hotspot, estado decorativo, texto alternativo condicional, legenda e crédito. |
| `seo` | Meta title, meta description, imagem Open Graph e `noIndex`; comprimentos inadequados geram avisos. |
| `callToAction` | Texto, descrição acessível, destino interno/HTTPS/telefone e variante visual controlada. |
| `portableText` | Parágrafos, títulos H2-H4, negrito, itálico, listas, ligações seguras, imagens acessíveis e referências a documentos. Não permite HTML arbitrário. |
| `statistic` | Designação, valor, complemento, confirmação obrigatória, data de confirmação e nota editorial. |
| `socialLink` | Plataforma controlada e URL HTTPS oficial. |
| `address` | Linhas de morada, código postal, localidade, concelho e país. |
| `contactChannel` | Tipo, valor, nota e confirmação obrigatória de autorização para publicação. |
| `donationMethod` | Tipo controlado, instruções, IBAN/MB WAY/URL quando aplicável e confirmação datada. |
| `governingRole` | Cargo, referência obrigatória a `person` e nota pública. |
| `galleryItem` | `accessibleImage` dentro de uma lista ordenável. |
| `faqItem` | Pergunta e resposta em Portable Text controlado. |

## Relações principais

```text
homepage.featuredServices[]       -> service
newsArticle.categories[]         -> newsCategory
newsArticle.author               -> person (opcional)
governingBody.roles[].person     -> person
institutionalPage.documents[]    -> institutionalDocument
portableText[]                   -> institutionalDocument (opcional)
```

As relações são unidirecionais. Não existem referências inversas redundantes.

## Validação e integridade

- Títulos essenciais e slugs são obrigatórios; o campo slug aplica a verificação de unicidade do Sanity dentro do respetivo tipo.
- URLs públicas externas aceitam apenas HTTPS. Ligações no texto aceitam caminhos internos, HTTPS, `mailto:` e `tel:` validados.
- Emails e telefones usam validação adequada sem impor um formato visual único.
- Datas finais não podem anteceder datas iniciais; datas futuras de notícias geram aviso de agendamento.
- Uploads de documentos aceitam PDF e exigem um resumo HTML acessível.
- Imagens significativas exigem texto alternativo; imagens marcadas como decorativas dispensam-no.
- Indicadores exigem confirmação oficial e data de confirmação antes da publicação.
- Contactos adicionais exigem confirmação explícita de autorização pública.
- Quotas, especificações de viaturas e métodos de donativo apresentam avisos enquanto não estiverem confirmados.
- Limites SEO são avisos editoriais, não bloqueios desnecessários.

## Decisões face à fundação inicial

- `generalEmail` e `generalPhone` deixam de pertencer a `siteSettings`; a fonte única desses dados passa a ser `contactInformation`.
- O logótipo usa agora `accessibleImage`, mantendo compatibilidade estrutural com o tipo de imagem do Sanity e acrescentando requisitos de acessibilidade.
- Os quatro conteúdos institucionais usam um único schema controlado com IDs fixos, evitando páginas arbitrárias e schemas quase idênticos.
- As secções específicas da página inicial são objetos embebidos, não componentes livres de page builder.
- Não foram adicionados tipos específicos para “etapa de recrutamento”, “etapa de sócio” ou “especificação de viatura”; são objetos locais porque não têm ciclo de vida próprio.

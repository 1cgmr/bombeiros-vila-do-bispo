import type { StructureResolver } from 'sanity/structure'

import { institutionalPageIds } from './singletons'

export const structure: StructureResolver = (S) => {
  const fixedDocument = (
    title: string,
    schemaType: string,
    documentId: string,
  ) =>
    S.listItem()
      .id(documentId)
      .title(title)
      .schemaType(schemaType)
      .child(
        S.document()
          .id(documentId)
          .title(title)
          .schemaType(schemaType)
          .documentId(documentId),
      )

  return S.list()
    .title('Conteúdos')
    .items([
      fixedDocument('Página Inicial', 'homepage', 'homepage'),
      S.divider(),
      S.listItem()
        .id('association')
        .title('Associação')
        .child(
          S.list()
            .title('Associação')
            .items([
              fixedDocument(
                'Apresentação',
                'institutionalPage',
                institutionalPageIds.association,
              ),
              fixedDocument(
                'Política de Privacidade',
                'institutionalPage',
                institutionalPageIds.privacyPolicy,
              ),
              fixedDocument(
                'Declaração de Acessibilidade',
                'institutionalPage',
                institutionalPageIds.accessibilityStatement,
              ),
            ]),
        ),
      S.listItem()
        .id('fireBrigade')
        .title('Corpo de Bombeiros')
        .child(
          S.list()
            .title('Corpo de Bombeiros')
            .items([
              fixedDocument(
                'Apresentação',
                'institutionalPage',
                institutionalPageIds.fireBrigade,
              ),
              S.listItem()
                .id('command')
                .title('Comando')
                .schemaType('governingBody')
                .child(
                  S.documentTypeList('governingBody')
                    .id('commandDocuments')
                    .title('Comando')
                    .filter('_type == "governingBody" && bodyType == "command"')
                    .apiVersion('2026-09-01')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('command-governing-body'),
                    ]),
                ),
              S.listItem()
                .id('governingBodies')
                .title('Órgãos Sociais')
                .schemaType('governingBody')
                .child(
                  S.documentTypeList('governingBody')
                    .id('governingBodyDocuments')
                    .title('Órgãos Sociais')
                    .filter(
                      '_type == "governingBody" && bodyType == "governingBody"',
                    )
                    .apiVersion('2026-09-01')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('social-governing-body'),
                    ]),
                ),
              S.documentTypeListItem('person').title('Pessoas'),
              S.documentTypeListItem('vehicle').title('Viaturas'),
            ]),
        ),
      S.listItem()
        .id('news')
        .title('Notícias')
        .child(
          S.list()
            .title('Notícias')
            .items([
              S.documentTypeListItem('newsArticle').title('Artigos'),
              S.documentTypeListItem('newsCategory').title('Categorias'),
            ]),
        ),
      S.documentTypeListItem('service').title('Serviços'),
      S.listItem()
        .id('training')
        .title('Formação')
        .child(
          S.list()
            .title('Formação')
            .items([
              fixedDocument(
                'Apresentação',
                'trainingInformation',
                'trainingInformation',
              ),
              S.documentTypeListItem('training').title('Ações de formação'),
            ]),
        ),
      fixedDocument(
        'Recrutamento',
        'recruitmentInformation',
        'recruitmentInformation',
      ),
      S.listItem()
        .id('membershipAndSupport')
        .title('Sócios e Apoio')
        .child(
          S.list()
            .title('Sócios e Apoio')
            .items([
              fixedDocument(
                'Informação para Sócios',
                'membershipInformation',
                'membershipInformation',
              ),
              fixedDocument(
                'Donativos',
                'donationInformation',
                'donationInformation',
              ),
              S.documentTypeListItem('partner').title('Parceiros'),
            ]),
        ),
      S.documentTypeListItem('gallery').title('Galerias'),
      S.documentTypeListItem('institutionalDocument').title('Documentos'),
      fixedDocument('Contactos', 'contactInformation', 'contactInformation'),
      S.divider(),
      fixedDocument('Configurações do Site', 'siteSettings', 'siteSettings'),
    ])
}

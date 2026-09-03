import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdos')
    .items([
      S.listItem()
        .id('siteSettings')
        .title('Configurações do Site')
        .schemaType('siteSettings')
        .child(
          S.document()
            .id('siteSettings')
            .title('Configurações do Site')
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),
    ])

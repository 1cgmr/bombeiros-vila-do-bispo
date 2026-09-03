import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO e partilha',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Título para motores de pesquisa',
      type: 'string',
      description:
        'Se ficar vazio, o site utilizará o título principal do conteúdo.',
      validation: (rule) => [
        rule
          .max(60)
          .warning(
            'Os motores de pesquisa podem cortar títulos com mais de 60 caracteres.',
          ),
        rule
          .min(30)
          .warning(
            'Um título entre 30 e 60 caracteres costuma ser mais informativo.',
          ),
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Descrição para motores de pesquisa',
      type: 'text',
      rows: 3,
      validation: (rule) => [
        rule
          .max(160)
          .warning(
            'Os motores de pesquisa podem cortar descrições com mais de 160 caracteres.',
          ),
        rule
          .min(70)
          .warning(
            'Uma descrição entre 70 e 160 caracteres costuma ser mais útil.',
          ),
      ],
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Imagem de partilha',
      type: 'accessibleImage',
      description:
        'Imagem opcional usada quando este conteúdo é partilhado nas redes sociais.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Não indexar esta página',
      type: 'boolean',
      description:
        'Ative apenas quando esta página não deve aparecer nos motores de pesquisa.',
      initialValue: false,
    }),
  ],
})

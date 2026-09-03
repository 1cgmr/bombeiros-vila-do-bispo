import { defineArrayMember, defineField, defineType } from 'sanity'

export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'Artigo de Notícias',
  type: 'document',
  groups: [
    { name: 'content', title: 'Conteúdo', default: true },
    { name: 'classification', title: 'Publicação' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().error('Indique o título do artigo.').max(160),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço do artigo',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      description:
        'Use “Gerar” depois de confirmar o título. O endereço deve ser único.',
      validation: (rule) =>
        rule.required().error('Gere um endereço único para o artigo.'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => [
        rule.required().error('Introduza um resumo do artigo.'),
        rule.max(240).warning('Prefira um resumo com até 240 caracteres.'),
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagem principal',
      type: 'accessibleImage',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Conteúdo',
      type: 'portableText',
      group: 'content',
      validation: (rule) =>
        rule.required().min(1).error('Introduza o conteúdo do artigo.'),
    }),
    defineField({
      name: 'publicationDate',
      title: 'Data de publicação',
      type: 'datetime',
      group: 'classification',
      validation: (rule) => [
        rule.required().error('Indique a data de publicação.'),
        rule
          .custom((value) => {
            if (!value || new Date(value) <= new Date()) return true
            return 'A data está no futuro; confirme que o artigo deve ficar agendado.'
          })
          .warning(),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categorias',
      type: 'array',
      group: 'classification',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'newsCategory' }],
        }),
      ],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error('Escolha pelo menos uma categoria.')
          .unique(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      group: 'classification',
      to: [{ type: 'person' }],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Data de publicação, mais recente',
      name: 'publicationDateDesc',
      by: [{ field: 'publicationDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'publicationDate', media: 'mainImage' },
    prepare: ({ title, date, media }) => ({
      title: title || 'Artigo sem título',
      subtitle: date
        ? new Date(date).toLocaleDateString('pt-PT')
        : 'Sem data de publicação',
      media,
    }),
  },
})

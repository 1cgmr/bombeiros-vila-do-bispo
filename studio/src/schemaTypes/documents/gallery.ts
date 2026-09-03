import { defineArrayMember, defineField, defineType } from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Galeria',
  type: 'document',
  groups: [
    { name: 'content', title: 'Informação', default: true },
    { name: 'images', title: 'Imagens' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().error('Indique o título da galeria.').max(160),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço da galeria',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      description:
        'Use “Gerar” depois de confirmar o título. O endereço deve ser único.',
      validation: (rule) =>
        rule.required().error('Gere um endereço único para a galeria.'),
    }),
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagem de capa',
      type: 'accessibleImage',
      group: 'images',
      validation: (rule) =>
        rule.required().error('Escolha uma imagem de capa.'),
    }),
    defineField({
      name: 'items',
      title: 'Imagens ordenadas',
      type: 'array',
      group: 'images',
      description: 'Arraste as imagens para definir a ordem de apresentação.',
      of: [defineArrayMember({ type: 'galleryItem' })],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error('Adicione pelo menos uma imagem à galeria.'),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Data, mais recente',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'date', media: 'coverImage' },
    prepare: ({ title, date, media }) => ({
      title: title || 'Galeria sem título',
      subtitle: date ? new Date(date).toLocaleDateString('pt-PT') : 'Sem data',
      media,
    }),
  },
})

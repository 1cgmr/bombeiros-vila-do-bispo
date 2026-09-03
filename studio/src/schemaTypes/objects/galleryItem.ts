import { defineField, defineType } from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Imagem da galeria',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'accessibleImage',
      validation: (rule) =>
        rule.required().error('Escolha uma imagem para a galeria.'),
    }),
  ],
  preview: {
    select: {
      title: 'image.caption',
      subtitle: 'image.credit',
      media: 'image',
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Imagem sem legenda',
      subtitle,
      media,
    }),
  },
})

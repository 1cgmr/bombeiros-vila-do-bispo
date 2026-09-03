import { defineArrayMember, defineField, defineType } from 'sanity'

export const person = defineType({
  name: 'person',
  title: 'Pessoa',
  type: 'document',
  fields: [
    defineField({
      name: 'publicName',
      title: 'Nome público',
      type: 'string',
      description: 'Utilize apenas o nome autorizado para divulgação.',
      validation: (rule) =>
        rule
          .required()
          .error('Indique o nome autorizado para publicação.')
          .max(160),
    }),
    defineField({
      name: 'photograph',
      title: 'Fotografia',
      type: 'accessibleImage',
      description:
        'Utilize apenas uma fotografia com autorização de publicação.',
    }),
    defineField({
      name: 'biography',
      title: 'Biografia pública',
      type: 'portableText',
    }),
    defineField({
      name: 'publicContactChannels',
      title: 'Contactos públicos autorizados',
      type: 'array',
      description:
        'Adicione apenas contactos profissionais explicitamente autorizados para divulgação.',
      of: [defineArrayMember({ type: 'contactChannel' })],
    }),
  ],
  preview: {
    select: { title: 'publicName', media: 'photograph' },
    prepare: ({ title, media }) => ({
      title: title || 'Pessoa sem nome',
      media,
    }),
  },
})

import { defineArrayMember, defineField, defineType } from 'sanity'

export const donationInformation = defineType({
  name: 'donationInformation',
  title: 'Donativos',
  type: 'document',
  fields: [
    defineField({
      name: 'introduction',
      title: 'Introdução',
      type: 'portableText',
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error('Introduza a apresentação oficial dos donativos.'),
    }),
    defineField({
      name: 'waysToContribute',
      title: 'Como ajudar',
      type: 'portableText',
    }),
    defineField({
      name: 'donationMethods',
      title: 'Formas de donativo',
      type: 'array',
      description:
        'Nunca introduza IBAN, MB WAY ou instruções sem confirmação oficial da Direção.',
      of: [defineArrayMember({ type: 'donationMethod' })],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Donativos' }) },
})

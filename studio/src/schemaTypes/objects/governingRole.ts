import { defineField, defineType } from 'sanity'

export const governingRole = defineType({
  name: 'governingRole',
  title: 'Cargo e pessoa',
  type: 'object',
  fields: [
    defineField({
      name: 'roleTitle',
      title: 'Cargo',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .error('Indique a designação oficial do cargo.')
          .max(120),
    }),
    defineField({
      name: 'person',
      title: 'Pessoa',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (rule) =>
        rule.required().error('Escolha a pessoa que ocupa este cargo.'),
    }),
    defineField({
      name: 'publicNote',
      title: 'Nota pública',
      type: 'string',
      validation: (rule) =>
        rule.max(240).warning('Prefira uma nota com até 240 caracteres.'),
    }),
  ],
  preview: {
    select: {
      title: 'roleTitle',
      subtitle: 'person.publicName',
      media: 'person.photograph',
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Cargo sem designação',
      subtitle,
      media,
    }),
  },
})

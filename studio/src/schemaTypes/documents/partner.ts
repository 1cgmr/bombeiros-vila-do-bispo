import { defineField, defineType } from 'sanity'

import { validateHttpsUrl } from '../validation'

export const partner = defineType({
  name: 'partner',
  title: 'Parceiro',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      description: 'Utilize apenas a designação autorizada para divulgação.',
      validation: (rule) =>
        rule.required().error('Indique o nome do parceiro.').max(160),
    }),
    defineField({
      name: 'logo',
      title: 'Logótipo',
      type: 'accessibleImage',
      description:
        'Utilize apenas ficheiros cuja publicação tenha sido autorizada.',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      validation: (rule) => rule.custom(validateHttpsUrl),
    }),
    defineField({
      name: 'description',
      title: 'Descrição pública',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(320).warning('Prefira uma descrição com até 320 caracteres.'),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Ordem de apresentação',
      type: 'number',
      validation: (rule) =>
        rule
          .integer()
          .min(0)
          .error('Utilize um número inteiro igual ou superior a zero.'),
    }),
    defineField({
      name: 'active',
      title: 'Apresentar no website',
      type: 'boolean',
      description:
        'Ative apenas enquanto a parceria estiver confirmada e autorizada.',
    }),
  ],
  orderings: [
    {
      title: 'Ordem de apresentação',
      name: 'displayOrderAsc',
      by: [
        { field: 'displayOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', active: 'active', media: 'logo' },
    prepare: ({ title, active, media }) => ({
      title: title || 'Parceiro sem nome',
      subtitle: active ? 'Visível no website' : 'Não visível',
      media,
    }),
  },
})

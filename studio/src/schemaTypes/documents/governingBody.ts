import { defineArrayMember, defineField, defineType } from 'sanity'

import { validateEndDate } from '../validation'

export const governingBody = defineType({
  name: 'governingBody',
  title: 'Comando ou Órgão Social',
  type: 'document',
  fields: [
    defineField({
      name: 'bodyType',
      title: 'Tipo',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Comando', value: 'command' },
          { title: 'Órgão social', value: 'governingBody' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha o tipo de estrutura.'),
    }),
    defineField({
      name: 'title',
      title: 'Designação oficial',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Indique a designação oficial.').max(160),
    }),
    defineField({
      name: 'mandateStart',
      title: 'Início do mandato',
      type: 'date',
    }),
    defineField({
      name: 'mandateEnd',
      title: 'Fim do mandato',
      type: 'date',
      validation: (rule) =>
        rule.custom((value, context) =>
          validateEndDate(
            value,
            (context.document as { mandateStart?: string }).mandateStart,
            'O fim do mandato',
          ),
        ),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'portableText',
    }),
    defineField({
      name: 'roles',
      title: 'Cargos e pessoas',
      type: 'array',
      description: 'Arraste os cargos para definir a ordem de apresentação.',
      of: [defineArrayMember({ type: 'governingRole' })],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error('Adicione pelo menos um cargo e respetiva pessoa.'),
    }),
  ],
  orderings: [
    {
      title: 'Início do mandato, mais recente',
      name: 'mandateStartDesc',
      by: [{ field: 'mandateStart', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'bodyType',
      start: 'mandateStart',
      end: 'mandateEnd',
    },
    prepare: ({ title, type, start, end }) => ({
      title: title || 'Estrutura sem designação',
      subtitle: [
        type === 'command'
          ? 'Comando'
          : type === 'governingBody'
            ? 'Órgão social'
            : undefined,
        start && end ? `${start} – ${end}` : start,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

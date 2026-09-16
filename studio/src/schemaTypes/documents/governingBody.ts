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
      title: 'Designação',
      type: 'string',
      description: 'Nos exemplos provisórios, a designação é ilustrativa e deve ser confirmada antes de apresentar a composição oficial.',
      validation: (rule) =>
        rule.required().error('Indique a designação do órgão.').max(160),
    }),
    defineField({
      name: 'isPlaceholder',
      title: 'Exemplo provisório',
      type: 'boolean',
      description: 'Assinale enquanto a existência, a designação ou a composição deste órgão não estiverem confirmadas. O site identifica-o como exemplo e não apresenta pessoas.',
      initialValue: false,
      hidden: ({document}) => document?.bodyType !== 'governingBody',
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
      hidden: ({document}) => document?.bodyType === 'governingBody' && document?.isPlaceholder === true,
      validation: (rule) =>
        rule.custom((value, context) => {
          const document = context.document as {bodyType?: string; isPlaceholder?: boolean}
          if (document.bodyType === 'governingBody' && document.isPlaceholder) return true
          return Array.isArray(value) && value.length > 0
            ? true
            : 'Adicione pelo menos um cargo e respetiva pessoa.'
        }),
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
      placeholder: 'isPlaceholder',
      start: 'mandateStart',
      end: 'mandateEnd',
    },
    prepare: ({ title, type, placeholder, start, end }) => ({
      title: title || 'Estrutura sem designação',
      subtitle: [
        type === 'command'
          ? 'Comando'
          : type === 'governingBody'
            ? 'Órgão social'
            : undefined,
        placeholder ? 'Exemplo provisório' : undefined,
        start && end ? `${start} – ${end}` : start,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

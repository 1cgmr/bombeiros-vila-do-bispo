import { defineField, defineType } from 'sanity'

import { getOptionLabel, trainingStatusLabels } from '../optionLabels'
import { validateEndDate } from '../validation'

export const training = defineType({
  name: 'training',
  title: 'Formação',
  type: 'document',
  groups: [
    { name: 'content', title: 'Conteúdo', default: true },
    { name: 'schedule', title: 'Datas e inscrições' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().error('Indique o título da formação.').max(160),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço da formação',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      description:
        'Use “Gerar” depois de confirmar o título. O endereço deve ser único.',
      validation: (rule) =>
        rule.required().error('Gere um endereço único para a formação.'),
    }),
    defineField({
      name: 'summary',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => [
        rule.required().error('Introduza um resumo da formação.'),
        rule.max(240).warning('Prefira um resumo com até 240 caracteres.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'portableText',
      group: 'content',
      validation: (rule) =>
        rule.required().min(1).error('Introduza a descrição da formação.'),
    }),
    defineField({
      name: 'startDate',
      title: 'Data de início',
      type: 'datetime',
      group: 'schedule',
    }),
    defineField({
      name: 'endDate',
      title: 'Data de fim',
      type: 'datetime',
      group: 'schedule',
      validation: (rule) =>
        rule.custom((value, context) =>
          validateEndDate(
            value,
            (context.document as { startDate?: string }).startDate,
          ),
        ),
    }),
    defineField({
      name: 'location',
      title: 'Local',
      type: 'string',
      group: 'schedule',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'audience',
      title: 'Destinatários',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'enrollmentInformation',
      title: 'Informação de inscrição',
      type: 'portableText',
      group: 'schedule',
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      group: 'schedule',
      options: {
        list: [
          { title: 'Prevista', value: 'planned' },
          { title: 'Inscrições abertas', value: 'open' },
          { title: 'Inscrições encerradas', value: 'closed' },
          { title: 'Concluída', value: 'completed' },
          { title: 'Cancelada', value: 'cancelled' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha o estado da formação.'),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Data de início, mais recente',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'startDate', status: 'status' },
    prepare: ({ title, date, status }) => ({
      title: title || 'Formação sem título',
      subtitle:
        [
          date ? new Date(date).toLocaleDateString('pt-PT') : undefined,
          getOptionLabel(trainingStatusLabels, status),
        ]
          .filter(Boolean)
          .join(' · ') || 'Sem datas',
    }),
  },
})

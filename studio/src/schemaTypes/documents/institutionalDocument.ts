import { defineField, defineType } from 'sanity'

import {
  getOptionLabel,
  institutionalDocumentCategoryLabels,
} from '../optionLabels'
import { validatePdfFile } from '../validation'

export const institutionalDocument = defineType({
  name: 'institutionalDocument',
  title: 'Documento Institucional',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Indique o título do documento.').max(180),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Estatutos', value: 'statutes' },
          { title: 'Relatórios', value: 'reports' },
          { title: 'Contas', value: 'accounts' },
          { title: 'Regulamentos', value: 'regulations' },
          { title: 'Atas e deliberações', value: 'minutes' },
          { title: 'Outro', value: 'other' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha a categoria do documento.'),
    }),
    defineField({
      name: 'file',
      title: 'Ficheiro PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
      validation: (rule) =>
        rule
          .required()
          .error('Carregue o documento em PDF.')
          .custom(validatePdfFile),
    }),
    defineField({ name: 'date', title: 'Data do documento', type: 'date' }),
    defineField({
      name: 'reference',
      title: 'Referência oficial',
      type: 'string',
      description:
        'Opcional: número, código ou referência oficial do documento.',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'accessibleSummary',
      title: 'Resumo acessível em HTML',
      type: 'portableText',
      description:
        'Explique o objetivo e os pontos essenciais para que a informação principal não dependa apenas do PDF.',
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error('Adicione um resumo acessível do documento.'),
    }),
  ],
  orderings: [
    {
      title: 'Data, mais recente',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', category: 'category', date: 'date' },
    prepare: ({ title, category, date }) => ({
      title: title || 'Documento sem título',
      subtitle: [
        getOptionLabel(institutionalDocumentCategoryLabels, category),
        date,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

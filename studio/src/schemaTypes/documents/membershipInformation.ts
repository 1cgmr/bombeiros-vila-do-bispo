import { defineArrayMember, defineField, defineType } from 'sanity'

export const membershipInformation = defineType({
  name: 'membershipInformation',
  title: 'Informação para Sócios',
  type: 'document',
  groups: [
    { name: 'content', title: 'Informação', default: true },
    { name: 'form', title: 'Futuro formulário' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'introduction',
      title: 'Introdução',
      type: 'portableText',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error('Introduza a apresentação oficial para sócios.'),
    }),
    defineField({
      name: 'eligibility',
      title: 'Quem se pode associar',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefícios',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'process',
      title: 'Como tornar-se sócio',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'membershipStep',
          title: 'Etapa',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (rule) =>
                rule.required().error('Indique o título da etapa.'),
            }),
            defineField({
              name: 'description',
              title: 'Descrição',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
    defineField({
      name: 'fees',
      title: 'Quotas e valores',
      type: 'portableText',
      group: 'content',
      description:
        'Preencher apenas com valores e condições oficialmente confirmados.',
      validation: (rule) =>
        rule
          .custom((value, context) => {
            if (!Array.isArray(value) || value.length === 0) return true
            const document = context.document as {
              feesConfirmedForPublication?: boolean
              feesConfirmationDate?: string
            }
            if (!document.feesConfirmedForPublication)
              return 'As quotas ou valores ainda não estão confirmados para publicação.'
            if (!document.feesConfirmationDate)
              return 'Indique a data de confirmação das quotas ou valores.'
            return true
          })
          .warning(),
    }),
    defineField({
      name: 'feesConfirmedForPublication',
      title: 'Quotas confirmadas para publicação',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'feesConfirmationDate',
      title: 'Data de confirmação das quotas',
      type: 'date',
      group: 'content',
    }),
    defineField({
      name: 'faq',
      title: 'Perguntas frequentes',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
    defineField({
      name: 'futureFormIntroduction',
      title: 'Introdução ao futuro formulário',
      type: 'portableText',
      group: 'form',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Informação para Sócios' }) },
})

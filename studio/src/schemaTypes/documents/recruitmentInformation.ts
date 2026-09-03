import { defineArrayMember, defineField, defineType } from 'sanity'

export const recruitmentInformation = defineType({
  name: 'recruitmentInformation',
  title: 'Recrutamento',
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
          .error('Introduza a apresentação oficial do recrutamento.'),
    }),
    defineField({
      name: 'eligibility',
      title: 'Quem se pode candidatar',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'requirements',
      title: 'Requisitos',
      type: 'array',
      group: 'content',
      description: 'Indique apenas requisitos oficialmente confirmados.',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'stages',
      title: 'Etapas do processo',
      type: 'array',
      group: 'content',
      description: 'A ordem nesta lista será a ordem apresentada ao candidato.',
      of: [
        defineArrayMember({
          name: 'recruitmentStage',
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
      name: 'expectations',
      title: 'O que esperar',
      type: 'portableText',
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
    defineField({
      name: 'privacySummary',
      title: 'Resumo de privacidade',
      type: 'portableText',
      group: 'form',
      description:
        'Texto curto a apresentar junto do futuro formulário; deverá ser validado antes da publicação.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Recrutamento' }) },
})

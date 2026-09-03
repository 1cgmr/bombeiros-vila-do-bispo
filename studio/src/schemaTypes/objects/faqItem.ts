import { defineField, defineType } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'Pergunta frequente',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Pergunta',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Introduza a pergunta.').max(200),
    }),
    defineField({
      name: 'answer',
      title: 'Resposta',
      type: 'portableText',
      validation: (rule) =>
        rule.required().min(1).error('Introduza a resposta.'),
    }),
  ],
  preview: {
    select: { title: 'question' },
    prepare: ({ title }) => ({ title: title || 'Pergunta sem título' }),
  },
})

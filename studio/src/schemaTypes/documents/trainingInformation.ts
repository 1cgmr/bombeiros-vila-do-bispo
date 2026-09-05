import {defineField, defineType} from 'sanity'

export const trainingInformation = defineType({
  name: 'trainingInformation',
  title: 'Apresentação da Formação',
  type: 'document',
  groups: [
    {name: 'content', title: 'Informação', default: true},
    {name: 'form', title: 'Formulário de contacto'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'introduction',
      title: 'Introdução',
      type: 'portableText',
      group: 'content',
      validation: (rule) =>
        rule.required().min(1).error('Introduza a apresentação geral da formação.'),
    }),
    defineField({
      name: 'body',
      title: 'Informação complementar',
      type: 'portableText',
      group: 'content',
      description:
        'Apresente informação geral. As datas, os destinatários e as inscrições pertencem a cada ação de formação.',
    }),
    defineField({
      name: 'contactForm',
      title: 'Formulário de contacto',
      type: 'contactForm',
      group: 'form',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Apresentação da Formação'})},
})

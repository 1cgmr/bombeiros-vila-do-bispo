import { defineArrayMember, defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Serviço',
  type: 'document',
  groups: [
    { name: 'content', title: 'Conteúdo', default: true },
    { name: 'availability', title: 'Disponibilidade e contactos' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().error('Indique o título do serviço.').max(140),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço do serviço',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      description:
        'Use “Gerar” depois de confirmar o título. O endereço deve ser único.',
      validation: (rule) =>
        rule.required().error('Gere um endereço único para o serviço.'),
    }),
    defineField({
      name: 'summary',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => [
        rule.required().error('Introduza um resumo do serviço.'),
        rule.max(240).warning('Prefira um resumo com até 240 caracteres.'),
      ],
    }),
    defineField({
      name: 'visualType',
      title: 'Tipo de elemento visual',
      type: 'string',
      group: 'content',
      options: {
        layout: 'radio',
        list: [
          { title: 'Imagem', value: 'image' },
          { title: 'Símbolo controlado', value: 'icon' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha imagem ou símbolo controlado.'),
    }),
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'accessibleImage',
      group: 'content',
      hidden: ({ document }) => document?.visualType !== 'image',
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.document as { visualType?: string }).visualType !==
            'image' || value
            ? true
            : 'Escolha a imagem do serviço.',
        ),
    }),
    defineField({
      name: 'icon',
      title: 'Símbolo',
      type: 'string',
      group: 'content',
      hidden: ({ document }) => document?.visualType !== 'icon',
      options: {
        list: [
          { title: 'Emergência e socorro', value: 'emergency' },
          { title: 'Transporte', value: 'transport' },
          { title: 'Prevenção', value: 'prevention' },
          { title: 'Formação', value: 'training' },
          { title: 'Comunidade', value: 'community' },
          { title: 'Informação geral', value: 'general' },
        ],
      },
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.document as { visualType?: string }).visualType !== 'icon' ||
          value
            ? true
            : 'Escolha o símbolo do serviço.',
        ),
    }),
    defineField({
      name: 'content',
      title: 'Conteúdo completo',
      type: 'portableText',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error('Introduza a descrição completa do serviço.'),
    }),
    defineField({
      name: 'availabilityInformation',
      title: 'Informação de disponibilidade',
      type: 'portableText',
      group: 'availability',
    }),
    defineField({
      name: 'contactChannels',
      title: 'Contactos específicos',
      type: 'array',
      group: 'availability',
      of: [defineArrayMember({ type: 'contactChannel' })],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Ordem de apresentação',
      type: 'number',
      group: 'content',
      validation: (rule) =>
        rule
          .integer()
          .min(0)
          .error('Utilize um número inteiro igual ou superior a zero.'),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Ordem de apresentação',
      name: 'displayOrderAsc',
      by: [
        { field: 'displayOrder', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'summary', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Serviço sem título',
      subtitle,
      media,
    }),
  },
})

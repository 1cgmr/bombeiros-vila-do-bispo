import { defineArrayMember, defineField, defineType } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Página Inicial',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Destaque principal', default: true },
    { name: 'statistics', title: 'Indicadores' },
    { name: 'mission', title: 'Missão' },
    { name: 'content', title: 'Serviços, notícias e apoio' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Destaque principal',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'headline',
          title: 'Mensagem principal',
          type: 'string',
          validation: (rule) =>
            rule.required().error('Indique a mensagem principal.').max(140),
        }),
        defineField({
          name: 'highlightedFragment',
          title: 'Trecho em destaque',
          type: 'string',
          description:
            'Opcional. Deve corresponder exatamente a uma parte da mensagem principal.',
          validation: (rule) =>
            rule.custom((value, context) => {
              if (!value) return true
              const parent = context.parent as { headline?: string } | undefined
              return parent?.headline?.includes(value)
                ? true
                : 'O trecho deve existir exatamente dentro da mensagem principal.'
            }),
        }),
        defineField({
          name: 'description',
          title: 'Descrição',
          type: 'text',
          rows: 3,
          validation: (rule) =>
            rule
              .max(320)
              .warning('Prefira uma descrição com até 320 caracteres.'),
        }),
        defineField({
          name: 'image',
          title: 'Imagem principal',
          type: 'accessibleImage',
        }),
        defineField({
          name: 'emergencyCta',
          title: 'Botão de emergência',
          type: 'callToAction',
        }),
        defineField({
          name: 'recruitmentCta',
          title: 'Botão de recrutamento',
          type: 'callToAction',
        }),
        defineField({
          name: 'supportCta',
          title: 'Botão de apoio',
          type: 'callToAction',
        }),
      ],
    }),
    defineField({
      name: 'statistics',
      title: 'Indicadores oficiais',
      type: 'array',
      group: 'statistics',
      description:
        'Adicione apenas valores oficialmente confirmados. A ordem nesta lista será a ordem de apresentação.',
      of: [defineArrayMember({ type: 'statistic' })],
      validation: (rule) =>
        rule
          .max(8)
          .warning('Mais de oito indicadores podem dificultar a leitura.'),
    }),
    defineField({
      name: 'mission',
      title: 'Missão',
      type: 'object',
      group: 'mission',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Etiqueta da secção',
          type: 'string',
          validation: (rule) => rule.max(80),
        }),
        defineField({
          name: 'title',
          title: 'Título',
          type: 'string',
          validation: (rule) => rule.max(140),
        }),
        defineField({ name: 'body', title: 'Texto', type: 'portableText' }),
        defineField({
          name: 'image',
          title: 'Imagem',
          type: 'accessibleImage',
        }),
      ],
    }),
    defineField({
      name: 'featuredServices',
      title: 'Serviços em destaque',
      type: 'array',
      group: 'content',
      description:
        'Escolha e ordene os serviços apresentados na página inicial.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
      validation: (rule) =>
        rule
          .unique()
          .max(6)
          .warning('Recomenda-se um máximo de seis serviços em destaque.'),
    }),
    defineField({
      name: 'latestNews',
      title: 'Últimas notícias',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Etiqueta da secção',
          type: 'string',
          validation: (rule) => rule.max(80),
        }),
        defineField({
          name: 'title',
          title: 'Título da secção',
          type: 'string',
          validation: (rule) => rule.max(140),
        }),
        defineField({
          name: 'itemCount',
          title: 'Número de artigos',
          type: 'number',
          description:
            'Os artigos publicados mais recentes serão escolhidos automaticamente.',
          validation: (rule) =>
            rule.integer().min(1).max(6).error('Escolha um valor entre 1 e 6.'),
        }),
      ],
    }),
    defineField({
      name: 'supportSection',
      title: 'Chamada de apoio e donativo',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Etiqueta da secção',
          type: 'string',
          validation: (rule) => rule.max(80),
        }),
        defineField({
          name: 'title',
          title: 'Título',
          type: 'string',
          validation: (rule) => rule.max(140),
        }),
        defineField({
          name: 'description',
          title: 'Descrição',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(320),
        }),
        defineField({
          name: 'cta',
          title: 'Botão de ação',
          type: 'callToAction',
        }),
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Página Inicial' }) },
})

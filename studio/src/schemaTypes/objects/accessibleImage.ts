import { defineField, defineType } from 'sanity'

export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Imagem acessível',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'decorative',
      title: 'Imagem decorativa',
      type: 'boolean',
      description:
        'Ative apenas quando a imagem não acrescenta informação. Imagens decorativas são ignoradas por leitores de ecrã.',
      initialValue: false,
    }),
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      description:
        'Descreva de forma curta o conteúdo ou a função da imagem, sem começar por “imagem de”.',
      hidden: ({ parent }) => Boolean(parent?.decorative),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            { asset?: unknown; decorative?: boolean } | undefined
          if (!parent?.asset || parent.decorative) return true
          return typeof value === 'string' && value.trim().length > 0
            ? true
            : 'Adicione texto alternativo ou marque a imagem como decorativa.'
        }),
    }),
    defineField({
      name: 'caption',
      title: 'Legenda',
      type: 'string',
      validation: (rule) =>
        rule.max(240).warning('Prefira uma legenda com até 240 caracteres.'),
    }),
    defineField({
      name: 'credit',
      title: 'Crédito da imagem',
      type: 'string',
      description:
        'Identifique o autor ou a origem quando aplicável e autorizado.',
      validation: (rule) =>
        rule.max(160).warning('Prefira um crédito com até 160 caracteres.'),
    }),
  ],
})

import { defineArrayMember, defineField, defineType } from 'sanity'

import { getOptionLabel, vehicleCategoryLabels } from '../optionLabels'

export const vehicle = defineType({
  name: 'vehicle',
  title: 'Viatura',
  type: 'document',
  groups: [
    { name: 'content', title: 'Apresentação', default: true },
    { name: 'specifications', title: 'Especificações públicas' },
    { name: 'media', title: 'Galeria' },
  ],
  fields: [
    defineField({
      name: 'designation',
      title: 'Designação',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .error('Indique a designação oficial da viatura.')
          .max(120),
    }),
    defineField({
      name: 'category',
      title: 'Categoria ou tipo',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Ambulância', value: 'ambulance' },
          { title: 'Combate a incêndios', value: 'firefighting' },
          { title: 'Comando', value: 'command' },
          { title: 'Apoio', value: 'support' },
          { title: 'Outra', value: 'other' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha a categoria da viatura.'),
    }),
    defineField({
      name: 'otherCategory',
      title: 'Outra categoria',
      type: 'string',
      group: 'content',
      hidden: ({ document }) => document?.category !== 'other',
      validation: (rule) =>
        rule
          .max(100)
          .custom((value, context) =>
            (context.document as { category?: string }).category !== 'other' ||
            value
              ? true
              : 'Indique a categoria da viatura.',
          ),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagem principal',
      type: 'accessibleImage',
      group: 'content',
    }),
    defineField({
      name: 'publicDescription',
      title: 'Descrição pública',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'publicSpecifications',
      title: 'Especificações aprovadas para divulgação',
      type: 'array',
      group: 'specifications',
      description:
        'Não inclua informação operacional sensível. Use apenas dados aprovados para divulgação pública.',
      of: [
        defineArrayMember({
          name: 'publicSpecification',
          title: 'Especificação',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Designação',
              type: 'string',
              validation: (rule) =>
                rule.required().error('Indique a designação da especificação.'),
            }),
            defineField({
              name: 'value',
              title: 'Valor',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .error('Indique o valor aprovado para divulgação.'),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (rule) =>
        rule
          .custom((value, context) => {
            if (!Array.isArray(value) || value.length === 0) return true
            const document = context.document as {
              specificationsApprovedForPublication?: boolean
            }
            return document.specificationsApprovedForPublication
              ? true
              : 'Confirme que todas as especificações foram aprovadas para divulgação pública.'
          })
          .warning(),
    }),
    defineField({
      name: 'specificationsApprovedForPublication',
      title: 'Especificações aprovadas para publicação',
      type: 'boolean',
      group: 'specifications',
      initialValue: false,
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria da viatura',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'galleryItem' })],
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
  ],
  orderings: [
    {
      title: 'Ordem de apresentação',
      name: 'displayOrderAsc',
      by: [
        { field: 'displayOrder', direction: 'asc' },
        { field: 'designation', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'designation',
      subtitle: 'otherCategory',
      category: 'category',
      media: 'mainImage',
    },
    prepare: ({ title, subtitle, category, media }) => ({
      title: title || 'Viatura sem designação',
      subtitle: subtitle || getOptionLabel(vehicleCategoryLabels, category),
      media,
    }),
  },
})

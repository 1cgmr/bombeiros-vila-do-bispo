import { defineArrayMember, defineField, defineType } from 'sanity'

import { validateSafeLink } from '../validation'

export const portableText = defineType({
  name: 'portableText',
  title: 'Conteúdo formatado',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Parágrafo', value: 'normal' },
        { title: 'Título de secção', value: 'h2' },
        { title: 'Subtítulo', value: 'h3' },
        { title: 'Título menor', value: 'h4' },
      ],
      lists: [
        { title: 'Lista com marcas', value: 'bullet' },
        { title: 'Lista numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrito', value: 'strong' },
          { title: 'Itálico', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Ligação',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Destino',
                type: 'string',
                description:
                  'Aceita caminhos internos, HTTPS, email (mailto:) e telefone (tel:).',
                validation: (rule) =>
                  rule
                    .required()
                    .error('Indique o destino da ligação.')
                    .custom(validateSafeLink),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Abrir num novo separador',
                type: 'boolean',
                description: 'Recomendado apenas para websites externos.',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'accessibleImage' }),
    defineArrayMember({
      name: 'institutionalDocumentReference',
      title: 'Documento institucional',
      type: 'reference',
      to: [{ type: 'institutionalDocument' }],
    }),
  ],
})

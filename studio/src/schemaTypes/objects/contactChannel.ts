import { defineField, defineType } from 'sanity'

import { validateHttpsUrl, validatePhone } from '../validation'

export const contactChannel = defineType({
  name: 'contactChannel',
  title: 'Canal de contacto',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Designação',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Indique a designação deste contacto.').max(80),
    }),
    defineField({
      name: 'channelType',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Telefone', value: 'phone' },
          { title: 'Email', value: 'email' },
          { title: 'Website', value: 'website' },
          { title: 'Outro', value: 'other' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha o tipo de contacto.'),
    }),
    defineField({
      name: 'value',
      title: 'Contacto',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .error('Indique o contacto.')
          .custom((value, context) => {
            const parent = context.parent as
              { channelType?: string } | undefined
            if (parent?.channelType === 'phone') return validatePhone(value)
            if (parent?.channelType === 'email') {
              return typeof value === 'string' &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? true
                : 'Introduza um endereço de email válido.'
            }
            if (parent?.channelType === 'website')
              return validateHttpsUrl(value)
            return true
          }),
    }),
    defineField({
      name: 'description',
      title: 'Nota pública',
      type: 'string',
      validation: (rule) =>
        rule.max(160).warning('Prefira uma nota com até 160 caracteres.'),
    }),
    defineField({
      name: 'authorizedForPublication',
      title: 'Autorizado para publicação',
      type: 'boolean',
      description:
        'Confirme que este contacto é institucional e foi autorizado para divulgação pública.',
      initialValue: false,
      validation: (rule) =>
        rule.custom((value) =>
          value === true
            ? true
            : 'Confirme a autorização antes de publicar este contacto.',
        ),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'value' },
  },
})

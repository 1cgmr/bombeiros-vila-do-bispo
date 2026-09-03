import { defineField, defineType } from 'sanity'

import { validateHttpsUrl, validatePhone } from '../validation'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Botão de ação',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Texto do botão',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Indique o texto apresentado no botão.').max(60),
    }),
    defineField({
      name: 'accessibleLabel',
      title: 'Descrição acessível',
      type: 'string',
      description:
        'Opcional. Use quando o texto curto do botão não explica claramente o destino.',
      validation: (rule) =>
        rule.max(120).warning('Prefira uma descrição com até 120 caracteres.'),
    }),
    defineField({
      name: 'destinationType',
      title: 'Tipo de destino',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Página deste site', value: 'internal' },
          { title: 'Website externo', value: 'external' },
          { title: 'Telefone', value: 'telephone' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha o tipo de destino do botão.'),
    }),
    defineField({
      name: 'internalPath',
      title: 'Caminho interno',
      type: 'string',
      description:
        'Exemplo de formato: /recrutamento. O caminho deve começar por /.',
      hidden: ({ parent }) => parent?.destinationType !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            { destinationType?: string } | undefined
          if (parent?.destinationType !== 'internal') return true
          return typeof value === 'string' && /^\/(?!\/)/.test(value)
            ? true
            : 'Introduza um caminho interno iniciado por /.'
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'Endereço externo',
      type: 'url',
      hidden: ({ parent }) => parent?.destinationType !== 'external',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            { destinationType?: string } | undefined
          if (parent?.destinationType !== 'external') return true
          if (!value) return 'Indique o endereço externo.'
          return validateHttpsUrl(value)
        }),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Número de telefone',
      type: 'string',
      hidden: ({ parent }) => parent?.destinationType !== 'telephone',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            { destinationType?: string } | undefined
          if (parent?.destinationType !== 'telephone') return true
          if (!value) return 'Indique o número de telefone.'
          return validatePhone(value)
        }),
    }),
    defineField({
      name: 'style',
      title: 'Destaque visual',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Principal', value: 'primary' },
          { title: 'Secundário', value: 'secondary' },
          { title: 'Emergência', value: 'emergency' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha o destaque visual do botão.'),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'destinationType' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Botão sem texto',
      subtitle:
        subtitle === 'internal'
          ? 'Página deste site'
          : subtitle === 'external'
            ? 'Website externo'
            : subtitle === 'telephone'
              ? 'Telefone'
              : 'Destino por definir',
    }),
  },
})

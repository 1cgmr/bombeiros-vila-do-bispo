import { defineField, defineType } from 'sanity'

import { getOptionLabel, socialPlatformLabels } from '../optionLabels'
import { validateHttpsUrl } from '../validation'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Rede social',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Plataforma',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'X', value: 'x' },
          { title: 'Outra', value: 'other' },
        ],
      },
      validation: (rule) => rule.required().error('Escolha a plataforma.'),
    }),
    defineField({
      name: 'label',
      title: 'Nome apresentado',
      type: 'string',
      description: 'Obrigatório apenas quando escolher “Outra”.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { platform?: string } | undefined
          if (parent?.platform !== 'other') return true
          return typeof value === 'string' && value.trim()
            ? true
            : 'Indique o nome da plataforma.'
        }),
    }),
    defineField({
      name: 'url',
      title: 'Endereço do perfil',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .error('Indique o endereço oficial do perfil.')
          .custom(validateHttpsUrl),
    }),
  ],
  preview: {
    select: { platform: 'platform', label: 'label', url: 'url' },
    prepare: ({ platform, label, url }) => ({
      title:
        label ||
        getOptionLabel(socialPlatformLabels, platform) ||
        'Rede social',
      subtitle: url,
    }),
  },
})

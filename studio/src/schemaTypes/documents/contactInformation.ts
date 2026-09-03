import { defineArrayMember, defineField, defineType } from 'sanity'

import { validateHttpsUrl, validatePhone } from '../validation'

export const contactInformation = defineType({
  name: 'contactInformation',
  title: 'Contactos',
  type: 'document',
  groups: [
    { name: 'contacts', title: 'Contactos', default: true },
    { name: 'location', title: 'Localização' },
    { name: 'social', title: 'Redes sociais' },
    { name: 'emergency', title: 'Emergência' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'informationConfirmedForPublication',
      title: 'Informação confirmada para publicação',
      type: 'boolean',
      group: 'contacts',
      description:
        'Confirme com a Direção todos os contactos e a morada antes de publicar.',
      initialValue: false,
      validation: (rule) =>
        rule.custom((value) =>
          value === true
            ? true
            : 'Confirme os dados de contacto antes da publicação.',
        ),
    }),
    defineField({
      name: 'address',
      title: 'Morada',
      type: 'address',
      group: 'location',
    }),
    defineField({
      name: 'generalEmail',
      title: 'Email geral',
      type: 'string',
      group: 'contacts',
      validation: (rule) =>
        rule.email().error('Introduza um endereço de email válido.'),
    }),
    defineField({
      name: 'telephone',
      title: 'Telefone geral',
      type: 'string',
      group: 'contacts',
      validation: (rule) => rule.custom(validatePhone),
    }),
    defineField({
      name: 'additionalChannels',
      title: 'Outros contactos',
      type: 'array',
      group: 'contacts',
      of: [defineArrayMember({ type: 'contactChannel' })],
    }),
    defineField({
      name: 'contactHours',
      title: 'Horário de atendimento',
      type: 'portableText',
      group: 'contacts',
    }),
    defineField({
      name: 'directionsMapUrl',
      title: 'Ligação para direções no mapa',
      type: 'url',
      group: 'location',
      description:
        'Utilize uma ligação HTTPS; não é necessária uma chave paga do Google Maps.',
      validation: (rule) => rule.custom(validateHttpsUrl),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociais oficiais',
      type: 'array',
      group: 'social',
      of: [defineArrayMember({ type: 'socialLink' })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'emergencyWarning',
      title: 'Aviso de emergência',
      type: 'text',
      rows: 2,
      group: 'emergency',
      description:
        'O aviso público deve reforçar claramente: “Em caso de emergência, ligue 112.”',
      validation: (rule) => [
        rule.required().error('Introduza o aviso oficial de emergência.'),
        rule.max(240).warning('Prefira um aviso curto e direto.'),
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Contactos' }) },
})

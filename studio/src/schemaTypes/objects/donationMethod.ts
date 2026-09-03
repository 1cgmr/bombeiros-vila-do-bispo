import { defineField, defineType } from 'sanity'

import { donationMethodLabels, getOptionLabel } from '../optionLabels'
import { validateHttpsUrl, validatePhone } from '../validation'

type DonationMethodValue = {
  confirmationDate?: string
  confirmedForPublication?: boolean
  externalUrl?: string
  iban?: string
  mbWayNumber?: string
  methodType?: string
}

export const donationMethod = defineType({
  name: 'donationMethod',
  title: 'Forma de donativo',
  type: 'object',
  fields: [
    defineField({
      name: 'methodType',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Transferência bancária', value: 'bankTransfer' },
          { title: 'MB WAY', value: 'mbWay' },
          { title: 'Página externa', value: 'external' },
          { title: 'Presencial', value: 'inPerson' },
          { title: 'Outra', value: 'other' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha o tipo de donativo.'),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .error('Indique um título para esta forma de donativo.')
          .max(100),
    }),
    defineField({
      name: 'description',
      title: 'Instruções públicas',
      type: 'portableText',
    }),
    defineField({
      name: 'iban',
      title: 'IBAN',
      type: 'string',
      description: 'Nunca introduza um IBAN sem confirmação oficial.',
      hidden: ({ parent }) => parent?.methodType !== 'bankTransfer',
      validation: (rule) =>
        rule
          .custom((value, context) => {
            const parent = context.parent as { methodType?: string } | undefined
            if (parent?.methodType !== 'bankTransfer' || !value) return true
            return /^PT\d{23}$/i.test(value.replace(/\s/g, ''))
              ? true
              : 'Confirme o IBAN português: deve começar por PT e conter 25 caracteres.'
          })
          .warning(),
    }),
    defineField({
      name: 'mbWayNumber',
      title: 'Número MB WAY',
      type: 'string',
      description: 'Nunca introduza um número MB WAY sem confirmação oficial.',
      hidden: ({ parent }) => parent?.methodType !== 'mbWay',
      validation: (rule) => rule.custom(validatePhone).warning(),
    }),
    defineField({
      name: 'externalUrl',
      title: 'Página externa de donativo',
      type: 'url',
      hidden: ({ parent }) => parent?.methodType !== 'external',
      validation: (rule) => rule.custom(validateHttpsUrl),
    }),
    defineField({
      name: 'confirmedForPublication',
      title: 'Dados confirmados para publicação',
      type: 'boolean',
      description:
        'Confirme com a Direção todos os dados e instruções antes da publicação.',
      initialValue: false,
    }),
    defineField({
      name: 'confirmationDate',
      title: 'Data de confirmação',
      type: 'date',
    }),
  ],
  validation: (rule) =>
    rule
      .custom((value: DonationMethodValue | undefined) => {
        if (!value) return true
        if (!value.confirmedForPublication)
          return 'Os dados desta forma de donativo ainda não estão confirmados.'
        if (!value.confirmationDate)
          return 'Indique a data da confirmação dos dados de donativo.'
        if (value.methodType === 'bankTransfer' && !value.iban)
          return 'Confirme e introduza o IBAN oficial.'
        if (value.methodType === 'mbWay' && !value.mbWayNumber)
          return 'Confirme e introduza o número MB WAY oficial.'
        if (value.methodType === 'external' && !value.externalUrl)
          return 'Indique a página externa de donativo.'
        return true
      })
      .warning(),
  preview: {
    select: { title: 'title', subtitle: 'methodType' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Forma de donativo sem título',
      subtitle: getOptionLabel(donationMethodLabels, subtitle),
    }),
  },
})

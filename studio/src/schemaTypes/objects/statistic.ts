import { defineField, defineType } from 'sanity'

import { getOptionLabel, statisticKindLabels } from '../optionLabels'

type StatisticValue = {
  asOfDate?: string
  confirmedForPublication?: boolean
  label?: string
  value?: string
}

export const statistic = defineType({
  name: 'statistic',
  title: 'Indicador',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Tipo de indicador',
      type: 'string',
      options: {
        list: [
          { title: 'Bombeiros', value: 'firefighters' },
          { title: 'Viaturas', value: 'vehicles' },
          { title: 'Disponibilidade', value: 'availability' },
          { title: 'Ano de fundação', value: 'foundingYear' },
          { title: 'Outro', value: 'other' },
        ],
      },
      validation: (rule) =>
        rule.required().error('Escolha o tipo de indicador.'),
    }),
    defineField({
      name: 'label',
      title: 'Designação',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Indique a designação do indicador.').max(80),
    }),
    defineField({
      name: 'value',
      title: 'Valor público',
      type: 'string',
      description: 'Introduza apenas um valor confirmado oficialmente.',
      validation: (rule) =>
        rule
          .required()
          .error('Indique o valor confirmado do indicador.')
          .max(40),
    }),
    defineField({
      name: 'suffix',
      title: 'Complemento do valor',
      type: 'string',
      description: 'Opcional, por exemplo uma unidade ou expressão curta.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'confirmedForPublication',
      title: 'Valor confirmado para publicação',
      type: 'boolean',
      description:
        'Confirme apenas depois de validar este valor com a Direção/Comando.',
      initialValue: false,
    }),
    defineField({
      name: 'asOfDate',
      title: 'Data de confirmação',
      type: 'date',
      description: 'Data em que o valor foi confirmado oficialmente.',
    }),
    defineField({
      name: 'sourceNote',
      title: 'Nota interna sobre a fonte',
      type: 'string',
      description:
        'Nota editorial; não é apresentada automaticamente no website.',
      validation: (rule) => rule.max(240),
    }),
  ],
  validation: (rule) =>
    rule.custom((value: StatisticValue | undefined) => {
      if (!value) return true
      if (!value.confirmedForPublication)
        return 'Confirme oficialmente o indicador antes de o publicar.'
      if (!value.asOfDate)
        return 'Indique a data em que o indicador foi confirmado.'
      return true
    }),
  preview: {
    select: { title: 'label', value: 'value', kind: 'kind' },
    prepare: ({ title, value, kind }) => ({
      title: title || 'Indicador sem designação',
      subtitle:
        [value, getOptionLabel(statisticKindLabels, kind)]
          .filter(Boolean)
          .join(' · ') || 'Sem valor',
    }),
  },
})

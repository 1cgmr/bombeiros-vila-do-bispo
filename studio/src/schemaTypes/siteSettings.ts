import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    defineField({
      name: 'officialName',
      title: 'Nome oficial',
      type: 'string',
      description: 'Usar apenas a designação confirmada pela Direção.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'shortName',
      title: 'Nome curto',
      type: 'string',
      description: 'Forma abreviada aprovada para espaços reduzidos.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'institutionalDescription',
      title: 'Descrição institucional',
      type: 'text',
      rows: 5,
      description: 'Resumo institucional confirmado pela Direção/Comando.',
      validation: (rule) => rule.max(1200),
    }),
    defineField({
      name: 'logo',
      title: 'Logótipo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Descrição curta e objetiva do logótipo para leitores de ecrã.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'generalEmail',
      title: 'Email geral',
      type: 'string',
      description: 'Endereço institucional confirmado para contacto geral.',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'generalPhone',
      title: 'Telefone geral',
      type: 'string',
      description: 'Número institucional confirmado, incluindo indicativo quando aplicável.',
      validation: (rule) => rule.max(40),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Configurações do Site'}),
  },
})

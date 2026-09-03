import { defineField, defineType } from 'sanity'

export const address = defineType({
  name: 'address',
  title: 'Morada',
  type: 'object',
  fields: [
    defineField({
      name: 'line1',
      title: 'Morada',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Indique a morada oficial.').max(160),
    }),
    defineField({
      name: 'line2',
      title: 'Complemento da morada',
      type: 'string',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'postalCode',
      title: 'Código postal',
      type: 'string',
      validation: (rule) => rule.max(20),
    }),
    defineField({
      name: 'locality',
      title: 'Localidade',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'municipality',
      title: 'Concelho',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
  ],
})

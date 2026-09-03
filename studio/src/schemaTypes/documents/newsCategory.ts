import { defineField, defineType } from 'sanity'

export const newsCategory = defineType({
  name: 'newsCategory',
  title: 'Categoria de Notícias',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (rule) =>
        rule.required().error('Indique o nome da categoria.').max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Endereço da categoria',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description:
        'Use “Gerar” depois de confirmar o nome. O endereço deve ser único.',
      validation: (rule) =>
        rule.required().error('Gere um endereço único para a categoria.'),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(320).warning('Prefira uma descrição com até 320 caracteres.'),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Categoria sem nome',
      subtitle: subtitle ? `/${subtitle}` : 'Sem endereço',
    }),
  },
})

import { defineField, defineType } from 'sanity'

import { validateHttpsUrl } from './validation'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do Site',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identidade' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'officialName',
      title: 'Nome oficial',
      type: 'string',
      group: 'identity',
      description: 'Usar apenas a designação confirmada pela Direção.',
      validation: (rule) =>
        rule.required().error('Indique o nome oficial confirmado.').max(160),
    }),
    defineField({
      name: 'shortName',
      title: 'Nome curto',
      type: 'string',
      group: 'identity',
      description: 'Forma abreviada aprovada para espaços reduzidos.',
      validation: (rule) =>
        rule.max(80).warning('Prefira um nome curto com até 80 caracteres.'),
    }),
    defineField({
      name: 'institutionalDescription',
      title: 'Descrição institucional',
      type: 'text',
      rows: 5,
      group: 'identity',
      description: 'Resumo institucional confirmado pela Direção/Comando.',
      validation: (rule) =>
        rule
          .max(1200)
          .warning('Prefira uma descrição com até 1 200 caracteres.'),
    }),
    defineField({
      name: 'logo',
      title: 'Logótipo oficial',
      type: 'accessibleImage',
      group: 'identity',
      description:
        'Utilize apenas o ficheiro oficial e respeite as normas de identidade existentes.',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Endereço oficial do website',
      type: 'url',
      group: 'identity',
      description:
        'Preencher apenas depois de o domínio oficial estar confirmado.',
      validation: (rule) => rule.custom(validateHttpsUrl),
    }),
    defineField({
      name: 'defaultSeo',
      title: 'SEO por omissão',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configurações do Site' }),
  },
})

import { defineArrayMember, defineField, defineType } from 'sanity'

const pageLabels: Record<string, string> = {
  'institutional-page-association': 'Associação',
  'institutional-page-statutes': 'Estatutos',
  'institutional-page-social-bodies': 'Órgãos Sociais',
  'institutional-page-fire-brigade': 'Corpo de Bombeiros',
  'institutional-page-privacy-policy': 'Política de Privacidade',
  'institutional-page-accessibility-statement': 'Declaração de Acessibilidade',
}

export const institutionalPage = defineType({
  name: 'institutionalPage',
  title: 'Página Institucional',
  type: 'document',
  groups: [
    { name: 'content', title: 'Conteúdo', default: true },
    { name: 'documents', title: 'Documentos' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().error('Indique o título oficial da página.').max(160),
    }),
    defineField({
      name: 'introduction',
      title: 'Introdução',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (rule) =>
        rule.max(500).warning('Prefira uma introdução com até 500 caracteres.'),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Imagem de destaque',
      type: 'accessibleImage',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Conteúdo',
      type: 'portableText',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .error('Introduza o conteúdo institucional da página.'),
    }),
    defineField({
      name: 'presidentMessage',
      title: 'Mensagem do Presidente',
      type: 'portableText',
      group: 'content',
      description: 'Publique apenas o texto aprovado pelo Presidente. Deixe vazio enquanto estiver em preparação.',
      hidden: ({document}) =>
        document?._id !== 'institutional-page-association' &&
        document?._id !== 'drafts.institutional-page-association',
    }),
    defineField({
      name: 'documents',
      title: 'Documentos relacionados',
      type: 'array',
      group: 'documents',
      description: 'Na página Estatutos, associe aqui apenas PDFs oficiais da categoria Estatutos, depois de os criar em Documentos.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'institutionalDocument' }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: '_id', media: 'featuredImage' },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Página institucional sem título',
      subtitle: pageLabels[subtitle?.replace(/^drafts\./, '') ?? ''] ?? 'Página institucional controlada',
      media,
    }),
  },
})

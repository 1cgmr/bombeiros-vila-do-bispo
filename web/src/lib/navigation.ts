export const primaryNavigation = [
  {label: 'Início', href: '/'},
  {
    label: 'Associação',
    href: '/associacao',
    children: [
      {label: 'Apresentação', href: '/associacao'},
      {label: 'Estatutos', href: '/associacao/estatutos'},
      {label: 'Órgãos Sociais', href: '/associacao/orgaos-sociais'},
    ],
  },
  {label: 'Corpo de Bombeiros', href: '/corpo-de-bombeiros'},
  {label: 'Serviços', href: '/servicos'},
  {label: 'Formação', href: '/formacao'},
  {label: 'Recrutamento', href: '/recrutamento'},
  {label: 'Notícias', href: '/noticias'},
  {label: 'Sócios e Apoio', href: '/socios-e-apoio'},
  {label: 'Galeria', href: '/galeria'},
  {label: 'Contactos', href: '/contactos'},
] as const

export const footerNavigation = [
  ...primaryNavigation.flatMap<{label: string; href: string}>((item) => 'children' in item ? [item, ...item.children.slice(1)] : [item]),
  {label: 'Documentos', href: '/documentos'},
  {label: 'Privacidade', href: '/privacidade'},
  {label: 'Acessibilidade', href: '/acessibilidade'},
] as const

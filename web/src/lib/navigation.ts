export const primaryNavigation = [
  {label: 'Início', href: '/'},
  {label: 'Associação', href: '/associacao'},
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
  ...primaryNavigation,
  {label: 'Documentos', href: '/documentos'},
  {label: 'Privacidade', href: '/privacidade'},
  {label: 'Acessibilidade', href: '/acessibilidade'},
] as const

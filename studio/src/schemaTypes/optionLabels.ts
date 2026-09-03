export const donationMethodLabels: Record<string, string> = {
  bankTransfer: 'Transferência bancária',
  mbWay: 'MB WAY',
  external: 'Página externa',
  inPerson: 'Presencial',
  other: 'Outra',
}

export const institutionalDocumentCategoryLabels: Record<string, string> = {
  statutes: 'Estatutos',
  reports: 'Relatórios',
  accounts: 'Contas',
  regulations: 'Regulamentos',
  minutes: 'Atas e deliberações',
  other: 'Outro',
}

export const socialPlatformLabels: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  x: 'X',
  other: 'Outra',
}

export const statisticKindLabels: Record<string, string> = {
  firefighters: 'Bombeiros',
  vehicles: 'Viaturas',
  availability: 'Disponibilidade',
  foundingYear: 'Ano de fundação',
  other: 'Outro',
}

export const trainingStatusLabels: Record<string, string> = {
  planned: 'Prevista',
  open: 'Inscrições abertas',
  closed: 'Inscrições encerradas',
  completed: 'Concluída',
  cancelled: 'Cancelada',
}

export const vehicleCategoryLabels: Record<string, string> = {
  ambulance: 'Ambulância',
  firefighting: 'Combate a incêndios',
  command: 'Comando',
  support: 'Apoio',
  other: 'Outra',
}

export function getOptionLabel(
  labels: Record<string, string>,
  value: unknown,
): string | undefined {
  return typeof value === 'string' ? (labels[value] ?? value) : undefined
}

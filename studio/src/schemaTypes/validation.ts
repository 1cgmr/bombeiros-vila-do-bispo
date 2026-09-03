type SanityFileValue = {
  asset?: {
    _ref?: string
  }
}

export function validateHttpsUrl(value: unknown): true | string {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return 'Introduza um endereço web válido.'

  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      ? true
      : 'O endereço deve começar por https://.'
  } catch {
    return 'Introduza um endereço web HTTPS válido.'
  }
}

export function validateSafeLink(value: unknown): true | string {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return 'Introduza uma ligação válida.'

  if (value.startsWith('/') && !value.startsWith('//')) return true
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)) return true
  if (/^tel:\+?[0-9][0-9\s().-]{5,30}$/i.test(value)) return true

  return validateHttpsUrl(value) === true
    ? true
    : 'Use um caminho interno iniciado por /, ou uma ligação https://, mailto: ou tel: válida.'
}

export function validatePhone(value: unknown): true | string {
  if (value === undefined || value === null || value === '') return true
  if (
    typeof value !== 'string' ||
    !/^\+?[0-9][0-9\s().-]{5,30}$/.test(value.trim())
  ) {
    return 'Introduza um número de telefone válido, podendo incluir o indicativo internacional.'
  }

  return true
}

export function validatePdfFile(value: unknown): true | string {
  if (value === undefined || value === null) return true

  const assetReference = (value as SanityFileValue).asset?._ref
  if (!assetReference) return true

  return assetReference.toLowerCase().endsWith('-pdf')
    ? true
    : 'Carregue um ficheiro em formato PDF.'
}

export function validateEndDate(
  endDate: unknown,
  startDate: unknown,
  label = 'A data de fim',
): true | string {
  if (
    !endDate ||
    !startDate ||
    typeof endDate !== 'string' ||
    typeof startDate !== 'string'
  )
    return true

  return new Date(endDate) >= new Date(startDate)
    ? true
    : `${label} não pode ser anterior à data de início.`
}

import {describe, expect, it} from 'vitest'

import {primaryNavigation} from './navigation'

describe('primaryNavigation', () => {
  it('exposes every approved primary route exactly once', () => {
    const hrefs = primaryNavigation.map((item) => item.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
    expect(hrefs).toEqual([
      '/',
      '/associacao',
      '/corpo-de-bombeiros',
      '/servicos',
      '/formacao',
      '/recrutamento',
      '/noticias',
      '/socios-e-apoio',
      '/galeria',
      '/contactos',
    ])
  })
})

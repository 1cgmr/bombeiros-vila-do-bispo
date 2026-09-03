import {describe, expect, it} from 'vitest'

import {buildMetadata} from './metadata'

describe('buildMetadata', () => {
  it('uses CMS SEO values and noIndex safely', () => {
    const metadata = buildMetadata({
      title: 'Título estrutural',
      path: '/pagina',
      seo: {metaTitle: 'Título editorial', metaDescription: 'Descrição editorial', noIndex: true},
      siteSettings: {siteUrl: 'https://example.org'},
    })

    expect(metadata.title).toBe('Título editorial')
    expect(metadata.description).toBe('Descrição editorial')
    expect(metadata.alternates).toEqual({canonical: 'https://example.org/pagina'})
    expect(metadata.robots).toEqual({index: false, follow: false})
  })

  it('does not fabricate a description when CMS content is absent', () => {
    expect(buildMetadata({title: 'Contactos'}).description).toBeUndefined()
  })
})

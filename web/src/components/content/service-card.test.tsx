import {renderToStaticMarkup} from 'react-dom/server'
import {describe, expect, it} from 'vitest'

import {ServiceCard} from './service-card'

describe('ServiceCard', () => {
  it('makes the complete card a single accessible link', () => {
    const html = renderToStaticMarkup(
      <ServiceCard
        service={{
          _id: 'service-test',
          icon: 'transport',
          slug: 'transporte',
          summary: 'Informação do serviço.',
          title: 'Transporte',
          visualType: 'icon',
        }}
      />,
    )

    expect(html.match(/<a /g)).toHaveLength(1)
    expect(html).toContain('href="/servicos/transporte"')
    expect(html).toContain('Saber mais')
    expect(html).toContain('<svg')
  })
})

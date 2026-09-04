import {renderToStaticMarkup} from 'react-dom/server'
import {describe, expect, it} from 'vitest'

import {NewsCard} from './news-card'

describe('NewsCard', () => {
  it('links only the title and call to action and renders a controlled fallback', () => {
    const html = renderToStaticMarkup(
      <NewsCard
        article={{
          _id: 'news-test',
          fallbackVisual: 'community',
          slug: 'atividade',
          title: 'Atividade institucional',
        }}
      />,
    )

    expect(html.match(/<a /g)).toHaveLength(2)
    expect(html.match(/href="\/noticias\/atividade"/g)).toHaveLength(2)
    expect(html).toContain('Ler notícia')
    expect(html).toContain('<svg')
    expect(html).not.toContain('<img')
  })
})

import {renderToStaticMarkup} from 'react-dom/server'
import {describe, expect, it} from 'vitest'

import {PortableTextRenderer} from './portable-text'

describe('PortableTextRenderer', () => {
  it('renders approved blocks and secures external links', () => {
    const html = renderToStaticMarkup(<PortableTextRenderer value={[{_type: 'block', _key: 'one', style: 'normal', markDefs: [{_key: 'link', _type: 'link', href: 'https://example.org'}], children: [{_type: 'span', _key: 'span', text: 'Ligação', marks: ['link']}]}]} />)
    expect(html).toContain('<p')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('renders nothing for an absent value', () => {
    expect(renderToStaticMarkup(<PortableTextRenderer value={null} />)).toBe('')
  })

  it('links institutional references to the document directory', () => {
    const html = renderToStaticMarkup(<PortableTextRenderer value={[{_type: 'institutionalDocumentReference', _key: 'doc', _ref: 'document-id'}]} />)
    expect(html).toContain('/documentos#document-id')
  })
})

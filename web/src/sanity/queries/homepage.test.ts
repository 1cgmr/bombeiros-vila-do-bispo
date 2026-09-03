import {describe, expect, it} from 'vitest'

import {sanityClient} from '../client'
import {HOMEPAGE_QUERY} from './homepage'

describe('homepage query foundation', () => {
  it('uses the published perspective without a token', () => {
    const config = sanityClient.config()
    expect(config.perspective).toBe('published')
    expect(config.token).toBeUndefined()
  })

  it('targets the stable homepage singleton', () => {
    expect(String(HOMEPAGE_QUERY)).toContain('_id == "homepage"')
  })
})

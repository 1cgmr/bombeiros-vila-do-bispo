import {createClient} from '@sanity/client'

import {sanityEnv} from './env'

export const sanityClient = createClient({
  ...sanityEnv,
  perspective: 'published',
  useCdn: true,
})

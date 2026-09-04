import {describe, expect, it} from 'vitest'

import {TRAINING_INFORMATION_QUERY} from './training'

describe('training query foundation', () => {
  it('targets the stable presentation singleton', () => {
    expect(String(TRAINING_INFORMATION_QUERY)).toContain('_id == "trainingInformation"')
  })
})

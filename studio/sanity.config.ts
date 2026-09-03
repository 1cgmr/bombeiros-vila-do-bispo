import {ptPTLocale} from '@sanity/locale-pt-pt'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './src/schemaTypes'
import {singletonActions, singletonTypes} from './src/singletons'
import {structure} from './src/structure'

export default defineConfig({
  name: 'default',
  title: 'Bombeiros Voluntários de Vila do Bispo',
  projectId: 'n3esjk8x',
  dataset: 'production',

  plugins: [structureTool({structure}), ptPTLocale()],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(({action}) => action !== undefined && singletonActions.has(action))
        : actions,
  },
})

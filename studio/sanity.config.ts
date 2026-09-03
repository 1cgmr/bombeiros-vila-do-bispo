import { ptPTLocale } from '@sanity/locale-pt-pt'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schemaTypes } from './src/schemaTypes'
import { protectedDocumentTypes, singletonActions } from './src/singletons'
import { structure } from './src/structure'

export default defineConfig({
  name: 'default',
  title: 'Bombeiros Voluntários de Vila do Bispo',
  projectId: 'n3esjk8x',
  dataset: 'production',

  plugins: [structureTool({ structure }), ptPTLocale()],

  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(
        ({ schemaType }) =>
          !protectedDocumentTypes.has(schemaType) &&
          schemaType !== 'governingBody',
      ),
      {
        id: 'command-governing-body',
        title: 'Novo elemento do Comando',
        schemaType: 'governingBody',
        value: { bodyType: 'command' },
      },
      {
        id: 'social-governing-body',
        title: 'Novo Órgão Social',
        schemaType: 'governingBody',
        value: { bodyType: 'governingBody' },
      },
    ],
  },

  document: {
    actions: (actions, context) =>
      protectedDocumentTypes.has(context.schemaType)
        ? actions.filter(
            ({ action }) =>
              action !== undefined && singletonActions.has(action),
          )
        : actions,
  },
})

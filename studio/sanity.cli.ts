import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'n3esjk8x',
    dataset: 'production',
  },
  deployment: {
    appId: 'z47lpciehk5d3dg5w6616wqd',
  },
  schemaExtraction: {
    enabled: true,
    enforceRequiredFields: true,
    path: '.sanity/schema.json',
  },
  typegen: {
    enabled: true,
    path: '../web/src/**/*.{ts,tsx}',
    schema: '.sanity/schema.json',
    generates: '../web/src/sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
})

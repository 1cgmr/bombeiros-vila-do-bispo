import {getCliClient} from 'sanity/cli'

const EXPECTED_PROJECT_ID = 'n3esjk8x'
const EXPECTED_DATASET = 'production'
const isApply = process.argv.includes('--apply')

const paragraph = (key: string, text: string, style: 'normal' | 'h2' | 'h3' = 'normal') => ({
  _key: key,
  _type: 'block' as const,
  style,
  markDefs: [],
  children: [{_key: `${key}-text`, _type: 'span' as const, marks: [], text}],
})

const previousPlaceholders: Record<string, string[]> = {
  'institutional-page-statutes': [
    'Esta página aguarda o texto e o PDF oficiais dos estatutos. Após a validação, a Associação poderá atualizar esta apresentação e associar o documento publicado.',
    'A versão integral dos estatutos e uma apresentação dos seus pontos essenciais serão disponibilizadas nesta página depois da sua validação para publicação.',
  ],
  'institutional-page-social-bodies': [
    'A informação sobre os órgãos sociais será completada após confirmação oficial. A composição é gerida nos registos de órgãos sociais do Studio.',
  ],
}

const pages: Array<{
  _id: string
  _type: 'institutionalPage'
  title: string
  introduction: string
  body: ReturnType<typeof paragraph>[]
}> = [
  {
    _id: 'institutional-page-statutes',
    _type: 'institutionalPage',
    title: 'Estatutos',
    introduction: 'O texto oficial dos estatutos será disponibilizado após validação pela Associação.',
    body: [
      paragraph('statutes-placeholder', 'A versão integral dos estatutos e uma apresentação dos seus pontos essenciais serão disponibilizadas nesta página depois da sua validação para publicação.'),
      paragraph('statutes-examples-title', 'Exemplos de secções a preencher', 'h2'),
      paragraph('statutes-examples-notice', 'Os tópicos seguintes são apenas exemplos de organização do conteúdo. Não reproduzem nem substituem os estatutos oficiais da Associação.'),
      paragraph('statutes-purpose-title', 'Objeto e fins — exemplo', 'h3'),
      paragraph('statutes-purpose-text', 'O texto aprovado sobre o objeto e os fins da Associação poderá ser apresentado aqui após validação oficial.'),
      paragraph('statutes-members-title', 'Associados — exemplo', 'h3'),
      paragraph('statutes-members-text', 'As disposições aprovadas sobre os associados poderão ser resumidas aqui, com ligação ao documento integral.'),
      paragraph('statutes-organization-title', 'Organização e funcionamento — exemplo', 'h3'),
      paragraph('statutes-organization-text', 'A informação validada sobre a organização e o funcionamento poderá ser acrescentada nesta secção.'),
    ],
  },
  {
    _id: 'institutional-page-social-bodies',
    _type: 'institutionalPage',
    title: 'Órgãos Sociais',
    introduction: 'Consulte a composição dos órgãos sociais publicada pela Associação.',
    body: [
      paragraph('social-bodies-placeholder', 'A composição dos órgãos sociais e a informação sobre os respetivos mandatos serão atualizadas após confirmação oficial.'),
    ],
  },
]

const socialBodyExamples: Array<{
  _id: string
  _type: 'governingBody'
  bodyType: 'governingBody'
  isPlaceholder: true
  title: string
  description: ReturnType<typeof paragraph>[]
}> = [
  {
    _id: 'governing-body-general-assembly-example',
    _type: 'governingBody',
    bodyType: 'governingBody',
    isPlaceholder: true,
    title: 'Mesa da Assembleia Geral — exemplo',
    description: [paragraph('general-assembly-example-description', 'Estrutura ilustrativa. A existência, a designação e a composição deste órgão aguardam confirmação oficial.')],
  },
  {
    _id: 'governing-body-supervisory-board-example',
    _type: 'governingBody',
    bodyType: 'governingBody',
    isPlaceholder: true,
    title: 'Conselho Fiscal — exemplo',
    description: [paragraph('supervisory-board-example-description', 'Estrutura ilustrativa. A existência, a designação e a composição deste órgão aguardam confirmação oficial.')],
  },
]

const statutesDraft = {
  _id: 'drafts.institutional-document-statutes-example',
  _type: 'institutionalDocument',
  title: 'Exemplo — Estatutos (substituir antes de publicar)',
  category: 'statutes',
  accessibleSummary: [
    paragraph('statutes-summary-example', 'Resumo provisório: descreva aqui o objetivo e os pontos essenciais dos estatutos aprovados antes da publicação do PDF oficial.'),
  ],
}

const client = getCliClient({apiVersion: '2026-09-01'}).withConfig({perspective: 'raw', useCdn: false})

async function main() {
  const {projectId, dataset} = client.config()
  if (projectId !== EXPECTED_PROJECT_ID || dataset !== EXPECTED_DATASET) {
    throw new Error(`Destino inesperado: ${projectId}/${dataset}.`)
  }

  const existingIds = await client.fetch<string[]>(
    '*[_id in $ids]._id',
    {ids: [...pages, ...socialBodyExamples].flatMap(({_id}) => [_id, `drafts.${_id}`])},
  )
  const existingBaseIds = new Set(existingIds.map((id) => id.replace(/^drafts\./, '')))
  const pagesToCreate = pages.filter(({_id}) => !existingBaseIds.has(_id))
  const examplesToCreate = socialBodyExamples.filter(({_id}) => !existingBaseIds.has(_id))
  const publishedPages = await client.fetch<Array<{
    _id: string
    _rev: string
    body?: Array<{children?: Array<{text?: string}>}>
  }>>('*[_id in $ids]{_id, _rev, body}', {ids: pages.map(({_id}) => _id)})
  const placeholdersToUpdate = publishedPages.filter((page) =>
    page.body?.length === 1 &&
    previousPlaceholders[page._id]?.includes(page.body[0]?.children?.[0]?.text ?? '') &&
    !existingIds.includes(`drafts.${page._id}`),
  )
  const existingStatutesCount = await client.fetch<number>(
    'count(*[_type == "institutionalDocument" && category == "statutes"])',
  )
  const createDraft = existingStatutesCount === 0

  console.log(`Destino: ${projectId}/${dataset}`)
  console.log(`Modo: ${isApply ? 'APLICAR' : 'SIMULAÇÃO'}`)
  console.log(`Páginas provisórias a criar: ${pagesToCreate.map(({title}) => title).join(', ') || 'nenhuma'}`)
  console.log(`Textos provisórios anteriores a atualizar: ${placeholdersToUpdate.length}`)
  console.log(`Órgãos sociais de exemplo a criar: ${examplesToCreate.map(({title}) => title).join(', ') || 'nenhum'}`)
  console.log(`Exemplo de documento em rascunho: ${createDraft ? 'criar' : 'já existe conteúdo de Estatutos'}`)

  if (!isApply || (!pagesToCreate.length && !createDraft && !placeholdersToUpdate.length && !examplesToCreate.length)) return

  let transaction = client.transaction()
  for (const page of pagesToCreate) transaction = transaction.createIfNotExists(page)
  for (const example of examplesToCreate) transaction = transaction.createIfNotExists(example)
  for (const existing of placeholdersToUpdate) {
    const page = pages.find(({_id}) => _id === existing._id)
    if (page) {
      transaction = transaction.patch(existing._id, (patch) =>
        patch.ifRevisionId(existing._rev).set({body: page.body}),
      )
    }
  }
  if (createDraft) transaction = transaction.createIfNotExists(statutesDraft)
  const result = await transaction.commit({visibility: 'sync'})
  console.log(`Transação de conteúdo provisório concluída: ${result.transactionId}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

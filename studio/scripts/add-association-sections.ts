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

const statutesExamples = [
  {
    _key: 'statutes-example-identification',
    _type: 'statutesExample' as const,
    title: 'Artigo 1.º — Denominação e sede',
    text: 'A [designação oficial da Associação] tem sede em [morada aprovada] e rege-se pelos presentes estatutos e pela legislação aplicável.',
  },
  {
    _key: 'statutes-example-purposes',
    _type: 'statutesExample' as const,
    title: 'Artigo 2.º — Fins',
    text: 'A Associação tem por finalidade [indicar os fins aprovados]. Para a sua prossecução, poderá desenvolver [atividades previstas nos estatutos aprovados].',
  },
  {
    _key: 'statutes-example-members',
    _type: 'statutesExample' as const,
    title: 'Artigo 3.º — Associados',
    text: 'Podem adquirir a qualidade de associado [indicar as condições de admissão aprovadas]. Os direitos e deveres dos associados constam de [indicar os artigos aprovados].',
  },
  {
    _key: 'statutes-example-bodies',
    _type: 'statutesExample' as const,
    title: 'Artigo 4.º — Órgãos sociais',
    text: 'São órgãos da Associação [indicar os órgãos confirmados]. A composição, as competências e a duração dos mandatos são definidas em [indicar os artigos aprovados].',
  },
]

const pages: Array<{
  _id: string
  _type: 'institutionalPage'
  title: string
  introduction: string
  body: ReturnType<typeof paragraph>[]
  statutesExamples?: typeof statutesExamples
}> = [
  {
    _id: 'institutional-page-statutes',
    _type: 'institutionalPage',
    title: 'Estatutos',
    introduction: 'O texto oficial dos estatutos será disponibilizado após validação pela Associação.',
    statutesExamples,
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
    statutesExamples?: unknown[] | null
  }>>('*[_id in $ids]{_id, _rev, body, statutesExamples}', {ids: pages.map(({_id}) => _id)})
  const placeholdersToUpdate = publishedPages.filter((page) =>
    page.body?.length === 1 &&
    previousPlaceholders[page._id]?.includes(page.body[0]?.children?.[0]?.text ?? '') &&
    !existingIds.includes(`drafts.${page._id}`),
  )
  const examplesToAdd = publishedPages.filter((page) =>
    page._id === 'institutional-page-statutes' &&
    page.statutesExamples == null &&
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
  console.log(`Páginas de Estatutos a receber exemplos de artigos: ${examplesToAdd.length}`)
  console.log(`Órgãos sociais de exemplo a criar: ${examplesToCreate.map(({title}) => title).join(', ') || 'nenhum'}`)
  console.log(`Exemplo de documento em rascunho: ${createDraft ? 'criar' : 'já existe conteúdo de Estatutos'}`)

  if (!isApply || (!pagesToCreate.length && !createDraft && !placeholdersToUpdate.length && !examplesToAdd.length && !examplesToCreate.length)) return

  let transaction = client.transaction()
  for (const page of pagesToCreate) transaction = transaction.createIfNotExists(page)
  for (const example of examplesToCreate) transaction = transaction.createIfNotExists(example)
  for (const existing of publishedPages.filter((page) =>
    placeholdersToUpdate.includes(page) || examplesToAdd.includes(page),
  )) {
    const page = pages.find(({_id}) => _id === existing._id)
    if (page) {
      const updates = {
        ...(placeholdersToUpdate.includes(existing) ? {body: page.body} : {}),
        ...(examplesToAdd.includes(existing) ? {statutesExamples} : {}),
      }
      transaction = transaction.patch(existing._id, (patch) =>
        patch.ifRevisionId(existing._rev).set(updates),
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

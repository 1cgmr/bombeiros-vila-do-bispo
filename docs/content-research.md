# Investigação e proveniência do conteúdo inicial

Investigação efetuada em **3 de setembro de 2026** para a população inicial do dataset público `production`. A classificação segue a política de confiança definida para o projeto: apenas factos de confiança **HIGH** e baixo risco foram publicados. O texto público é redação original em pt-PT e não reproduz passagens extensas das fontes.

Durante a verificação anónima foi identificado e corrigido um defeito anterior nos IDs controlados: o Sanity trata qualquer ID com ponto como um subcaminho privado. Os IDs iniciais com ponto existiam e eram visíveis no Studio autenticado, mas não no frontend público sem token. Foram migrados para IDs com hífen, as referências foram atualizadas e os documentos privados criados nesta operação foram removidos. A decisão segue a documentação oficial [IDs and paths](https://www.sanity.io/docs/content-lake/ids) e preserva a arquitetura aprovada de leitura pública sem token.

## Verified and published

| Área CMS | Facto/valor | Fonte e organização | Data da fonte | Confiança | Publicado | Notas/conflitos |
| --- | --- | --- | --- | --- | --- | --- |
| Identidade | Associação Humanitária dos Bombeiros Voluntários de Vila do Bispo | [Lista de associações](https://lbp.pt/associacoes/), Liga dos Bombeiros Portugueses; [arquivo associativo](https://agc.sg.mai.gov.pt/results?lg=ComposedDocument%2CDocument&p=2455&s=CompleteUnitId&sd=False&searchType=Description), Secretaria-Geral do MAI | consulta atual; registos 1982–2004 | HIGH | YES | A designação coincide ainda com as fontes municipais atuais e com a identificação fornecida pelo próprio projeto. |
| História | Constituição em 27 de maio de 1982 | [Arquivo associativo](https://agc.sg.mai.gov.pt/results?lg=ComposedDocument%2CDocument&p=2455&s=CompleteUnitId&sd=False&searchType=Description), Secretaria-Geral do MAI; [44.º aniversário](https://www.cm-viladobispo.pt/noticias/vila-do-bispo-e-o-primeiro-municipio-do-algarve-a-entregar-uma-viatura-aos-bombeiros-no-ambito-do-algarve-2030), Município de Vila do Bispo | registo iniciado em 1982-05-27; notícia 2026-05-30, atualizada 2026-05-31 | HIGH | YES | As duas fontes são coerentes: o 44.º aniversário em 2026 corrobora 1982. |
| Natureza e missão | Associação sem fins lucrativos que detém e mantém um corpo de bombeiros; proteção de pessoas e bens, socorro e extinção de incêndios | [Lei n.º 32/2007 consolidada](https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2007-70048101), Diário da República | publicação 2007-08-13; última alteração 2021-06-14 | HIGH | YES | Redação pública adaptada à entidade, sem a apresentar como citação ou formulação estatutária própria. |
| Missões do Corpo | Prevenção e combate a incêndios, socorro às populações, socorro e transporte de acidentados/doentes e participação em proteção civil | [Decreto-Lei n.º 247/2007](https://diariodarepublica.pt/dr/detalhe/decreto-lei/247-2007-635841), Diário da República | 2007-06-27; em vigor | HIGH | YES | Publicado como enquadramento legal geral e não como catálogo operacional exaustivo. |
| Contactos | Telefone geral `282 639 285` | [Programa DAE](https://cm-viladobispo.pt/servicos/protecao-civil/informacao-publica-e-sensibilizacao/programa-dae-de-vila-do-bispo), Município de Vila do Bispo; [perfil do corpo](https://www.bombeiros.pt/corpos_de_bombeiros/associacao-humanitaria-dos-bombeiros-voluntarios-de-vila-do-bispo/), Bombeiros Portugueses | atualizado 2026-03-11; consulta 2026 | HIGH | YES | Publicado como telefone geral, nunca como substituto do 112. |
| Contactos | Aviso “Em caso de emergência, ligue 112.” | [Programa DAE](https://cm-viladobispo.pt/servicos/protecao-civil/informacao-publica-e-sensibilizacao/programa-dae-de-vila-do-bispo), Município de Vila do Bispo | atualizado 2026-03-11 | HIGH | YES | Número europeu/nacional de emergência claramente separado do telefone geral. |
| Serviço | Proteção e socorro | [Decreto-Lei n.º 247/2007](https://diariodarepublica.pt/dr/detalhe/decreto-lei/247-2007-635841), Diário da República; [reforço de meios](https://www.cm-viladobispo.pt/noticias/camara-municipal-reforca-meios-dos-bombeiros-com-nova-viatura-de-combate-a-incendios), Município de Vila do Bispo | 2007-06-27; notícia 2026-05-22, atualizada 2026-05-23 | HIGH | YES | Serviço amplo, com formulação cautelosa e sem prometer disponibilidade específica. |
| Serviço | Combate a incêndios, incluindo resposta a incêndios rurais | [Decreto-Lei n.º 247/2007](https://diariodarepublica.pt/dr/detalhe/decreto-lei/247-2007-635841), Diário da República; [entrega da VFCI](https://www.cm-viladobispo.pt/noticias/camara-municipal-reforca-meios-dos-bombeiros-com-nova-viatura-de-combate-a-incendios), Município de Vila do Bispo | 2007-06-27; notícia 2026-05-22, atualizada 2026-05-23 | HIGH | YES | A fonte municipal confirma especificamente o reforço local para incêndios rurais. |
| Serviço | Transporte social ao abrigo de protocolo municipal | [Adenda ao protocolo de transporte social](https://www.cm-viladobispo.pt/noticias/camara-promove-transporte-social-mais-abrangente-em-colaboracao-com-os-bombeiros-de-vila-do-bispo), Município de Vila do Bispo; [protocolos de 2026](https://www.cm-viladobispo.pt/municipio/autarquia/camara-municipal/protocolos/2026), Município de Vila do Bispo | 2026-01-08; lista atualizada 2026-08-26 | HIGH | YES | O texto remete os critérios para a informação municipal em vigor e não generaliza elegibilidade. |
| Comando | Emerson Gomes, Comandante | [Entrega da VFCI](https://www.cm-viladobispo.pt/noticias/vila-do-bispo-e-o-primeiro-municipio-do-algarve-a-entregar-uma-viatura-aos-bombeiros-no-ambito-do-algarve-2030), Município de Vila do Bispo | notícia 2026-05-30, atualizada 2026-05-31 | HIGH | YES | A fonte identifica “Emerson Gomes”. Não foi publicado o nome completo não confirmado nem qualquer contacto/biografia. |
| Direção | Carlos Costa, Presidente da Direção | [Adenda ao protocolo de transporte social](https://www.cm-viladobispo.pt/noticias/camara-promove-transporte-social-mais-abrangente-em-colaboracao-com-os-bombeiros-de-vila-do-bispo), Município de Vila do Bispo; [entrega da VFCI](https://www.cm-viladobispo.pt/noticias/vila-do-bispo-e-o-primeiro-municipio-do-algarve-a-entregar-uma-viatura-aos-bombeiros-no-ambito-do-algarve-2030), Município de Vila do Bispo | 2026-01-08; 2026-05-30/31 | HIGH | YES | Duas fontes municipais atuais e coerentes. Sem datas de mandato, contacto ou biografia. |
| Notícia | Entrega de uma VFCI e reforço da resposta a incêndios rurais | [Notícia municipal de entrega](https://www.cm-viladobispo.pt/noticias/vila-do-bispo-e-o-primeiro-municipio-do-algarve-a-entregar-uma-viatura-aos-bombeiros-no-ambito-do-algarve-2030); [notícia municipal de reforço](https://www.cm-viladobispo.pt/noticias/camara-municipal-reforca-meios-dos-bombeiros-com-nova-viatura-de-combate-a-incendios), Município de Vila do Bispo | 2026-05-30/31; 2026-05-22/23 | HIGH | YES | Artigo original sem fotografias externas e sem publicar o número futuro de veículos como frota existente. |
| Notícia | Participação no Dia Regional do Bombeiro em Portimão, com 13 operacionais e três viaturas no evento | [Comemorações do Dia Regional do Bombeiro](https://www.cm-viladobispo.pt/noticias/comemoracoes-do-dia-regional-do-bombeiro-do-algarve), Município de Vila do Bispo | evento 2026-05-03; atualização 2026-05-12 | HIGH | YES | O artigo esclarece expressamente que estes números são apenas os da participação, não totais do corpo/frota. |
| Notícia | Segunda adenda ao protocolo de transporte social | [Notícia municipal](https://www.cm-viladobispo.pt/noticias/camara-promove-transporte-social-mais-abrangente-em-colaboracao-com-os-bombeiros-de-vila-do-bispo), Município de Vila do Bispo | 2026-01-08 | HIGH | YES | Redação original; sem reproduzir fotografias ou parágrafos da fonte. |
| Imagem | `Logo_bombeiros.jpeg` é o emblema oficial fornecido para o projeto | `docs/images/Logo_bombeiros.jpeg`, fornecido diretamente pelos Bombeiros | disponibilizado antes de 2026-09-03 | HIGH | YES | Carregado uma só vez e usado em `siteSettings.logo`; alt: “Emblema dos Bombeiros Voluntários de Vila do Bispo”. |
| Imagem | `Foto_Quartel.jpg` representa o quartel | `docs/images/Foto_Quartel.jpg`, fornecido diretamente pelos Bombeiros | disponibilizado antes de 2026-09-03 | HIGH | YES | Carregado uma só vez e reutilizado no hero, na missão e nas páginas Associação/Corpo de Bombeiros; alt: “Quartel dos Bombeiros Voluntários de Vila do Bispo”. |

O documento e a categoria de desenvolvimento “Artigo de teste”/“teste” foram confirmados no dataset como conteúdo inequivocamente fictício (`asdf`, “Apenas um teste”) e despublicados. Foram conservados como rascunhos recuperáveis; nenhum conteúdo institucional real foi apagado.

## Verified but not published

| Área CMS | Facto/valor | Fonte e organização | Data da fonte | Confiança | Publicado | Notas/conflitos |
| --- | --- | --- | --- | --- | --- | --- |
| Contactos | Morada histórica Rua 1.º de Maio, n.º 24, 8650-425 | [Arquivo associativo](https://agc.sg.mai.gov.pt/results?lg=ComposedDocument%2CDocument&p=2455&s=CompleteUnitId&sd=False&searchType=Description), Secretaria-Geral do MAI | registos 1982–2004 | HIGH para o registo histórico | NO | É arquivo histórico, não confirmação de morada atual. |
| Veículos | Uma VFCI entregue em 2026 e três outras viaturas adjudicadas para entrega futura | [Notícia municipal](https://www.cm-viladobispo.pt/noticias/camara-municipal-reforca-meios-dos-bombeiros-com-nova-viatura-de-combate-a-incendios), Município de Vila do Bispo | 2026-05-22/23 | HIGH | PARTIAL | Publicou-se apenas a entrega da VFCI. As três adjudicações futuras não foram convertidas em documentos de viatura nem em total de frota. |
| Atividade | Colaboração em resposta municipal às depressões Ingrid, Joseph e Kristin | [Balanço municipal](https://www.cm-viladobispo.pt/noticias/camara-municipal-faz-balanco-das-intervencoes-apos-passagem-das-depressoes-ingrid-joseph-e-kristin), Município de Vila do Bispo | 2026-01-30 | HIGH | NO | Confirma atuação de proteção civil, mas não acrescenta conteúdo essencial ao lote inicial. |

## Provisional editorial copy

O headline “Desde 1982 ao serviço da comunidade”, os títulos de secção, a síntese de missão e as descrições de serviços são redação editorial original baseada apenas nos factos HIGH acima. Não são apresentados como lema, missão estatutária ou formulação oficialmente aprovada pela Associação.

A chamada para recrutamento usa apenas “Quero ser bombeiro” e liga à página informativa; não afirma que o recrutamento esteja aberto. A chamada “Sócios e apoio” não apresenta direitos, quotas ou métodos de donativo. Não foi publicada uma lista formal de valores.

As páginas Formação e Recrutamento usam texto editorial geral e duradouro. A Formação explica a finalidade da preparação contínua sem criar uma ação fictícia. O Recrutamento não apresenta idades, requisitos, etapas, datas ou uma campanha aberta; esclarece que essas condições só serão divulgadas depois de confirmação oficial.

Na ausência de fotografias editoriais autorizadas, os cartões podem mostrar ilustrações vetoriais institucionais controladas no CMS. Estes visuais não são fotografias, não representam meios ou ocorrências reais e são substituídos automaticamente quando o editor publica uma imagem.

## Conflicting information

- **Morada atual:** o arquivo da Secretaria-Geral do MAI regista historicamente Rua 1.º de Maio, n.º 24; o perfil setorial Bombeiros Portugueses indica Sítio Senhora do Amparo. A página atual de contactos do Município apresenta a secção dos Bombeiros, mas o conteúdo extraído não expõe a respetiva morada. Resultado: nenhuma morada ou ligação de direções foi publicada.
- **Código postal:** o sufixo `8650-425` aparece no arquivo histórico e no perfil setorial, mas depende da morada atual ainda não confirmada. Não foi publicado.
- **Data exata da cerimónia VFCI:** a página municipal está datada de 30 de maio e foi atualizada em 31 de maio, usando uma formulação temporal internamente ambígua. A data de publicação da notícia foi usada no CMS; não se criou uma cronologia diária adicional.

## Rejected / insufficient evidence

| Área | Candidato | Confiança | Publicado | Decisão |
| --- | --- | --- | --- | --- |
| Estatísticas | 70+ bombeiros | LOW | NO | Só aparece no mockup visual; não existe confirmação atual autorizada. |
| Estatísticas | 16 viaturas | LOW | NO | Só aparece no mockup visual; notícias sobre viaturas entregues/adjudicadas não permitem inferir a frota total. |
| Contactos | `bomb.vbispo@gmail.com` | MEDIUM | NO | Um único perfil setorial secundário; requer confirmação direta. |
| Contactos | Sítio Senhora do Amparo, 8650-425 | MEDIUM | NO | Um único perfil setorial e divergência com o registo histórico de morada. |
| Identificação | Código operacional 0816 | MEDIUM | NO | Perfil setorial secundário; não é necessário ao website público inicial. |
| Redes sociais | Instagram `bombeiros_vila_do_bispo` e possíveis páginas Facebook | MEDIUM/LOW | NO | As páginas diretas não puderam ser verificadas de forma fiável devido a restrições técnicas/autenticação. Não se publicou qualquer perfil ou mirror. |
| Comando | Nome completo “Emerson Manuel Silva Gomes” | MEDIUM | NO | A fonte municipal confirma apenas “Emerson Gomes”; publicou-se somente essa forma. |
| Comando | David Correia, Adjunto de Comando | LOW | NO | Não foi encontrada fonte primária atual suficiente. |
| Recrutamento | Recrutamento aberto em 2026 e respetivas condições | LOW | NO | Não foi encontrada publicação oficial atual e acessível. Foi publicada apenas uma apresentação geral que declara expressamente não existir confirmação de candidaturas abertas. |
| Serviços | Resgate em falésias/grande ângulo, formação pública ou catálogo operacional detalhado | LOW | NO | Atividades plausíveis não equivalem a confirmação local atual. |
| Associação | Valores formais, fundadores, frota inicial, primeira ocorrência, datas do quartel | LOW/UNKNOWN | NO | Ausência de fonte institucional ou governamental suficiente. |
| Sócios/donativos | Condições, benefícios, quotas, IBAN, MB WAY e outros métodos | UNKNOWN | NO | Nenhuma informação diretamente autorizada. Os respetivos singletons permanecem ausentes. |
| Fotografias externas | Imagens municipais, sociais, imprensa ou diretórios | N/A | NO | Não existe autorização de reutilização; apenas os dois ficheiros fornecidos foram usados. |

## Still required from the Fire Brigade

- Morada postal atual completa, código postal e ligação oficial para direções.
- Email geral e URLs canónicos das contas oficiais de Facebook/Instagram.
- Número atual de bombeiros e número atual de viaturas, ambos com data de referência.
- Estrutura completa e atual do Comando, incluindo confirmação do nome completo do Comandante e eventual Adjunto/2.º Comandante.
- Composição completa e datas de mandato da Direção, Assembleia Geral e Conselho Fiscal.
- Redação formal de missão/valores, caso exista e deva ser usada.
- Catálogo final de serviços, disponibilidade, critérios e contactos específicos autorizados.
- Estado atual do recrutamento, requisitos, processo e contacto autorizado.
- Condições de admissão de sócios, benefícios, processo e quotas.
- Métodos de donativo confirmados, incluindo IBAN/MB WAY apenas se a Direção autorizar a publicação.
- Política de privacidade e declaração de acessibilidade aprovadas.
- Mais fotografia institucional autorizada e respetivos créditos.

## Sources

### Autoritativas/primárias acessíveis

- [Lei n.º 32/2007 — regime jurídico das associações humanitárias de bombeiros](https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2007-70048101)
- [Decreto-Lei n.º 247/2007 — regime jurídico dos corpos de bombeiros](https://diariodarepublica.pt/dr/detalhe/decreto-lei/247-2007-635841)
- [Arquivo associativo da Secretaria-Geral do Ministério da Administração Interna](https://agc.sg.mai.gov.pt/results?lg=ComposedDocument%2CDocument&p=2455&s=CompleteUnitId&sd=False&searchType=Description)
- [Município — entrega de VFCI no âmbito do Algarve 2030](https://www.cm-viladobispo.pt/noticias/vila-do-bispo-e-o-primeiro-municipio-do-algarve-a-entregar-uma-viatura-aos-bombeiros-no-ambito-do-algarve-2030)
- [Município — reforço com nova viatura de combate a incêndios](https://www.cm-viladobispo.pt/noticias/camara-municipal-reforca-meios-dos-bombeiros-com-nova-viatura-de-combate-a-incendios)
- [Município — Dia Regional do Bombeiro do Algarve](https://www.cm-viladobispo.pt/noticias/comemoracoes-do-dia-regional-do-bombeiro-do-algarve)
- [Município — transporte social](https://www.cm-viladobispo.pt/noticias/camara-promove-transporte-social-mais-abrangente-em-colaboracao-com-os-bombeiros-de-vila-do-bispo)
- [Município — protocolos de 2026](https://www.cm-viladobispo.pt/municipio/autarquia/camara-municipal/protocolos/2026)
- [Município — Programa DAE](https://cm-viladobispo.pt/servicos/protecao-civil/informacao-publica-e-sensibilizacao/programa-dae-de-vila-do-bispo)
- [Município — balanço de intervenções após tempestades](https://www.cm-viladobispo.pt/noticias/camara-municipal-faz-balanco-das-intervencoes-apos-passagem-das-depressoes-ingrid-joseph-e-kristin)
- [Liga dos Bombeiros Portugueses — associações](https://lbp.pt/associacoes/)

### Secundária usada apenas para corroborar ou sinalizar revisão

- [Bombeiros Portugueses — perfil do corpo de bombeiros](https://www.bombeiros.pt/corpos_de_bombeiros/associacao-humanitaria-dos-bombeiros-voluntarios-de-vila-do-bispo/)

### Limitações de acesso

- As contas diretas de Instagram/Facebook não puderam ser inspecionadas de forma suficientemente fiável sem depender de autenticação, pesquisa indireta ou mirrors. Nenhum URL social foi publicado.
- A página municipal geral de contactos carregou a secção “Bombeiros Voluntários de Vila do Bispo”, mas a extração pública disponível não apresentou os detalhes dessa secção. Foi usado o telefone explicitamente publicado na página municipal do Programa DAE e corroborado por fonte setorial.

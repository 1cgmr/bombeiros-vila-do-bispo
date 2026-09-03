# AGENTS.md

## Missão e limites

- Este é um projeto voluntário e não comercial para a Associação Humanitária dos Bombeiros Voluntários de Vila do Bispo.
- O custo recorrente normal de software e alojamento deve permanecer em 0 €/mês; o custo do domínio é a única exceção definida.
- Não introduzir serviços pagos, planos premium ou infraestrutura adicional sem autorização explícita e uma necessidade demonstrada.
- Preferir soluções simples, dependências mínimas e as arquiteturas já estabelecidas em `docs/architecture.md`.

## Linguagem e código

- Usar português europeu (`pt-PT`) em toda a interface pública, textos editoriais e interface configurada do Sanity Studio.
- Identificadores técnicos, nomes de campos e nomes de ficheiros podem usar inglês.
- Usar TypeScript estrito em `web/` e `studio/`.
- No Next.js, preferir Server Components; adicionar Client Components apenas quando a interatividade o exigir.
- Respeitar os limites entre as aplicações npm independentes `web/` e `studio/`; não adicionar um pacote partilhado sem necessidade demonstrada.

## Conteúdo e dados

- O Sanity é a fonte de verdade para conteúdo institucional editável.
- Nunca inventar factos institucionais, incluindo nomes, datas, contagens, estatísticas, contactos, moradas, IBAN, MB WAY ou ligações sociais.
- Nunca codificar diretamente conteúdo que deve ser gerido no Sanity.
- Manter valores não confirmados explicitamente como pendentes de validação oficial.
- Nunca guardar dados pessoais provenientes de formulários no dataset público do Sanity.

## Segurança, custo e qualidade

- Nunca incluir segredos, tokens, credenciais ou ficheiros `.env.local` no Git.
- Tokens de escrita/administração do Sanity nunca podem ser expostos no browser.
- Preservar acessibilidade, HTML semântico, navegação por teclado, contraste e textos alternativos.
- Não adicionar rastreio, cookies ou serviços externos desnecessários.
- Atualizar a documentação quando uma decisão arquitetural mudar.
- Antes de concluir uma tarefa, executar as verificações relevantes: lint, typecheck, testes existentes e build das aplicações afetadas.

## Comandos de verificação

Em `web/`:

```text
npm run lint
npm run typecheck
npm run build
```

Em `studio/`:

```text
npm run lint
npm run typecheck
npm run schema:validate
npm run build
```

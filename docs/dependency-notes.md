# Notas de dependências

Auditoria verificada em 5 de setembro de 2026 com Node.js `24.19.0` e npm `11.17.0`.

## Frontend

`npm audit` em `web/` não reporta vulnerabilidades conhecidas.

O único cliente de produção acrescentado para os formulários é o SDK oficial `resend`. A interação dos componentes é testada com `@testing-library/react` e `jsdom`, ambos limitados a `devDependencies`; não foi adicionada uma biblioteca de formulários ou validação em runtime.

## Sanity Studio

`npm audit` em `studio/` reporta oito vulnerabilidades transitivas: uma de severidade alta em `js-yaml` e sete de severidade moderada através de `smol-toml` e `uuid`. A cadeia afetada pertence às ferramentas de desenvolvimento/deployment do Sanity e Vercel (`sanity` → `@sanity/cli`/`@sanity/cli-build` → dependências transitivas).

O npm apenas propõe correção através de `npm audit fix --force`, que substituiria o Sanity 6 por `sanity@5.14.1` e introduziria uma alteração incompatível. Essa correção não deve ser aplicada. Também não se deve fazer downgrade apenas para silenciar a auditoria.

Reavaliar quando existir uma versão estável do Sanity que atualize estas dependências transitivas. Até lá:

- não processar ficheiros YAML/TOML não confiáveis através destas ferramentas;
- limitar operações CLI autenticadas a máquinas autorizadas;
- manter as dependências bloqueadas pelo `package-lock.json`;
- executar `npm audit` nas atualizações planeadas, sem usar `--force`.

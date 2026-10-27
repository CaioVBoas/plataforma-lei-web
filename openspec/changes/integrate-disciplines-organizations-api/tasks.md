# Tasks

## 1. Base da integração

- [x] 1.1 Acrescentar `mocksEnabled` em `src/lib/apiClient.ts`, `VITE_USE_MOCKS` em `src/viteEnv.d.ts` e o comentário em `.env.development.example`, com as mesmas linhas da PLEI-40; verificar com `git diff` que só esses trechos mudaram e que `npm run build` passa

## 2. Disciplinas e competências

- [x] 2.1 Ligar as funções de disciplina de `disciplinesApi.ts` à API (list, get, create, `PATCH`, `DELETE` 204, convite e remoção de co-docente com `encodeURIComponent`), mantendo o mock sob `mocksEnabled`; verificar no Swagger e na aba Network que cada chamada vai à rota e com o verbo da tabela do design
- [x] 2.2 Ligar `getSkillCatalog` a `GET /skills/catalog`; verificar que o formulário de disciplina mostra as competências do seed da API
- [x] 2.3 Tornar `code` obrigatório em `disciplineSchema.ts` e trocar o rótulo "Código, opcional" por "Código" em `disciplineForm.tsx`; verificar que salvar sem código mostra "Informe o código da disciplina." sem chamada à API

## 3. Organizações

- [x] 3.1 Criar `OrganizationDemandRef` e `OrganizationProjectRef` em `organizations/types.ts` e usá-los em `OrganizationDetail`; verificar com `tsc -b` que só `organizationPage.tsx` e o mock reclamam
- [x] 3.2 Ajustar `mocks/handlers/organizations.ts` para devolver a forma enxuta; verificar com `VITE_USE_MOCKS=true` que o perfil abre e lista as demandas abertas do Hospital das Clínicas
- [x] 3.3 Trocar os cards de demanda de `organizationPage.tsx` por uma lista de títulos com link para `/cardapio/:id`, removendo os imports que deixarem de ser usados; verificar que `npm run lint` não acusa nada
- [x] 3.4 Ligar `getOrganizations` e `getOrganization` de `organizationsApi.ts` à API; verificar que o catálogo e o perfil mostram os dados do seed e que `contact` só aparece para docente com projeto

## 4. Verificação

- [x] 4.1 Rodar `npm run build` e `npm run lint` sem erros
- [x] 4.2 Com a API da PLEI-41 e o Postgres no ar, entrar como docente e passar pelos cenários das specs:
  - criar, editar e excluir disciplina, inclusive o `409` de exclusão com projeto;
  - convidar colega com conta e sem conta (`404`), e remover o colega;
  - abrir uma disciplina de outro docente (`404`);
  - catálogo de organizações, perfil com e sem contato, e organização inexistente (`404`)
- [x] 4.3 Com `VITE_USE_MOCKS=true`, confirmar que Disciplinas, Organizações e o "levar demanda" continuam funcionando como antes
- [x] 4.4 Registrar no PR os efeitos de transição descritos no design (projetos e demandas ainda no mock)

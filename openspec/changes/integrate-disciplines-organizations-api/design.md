# Design

## Context

Motivação em proposal.md (Why).

Hoje as funções de `disciplinesApi.ts` e `organizationsApi.ts` só chamam `mockRequest(() => server.x())`. A única integração já feita em `develop` é a de auth. Ela usa `VITE_USE_MOCKS` dentro do próprio `authApi.ts` e, em desenvolvimento, cai no mock quando a rede falha.

A PLEI-40 (`plataforma-lei-web#7`, ainda aberta) introduziu outro padrão:
- `export const mocksEnabled = import.meta.env.VITE_USE_MOCKS === 'true'` em `src/lib/apiClient.ts`;
- em cada função do `*Api.ts`, `mocksEnabled ? mockRequest(...) : api.get(...).then((r) => r.data)`.

O contrato da API está na branch `feature/PLEI-41-disciplines` da `plataforma-lei-api`:

| Front (`*Api.ts`) | API | Resposta |
|---|---|---|
| `getDisciplines` | `GET /disciplines` | `DisciplineDto[]` |
| `getDiscipline(id)` | `GET /disciplines/:id` | `DisciplineDto` |
| `createDiscipline(input)` | `POST /disciplines` | `201 DisciplineDto` |
| `updateDiscipline({ id, input })` | `PATCH /disciplines/:id` | `DisciplineDto` |
| `removeDiscipline(id)` | `DELETE /disciplines/:id` | `204` |
| `inviteCoTeacher({ id, email })` | `POST /disciplines/:id/co-teachers` `{ email }` | `201 DisciplineDto` |
| `removeCoTeacher({ id, email })` | `DELETE /disciplines/:id/co-teachers/:email` | `DisciplineDto` |
| `getSkillCatalog` | `GET /skills/catalog` | `string[]` |
| `getOrganizations` | `GET /organizations` | `OrganizationSummaryDto[]` |
| `getOrganization(id)` | `GET /organizations/:id` | `OrganizationDetailDto` |

Os campos de `DisciplineDto` são os mesmos de `DisciplineWithUsage`: `id` string, `level` em `intro|intermediate|advanced`, `coTeachers: { email, name? }[]`, `activeProjects` e `isCurrent`. `OrganizationDto` também casa com `Organization`, com nulos já convertidos em `""` e `type` como rótulo.

A única diferença de forma está em `OrganizationDetailDto`:
- `openDemands` vem como `{ id, title }[]`;
- `myProjects` vem como `{ id, title, semester, disciplineName }[]`.

## Goals / Non-Goals

**Goals:**
- Trocar a fonte de dados só dentro dos `*Api.ts` e dos tipos. Hooks e telas não mudam, a não ser onde a forma enxuta obriga.
- Manter o modo demonstração completo com `VITE_USE_MOCKS=true`.
- Ficar compatível com o merge da PLEI-40 sem retrabalho.

**Non-Goals:**
- Adaptadores entre ids do mock e da API.
- Integração de demandas e projetos (PLEI-42 e PLEI-43).
- Testes automatizados no front: o projeto ainda não tem runner de testes, e incluir um fica para outra change.

## Decisions

### 1. Flag `mocksEnabled` idêntica à da PLEI-40
Crio em `src/lib/apiClient.ts`, `src/viteEnv.d.ts` e `.env.development.example` as mesmas linhas que o `a9a4fce` (PLEI-40) acrescenta, com o mesmo texto e no mesmo lugar. Quem fizer merge depois encontra um conflito trivial ou nenhum.
- Alternativa: basear a branch na PLEI-40. Foi descartada a pedido, para o PR não depender do `#7`.
- `authApi.ts` continua lendo `VITE_USE_MOCKS` por conta própria. Unificar fica para quando a PLEI-40 entrar.

### 2. Sem fallback silencioso para o mock
No modo real, erro de rede ou HTTP propaga como `Error`, com a mensagem que o interceptor do `apiClient` já extrai (`message` da API, ou a junção dos itens quando a validação devolve um array). O `QueryView` e os `isError` das mutations já mostram essa mensagem.
- Alternativa: repetir o fallback de `authApi.ts` em desenvolvimento. Foi descartada porque mistura dados da API com dados do mock na mesma tela e esconde a falha. O próprio `demo-token` desse fallback já causa 401 na API.

### 3. Formato das chamadas
- O padrão é o da PLEI-40: `api.<verbo><T>(url, body?).then((response) => response.data)`, tipado com os tipos do front que já casam com os DTOs.
- `removeDiscipline` devolve `Promise<void>` e ignora o corpo do `204`.
- `removeCoTeacher` usa `encodeURIComponent(email)` no segmento da URL, porque o `+` e o `@` precisam trafegar intactos.
- `updateDiscipline` envia o `DisciplineInput` completo no `PATCH`, que aceita campos parciais, e a API valida `teamSize` contra os valores resultantes.
- O cache não muda: as chaves e as invalidações de `useDisciplines.ts` continuam as mesmas.

### 4. Forma enxuta em `OrganizationDetail`
- **Tipos:** `types.ts` ganha `OrganizationDemandRef { id, title }` e `OrganizationProjectRef { id, title, semester, disciplineName }`.
- **Mock:** `mocks/handlers/organizations.ts` passa a mapear para essa forma, para os dois modos se comportarem igual.
- **Página:** `organizationPage.tsx` troca o `DemandCard` com `rankDisciplines` por uma `ItemList` de títulos com link para `paths.demand(id)`, no mesmo padrão da aba Projetos. Saem dela `useCurrentDisciplines`, `useCalendar`, `DemandCard`, `rankDisciplines` e `cardGridClassName`.
- **Projetos:** `projectPage.tsx` e `projectAside.tsx` só usam `organization.cover`, `meetingCadence` e `onSiteVisit` do detalhe, então não mudam.
- **Alternativa descartada** (escolha do usuário): cruzar com `GET /demands/menu` para montar os cards, o que depende da PLEI-42.
- **Ajustes da verificação no navegador:**
  - A linha da demanda fica sem o botão "Ver no cardápio", porque a linha inteira já é o link e o botão cortava o título na coluna estreita. O título quebra linha em vez de truncar.
  - Na lista de organizações, o "·" entre tipo e local só aparece quando há local, porque a API devolve `""` para campo vazio.

### 5. Código da disciplina obrigatório
A API exige `code` não vazio (`IsNotEmpty`). Em `disciplineSchema.ts`, `code` passa a `min(1, 'Informe o código da disciplina.')`, e o rótulo "Código, opcional" vira "Código". Assim o erro aparece no campo, antes de um `400` genérico.
- Alternativa: mandar um código gerado. Foi descartada porque o código identifica a turma para o docente e entra na unicidade `[professorId, code, semester]`.

## Risks / Trade-offs

- **Transição com demandas e projetos no mock.** No modo real, demandas e projetos seguem com ids do mock (`'nase'`, `'mesa-2026-2'`, disciplinas `'…-slug'`). Isso traz três efeitos:
  - `useDiscipline(project.disciplineId)` em `projectPage.tsx` e `projectAside.tsx` recebe `400`, porque o id não é numérico. Como essas telas leem `data` como opcional, o card de equipes fica sem números e os co-docentes somem, mas a página não quebra.
  - `useOrganization(project.organization.id)` também recebe `400`, e a capa e as reuniões no projeto ficam vazias.
  - Levar uma demanda para uma disciplina criada na API falha no mock com "Disciplina não encontrada.", porque o mock só conhece `db.disciplines`.
  - Mitigação: registrar no PR, usar `VITE_USE_MOCKS=true` para demonstrar o fluxo inteiro até a PLEI-42 e a PLEI-43 serem integradas, e não criar adaptadores de id que viveriam só nesse intervalo.
- **Sessão vinda do fallback de login.** Se o login caiu no mock (`demo-token`), as chamadas desta change recebem `401` e o interceptor encerra a sessão. → Comportamento esperado: no modo real é preciso a API de auth no ar.
- **`GET /organizations` sem paginação, com `logo` e `cover` em data URL.** A resposta pode ficar pesada. → Fora do escopo; anotar como débito da API.
- **Competências fora do catálogo ficam invisíveis no seletor.** `ChoiceChips` só desenha as opções do catálogo, e um valor marcado que não está nele segue no formulário sem aparecer. Na API isso não acontece, porque toda competência salva vira linha de `Skill`. Mas acontece no "levar demanda" com competências de demanda vinda do mock. → Aceito na transição.
- **Migrations da API num banco novo.** Na branch da PLEI-41, `prisma migrate deploy` falha num banco vazio porque a coluna `references.updatedAt` é criada duas vezes. A correção está na PLEI-40 (`66d39f8`). → A verificação usou `prisma db push`; o ambiente de quem testar precisa da PLEI-40 ou de um banco já migrado.
- **Merge com a PLEI-40.** Conflito de uma linha em `apiClient.ts`, `viteEnv.d.ts` e `.env.development.example`. → Linhas idênticas às dela.

## Migration Plan

1. Fazer o merge da `feature/PLEI-41-disciplines` na API (PR `plataforma-lei-api#5`) antes ou junto deste PR.
2. Para rodar localmente: API com Postgres, migrations e seed (calendário `isCurrent`), e o front com `VITE_API_URL` apontando para ela.
3. Rollback: `VITE_USE_MOCKS=true` devolve o comportamento anterior sem reverter código.

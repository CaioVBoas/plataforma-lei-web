# Proposal

## Why

As telas de Disciplinas, o autocomplete de competências e o catálogo de Organizações ainda respondem pelo backend simulado (`src/mocks`). A PLEI-41 entregou esses endpoints na API (`/disciplines`, `/skills/catalog` e `/organizations`, PR `plataforma-lei-api#5`). Sem a integração, o que o docente cadastra se perde ao recarregar a página, e as regras de acesso (principal ou co-docente) e de contato (Regra 6) não valem de verdade.

## What Changes

- `disciplinesApi.ts` passa a chamar a API em todas as operações: listar, detalhar, criar, editar (`PATCH`), excluir (`204`), convidar e remover co-docente, além do catálogo de competências (`GET /skills/catalog`).
- `organizationsApi.ts` passa a chamar `GET /organizations` e `GET /organizations/:id`.
- Nova flag `mocksEnabled` (`VITE_USE_MOCKS=true`) em `src/lib/apiClient.ts`, com o mesmo nome e semântica da PLEI-40. Ligada, tudo responde pelos mocks, como hoje.
- **BREAKING (contrato interno do front):** `OrganizationDetail.openDemands` e `OrganizationDetail.myProjects` deixam de ser `Demand[]` e `Project[]` e passam a ser referências enxutas, como a API devolve.
  - A página da organização mostra as demandas abertas como uma lista de título com link para o cardápio, no lugar dos cards com compatibilidade.
  - O mock passa a devolver a mesma forma enxuta, para os dois modos se comportarem igual.
- O código da disciplina passa a ser obrigatório no formulário, porque a API rejeita código vazio com `400`.
- A falha de rede deixa de cair no mock em silêncio: o erro da API aparece na tela pela mensagem que o `apiClient` já extrai.

## Capabilities

### New Capabilities
- `disciplines`: o docente gerencia as disciplinas do semestre e os co-docentes pela API.
- `skills-catalog`: o autocomplete de competências lê o catálogo da API.
- `organizations`: o docente consulta o catálogo e o perfil das organizações pela API, com o contato condicionado à Regra 6.

### Modified Capabilities
Nenhuma (o projeto ainda não tem specs registrados).

## Non-goals

- Integrar demandas (PLEI-42) e projetos (PLEI-43), que seguem no mock nesta change.
- Mudar a API: o contrato é o da branch `feature/PLEI-41-disciplines`.
- Convite pendente de co-docente sem conta: a API responde `404`, e a tela só mostra a mensagem.
- Reescrever o visual das telas além do necessário para a lista enxuta de demandas.

## Impact

- Alterados: `src/lib/apiClient.ts`, `src/viteEnv.d.ts`, `.env.development.example`, `src/features/disciplines/{disciplinesApi.ts,disciplineSchema.ts}`, `src/features/organizations/{organizationsApi.ts,types.ts,organizationPage.tsx}` e `src/mocks/handlers/organizations.ts`.
- Dependência de backend: as telas só funcionam no modo real com a API da PLEI-41 rodando e um docente autenticado por JWT.
- Período de transição: enquanto demandas e projetos estiverem no mock, os ids desses mocks (`'nase'`, `'mesa-2026-2'`) não existem na API. Telas de projeto que buscam a disciplina ou a organização por esses ids recebem erro no modo real. Os detalhes estão no design.
- Sobreposição com PRs abertos do front:
  - PLEI-40 (`plataforma-lei-web#7`) cria o mesmo `mocksEnabled`.
  - PLEI-42 (`#6`) não toca nos arquivos desta change.

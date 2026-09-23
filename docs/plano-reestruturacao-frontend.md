# Plano de Reestruturação Arquitetural e Nomenclatura · Frontend (`plataforma-lei-web`)

Este documento consolida a revisão técnica da branch `feat/portal-docente`, detalha o novo padrão arquitetural para o diretório `src/features/`, define a migração de nomenclatura para `camelCase`, analisa a dissociação da feature `projects` e traça a matriz de compatibilidade com o schema do backend (`plataforma-lei-api`).

---

## 1. Diagnóstico da Branch `feat/portal-docente`

A branch introduz uma implementação mockada completa e rica do Portal do Docente do L.E.I., baseada no protótipo "Aperta o PLEI" e documentada em `docs/fluxos.md`.

* **Build & Typecheck:** `tsc -b && vite build` executa com **100% de sucesso** (0 erros de tipo em TypeScript 6).
* **Linter:** `oxlint` executado com **0 erros e 0 warnings** em 107 arquivos.
* **Pontos Positivos:**
  * **Regras de Negócio Puras (`src/domain/`):** Isolamento total das regras de ciclo de vida do projeto, compatibilidade de competências e regras de calendário, sem acoplamento ao React.
  * **Mock Realista (`src/mocks/`):** Banco em memória com persistência e simulação de latência de rede que consome as regras de domínio oficiais.
  * **Design System Primitivo (`src/components/ui/`):** Componentes visuais limpos e consistentes com tokens do Tailwind v4 (`src/index.css`).
* **Oportunidades de Melhoria:**
  * **Overhead de Pastas:** Features de página única (`home`, `guide`, `account`, `auth`) possuem estrutura profunda e desnecessária (`pages/`, `hooks/`, `api/`).
  * **Nomenclatura Kebab-case:** 100% dos arquivos estão em `kebab-case`, divergindo da convenção `camelCase` estabelecida para o projeto.
  * **Acoplamento em `projects`:** A feature de projetos acumula duas telas com propósitos e complexidades díspares: a listagem/dashboard e o workspace detalhado de execução.

---

## 2. Nova Arquitetura de Features: Page e Hook na Raiz

Para evitar navegação excessiva por subpastas com apenas 1 arquivo dentro, adotamos a regra: **a página principal e seu hook primário residem diretamente na raiz da pasta da feature**.

A pasta interna `hooks/` passa a ter papel nobre e exclusivo: abrigar hooks que fazem pontes com serviços externos, contextos globais ou integrações cross-feature.

### Estrutura Comparativa

#### Como está hoje (kebab-case e aninhamento redundante):
```text
features/account/
├── api/
│   └── account-api.ts
├── hooks/
│   └── use-account.ts
└── pages/
    └── account-page.tsx
```

#### Como fica na Nova Arquitetura (camelCase e raiz limpa):
```text
features/account/
├── accountPage.tsx         # Página da feature na raiz
├── useAccount.ts           # Hook primário da feature na raiz
├── accountApi.ts           # Contrato de comunicação com a API
└── types.ts                # Tipos específicos da conta
```

#### Para features com componentes e hooks auxiliares (ex: `demands`):
```text
features/demands/
├── menuPage.tsx            # Página do Cardápio de demandas
├── demandPage.tsx          # Página de Detalhe da demanda
├── useDemands.ts           # Hook principal da feature (queries e mutações de demanda)
├── demandsApi.ts           # Chamadas à API
├── types.ts                # Tipos locais da feature
├── hooks/                  # Apenas hooks auxiliares / integração externa
│   └── useCalendarBridge.ts# Ex: conexão com o calendário acadêmico global
├── components/             # Componentes visuais exclusivos da feature
│   ├── adoptDemandModal.tsx
│   ├── decisionPanel.tsx
│   └── demandCard.tsx
└── utils/                  # Helpers e formatação de apresentação
    └── demandPresentation.ts
```

---

## 3. Revisão da Feature `projects`: Listagem vs. Workspace

### 3.1. O Problema Atual
Atualmente, `src/features/projects/` agrupa duas páginas que possuem naturezas totalmente distintas:
1. `projects-page.tsx` (Lista de Projetos):
   - É um painel de leitura/listagem (67 linhas de código).
   - Agrupa projetos por estágio (`Em planejamento`, `Em andamento`, `Concluídos`).
   - Utiliza apenas **1 componente filho** (`project-row.tsx`).
2. `project-page.tsx` (Workspace do Projeto):
   - É uma aplicação operacional complexa (102 linhas de casca + centenas de linhas de componentes).
   - Possui 3 abas ativas: Etapas, Plano e Organização.
   - Contém **7 componentes dedicados e complexos**: `milestone-timeline.tsx`, `milestone-track.tsx`, `next-step-card.tsx`, `plan-tab.tsx`, `organization-tab.tsx`, `project-settings.tsx`, `complete-milestone-modal.tsx`.
   - Gerencia transição das 6 etapas, modal de conclusão de marcos, confirmação de plano do SIGAA e desistência.

### 3.2. Decisão Arquitetural: Divisão em Duas Features Independentes

A recomendação mais limpa e desacoplada é **dividir `projects` em duas features autônomas**:

#### 1. `features/projectList/` (ou `projectsList/`)
Focada exclusivamente na visão agregada dos projetos do docente:
```text
features/projectList/
├── projectsPage.tsx        # Página de listagem dos projetos
├── useProjects.ts          # Hook de consulta da lista de projetos
├── projectsApi.ts          # Endpoint GET /projects
├── projectRow.tsx          # Componente de linha de projeto
└── types.ts                # Tipos de listagem e agrupamento
```

#### 2. `features/projectWorkspace/` (ou `projectDetail/`)
Focada exclusivamente na gestão do projeto individual:
```text
features/projectWorkspace/
├── projectPage.tsx                 # Casca do workspace do projeto
├── useProjectWorkspace.ts          # Hook do projeto (dados + mutações de etapas/plano)
├── projectWorkspaceApi.ts          # Endpoints de detalhe, marcos e encerramento
├── types.ts                        # Tipos das abas e formulários de etapas
├── components/                     # Componentes exclusivos do workspace
│   ├── completeMilestoneModal.tsx
│   ├── milestoneTimeline.tsx
│   ├── milestoneTrack.tsx
│   ├── nextStepCard.tsx
│   ├── organizationTab.tsx
│   ├── planTab.tsx
│   └── projectSettings.tsx
└── utils/
    ├── agenda.ts
    └── projectPresentation.ts
```

> **Benefícios da Separação:**
> * **Zero Ambiguidade:** Cada feature tem exatamente 1 página raiz e 1 hook raiz.
> * **Manutenibilidade:** Quem estiver alterando o formulário de etapas ou a aba do SIGAA não toca nem corre risco de quebrar a listagem de projetos.
> * **Carregamento Otimizado (Code Splitting):** O bundle da listagem fica levíssimo, pois os 7 componentes do workspace só são baixados quando o usuário realmente entra em um projeto.

---

## 4. Padronização de Nomenclatura em `camelCase`

Todos os arquivos de código (`.ts` e `.tsx`) devem adotar **`camelCase`**.

### Regras de Conversão:

| Categoria | Formato Anterior (`kebab-case`) | Novo Formato (`camelCase`) |
| :--- | :--- | :--- |
| **Páginas** | `projects-page.tsx`, `menu-page.tsx` | `projectsPage.tsx`, `menuPage.tsx` |
| **Componentes** | `demand-card.tsx`, `adopt-demand-modal.tsx` | `demandCard.tsx`, `adoptDemandModal.tsx` |
| **Hooks** | `use-demands.ts`, `use-projects.ts` | `useDemands.ts`, `useProjects.ts` |
| **APIs** | `demands-api.ts`, `projects-api.ts` | `demandsApi.ts`, `projectsApi.ts` |
| **Utilitários e Domínio** | `project-lifecycle.ts`, `button-styles.ts` | `projectLifecycle.ts`, `buttonStyles.ts` |
| **Rotas e Layouts** | `app-routes.tsx`, `portal-layout.tsx` | `appRoutes.tsx`, `portalLayout.tsx` |

---

## 5. Matriz de Compatibilidade: Backend (`plataforma-lei-api`) vs Frontend (`plataforma-lei-web`)

Cruzamento detalhado entre o schema Prisma atualizado da API e as interfaces de domínio do frontend:

| Conceito | Backend (`schema.prisma`) | Frontend (`src/domain/types.ts`) | Análise & Plano de Ação |
| :--- | :--- | :--- | :--- |
| **Identificadores (IDs)** | `Int @id @default(autoincrement())` | `id: string` (`'dem-1'`, `'proj-1'`) | **Ação no Frontend:** Na camada de API e rotas, aceitar `number \| string` ou aplicar `Number(id)` para comunicação com o backend. |
| **Demanda: Título e Ofertas** | Ausentes no modelo `Demand` | `title: string`, `offers: string[]` | **Ação no Backend:** Adicionar `title String` e `offers String[]` na entidade `Demand` do Prisma. |
| **Demanda: Escopo e Viabilidade** | `Viabilidade { CABE_NO_SEMESTRE, APERTADO_EXIGE_RECORTE, NAO_CABE }` | `scopeFit: 'fits' \| 'needs-cut'` | **Ação de Alinhamento:** Adequar o frontend para mapear o enum oficial de viabilidade do backend. |
| **Reserva de Demanda** | `reservedByProfessorId Int?`, `reservationDeadline DateTime?` | `Reservation { teacherName, mine, until }` (7 dias) | **100% Compatível:** O backend possui as colunas necessárias; a API calcula `mine` através do token JWT. |
| **Notificação de Colega** | Inexistente no backend | `watching: boolean` ("Avise-me se liberar") | **Ação no Backend:** Criar relação `DemandWatcher` caso a funcionalidade de aviso seja mantida em produção. |
| **Turmas / Disciplinas** | `model Course` (`enrolledStudents`, `projectCapacity`, `expectedLevel`) | `interface Discipline` (`students`, `teamSize`, `projectSlots`) | **Ação de Alinhamento:** Adotar `Course` ou manter `Discipline` no frontend mapeando na camada de API. |
| **Organizações / Parceiros** | `model Partner` (`name`, `type`, `userId`) | `interface Organization` (contatos, histórico, endereço, sobre) | **Ação no Backend:** Enriquecer `Partner` com campos de contato institucional (`focalName`, `email`, `channel`) e histórico. |
| **Etapas do Projeto (Ciclo)** | `model Project` com `status StatusProjeto` e `ProgressRecord` genérico | 6 etapas fixas (`Milestone`: `plan`, `kickoff`, `sigaa`, `midterm`, `final`, `closing`) | **Ação Arquitetural no Backend:** O backend precisa criar o modelo `ProjectMilestone` para registrar data prevista, data de realização e notas das 6 etapas. |
| **Plano SIGAA e Carga Horária** | `ProposalSection` e `Workload` | `PlanSection` e `WorkloadRow` | **100% Compatível:** Mapeamento direto 1:1 de títulos, textos, atividades e horas. |

---

## 6. Roteiro de Execução da Refatoração

1. **Fase 1 · Criação da Documentação:** Registrar o plano em `docs/plano-reestruturacao-frontend.md` e atualizar o `README.md`.
2. **Fase 2 · Separação de `projects`:** Desmembrar em `features/projectList/` e `features/projectWorkspace/`.
3. **Fase 3 · Migração de Nomenclatura para `camelCase`:** Renomear arquivos em `src/domain/`, `src/components/`, `src/features/`, `src/layouts/`, `src/routes/` e `src/utils/`.
4. **Fase 4 · Reorganização das Features:** Trazer a página e o hook principal para a raiz de cada pasta de feature.
5. **Fase 5 · Validação Completa:** Executar `npm run build` e `npm run lint` para garantir zero erros de importação e integridade total.

# Plano de Reestruturação Arquitetural · Frontend (`plataforma-lei-web`)

Este documento consolida a revisão técnica da branch `feat/portal-docente`, detalha o padrão arquitetural atualizado para o diretório `src/features/`, apresenta a estrutura modular interna da feature `projects` (com submódulos, hooks dedicados e camada `shared/` interna), formaliza as justificativas técnicas e traça a matriz de compatibilidade com o schema do backend (`plataforma-lei-api`).

---

## 1. Diagnóstico e Status da Branch `feat/portal-docente`

A branch implementa a interface mockada do Portal do Docente do L.E.I., baseada no protótipo "Aperta o PLEI" e documentada em `docs/fluxos.md`.

* **Build & Typecheck:** `tsc -b && vite build` executa com **100% de sucesso** (0 erros de tipo no TypeScript 6).
* **Linter:** `oxlint` executado com **0 erros e 0 warnings** em 107 arquivos.
* **Nomenclatura:** Padronização para `camelCase` nos arquivos de `src/` já aplicada e integrada (commit `3df1aab`).
* **Pontos Fortes:**
  * **Regras de Negócio Puras (`src/domain/`):** Isolamento total das regras de ciclo de vida do projeto, compatibilidade de competências e regras de calendário, sem acoplamento ao React.
  * **Mock Realista (`src/mocks/`):** Banco em memória com persistência e simulação de latência de rede que consome as regras de domínio oficiais.
  * **Design System Primitivo (`src/components/ui/`):** Componentes visuais limpos e consistentes com tokens do Tailwind v4 (`src/index.css`).
* **Oportunidade Central de Melhoria:**
  * **Acoplamento Interno e Falta de Co-localização em `projects`:** A pasta `features/projects/` acumulava duas telas de complexidades muito distintas (`projectsPage.tsx` e `projectPage.tsx`), misturava 7 componentes pesados de workspace com componentes de listagem e centralizava todas as queries e mutações em um único hook monolítico (`useProjects.ts`).

---

## 2. Padrão Arquitetural de Features: Co-localização e Raiz Limpa

Para evitar navegação excessiva por subpastas com apenas 1 arquivo dentro, adotamos o princípio de **co-localização estrita**:

1. **Features Simples (1 tela):** A página principal (`*Page.tsx`) e seu hook primário (`use*.ts`) residem diretamente na raiz da pasta da feature.
   ```text
   features/account/
   ├── accountPage.tsx         # Página na raiz
   ├── useAccount.ts           # Hook primário na raiz
   ├── accountApi.ts           # Contrato de comunicação com a API
   └── types.ts                # Tipos específicos da conta
   ```

2. **Features com múltiplos fluxos ou componentes auxiliares (ex: `demands`):**
   ```text
   features/demands/
   ├── menuPage.tsx            # Tela do Cardápio de demandas
   ├── demandPage.tsx          # Tela de Detalhe da demanda
   ├── useDemands.ts           # Hook principal da feature (queries e mutações de demanda)
   ├── demandsApi.ts           # Chamadas à API
   ├── types.ts                # Tipos locais da feature
   ├── components/             # Componentes visuais da feature (demandCard, decisionPanel, adoptDemandModal)
   └── utils/                  # Helpers e formatação de apresentação (demandPresentation.ts)
   ```

---

## 3. Arquitetura da Feature `projects`: Submódulos e Camada `shared/` Interna

### 3.1. O Problema Identificado no Modelo Anterior
A feature `projects` possui duas telas com papéis e pesos muito diferentes:
* `projectsPage.tsx` (Lista de Projetos): Painel de consulta/leitura compacto (67 linhas) que só utiliza 1 componente (`projectRow.tsx`).
* `projectPage.tsx` (Workspace do Projeto): Ambiente operacional complexo com 3 abas ativas, responsável por **7 dos 8 componentes** da pasta (`milestoneTimeline`, `milestoneTrack`, `nextStepCard`, `planTab`, `organizationTab`, `projectSettings`, `completeMilestoneModal`).

Além disso, o arquivo [`useProjects.ts`](file:///Users/Caio/Documents/LEI/plataforma-lei-web/src/features/projects/hooks/useProjects.ts) funcionava como um **hook monolítico**, empacotando juntos:
1. A query da listagem (`useProjects`).
2. As mutações exclusivas do workspace (`useProject`, `useCompleteMilestone`, `useUpdatePlanSection`, `useUpdateTeams`, `useWithdrawProject`).
3. A mutação de adoção acionada externamente pelo modal de demandas (`useAdoptDemand`).

### 3.2. Estrutura Proposta

Para manter `projects` como o **módulo proprietário** do seu domínio (sem quebrar importações de Home, Sidebar e Disciplinas nem criar dependências circulares), estruturamos a feature com submódulos focados e uma camada `shared/` interna:

```text
src/features/projects/
│
├── list/                                # 📁 Sub-módulo: Listagem de Projetos
│   ├── projectsPage.tsx                 # Tela de listagem
│   └── useProjectsList.ts               # 🪝 Hook exclusivo da listagem (busca e filtros)
│
├── workspace/                           # 📁 Sub-módulo: Workspace do Projeto Individual
│   ├── projectPage.tsx                  # Tela principal do workspace
│   ├── useProjectWorkspace.ts           # 🪝 Hook exclusivo do workspace (query do projeto +
│   │                                    #    mutações de etapas, plano, equipes e desistência)
│   └── components/                      # Componentes visuais exclusivos do workspace:
│       ├── completeMilestoneModal.tsx
│       ├── milestoneTimeline.tsx
│       ├── milestoneTrack.tsx
│       ├── nextStepCard.tsx
│       ├── organizationTab.tsx
│       ├── planTab.tsx
│       └── projectSettings.tsx
│
└── shared/                              # 📁 Recursos comuns internos e pontes externas
    ├── api/
    │   └── projectsApi.ts               # Funções de requisição HTTP / mocks
    ├── components/
    │   └── projectRow.tsx               # Linha de projeto (usado em list/ e disciplines/)
    ├── hooks/
    │   ├── useAgenda.ts                 # 🪝 Hook da agenda (consumido por home e sidebar)
    │   └── useAdoptDemand.ts            # 🪝 Hook de adoção (consumido por demands/adoptDemandModal)
    ├── types.ts                         # Tipos compartilhados de inputs e entidades
    └── utils/
        ├── agenda.ts                    # Cálculo de agenda e atenção
        └── projectPresentation.ts       # Textos, badges e labels de etapas
```

---

## 4. Justificativas Técnicas para as Atualizações

### 1. Co-localização Real (Tela + Hook Lado a Lado)
Cada submódulo possui seu próprio hook dedicado:
* Em `list/`, quem mexe em `projectsPage.tsx` encontra `useProjectsList.ts` colado na tela, contendo apenas a lógica de listagem e filtros.
* Em `workspace/`, quem mexe em `projectPage.tsx` ou em seus componentes de abas encontra `useProjectWorkspace.ts`, isolando a busca do projeto por ID e as mutações operacionais de marcos e plano.

### 2. Fim do Hook Monolítico
O desmembramento do antigo `useProjects.ts` impede que a listagem de projetos carregue lógicas complexas de invalidação de etapas, travamento de plano no SIGAA ou histórico de organizações.

### 3. Preservação do Domínio & Eliminação de Ciclos
Diferente de separar em duas top-level features (`projectList` vs `projectWorkspace`) — o que forçaria imports cruzados e dúvidas sobre quem é dono de `useProjects` ou `useAgenda` —, a camada `shared/` interna à feature `projects` preserva a coesão:
* Outras telas (`home`, `sidebar`, `disciplines`, `demands`) continuam importando de `@/features/projects/shared/...`.
* Não há vazamento de regras nem dependências circulares.

### 4. Clareza de Escopo dos Componentes
Os 7 componentes de alta densidade visual pertencentes às abas e modais do workspace ficam restritos a `workspace/components/`. A pasta `shared/components/` mantém apenas o que é verdadeiramente compartilhado (`projectRow.tsx`).

---

## 5. Matriz de Compatibilidade: Backend (`plataforma-lei-api`) vs Frontend (`plataforma-lei-web`)

Cruzamento detalhado entre o schema Prisma da API e as interfaces de domínio do frontend:

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

## 6. Roteiro de Implementação

1. **Reestruturar `src/features/projects/`:**
   * Criar os diretórios `list/`, `workspace/`, `workspace/components/` e `shared/`.
   * Mover `projectsPage.tsx` para `list/` e extrair `useProjectsList.ts`.
   * Mover `projectPage.tsx` para `workspace/`, extrair `useProjectWorkspace.ts` e mover os 7 componentes para `workspace/components/`.
   * Mover `projectRow.tsx`, `projectsApi.ts`, `types.ts`, `agenda.ts`, `projectPresentation.ts`, `useAgenda.ts` e `useAdoptDemand.ts` para `shared/`.
2. **Atualizar Imports:**
   * Atualizar rotas (`src/routes/appRoutes.tsx`).
   * Atualizar consumidores externos (`src/features/home/pages/homePage.tsx`, `src/layouts/sidebar.tsx`, `src/features/disciplines/pages/disciplinePage.tsx`, `src/features/demands/components/adoptDemandModal.tsx`).
3. **Verificação de Integridade:**
   * Executar `npm run build` e `npm run lint`.

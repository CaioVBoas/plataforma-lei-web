# Plano de Reestruturação Arquitetural · Frontend (`plataforma-lei-web`)

Este documento registra a revisão técnica da branch `feat/portal-docente`, o padrão de organização de `src/features/` adotado em todas as features, a estrutura interna da feature `projects` e a matriz de compatibilidade com o schema do backend (`plataforma-lei-api`).

**Status:** implementado. A nomenclatura em camelCase, o padrão de pastas e a reestruturação de `projects` já estão na branch. O que falta é o alinhamento com o backend (seção 5).

---

## 1. Diagnóstico

A branch implementa a interface mockada do Portal do Docente do L.E.I., baseada no protótipo "Aperta o PLEI" e especificada em `docs/fluxos.md`.

* **Build e typecheck:** `tsc -b && vite build` sem erros.
* **Linter:** `oxlint` sem erros nem avisos.
* **Pontos fortes:**
  * **Regras de negócio puras em `src/domain/`:** ciclo de vida do projeto, reserva, compatibilidade e calendário, sem dependência do React. O backend simulado e as telas usam as mesmas funções.
  * **Backend simulado em `src/mocks/`:** banco em memória com latência simulada, aplicando as regras de domínio.
  * **Componentes de interface em `src/components/ui/`:** primitivos visuais consistentes, com os tokens do Tailwind v4 em `src/index.css`.
* **O que foi corrigido:**
  * Arquivos em kebab-case passaram para camelCase.
  * Features de uma tela tinham subpastas com um arquivo só (`pages/`, `hooks/`, `api/`).
  * A feature `projects` misturava a listagem com a tela do projeto e concentrava todas as queries e mutations num único hook.

---

## 2. Padrão de pastas das features

A regra vale para todas as features: **o que é principal fica na raiz, e subpasta só existe para agrupar coisas auxiliares.**

| Fica na raiz da feature | Vai para subpasta |
| --- | --- |
| Páginas (`*Page.tsx`) | `components/`: componentes visuais da feature |
| Hook primário (`use*.ts`) | `utils/`: textos, rótulos e formatação de apresentação |
| Contrato com a API (`*Api.ts`) | `hooks/`: só hooks auxiliares, que fazem ponte com outra feature ou serviço |
| `types.ts` e schemas de formulário | |

Uma feature com duas telas de naturezas muito diferentes, e com partes usadas por outras features, se divide em **submódulos** mais uma pasta **`shared/`** interna. Hoje só `projects` precisa disso.

### Como ficaram as features

```text
src/features/
├── account/        accountPage, useAccount, accountApi
├── auth/           loginPage, useAuth, authApi, session, types
├── calendar/       useCalendar, calendarApi                      (sem tela: calendário do semestre)
├── demands/        menuPage, demandPage, useDemands, demandsApi, types
│   ├── components/ adoptDemandModal, decisionPanel, demandCard
│   └── utils/      demandPresentation
├── disciplines/    disciplinesPage, disciplinePage, useDisciplines, disciplinesApi, disciplineSchema, types
│   ├── components/ disciplineForm, newDisciplineModal
│   └── utils/      disciplinePresentation
├── guide/          guidePage
├── home/           homePage
├── organizations/  organizationsPage, organizationPage, useOrganizations, organizationsApi, types
└── projects/       ver seção 3
```

---

## 3. A feature `projects`

### 3.1. O problema

A feature tinha duas telas com papéis muito diferentes:

* **`projectsPage.tsx`**, a lista de projetos: uma tela de consulta, que agrupa os projetos por estado e usa um componente só, a linha do projeto.
* **`projectPage.tsx`**, a tela do projeto: ambiente de trabalho com três abas (Etapas, Plano e Organização), a janela de registro das etapas, o travamento do plano depois do SIGAA e a desistência.

Além disso, um único `useProjects.ts` juntava a consulta da lista, a consulta de um projeto, as mutations da tela do projeto e a mutation de adoção, que é chamada pelo cardápio.

### 3.2. A estrutura

`projects` continua dona do próprio domínio. Separar em duas features de primeiro nível (`projectList` e `projectWorkspace`) deixaria sem dono o que as duas e outras telas usam, e criaria imports cruzados entre features. A solução foi dividir por dentro:

```text
src/features/projects/
├── list/                              A lista de projetos
│   ├── projectsPage.tsx
│   └── useProjectsList.ts             Agrupa os projetos por estado
│
├── workspace/                         A tela de um projeto
│   ├── projectPage.tsx
│   ├── useProjectWorkspace.ts         Consulta do projeto e mutations de etapas, plano, equipes e desistência
│   └── components/
│       ├── completeMilestoneModal.tsx
│       ├── milestoneTimeline.tsx
│       ├── nextStepCard.tsx
│       ├── organizationTab.tsx
│       ├── planTab.tsx
│       └── projectSettings.tsx
│
└── shared/                            Usado pelos dois submódulos e por outras features
    ├── api/projectsApi.ts
    ├── components/
    │   ├── projectRow.tsx             Lista de projetos e página de disciplina
    │   └── milestoneTrack.tsx         Linha do projeto e cabeçalho do workspace
    ├── hooks/
    │   ├── useProjects.ts             Consulta de todos os projetos (lista, agenda, disciplina)
    │   ├── useAgenda.ts               Próximos passos (Início e barra lateral)
    │   ├── useAdoptDemand.ts          Levar demanda para a disciplina (janela do cardápio)
    │   └── useInvalidateProjectLifecycle.ts   Recarga do que muda quando um projeto nasce ou é desfeito
    ├── types.ts
    └── utils/
        ├── agenda.ts                  Cálculo dos próximos passos e do que pede atenção
        └── projectPresentation.ts     Textos das etapas e dos estados
```

### 3.3. Ajustes em relação à primeira proposta

A proposta original foi mantida, com três correções que o código exigiu:

1. **`milestoneTrack.tsx` foi para `shared/components/`**, e não para `workspace/`. A linha do projeto, que está em `shared`, usa esse componente. Se ele ficasse no workspace, `shared` passaria a importar de `workspace`, que é exatamente o acoplamento que a estrutura quer evitar.
2. **A consulta de todos os projetos (`useProjects`) ficou em `shared/hooks/`.** Ela não é só da listagem: a agenda do Início, a barra lateral e a página de disciplina também leem. `list/useProjectsList.ts` é uma camada fina por cima, que agrupa os projetos por estado.
3. **Nada de lógica que não existe.** A lista não tem busca nem filtro, então `useProjectsList` só agrupa. Quando busca e filtro existirem, é ali que entram.

### 3.4. Regra de dependência

* `list/` e `workspace/` importam de `shared/`, e nunca um do outro.
* `shared/` não importa de `list/` nem de `workspace/`.
* Outras features (`home`, `demands`, `disciplines`) e a barra lateral importam só de `@/features/projects/shared/...`.

### 3.5. Por que assim

* **Tela e hook lado a lado.** Quem mexe na lista encontra `useProjectsList.ts` ao lado da página. Quem mexe no workspace encontra `useProjectWorkspace.ts` ao lado da página e dos componentes das abas.
* **Fim do hook único.** A lista não carrega mais as mutations de etapas, plano e desistência.
* **Dono claro para o que é compartilhado.** `shared/` responde de quem é a consulta de projetos, a agenda e a adoção, sem dependência circular.

A divisão do bundle por tela já existia antes, porque cada página é carregada sob demanda pelas rotas. A reestruturação não muda isso; o ganho é de organização.

---

## 4. Nomenclatura

Todos os arquivos `.ts` e `.tsx` de `src/` usam camelCase: `menuPage.tsx`, `useDemands.ts`, `demandsApi.ts`, `projectLifecycle.ts`, `appRoutes.tsx`. Os componentes React exportados continuam em PascalCase dentro do arquivo (`export const MenuPage`).

---

## 5. Compatibilidade com o backend (`plataforma-lei-api`)

Cruzamento entre o schema Prisma da API e os tipos de domínio do frontend (`src/domain/types.ts`):

| Conceito | Backend (`schema.prisma`) | Frontend | Ação |
| :--- | :--- | :--- | :--- |
| **Identificadores** | `Int @id @default(autoincrement())` | `id: string` (`'nase'`, `'mesa-2026-2'`) | **Frontend:** converter na camada `*Api.ts`, aceitando o número da API e usando texto nas rotas. |
| **Demanda: título e ofertas** | Ausentes em `Demand` | `title: string`, `offers: string[]` | **Backend:** adicionar `title String` e `offers String[]` em `Demand`. |
| **Demanda: viabilidade** | `Viabilidade { CABE_NO_SEMESTRE, APERTADO_EXIGE_RECORTE, NAO_CABE }` | `scopeFit: 'fits' \| 'needs-cut'` | **Alinhar:** o frontend precisa tratar `NAO_CABE`, ou o backend deixa de publicar demandas nesse estado no cardápio. |
| **Reserva** | `reservedByProfessorId Int?`, `reservationDeadline DateTime?` | `Reservation { teacherName, mine, until }` | **Compatível:** a API calcula `mine` a partir do token. |
| **Avise-me se liberar** | Não existe | `watching: boolean` | **Backend:** criar a relação `DemandWatcher` se o aviso for mantido. |
| **Disciplinas** | `model Course` (`enrolledStudents`, `projectCapacity`, `expectedLevel`) | `Discipline` (`students`, `teamSize`, `projectSlots`, `skills`) | **Alinhar:** mapear `Course` para `Discipline` na camada de API. `teamSize` e `skills` precisam existir no backend. |
| **Organizações** | `model Partner` (`name`, `type`, `userId`) | `Organization` (sobre, público, reuniões, contato, histórico) | **Backend:** enriquecer `Partner` com contato do ponto focal (`focalName`, `email`, `channel`) e histórico. |
| **Etapas do projeto** | `Project` com `status StatusProjeto` e `ProgressRecord` genérico | Seis etapas fixas (`plan`, `kickoff`, `sigaa`, `midterm`, `final`, `closing`) | **Backend:** criar `ProjectMilestone` com data prevista, data de realização e nota de cada etapa. O estado do projeto passa a ser calculado a partir delas. |
| **Plano SIGAA e carga horária** | `ProposalSection` e `Workload` | `PlanSection` e `WorkloadRow` | **Compatível:** mapeamento direto. |

---

## 6. Roteiro

| Fase | O que | Status |
| --- | --- | --- |
| 1 | Documentar o plano | Feito |
| 2 | Renomear os arquivos de `src/` para camelCase | Feito |
| 3 | Aplicar o padrão de pastas em todas as features | Feito |
| 4 | Reestruturar `projects` em `list/`, `workspace/` e `shared/` | Feito |
| 5 | Validar com `npm run build` e `npm run lint` | Feito |
| 6 | Alinhar os tipos com o backend (seção 5) | A fazer, junto com o time da API |

# Aperta o PLEI · Portal do Docente

Front-end do portal docente do **Aperta o PLEI** (L.E.I. · CIn/UFPE): demandas reais de organizações externas chegam ligadas às disciplinas do docente, com a proposta de registro no SIGAA quase pronta.

A implementação segue o protótipo do Claude Design (`Entrada`, `Onboarding de Prática` e `Portal do Docente`) e o Design System Aperta o PLEI v1.0.

## Como rodar

```bash
npm install
cp .env.development.example .env.development
npm run dev
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento do Vite |
| `npm run build` | Typecheck (`tsc -b`) + build de produção |
| `npm run lint` | Oxlint |

Para entrar, escolha **Sou professor** e use qualquer e-mail `@ufpe.br` ou `@cin.ufpe.br` com qualquer senha. E-mails que começam com `paola` simulam a conta com dois papéis (docente e coordenação).

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, React Hook Form e Zod.

## Arquitetura

```
src/
├── components/
│   ├── ui/          # Primitivos sem regra de negócio (Button, Tag, SelectMenu, SidePanel…)
│   ├── feedback/    # Toast e estados de carregamento/erro de query
│   └── practice/    # Listas de prática, compartilhadas por perfil e disciplina
├── features/        # Uma pasta por domínio
│   └── <feature>/
│       ├── api/         # Contrato com o backend (hoje responde pelo mock)
│       ├── hooks/       # Queries e mutations do React Query
│       ├── components/  # Componentes do domínio
│       ├── pages/       # Telas ligadas às rotas
│       ├── utils/       # Regras puras (filtros, apresentação, cálculos)
│       └── types/
├── layouts/portal/  # Sidebar, cabeçalho, faixa do semestre
├── mocks/           # Backend simulado: seed, banco em memória e handlers
├── routes/          # Rotas, caminhos (paths.ts) e guarda de autenticação
├── hooks/ utils/ types/  # Compartilhados entre features
└── index.css        # Tokens do Design System no @theme do Tailwind
```

| Feature | Telas |
| --- | --- |
| `auth` | Entrada: escolha de portal, login e escolha de área |
| `matchmaking` | Cardápio de demandas, detalhe, explicação do casamento, leitura automática e vínculo à disciplina |
| `applications` | Minhas propostas (reservas ativas, liberadas e expiradas) |
| `proposals` | Rascunhos de projeto e editor da proposta para o SIGAA |
| `projects` | Meus projetos (em execução e concluídos) e detalhe com equipes, andamento, horas e rascunho |
| `disciplines` | Minhas disciplinas, cadastro e detalhe (visão, prática, projetos e demandas compatíveis) |
| `organizations` | Organizações parceiras e detalhe |
| `notifications` | Popover do cabeçalho e central de notificações com preferências |
| `profile` | Onboarding de prática e Meu perfil (dados, prática e histórico) |
| `semester` | Contexto do semestre usado pela faixa do portal |

### Regras que valem para o projeto todo

- **Páginas só falam com hooks.** Uma página nunca importa `mocks/` nem `lib/api-client` diretamente.
- **Features podem usar hooks e componentes de outra feature**, mas nunca os handlers do mock nem o estado interno dela.
- **Regra de negócio fica em funções puras** em `utils/`, como `filterDemands`, `silentWeeks` e `rankDisciplines`. Isso deixa os componentes finos e as regras testáveis.
- **Cor, fonte e movimento vêm dos tokens** do `index.css`. Não use hex solto nos componentes.
- **URLs só em `routes/paths.ts`.**
- **Comentários explicam o porquê**, não o que o código já diz.

## Backend simulado e integração com a API

Ainda não existe backend, então `src/mocks` faz esse papel. O `db.ts` guarda o estado em memória, semeado com as demandas reais do kit de prototipação. Os `handlers/` aplicam as regras e o `mockRequest` simula a latência de uma chamada HTTP. Recarregar a página volta ao cenário de demonstração.

Para integrar a API real, basta trocar o corpo das funções em `features/*/api/*.ts`. Hooks, páginas e componentes não mudam:

```ts
// antes
export const getDemands = () => mockRequest(() => server.listDemands());
// depois
export const getDemands = () => api.get<Demand[]>('/demands').then((response) => response.data);
```

## O que ainda depende de decisão

- O **portal da Coordenação** ainda não foi desenhado. Por enquanto, a escolha de área leva ao portal docente.
- O **alternador de papel** na sidebar, sugerido no kit, está desligado no protótipo e ficou fora.
- O **cálculo de compatibilidade** é de demonstração: os percentuais da segunda disciplina são derivados da primeira até o modelo real existir.

# Aperta o PLEI · Portal do Docente

Organizações de fora da UFPE publicam problemas reais. O docente do CIn leva um deles para uma disciplina que está lecionando, e a turma resolve o problema com a organização dentro do semestre.

**Antes de mudar qualquer tela, leia [`docs/fluxos.md`](docs/fluxos.md).** Ele é a especificação do produto: os três objetos, as seis etapas do projeto, as regras de negócio e as regras de design.

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

Para entrar, use qualquer e-mail `@ufpe.br` ou `@cin.ufpe.br` com qualquer senha.

## O produto em uma tela

| Item | Pergunta que responde |
| --- | --- |
| Início | O que eu preciso fazer hoje? |
| Cardápio | Que problema a minha turma pode resolver? |
| Projetos | Em que pé estão os meus projetos? |
| Disciplinas | Quais turmas podem receber projeto? |
| Organizações | Com quem eu vou trabalhar? |
| Como funciona | Tutorial dentro do portal |

No cardápio, o docente reserva uma demanda por 7 dias enquanto decide e depois a leva para uma disciplina. Todo projeto passa pelas mesmas seis etapas: revisar o plano, reunião de abertura, registro no SIGAA, entrega parcial, entrega final e encerramento. O estado do projeto (planejamento, em andamento, concluído) é calculado a partir delas.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, React Hook Form e Zod.

## Arquitetura

```
src/
├── domain/          # Entidades e regras puras, sem React: calendário, reserva, compatibilidade, ciclo do projeto
├── components/
│   ├── ui/          # Primitivos visuais sem regra de negócio (Page, ItemList, ActionMenu, UnderlineTabs, Modal…)
│   └── feedback/    # Aviso (toast) e estados de carregamento e erro
├── features/        # Uma pasta por área do portal
│   └── <feature>/
│       ├── *Page.tsx    # Telas ligadas às rotas, na raiz
│       ├── use*.ts      # Hook primário: queries e mutations do React Query
│       ├── *Api.ts      # Contrato com o backend (hoje responde pelo mock)
│       ├── types.ts
│       ├── components/  # Componentes da feature
│       └── utils/       # Apresentação: textos, rótulos e agrupamentos
├── layouts/         # Barra lateral e casca do portal
├── mocks/           # Backend simulado: seed, banco em memória e handlers
├── routes/          # Rotas, caminhos (paths.ts) e guarda de autenticação
├── lib/             # Cliente HTTP e chaves do React Query
└── index.css        # Tokens visuais no @theme do Tailwind
```

| Feature | Telas |
| --- | --- |
| `home` | Início: próximos passos e demandas sugeridas |
| `demands` | Cardápio, detalhe com a reserva e a janela "Levar para uma disciplina" |
| `projects` | `list/` (lista de projetos), `workspace/` (próximo passo, etapas, plano e organização) e `shared/` (o que outras telas usam) |
| `disciplines` | Disciplinas, cadastro e detalhe com as demandas que combinam |
| `organizations` | Organizações e detalhe com contato e histórico |
| `guide` | Como funciona |
| `account`, `auth`, `calendar` | Conta, entrada e calendário do semestre |

### Regras que valem para o projeto todo

- **Regra de negócio mora em `src/domain`.** O backend simulado e as telas usam as mesmas funções, então a regra não se repete nem diverge.
- **Páginas só falam com hooks.** Uma página nunca importa `mocks/` nem `lib/api-client` diretamente.
- **Features podem usar hooks e componentes de outra feature**, mas nunca os handlers do mock. Em `projects`, o que é usado de fora fica em `projects/shared/`.
- **Padrão de pastas:** página, hook primário, API e tipos na raiz da feature; subpasta só para `components/`, `utils/` e hooks auxiliares. Detalhes em [`docs/plano-reestruturacao-frontend.md`](docs/plano-reestruturacao-frontend.md).
- **Taxonomia de elementos:** rótulo estático e estado (livre, reservada, combina, cabe no semestre) são `Tag`, com `tone` suave dos tokens, link de texto usa `textLinkClassName`, ação é `Button` (ou `buttonClassName` num `Link`) e menu de ações é `ActionMenu`. Contagem é texto puro, nunca pílula. Detalhes na seção 7 do [`docs/fluxos.md`](docs/fluxos.md).
- **Listas usam `ItemList` e `Item`:** âncora de 40px, até três linhas e linha inteira clicável. Link ou botão dentro do item leva `aboveRowLink`.
- **Datas só com `formatShortDate`** ("21 ago 2026").
- **Cor, fonte, raio e movimento vêm dos tokens** do `index.css`. Não use hex solto nos componentes.
- **URLs só em `routes/paths.ts`, chaves de cache só em `lib/queryKeys.ts`.**
- **Arquivos em camelCase** (`projectPage.tsx`, `useProjects.ts`, `demandPresentation.ts`).
- **Comentários explicam o porquê**, não o que o código já diz.
- **Texto de interface sem travessão e sem emoji**, na linguagem da sala de aula ("levar para a disciplina", não "vincular demanda").

## Backend simulado e integração com a API

Ainda não existe backend, então `src/mocks` faz esse papel. O `db.ts` guarda o estado em memória, semeado com as demandas reais do L.E.I. Os `handlers/` aplicam as regras de negócio e o `mockRequest` simula a latência de uma chamada HTTP. Recarregar a página volta ao cenário de demonstração, com a data fixa em 24 de agosto de 2026.

Para integrar a API real, basta trocar o corpo das funções nos arquivos `*Api.ts` de cada feature. Hooks, páginas e componentes não mudam:

```ts
// antes
export const getMenu = () => mockRequest(() => server.listMenu());
// depois
export const getMenu = () => api.get<Demand[]>('/menu').then((response) => response.data);
```

## O que ainda depende de decisão

- **Propor um projeto a uma organização**, sem partir de uma demanda do cardápio, ainda não tem fluxo. Por isso a página da organização não tem esse botão.
- **Ementa, carga horária e nível da disciplina**, e as ações de duplicar, pausar e arquivar disciplina, dependem do modelo `Course` da API (seção 5 do plano de reestruturação).
- O **portal das organizações** (publicar demanda, acompanhar o projeto) ainda não foi desenhado.
- O **plano gerado** vem pronto do seed. Na versão real ele sai de um modelo de linguagem alimentado pela demanda e pela disciplina.
- O **prazo de vinculação** e o calendário do semestre precisam vir do calendário acadêmico oficial.

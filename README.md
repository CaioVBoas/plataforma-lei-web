# PLEI · Portal público, portal do docente e portal da organização

Organizações de fora da UFPE submetem problemas reais. O L.E.I. faz a triagem e as demandas aprovadas entram no cardápio. O docente do CIn leva uma delas para uma disciplina que está lecionando, e a turma resolve o problema com a organização dentro do semestre.

**Antes de mudar qualquer tela, leia [`docs/fluxos.md`](docs/fluxos.md).** O inventário do que está pronto e do que falta está em [`docs/requisitos.md`](docs/requisitos.md). Ele é a especificação do produto: os três objetos, as seis etapas do projeto, as regras de negócio e as regras de design.

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

A página inicial (`/`) é o portal público do L.E.I. Para entrar como docente, use qualquer e-mail `@ufpe.br` ou `@cin.ufpe.br` com qualquer senha, ou crie uma conta em **Criar conta**. Para entrar como organização, escolha **Organização** na entrada e use qualquer e-mail e senha: a demonstração abre a conta do Hospital das Clínicas. Em **Criar conta** dá para cadastrar uma organização nova. O estudante aparece como "em breve".

## O produto em uma tela

| Item | Pergunta que responde |
| --- | --- |
| Portal público (`/`) | O que é o L.E.I. e como eu participo? |
| Início | O que eu preciso fazer hoje? |
| Avisos (sino da barra superior) | O que mudou e o que pede decisão minha? |
| Cardápio | Que problema a minha turma pode resolver? |
| Projetos | Em que pé estão os meus projetos? |
| Disciplinas | Quais turmas podem receber projeto? |
| Organizações | Com quem eu vou trabalhar? |
| Como funciona | Tutorial dentro do portal |
| Minha conta | Meus dados e minha foto |

**Portal da organização** (`/organizacao`):

| Item | Pergunta que responde |
| --- | --- |
| Início | O que pede minha atenção: ajuste do L.E.I., pergunta de docente, rascunho, etapa do projeto? |
| Avisos (sino) | O que mudou nas minhas demandas e projetos? |
| Demandas | Em que pé está cada pedido: em preparo, no cardápio, em projeto ou concluído? |
| Submeter demanda | Como conto o problema para uma turma do CIn? |
| Projetos | Que turma está trabalhando no meu problema e em que etapa? |
| Perfil da organização | O que os docentes leem sobre nós e quem é o ponto focal? |

No cardápio, o docente reserva uma demanda por 7 dias enquanto decide e depois a leva para uma disciplina. Todo projeto passa pelas mesmas seis etapas: revisar o plano, reunião de abertura, registro no SIGAA, entrega parcial, entrega final e encerramento. O estado do projeto (planejamento, em andamento, concluído) é calculado a partir delas.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, React Hook Form e Zod.

## Arquitetura

```
src/
├── domain/          # Entidades e regras puras, sem React: calendário, reserva, compatibilidade, ciclo do projeto
├── assets/brand/    # Logotipo oficial em SVG (horizontal, empilhado, centralizado, caixa alta e símbolo). Ver o README da pasta
├── assets/portal/   # Fotos do portal público, do Início e da entrada, com origem e crédito no README
├── assets/covers/   # Capas de organizações e demandas, pelo id; crédito em lib/covers.ts
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
├── layouts/         # Casca dos portais (portalLayout) e a configuração de cada perfil (teacherLayout, orgLayout)
├── mocks/           # Backend simulado: seed, banco em memória e handlers
├── routes/          # Rotas, caminhos (paths.ts) e guarda de autenticação
├── lib/             # Cliente HTTP, chaves do React Query e capas (covers.ts)
└── index.css        # Tokens visuais no @theme do Tailwind
```

| Feature | Telas |
| --- | --- |
| `home` | Início: próximos passos e demandas sugeridas |
| `demands` | Cardápio, detalhe com a reserva e a janela "Levar para uma disciplina" |
| `projects` | `list/` (lista de projetos), `workspace/` (próximo passo, etapas, plano e organização) e `shared/` (o que outras telas usam) |
| `disciplines` | Disciplinas, cadastro e detalhe com as demandas que combinam |
| `organizations` | Organizações e detalhe com contato e histórico |
| `landing` | Portal público: abertura com fotos, perfis, boas-vindas, carrossel e como funciona |
| `notifications` | Sino e página de avisos, derivados do cardápio, dos projetos e do calendário |
| `orgPortal` | Portal da organização: Início, demandas (lista, detalhe com perguntas e formulário de envio em quatro etapas), projetos, perfil e avisos |
| `guide` | Como funciona |
| `account`, `auth`, `calendar` | Conta com foto, entrada e cadastro por perfil (docente e organização), calendário do semestre |

### Regras que valem para o projeto todo

- **Regra de negócio mora em `src/domain`.** O backend simulado e as telas usam as mesmas funções, então a regra não se repete nem diverge.
- **Páginas só falam com hooks.** Uma página nunca importa `mocks/` nem `lib/api-client` diretamente.
- **Features podem usar hooks e componentes de outra feature**, mas nunca os handlers do mock. Em `projects`, o que é usado de fora fica em `projects/shared/`.
- **Padrão de pastas:** página, hook primário, API e tipos na raiz da feature; subpasta só para `components/`, `utils/` e hooks auxiliares. Detalhes em [`docs/plano-reestruturacao-frontend.md`](docs/plano-reestruturacao-frontend.md).
- **Taxonomia de elementos:** rótulo estático e estado (livre, reservada, combina, cabe no semestre) são `Tag`, com `tone` suave dos tokens, link de texto usa `textLinkClassName`, ação é `Button` (ou `buttonClassName` num `Link`) e menu de ações é `ActionMenu`. Contagem é texto puro, nunca pílula. Detalhes na seção 7 do [`docs/fluxos.md`](docs/fluxos.md).
- **Listas usam `ItemList` e `Item`:** âncora de 40px, até três linhas e linha inteira clicável. Link ou botão dentro do item leva `aboveRowLink`.
- **Datas só com `formatShortDate`** ("21 ago 2026").
- **Fotos com licença que exige crédito** levam o crédito junto da foto (`PhotoCreditLine`). Fotos esperando crédito ou autorização ficam em `image/pendentes`, fora do código.
- **Marca:** use só os SVGs de `src/assets/brand` pelo componente `BrandMark`; o favicon é o símbolo `petroleo-600`.
- **Identidade visual:** Verde Petróleo (`brand`, `fact`, `monogram`, `nav-active`) para identidade, Azul Tecnológico (`accent`) para ação e Laranja Social (`reserve`) só na reserva. Regras 13 a 16 da seção 7 do `docs/fluxos.md`.
- **Cor, fonte, raio e movimento vêm dos tokens** do `index.css`. Não use hex solto nos componentes.
- **URLs só em `routes/paths.ts`, chaves de cache só em `lib/queryKeys.ts`.**
- **Arquivos em camelCase** (`projectPage.tsx`, `useProjects.ts`, `demandPresentation.ts`).
- **Comentários explicam o porquê**, não o que o código já diz.
- **Texto de interface sem travessão e sem emoji**, na linguagem da sala de aula ("levar para a disciplina", não "vincular demanda").

## Backend simulado e integração com a API

Ainda não existe backend, então `src/mocks` faz esse papel. O `db.ts` guarda o estado em memória, semeado com as demandas reais do L.E.I. Os `handlers/` aplicam as regras de negócio e o `mockRequest` simula a latência de uma chamada HTTP. Recarregar a página volta ao cenário de demonstração, com a data fixa em 24 de agosto de 2026. Como os dois portais leem o mesmo banco em memória, dá para responder uma pergunta como organização, sair e entrar como docente (sem recarregar) para ver a resposta na demanda.

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
- A **triagem do L.E.I.** ainda não tem painel. A demanda enviada pela organização fica "Na triagem do L.E.I." e não chega sozinha ao cardápio; o pedido de ajuste e a aprovação vêm do seed. O matchmaking por IA entre demandas, docentes e disciplinas também fica de fora deste repositório.
- O **portal dos estudantes** (participar da turma, contar horas) ainda não foi desenhado; entrada e cadastro mostram esse perfil como "em breve".
- O **plano gerado** vem pronto do seed. Na versão real ele sai de um modelo de linguagem alimentado pela demanda e pela disciplina.
- O **prazo de vinculação** e o calendário do semestre precisam vir do calendário acadêmico oficial.

# Fluxos do Portal do Docente

Este documento é a especificação do produto. Se uma tela contradiz o que está aqui, a tela está errada.

## 1. O que a plataforma faz

Organizações de fora da UFPE (órgãos públicos, organizações sociais, coletivos) publicam **demandas**: problemas reais que precisam de solução. O L.E.I. faz a triagem e as demandas aprovadas entram no **cardápio**. Um docente do CIn escolhe uma demanda e a leva para uma **disciplina** que está lecionando. A turma resolve o problema com a organização **dentro do semestre da disciplina**.

Não é um projeto de extensão comum, com edital, bolsista e prazo próprio. O projeto vive no calendário da disciplina: começa quando a turma começa e termina quando a turma termina.

Referências de mercado que usam o mesmo modelo: [Riipen](https://help.riipen.com/en/articles/7339520-matching-your-experience-with-projects), em que o parceiro publica o projeto e o docente o encaixa no curso, e [EPICS](https://engineering.purdue.edu/EPICS), em que o escopo é definido com o parceiro nas primeiras semanas e aceito por ele antes da execução.

## 2. Três objetos, uma linha do tempo

A versão anterior tinha cinco objetos com ciclos próprios: demanda, reserva, proposta, projeto e prática. O docente precisava entender como um virava o outro. Agora são três, e só um deles tem ciclo de vida.

| Objeto | O que é | Estados |
| --- | --- | --- |
| **Demanda** | Problema publicado por uma organização | Aberta (no cardápio) ou Em projeto (fora do cardápio) |
| **Disciplina** | Turma que o docente leciona no semestre | Tem vagas ou Sem vagas |
| **Projeto** | Uma demanda levada para uma disciplina | Planejamento, Em andamento, Concluído |

A reserva deixou de existir. O docente não precisa "segurar" uma demanda antes de decidir: levar para a disciplina já é a decisão, e desistir continua possível durante o planejamento.

A proposta deixou de ser uma tela separada. Ela virou o **plano do projeto**, que já nasce escrito e é revisado dentro do próprio projeto.

## 3. As seis etapas do projeto

Todo projeto tem as mesmas seis etapas, na mesma ordem. O estado do projeto é **calculado** a partir delas e nunca é guardado separadamente.

| # | Etapa | O que o docente faz | Prazo padrão |
| --- | --- | --- | --- |
| 1 | Revisar o plano | Lê o plano gerado a partir da demanda, ajusta e confirma | 7 dias depois de levar a demanda |
| 2 | Reunião de abertura | Encontra a organização, combina escopo, calendário e sigilo | 14 dias depois de levar a demanda |
| 3 | Registro no SIGAA | Copia o plano para o SIGAA e informa a data do registro | Prazo de vinculação do semestre |
| 4 | Entrega parcial | Registra a entrega parcial e como a organização recebeu | Meio do semestre |
| 5 | Entrega final | Registra a entrega final | Última semana de aula |
| 6 | Encerramento | Escreve em duas linhas o resultado e se a organização usa o que foi entregue | Fim do semestre |

- Registro no SIGAA ainda não feito: **Planejamento**.
- Registro no SIGAA feito e encerramento pendente: **Em andamento**.
- Encerramento feito: **Concluído**.

Só a próxima etapa pendente tem ação. As outras mostram a data prevista ou a data em que foram feitas. Uma etapa com prazo vencido aparece como **atrasada**, sem bloquear nada.

## 4. Regras de negócio

1. **Uma demanda, um projeto.** Ao ser levada para uma disciplina, a demanda sai do cardápio de todo mundo.
2. **Só disciplinas do semestre atual com vaga** recebem demandas. Cada disciplina define quantos projetos comporta.
3. **Existe prazo de vinculação.** Depois do prazo do semestre, nenhuma demanda nova entra em disciplina deste semestre.
4. **O contato da organização só aparece depois** que a demanda vira projeto. Antes disso, o docente vê quem é a organização e como ela trabalha, mas não o e-mail ou o telefone.
5. **Desistir só no planejamento.** Enquanto o registro no SIGAA não foi feito, o docente pode desistir e a demanda volta para o cardápio. Depois do registro, o compromisso é institucional.
6. **O plano fica travado depois do registro no SIGAA**, porque passa a ser o texto oficial.
7. **A compatibilidade é contada, não estimada.** Uma demanda combina com uma disciplina quando a disciplina trabalha pelo menos metade das competências que a demanda pede. A tela mostra quais combinam e quais faltam, sem percentual inventado.
8. **O resultado volta para a organização.** O texto do encerramento aparece no histórico da organização, para o próximo docente saber o que já foi feito.
9. **A plataforma não acessa o SIGAA.** Ela entrega o texto pronto e guarda a data que o docente informou.

## 5. Navegação

| Item | Para quê | Pergunta que responde |
| --- | --- | --- |
| **Início** | O que fazer agora | "O que eu preciso fazer hoje?" |
| **Demandas** | Escolher uma demanda | "Que problema a minha turma pode resolver?" |
| **Projetos** | Acompanhar as etapas | "Em que pé estão os meus projetos?" |
| **Disciplinas** | Dizer o que cada turma sabe fazer | "Quais turmas podem receber projeto?" |
| **Organizações** | Conhecer os parceiros | "Com quem eu vou trabalhar?" |
| **Como funciona** | Tutorial | "Como isso funciona?" |

A conta fica no rodapé da barra lateral, com Minha conta e Sair.

## 6. Fluxos

### F1. Levar uma demanda para a disciplina

1. **Demandas.** O filtro começa em "Para minhas disciplinas". Cada linha mostra a organização, o problema, com qual disciplina combina e se cabe num semestre.
2. **Detalhe da demanda.** Aparecem o problema, o que a organização oferece (ponto focal, frequência de reunião, visita) e as competências pedidas, com a indicação de quais cada disciplina cobre. Existe uma única ação primária: **Levar para uma disciplina**.
3. **Janela de confirmação.** O docente escolhe a disciplina (a que mais combina já vem marcada) e o número de equipes. A janela diz o que acontece em seguida. Se não houver disciplina cadastrada, o cadastro acontece ali mesmo.
4. **Projeto criado.** O docente cai no projeto, na etapa 1, com o plano pronto para revisar.

### F2. Planejar

Plano confirmado, reunião de abertura registrada e registro no SIGAA com a data. Cada etapa é um botão no card "Próximo passo" do projeto e também aparece no Início.

### F3. Executar e encerrar

Entrega parcial, entrega final e encerramento. O encerramento pede o resultado e se a organização usa a entrega. O projeto vai para Concluídos e o resultado entra no histórico da organização.

### F4. Primeiro acesso

O docente entra com o e-mail institucional. O Início mostra um convite para o tutorial e, se não houver disciplina cadastrada, pede isso antes de qualquer outra coisa.

## 7. Regras de design

1. **Uma pergunta por tela, uma ação primária por tela.**
2. **O próximo passo está sempre visível**, no Início e no topo do projeto.
3. **Nada que não funcione.** Se a ação não existe, o controle não aparece.
4. **Estado calculado, não guardado.** O estado do projeto, as vagas e a compatibilidade saem das regras em `src/domain`.
5. **Linguagem da sala de aula**, não do sistema: "levar para a disciplina", e não "vincular demanda".
6. **Visual sóbrio.** Tipografia do sistema, cantos de 6 a 10px, cinzas neutros, um único azul de ação e cores de estado dessaturadas. Nada de gradiente, emoji ou roxo.

## 8. O que saiu e por quê

| Saiu | Motivo |
| --- | --- |
| Reserva de demanda, com prazo e expiração | Criava um estado intermediário que não gerava nada. Levar para a disciplina já é a decisão, e desistir no planejamento cobre o arrependimento |
| Propostas como seção própria | Separava o texto do projeto do próprio projeto. O plano agora é uma aba do projeto |
| Perfil de prática, leitura automática e onboarding de prática | Três lugares para calibrar uma sugestão que era percentual inventado. A compatibilidade agora vem das competências da disciplina, que o docente edita em um só lugar |
| Registro semanal de andamento e horas | Controle que a disciplina já faz. O projeto acompanha só os marcos que importam para a organização |
| Central de notificações | O Início já responde "o que mudou e o que fazer" |
| Escolha de portal e de área na entrada | O portal é do docente. Organizações têm um aviso na entrada |

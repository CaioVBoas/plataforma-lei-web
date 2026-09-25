# Fluxos do Portal do Docente

Este documento é a especificação do produto. Se uma tela contradiz o que está aqui, a tela está errada.

## 1. O que a plataforma faz

Organizações de fora da UFPE (órgãos públicos, organizações sociais, coletivos) publicam **demandas**: problemas reais que precisam de solução. O L.E.I. faz a triagem e as demandas aprovadas entram no **cardápio**. Um docente do CIn escolhe uma demanda e a leva para uma **disciplina** que está lecionando. A turma resolve o problema com a organização **dentro do semestre da disciplina**.

Não é um projeto de extensão comum, com edital, bolsista e prazo próprio. O projeto vive no calendário da disciplina: começa quando a turma começa e termina quando a turma termina.

Referências de mercado que usam o mesmo modelo: [Riipen](https://help.riipen.com/en/articles/7339520-matching-your-experience-with-projects), em que o parceiro publica o projeto e o docente o encaixa no curso, e [EPICS](https://engineering.purdue.edu/EPICS), em que o escopo é definido com o parceiro nas primeiras semanas e aceito por ele antes da execução.

## 2. Três objetos, uma linha do tempo

A versão anterior tinha cinco objetos com ciclos próprios: demanda, reserva, proposta, projeto e prática. O docente precisava entender como um virava o outro. Agora são três. A reserva continua, mas como um estado da demanda, não como um objeto com tela própria.

| Objeto | O que é | Estados |
| --- | --- | --- |
| **Demanda** | Problema publicado por uma organização | Livre, Reservada (por você ou por um colega) ou Em projeto |
| **Disciplina** | Turma que o docente leciona no semestre | Tem vagas ou Sem vagas |
| **Projeto** | Uma demanda levada para uma disciplina | Planejamento, Em andamento, Concluído |

```
            reservar (7 dias)                 levar para a disciplina
  Livre ───────────────────▶ Reservada ─────────────────────────▶ Em projeto
    ▲  ◀──────────────────────  │                                     │
    │     liberar ou expirar                                          │
    └──────────────── desistir antes do registro no SIGAA ◀───────────┘
```

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

1. **Reservar antes de levar.** A reserva guarda a demanda por 7 dias enquanto o docente decide, e ninguém mais consegue levá-la nesse tempo. Cada docente tem até 3 reservas ativas. Liberar é um clique; vencida, a reserva expira sozinha e a demanda volta a ficar livre.
2. **Reserva de colega é visível.** A demanda reservada por outro docente continua no cardápio, com o nome de quem reservou e a data de fim. Quem quiser pode pedir aviso para quando ela voltar a ficar livre.
3. **Uma demanda, um projeto.** Ao ser levada para uma disciplina, a demanda sai do cardápio de todo mundo.
4. **Só disciplinas do semestre atual com vaga** recebem demandas. Cada disciplina define quantos projetos comporta.
5. **Existe prazo de vinculação.** Depois do prazo do semestre, nenhuma demanda nova entra em disciplina deste semestre.
6. **O contato da organização só aparece depois** que a demanda vira projeto. Antes disso, o docente vê quem é a organização e como ela trabalha, mas não o e-mail ou o telefone.
7. **Desistir só no planejamento.** Enquanto o registro no SIGAA não foi feito, o docente pode desistir e a demanda volta a ficar livre no cardápio. Depois do registro, o compromisso é institucional.
8. **O plano fica travado depois do registro no SIGAA**, porque passa a ser o texto oficial.
9. **A compatibilidade é contada, não estimada.** Uma demanda combina com uma disciplina quando a disciplina trabalha pelo menos metade das competências que a demanda pede **e** a demanda não pede mais do que a altura do curso em que a turma está (início, meio ou fim do curso). A tela mostra quais competências combinam, quais faltam e se a demanda está acima do nível, sem percentual inventado. Turma abaixo do nível pedido não recebe a demanda.
10. **O resultado volta para a organização.** O texto do encerramento aparece no histórico da organização, para o próximo docente saber o que já foi feito.
11. **A plataforma não acessa o SIGAA.** Ela entrega o texto pronto e guarda a data que o docente informou. O certificado de horas dos estudantes sai da aprovação do relatório final pela PROExC; o encerramento lembra disso e entrega o resultado pronto para copiar.
12. **Dúvida vai pela demanda.** Antes de decidir, o docente pergunta à organização na própria demanda. Nesta versão o L.E.I. repassa; pergunta e resposta ficam registradas para os próximos docentes.
13. **Disciplina pode ter mais de um docente.** O colega entra pelo e-mail institucional e vê e edita os mesmos projetos. Só a disciplina do semestre atual aceita convite.
14. **A expectativa é dita no começo.** A demanda mostra o que um semestre entrega (pesquisa com usuários, protótipo ou prova de conceito) e o que pesa na rotina da turma (presencial, dados sensíveis, sigilo). A reunião de abertura lembra de combinar isso com a organização.

## 5. Navegação

| Item | Para quê | Pergunta que responde |
| --- | --- | --- |
| **Início** | O que fazer agora: reservas a decidir e etapas dos projetos | "O que eu preciso fazer hoje?" |
| **Cardápio** | Escolher e reservar uma demanda | "Que problema a minha turma pode resolver?" |
| **Projetos** | Acompanhar as etapas | "Em que pé estão os meus projetos?" |
| **Disciplinas** | Dizer o que cada turma sabe fazer | "Quais turmas podem receber projeto?" |
| **Organizações** | Conhecer os parceiros | "Com quem eu vou trabalhar?" |
| **Como funciona** | Tutorial | "Como isso funciona?" |

A conta fica no rodapé da barra lateral, com Minha conta e Sair. O único contador da navegação fica no Início e soma reservas abertas e etapas com prazo nos próximos 14 dias.

## 6. Fluxos

### F1. Do cardápio à disciplina

1. **Cardápio.** O filtro começa em "Para minhas turmas", e há também "Minhas reservas" e "Todas". Cada cartão mostra a organização, o problema, as competências (as que a turma cobre vêm marcadas), com qual disciplina combina, se cabe num semestre e, em laranja, a reserva.
2. **Detalhe da demanda.** Aparecem o problema, o que a organização oferece, as competências com a cobertura de cada disciplina, se cabe na turma (semestre e altura do curso) e o que um semestre entrega, as condições que pesam na rotina, **Para se inspirar**, com soluções parecidas que já existem, e as **perguntas à organização**, com as respostas já dadas. A coluna da decisão tem uma única ação primária, que muda com o estado:
   - Livre: **Reservar por 7 dias**.
   - Reservada por você: **Levar para uma disciplina**, com "Liberar reserva" como ação secundária.
   - Reservada por colega: **Avise-me se liberar**.
   - Já é projeto seu: **Abrir projeto**.
3. **Janela de confirmação.** O docente escolhe a disciplina (a que mais combina já vem marcada) e o número de equipes. A janela diz o que acontece em seguida. Se não houver disciplina cadastrada, o cadastro acontece ali mesmo.
4. **Projeto criado.** O docente cai no projeto, na etapa 1, com o plano pronto para revisar.

### F2. Planejar

Plano confirmado, reunião de abertura registrada e registro no SIGAA com a data. Cada etapa é um botão no card "Próximo passo" do projeto e também aparece no Início.

### F3. Executar e encerrar

Entrega parcial, entrega final e encerramento. O encerramento pede o resultado e se a organização usa a entrega. O projeto vai para Concluídos e o resultado entra no histórico da organização.

### F4. Primeiro acesso

O docente entra com o e-mail institucional. O Início mostra um convite para o tutorial e, se não houver disciplina cadastrada, pede isso antes de qualquer outra coisa.

### F5. Reserva a decidir

Toda reserva ativa aparece nos Próximos passos do Início como "Decidir a reserva", com os dias restantes em laranja. Dali o docente volta ao detalhe da demanda e leva para a disciplina ou libera.

### F6. Chegar por indicação do L.E.I.

O L.E.I. escreve para o docente que tem perfil para uma demanda, com um link direto para ela. Sem sessão, o docente entra e volta para a demanda. O topo da demanda diz quem indicou, a mensagem e, em três linhas, o que é extensão na disciplina. A indicação também aparece no Início como "Avaliar a indicação do L.E.I." e no cartão do cardápio, até o docente reservar.

### F7. Dividir a disciplina

Na página da disciplina, a seção Docentes mostra quem divide a turma. O docente convida o colega pelo e-mail institucional; os dois veem e editam os mesmos projetos, e o projeto mostra "Coordenação compartilhada com".

## 7. Regras de design

1. **Uma pergunta por tela, uma ação primária por tela.**
2. **O próximo passo está sempre visível**, no Início e no topo do projeto.
3. **Nada que não funcione.** Se a ação não existe, o controle não aparece.
4. **Estado calculado, não guardado.** O estado do projeto, as vagas e a compatibilidade saem das regras em `src/domain`.
5. **Linguagem da sala de aula**, não do sistema: "levar para a disciplina", e não "vincular demanda".
6. **Cada elemento tem uma aparência só.** Rótulo estático (tipo, competência) é texto sobre fundo cinza claro, sem borda. Contagem é texto puro, apagada quando é zero. Link é texto azul, sublinhado só no hover. Só botão tem borda (secundário) ou preenchimento (primário), e um menu de ações é sempre o kebab de 32px. Nenhuma ação aparece só no hover.
7. **Listas com âncora e item inteiro clicável.** Todo item de lista tem uma âncora de 40px à esquerda (monograma, código ou ícone), no máximo três linhas de conteúdo e a linha inteira como área de clique.
8. **Uma data só: "21 ago 2026".** Tempo relativo ("em 7 dias", "há 9 dias") entra só como complemento, nunca no lugar da data.
9. **Visual sóbrio com identidade própria.** Tipografia do sistema, cantos de 6 a 10px e cinzas neutros. A identidade vem do Design System Aperta o PLEI: o Azul Tecnológico nas ações e o Laranja Social usado só na reserva. Nada de gradiente, emoji ou roxo.

## 8. O que nos faz únicos

Plataformas parecidas conectam empresa e curso. O Aperta o PLEI tem quatro coisas que elas não têm, e que a interface precisa deixar à vista:

1. **O cardápio.** Demandas reais de organizações sociais e órgãos públicos de Pernambuco, já triadas pelo L.E.I., e não vagas genéricas de empresa.
2. **A reserva.** O docente guarda uma demanda enquanto pensa, e o cardápio mostra quem está avaliando o quê. É um gesto de cuidado com o colega e com a organização.
3. **O plano pronto para o SIGAA.** A plataforma escreve o texto institucional; o docente revisa.
4. **A memória da parceria.** O resultado de cada projeto fica no histórico da organização, e as referências "Para se inspirar" evitam que a turma comece do zero.

## 9. O que saiu e por quê

| Saiu | Motivo |
| --- | --- |
| Página própria de reservas, com abas de liberadas e expiradas | A reserva virou um estado da demanda: aparece no cartão do cardápio, no filtro "Minhas reservas" e nos Próximos passos do Início |
| Propostas como seção própria | Separava o texto do projeto do próprio projeto. O plano agora é uma aba do projeto |
| Perfil de prática, leitura automática e onboarding de prática | Três lugares para calibrar uma sugestão que era percentual inventado. A compatibilidade agora vem das competências da disciplina, que o docente edita em um só lugar |
| Registro semanal de andamento e horas | Controle que a disciplina já faz. O projeto acompanha só os marcos que importam para a organização |
| Central de notificações | O Início já responde "o que mudou e o que fazer" |
| Escolha de portal e de área na entrada | O portal é do docente. Organizações têm um aviso na entrada |
| Participantes e horas por estudante no projeto | A primeira versão vai até a proposta do projeto (orientação do Prof. Cristiano). Horas por pessoa dependem de os estudantes escolherem o projeto, que é o fluxo do estudante |
| Recusar demanda ("Não tenho interesse") | Decisão da equipe: a demanda simplesmente não é reservada |

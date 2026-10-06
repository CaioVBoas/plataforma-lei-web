# Fluxos do PLEI: portal do docente e portal da organização

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
9. **A compatibilidade é contada, não estimada.** Uma demanda combina com uma disciplina quando a disciplina trabalha pelo menos metade das competências que a demanda pede **e** a demanda não pede mais do que a altura do curso em que a turma está (início, meio ou fim do curso). A tela mostra quais competências combinam, quais faltam e se a demanda está acima do nível, sem percentual inventado. Turma abaixo do nível pedido não recebe a demanda. Turma que cobre menos da metade das competências pode receber, mas a janela de levar avisa que a demanda não serve para ela e pede que o docente confirme: a decisão, e a responsabilidade, são dele.
10. **O resultado volta para a organização.** O texto do encerramento aparece no histórico da organização, para o próximo docente saber o que já foi feito.
11. **A plataforma não acessa o SIGAA.** Ela entrega o texto pronto e guarda a data que o docente informou. O certificado de horas dos estudantes sai da aprovação do relatório final pela PROExC; o encerramento lembra disso e entrega o resultado pronto para copiar.
12. **Dúvida vai pela demanda.** Antes de decidir, o docente pergunta à organização na própria demanda. A organização responde no portal dela; pergunta e resposta ficam registradas para os próximos docentes.
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
| **Minha conta** | Dados do docente | "Meus dados estão certos?" |

Avisos não fica na barra lateral: o sino da barra superior abre os mais recentes e leva à página Avisos. A barra lateral recolhe para só ícones (a escolha fica no navegador). A barra superior tem o sino de avisos e a conta, com Minha conta e Sair. O único contador do portal fica no sino e soma o que pede decisão: indicações do L.E.I., reservas abertas, demandas que liberaram para quem pediu aviso e etapas com prazo nos próximos 14 dias. Respostas das organizações aparecem como novidade, sem contar.

**Portal da organização.** Segue o desenho do portal do docente, tela a tela, pensado para quem tem pouca prática com computador: nada fica escondido em lista suspensa ou bloco que abre e fecha. Demandas abre na aba **Sua vez**, só com o que espera algo da organização (rascunho, ajuste pedido, pergunta de docente); as outras abas ficam à vista, com contagem, e uma frase embaixo explica o que aparece em cada uma. A busca procura em todas as demandas. Cada demanda é um cartão com o estado, um quadro "Agora:" em palavras simples e um botão grande com a ação (Continuar escrevendo, Ver o que mudar, Responder a pergunta, Ver a demanda, Acompanhar o projeto); em azul cheio quando a vez é da organização. No detalhe, o caminho da demanda vira cinco passos numerados com "Agora" no atual, e a coluna lateral "O que acontece agora" diz o momento, se é a vez de vocês, o que vem depois e o botão. Projetos também são cartões, com as seis etapas em traços e o próximo passo escrito; o detalhe diz se a etapa conta com a organização e traz o botão Escrever ao docente. Início (convite para o Como funciona até abrir ou dispensar, Próximos passos, a faixa de Submeter demanda e as demandas mais recentes), Demandas (abas Em preparo, No cardápio, Em projeto e Concluídas; projeto antigo cuja demanda saiu da plataforma aparece em Concluídas e abre o projeto) com busca, e Projetos (números de resumo, abas por estado e a mesma tabela do docente, com o docente no lugar da organização), com Como funciona e Perfil da organização no pé da barra. O detalhe da demanda abre como o do docente: organização em cima, capa, o caminho em cinco passos, mini cards acima das abas e a situação com o estado em tag na coluna ao lado. O detalhe do projeto também: estado e turma no subtítulo, capa, as seis etapas em segmentos, a faixa do próximo passo (ou do que ficou com vocês) e, ao lado, a turma e o docente. O Como funciona usa os mesmos blocos do docente, com o texto do lado da organização: o caminho da demanda em cinco passos (marcados pelo que as demandas dela já alcançaram), as seis etapas clicáveis, as regras em três colunas e as perguntas frequentes. Detalhe da demanda e do projeto abrem com a foto de capa, como no portal do docente. A ação principal é **Submeter demanda**. O sino soma o que pede decisão da organização: ajustes pedidos pelo L.E.I. e perguntas de docentes sem resposta; reserva de um docente e etapa com a organização chegando são novidades.

**Portal público.** Antes da plataforma, a página inicial (`/`) tem a abertura com fotos de Pernambuco passando (com o nome do lugar), uma faixa com a porta de cada perfil, boas-vindas com o logo sobre fundo neutro, o carrossel do que há na plataforma, o caminho em quatro passos (que acendem um de cada vez) e o rodapé. Entrada e cadastro têm só a foto da Rua da Aurora, o logo e uma frase no painel, com o crédito CC BY-SA no pé. As fotos e seus créditos ficam em `src/assets/portal` (ver o README de lá). Entrada e cadastro perguntam primeiro como a pessoa participa. Docente e organização têm portal; o estudante vê "em breve". O cadastro do docente pede nome, e-mail institucional, departamento e senha e já entra no Início. O da organização pede nome, tipo e local da organização, nome, cargo e e-mail de quem cuida das demandas (que vira o ponto focal) e senha, e já entra no Início da organização. Cada sessão guarda o perfil: rota de um portal com sessão do outro volta ao Início do próprio perfil.

## 6. Fluxos

### F1. Do cardápio à disciplina

1. **Cardápio.** O filtro começa em "Para minhas turmas", e há também "Minhas reservas" e "Todas". Cada cartão mostra a organização, o problema, a disciplina que mais combina com um medidor de quantas competências ela cobre, uma linha com semestre e condições (presencial, dados sensíveis, sigilo) e, no topo, o estado: reserva em laranja, indicação ou novidade em azul. As competências uma a uma ficam no detalhe.
2. **Detalhe da demanda.** No topo, mini cards com quem sente, reuniões, semestre e altura do curso. Abaixo, abas (Problema, Competências, Perguntas, Para se inspirar, Organização) com o problema, o que a organização oferece, as competências com a cobertura de cada disciplina, se cabe na turma (semestre e altura do curso) e o que um semestre entrega, as condições que pesam na rotina, **Para se inspirar**, com soluções parecidas que já existem, e as **perguntas à organização**, com as respostas já dadas. A coluna da decisão tem uma única ação primária, que muda com o estado:
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

### F8. A organização submete uma demanda

1. **Formulário em quatro etapas**, com a prévia do cartão do cardápio montada ao lado enquanto a organização escreve:
   - *O problema*: nome, o problema em uma frase, contexto e quem sente.
   - *O que a turma faz*: o que já ajudaria ao fim do semestre (com o aviso de que um semestre entrega pesquisa, protótipo ou prova de conceito), competências (opcionais: o L.E.I. completa) e o que pesa na rotina (presencial, dados sensíveis, sigilo).
   - *Como vocês trabalham*: ritmo das reuniões (com sugestões de um clique), o que oferecem à turma (pelo menos uma coisa) e referências para se inspirar (opcionais, até três).
   - *Revisar e enviar*: o texto como o docente vai ler, o que falta preencher e o que acontece depois do envio.
2. **Rascunho** pode ser salvo a qualquer momento, só com o nome. Só a organização vê. Rascunho pode ser excluído; o que já foi enviado, não.
3. **Enviar para a triagem** exige os campos obrigatórios (`missingForReview` em `src/domain/submission.ts`). Na triagem o texto fica com o L.E.I. e não se edita.
4. **Ajuste pedido.** O L.E.I. pode devolver a demanda com um pedido. O pedido aparece no topo do detalhe e do formulário; a organização ajusta e reenvia.
5. **Aprovada**, a demanda entra no cardápio. Altura do curso e o recorte do semestre são escritos na triagem; o "O que ajudaria ao fim do semestre" da organização é a base do recorte.

Os estados que a organização vê, do envio ao fim: Rascunho, Na triagem do L.E.I., Ajuste pedido, No cardápio, Um docente está avaliando (a reserva, sem o laranja, que é só do portal do docente), Em projeto e Concluída. O detalhe mostra esse caminho numa linha de cinco passos.

### F9. A organização responde os docentes

As perguntas que os docentes fazem na demanda (regra 12) chegam no portal da organização como aviso que pede decisão e como próximo passo no Início. A organização responde logo abaixo da pergunta, no mesmo desenho de conversa do portal do docente, e a resposta aparece na hora para todos os docentes que abrirem a demanda. Depois que a demanda vira projeto, a conversa passa a ser direto com o docente.

### F10. A organização acompanha o projeto

Quando um docente leva a demanda para uma disciplina, ela vira projeto e aparece em Projetos: disciplina, docente, semestre, equipes, o próximo passo contado do lado da organização e as seis etapas com a data feita ou prevista. O contato do docente (e-mail, telefone se ele informou, colegas que dividem a disciplina) fica na coluna lateral. As anotações das etapas e o plano do SIGAA são do docente e não aparecem. No encerramento, o resultado e se a organização usa a entrega aparecem em "O que ficou com vocês".

### F11. O perfil da organização

O perfil que a organização edita é o mesmo que os docentes veem na página da organização: tipo, local, sobre, público, site, reuniões, visita da turma e o ponto focal. O contato do ponto focal continua visível só para quem tem projeto com ela (regra 6). O nome passa pelo L.E.I. Logo e capa mudam na hora, sem o Salvar do formulário: a logo toma o lugar da inicial no perfil, na lista de organizações e nos cartões do cardápio; a capa vai para o topo do perfil e para as demandas sem foto própria. A capa enviada pela organização não pede crédito.

## 7. Regras de design

1. **Uma pergunta por tela, uma ação primária por tela.**
2. **O próximo passo está sempre visível**, no Início e no topo do projeto.
3. **Nada que não funcione.** Se a ação não existe, o controle não aparece.
4. **Estado calculado, não guardado.** O estado do projeto, as vagas e a compatibilidade saem das regras em `src/domain`.
5. **Linguagem da sala de aula**, não do sistema: "levar para a disciplina", e não "vincular demanda".
6. **Cada elemento tem uma aparência só.** Rótulo estático (tipo, competência) é texto sobre fundo cinza claro, sem borda. Contagem é texto puro, apagada quando é zero. Link é texto azul, sublinhado só no hover. Só botão tem borda (secundário) ou preenchimento (primário), e um menu de ações é sempre o kebab de 32px. Nenhuma ação aparece só no hover.
7. **Card para escolher, lista para percorrer.** O que o docente escolhe ou decide (próximos passos, demandas, organizações, colegas) é card em grade de duas colunas. Lista fica para índices que se percorrem em coluna (disciplinas, projetos de uma turma, histórico): âncora de 40px à esquerda, no máximo três linhas e a linha inteira clicável.
8. **Botão é botão.** Ação solta numa linha de texto azul só vale dentro de uma frase ou para copiar um campo. Ação própria (liberar reserva, ver a organização, cadastrar outra disciplina) é botão secundário.
9. **Conversa não é card.** Pergunta do docente em balão branco com borda, resposta da organização em balão azul claro, alinhado à direita. Fundo cinza claro é só para fatos (mini cards).
10. **Resumo em mini cards, abas só quando precisa.** Telas de detalhe abrem com os fatos principais em mini cards brancos com rótulo petróleo. Demanda e projeto organizam o resto em abas sublinhadas, guardadas na URL (`?aba=`). A organização é um perfil em uma página (sobre, demandas abertas, parceria e contato ao lado), com só duas abas no fim: Projetos e Interface com o CIn. A disciplina é uma página só, sem abas, com seções âncora (`#projetos`, `#demandas`, `#docentes`, `#turma`).
11. **Tag só para estado.** No cartão, tag é reservada ao estado da demanda. Cobertura vira medidor e o resto vira texto.
12. **Uma data só: "21 ago 2026".** Tempo relativo ("em 7 dias", "há 9 dias") entra só como complemento, nunca no lugar da data.
13. **Visual sóbrio com identidade própria.** Tipografia do sistema, cantos de 6 a 10px e neutros levemente frios. A identidade (Identidade Visual PLEI) tem três papéis que não se misturam, e nada de gradiente, emoji ou roxo:
    - **Verde Petróleo** é a identidade: marca, fatos, monogramas e "onde estou" (item ativo da barra lateral preenchido em `brand`, aba ativa sublinhada em `brand`). Fora da navegação, nada clicável é petróleo.
    - **Cor cheia em poucos lugares:** o item ativo da barra lateral (que é branca), a boas-vindas do Início, o painel da tela de entrada (sobre fundo `brand-50`) e a capa dos perfis (organização, disciplina, conta). Fatos e números de resumo são blocos brancos com borda fina; o petróleo fica só no rótulo e no número. O resto do portal é branco, com o petróleo nos detalhes.
    - **Azul Tecnológico** é a ação: botão primário, links, foco, seleção, balão de resposta e aviso de indicação (`accent-soft`, nunca petróleo).
    - **Laranja Social** aparece só na reserva de demanda.
14. **Fato, tag e card não se confundem.** Mini card de fato usa `fact`, borda `fact-line` de 1px, rótulo `fact-label` e valor `ink`. Tag de estado não tem borda e ocupa uma linha só. Card clicável continua branco com borda `line`. Monograma usa `monogram` com a inicial em `monogram-ink`.
15. **Fundo escuro de marca (`panel-deep`) só na tela de entrada.** Medidor de cobertura e linha das etapas continuam em `positive` sobre `fill-strong`.
16. **Contraste AA sempre.** Nenhum texto abaixo de 4,5:1 sobre o fundo; `ink-3` é o cinza mais claro permitido.

## 8. O que nos faz únicos

Plataformas parecidas conectam empresa e curso. O PLEI tem quatro coisas que elas não têm, e que a interface precisa deixar à vista:

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
| Escolha de área na entrada | A entrada pergunta só o perfil (docente, organização ou estudante) |
| Participantes e horas por estudante no projeto | A primeira versão vai até a proposta do projeto (orientação do Prof. Cristiano). Horas por pessoa dependem de os estudantes escolherem o projeto, que é o fluxo do estudante |
| Recusar demanda ("Não tenho interesse") | Decisão da equipe: a demanda simplesmente não é reservada |

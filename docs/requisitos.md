# Requisitos · PLEI

Levantamento do que a plataforma faz hoje, do que foi verificado e do que ainda falta para ela cumprir o objetivo. A especificação do produto continua em [`fluxos.md`](fluxos.md); este documento é o inventário.

**Objetivo:** organizações de fora da UFPE publicam problemas reais, o L.E.I. faz a triagem, e o docente do CIn leva um problema para uma disciplina que está lecionando, para a turma resolver com a organização dentro do semestre. O resultado fica registrado para a próxima turma.

**Legenda de status**

| Status | Significado |
| --- | --- |
| Pronto | Implementado e verificado no navegador, contra o backend simulado |
| Parcial | Existe na interface, mas depende de backend ou integração real |
| A fazer | Não existe ainda |

---

## 1. Quem usa

| Ator | O que precisa fazer | Situação |
| --- | --- | --- |
| Docente do CIn | Escolher demanda, levar para a turma, acompanhar as seis etapas | Portal do docente pronto (este repositório) |
| Organização parceira | Publicar demanda, acompanhar o projeto, receber o resultado | Portal da organização pronto (este repositório), contra o backend simulado |
| Equipe do L.E.I. | Triar demandas, manter o calendário, acompanhar os projetos | A fazer: painel da coordenação |

---

## 2. Requisitos funcionais do portal do docente

### 2.1. Acesso e conta

| # | Requisito | Status |
| --- | --- | --- |
| RF01 | Entrar só com e-mail `@ufpe.br` ou `@cin.ufpe.br` | Parcial: validação pronta, sem autenticação real |
| RF02 | Rota do portal sem sessão leva à entrada e, depois de entrar, volta para a página pedida com aba e âncora | Pronto |
| RF03 | Editar nome, departamento, telefone e foto de perfil (reduzida no navegador); e-mail só leitura | Parcial: salva no backend simulado |
| RF04 | Sair limpa a sessão e o cache | Pronto |
| RF05 | Recuperar senha | A fazer: chega com o login da UFPE |
| RF05a | Portal público: abertura com fotos de Pernambuco, porta de cada perfil, boas-vindas com a marca, carrossel do que há na plataforma, quatro passos animados e rodapé | Pronto |
| RF05e | Capas com foto nas telas de detalhe de organizações e demandas (os cartões ficam sem foto), lidas de `src/assets/covers` pelo id | Parcial: 5 de 6 organizações com foto; NASE espera a foto da UFPE |
| RF05d | Foto no painel da entrada e do cadastro, com o crédito que a licença CC BY-SA 4.0 exige | Pronto |
| RF05b | Entrada e cadastro com escolha de perfil; estudante aparece como "em breve" | Pronto |
| RF05c | Cadastro do docente com nome, e-mail institucional, departamento e senha, entrando direto no Início | Parcial: salva no backend simulado |

### 2.2. Início

| # | Requisito | Status |
| --- | --- | --- |
| RF06 | Convite para o tutorial no primeiro acesso, dispensável | Pronto |
| RF07 | Sem disciplina cadastrada, pedir o cadastro antes de tudo (F4) | Pronto |
| RF08 | Próximos passos: indicações do L.E.I., reservas a decidir (F5) e a próxima etapa de cada projeto, com atraso em destaque | Pronto |
| RF09 | Sugestões do cardápio que combinam com turma com vaga | Pronto |
| RF10 | Contador único no sino da barra superior: indicações, reservas abertas, demandas liberadas e etapas nos próximos 14 dias | Pronto |
| RF10a | Avisos no portal (sino e página Avisos): o que pede decisão e as respostas das organizações às perguntas do docente | Pronto |
| RF10b | Barra lateral recolhível e barra superior com avisos e conta; Avisos só pelo sino | Pronto |
| RF10d | Todas as telas com a mesma largura e margens laterais | Pronto |

### 2.3. Cardápio e reserva

| # | Requisito | Status |
| --- | --- | --- |
| RF11 | Filtros "Para minhas turmas", "Minhas reservas" e "Todas", com busca; filtro e busca ficam na URL | Pronto |
| RF12 | Cartão com organização, problema, competências cobertas, disciplina que combina e se cabe no semestre, em tags | Pronto |
| RF13 | Detalhe da demanda com problema, o que a organização oferece, cobertura por disciplina (competência a competência), escopo, "Para se inspirar" e o perfil resumido da organização | Pronto |
| RF14 | Uma ação primária por estado: Reservar, Levar para uma disciplina, Avise-me se liberar, Abrir projeto | Pronto |
| RF15 | Reservar por 7 dias, até 3 reservas ativas, liberar com um clique, expirar sozinha | Pronto |
| RF16 | Reserva de colega visível com nome e data de fim | Pronto |
| RF17 | "Avise-me se liberar" liga e desliga o aviso | Parcial: a demanda liberada aparece nos Avisos do portal; falta o e-mail |
| RF17a | Perguntar à organização na demanda, numa conversa de altura fixa que rola por dentro (abre na mensagem mais recente, Enter envia), com o histórico visível para todos os docentes | Pronto: a organização responde no portal dela (RF45); falta o aviso por e-mail |
| RF17b | Nível da demanda contra a altura do curso da turma: acima do nível não combina e não pode ser levada | Pronto |
| RF17e | Turma que cobre menos da metade das competências: a janela de levar avisa que a demanda não serve e pede confirmação do docente, sem bloquear | Pronto |
| RF17c | Condições da demanda (presencial, dados sensíveis, sigilo) e o que um semestre entrega, no cartão e no detalhe | Pronto |
| RF17d | Chegar por indicação do L.E.I.: o link abre a demanda com quem indicou e o que é extensão na disciplina (F6) | Parcial: a indicação vem do seed; o envio é da coordenação |

### 2.4. Levar para a disciplina e projeto

| # | Requisito | Status |
| --- | --- | --- |
| RF18 | Janela de confirmação com a disciplina que mais combina já marcada, número de equipes e o que acontece depois | Pronto |
| RF19 | Cadastrar disciplina dentro da janela quando não há nenhuma | Pronto |
| RF20 | Avisar quando nenhuma turma tem vaga | Pronto |
| RF21 | Projeto nasce na etapa 1 com o plano pronto e prazos derivados do calendário | Parcial: plano vem do seed, não de um modelo de linguagem |
| RF22 | Card "Próximo passo" com uma única ação e a data | Pronto |
| RF23 | Registrar cada etapa em ordem, com data (nunca no futuro), anotação e código do SIGAA | Pronto |
| RF24 | Plano editável com limite de caracteres do SIGAA, salvo ao sair do campo, copiável por seção ou inteiro | Pronto |
| RF25 | Encerramento pede o resultado e se a organização usa a entrega, e lembra do relatório final no SIGAA com o resultado pronto para copiar | Pronto |
| RF26 | Ajustar equipes, com quantos estudantes da turma isso soma, e desistir (só no planejamento), na coluna lateral do projeto | Pronto |
| RF27 | Contato do ponto focal na coluna lateral e aba Demanda com o combinado (problema, oferta, escopo, competências, condições) | Pronto |
| RF28 | Lista de projetos em tabela, com abas por estado, "Com atraso", ações sempre visíveis e linha clicável | Pronto |

### 2.5. Disciplinas e organizações

| # | Requisito | Status |
| --- | --- | --- |
| RF29 | Cadastrar, editar e remover disciplina (remover só sem projeto), com o formulário em blocos e o resumo de equipes e projetos | Pronto |
| RF30 | Lista com vagas livres e demandas compatíveis; abas do semestre atual e anteriores | Pronto |
| RF31 | Detalhe com projetos da turma, demandas que combinam e formulário de competências | Pronto |
| RF31a | Disciplina com mais de um docente, convidado pelo e-mail institucional; projeto mostra a coordenação compartilhada (F7) | Parcial: o convite é registrado, sem e-mail enviado |
| RF32 | Ementa, carga horária; duplicar para o próximo semestre, pausar recebimento, arquivar | A fazer: depende do modelo `Course` da API |
| RF33 | Lista de organizações com demanda aberta primeiro e contagens em texto | Pronto |
| RF34 | Detalhe com sobre, demandas abertas, seus projetos, contato (só com projeto) e histórico com o CIn | Pronto |
| RF35 | Propor um projeto a uma organização sem partir de demanda | A fazer: fluxo não desenhado |

### 2.6. Portal da organização

| # | Requisito | Status |
| --- | --- | --- |
| RF36 | Entrar com e-mail e senha e cadastrar a organização (nome, tipo, local, quem cuida das demandas, e-mail e senha), entrando direto no Início | Parcial: qualquer e-mail entra na conta de demonstração; o cadastro salva no backend simulado |
| RF37 | Sessão guarda o perfil; rota de um portal com sessão do outro volta ao Início do próprio perfil; sair volta à entrada do mesmo perfil | Pronto |
| RF38 | Início com boas-vindas e números (na triagem, no cardápio, em projeto), o que pede atenção em cards e como uma demanda chega a uma turma | Pronto |
| RF39 | Submeter demanda em quatro etapas (problema, o que a turma faz, como trabalham, revisar e enviar), com validação por etapa, etapa na URL e prévia do cartão do cardápio ao lado | Pronto |
| RF40 | Salvar rascunho a qualquer momento só com o nome; excluir rascunho com confirmação | Pronto |
| RF41 | Enviar para a triagem só com os campos obrigatórios; na triagem o texto não se edita | Pronto |
| RF42 | Ajuste pedido pelo L.E.I. no topo do detalhe e do formulário; ajustar e reenviar | Parcial: o pedido vem do seed, sem painel da coordenação |
| RF43 | Lista de demandas com abas Em preparo, No cardápio, Em projeto e Concluídas, estado em tag e a data que importa em cada estado | Pronto |
| RF44 | Detalhe com o caminho em cinco passos, a situação e a única ação que cabe agora, a demanda como o docente lê e o cartão do cardápio | Pronto |
| RF45 | Responder as perguntas dos docentes; a resposta aparece na hora para todos os docentes | Pronto |
| RF46 | Projetos da organização com as seis etapas contadas do lado dela, próximo passo, contato do docente e o resultado no encerramento, sem o plano nem as anotações do docente | Pronto |
| RF47 | Perfil da organização editável (o mesmo que os docentes veem) e dados de quem usa a conta | Parcial: salva no backend simulado |
| RF47a | Logo e capa enviadas pela organização, reduzidas no navegador; a logo aparece para os docentes na lista, no perfil e no cardápio | Parcial: guardadas no backend simulado como imagem em texto |
| RF49 | Como funciona da organização: caminho da demanda, seis etapas, regras e perguntas frequentes, interativo como o do docente | Pronto |
| RF48 | Sino e página de avisos: ajuste pedido e pergunta sem resposta pedem decisão; reserva e etapa chegando são novidade | Pronto |

---

## 3. Regras de negócio e como foram verificadas

Cada regra do `fluxos.md` foi testada direto no backend simulado, incluindo os casos que a interface não deixa alcançar.

| Regra | Verificação | Status |
| --- | --- | --- |
| 1. Reservar antes de levar; 7 dias; até 3; expira sozinha | Levar sem reserva é recusado; a 4ª reserva é recusada; a reserva vencida volta ao cardápio; fim em hoje + 6 dias | Pronto |
| 2. Reserva de colega visível; aviso | Não dá para reservar nem liberar a de colega; o aviso só vale para ela | Pronto |
| 3. Uma demanda, um projeto | A demanda levada sai do cardápio de todos | Pronto |
| 4. Só semestre atual e com vaga | Disciplina antiga e disciplina sem vaga recusadas; equipes precisam caber na turma | Pronto |
| 5. Prazo de vinculação | Depois do prazo, levar é recusado | Pronto |
| 6. Contato só depois do projeto | Organização sem projeto não entrega contato | Pronto |
| 7. Desistir só no planejamento | Desistir depois do SIGAA é recusado; antes, a demanda volta livre | Pronto |
| 8. Plano travado depois do SIGAA | Edição recusada depois do registro | Pronto |
| 9. Compatibilidade contada | 2 de 4 combina, 1 de 4 não | Pronto |
| 10. Resultado volta para a organização | O encerramento entra no histórico; encerrar sem resultado é recusado | Pronto |
| 11. A plataforma não acessa o SIGAA | Só guarda a data e o código informados | Pronto |
| Etapas em ordem, sem data futura | Pular etapa e data futura recusadas | Pronto |
| 9. Nível da turma (RN-03) | Demanda acima do nível não combina e levar para turma abaixo do nível é recusado | Pronto |
| 12. Dúvida pela demanda | Pergunta vazia recusada; registrada como do docente, sem resposta; demanda em projeto não recebe pergunta | Pronto |
| 13. Mais de um docente | Só e-mail institucional, sem repetir nem convidar a si mesmo; editar a disciplina mantém os colegas | Pronto |

**Fluxos verificados no navegador (54 passos, sem erro no console, e as 43 telas dos dois portais sem rolagem lateral a 390, 768, 1024 e 1440 px, sem botão sem nome, campo sem rótulo, imagem sem alt ou id repetido), além das 32 verificações de regra no backend simulado:** indicação do L.E.I. no Início e na demanda (F6), pergunta à organização, condições e nível na demanda, turma abaixo do nível bloqueada, convite de colega na disciplina e coordenação compartilhada no projeto (F7), entrada e redirecionamento, Início (F4, F5, contador), cardápio (filtros e busca), F1 completo (reservar, levar, projeto criado na aba Plano, demanda fora do cardápio), F2 e F3 completos (plano, abertura, SIGAA com código, entregas, encerramento e histórico), desistência, liberar reserva, aviso, disciplinas (cadastrar, editar pelo kebab, remover, abas, link de compatíveis), organizações (linha e link da contagem), projetos (abas, linha, copiar plano), menu no celular, sino e página de avisos, barra lateral recolhida, menu da conta, conta e saída, portal público com perfis, entrada por perfil e cadastro do docente; no portal da organização, o Início com o que pede atenção primeiro, o Como funciona, Concluídas abrindo o projeto antigo, a resposta a um docente, o envio de uma demanda nas quatro etapas até a triagem, a busca nas demandas, a exclusão de rascunho, a tabela de projetos, logo e capa vistas pelo docente e o bloqueio do portal de um perfil para a sessão do outro.

---

## 4. Requisitos não funcionais

| # | Requisito | Status |
| --- | --- | --- |
| RNF01 | Regra de negócio só em `src/domain`, usada pelas telas e pelo backend | Pronto |
| RNF02 | Trocar o mock pela API mudando só os arquivos `*Api.ts` | Pronto |
| RNF03 | Funcionar da largura de celular ao desktop | Pronto |
| RNF04 | Acessibilidade: foco visível, rótulos, navegação por teclado, `prefers-reduced-motion`, cor nunca como única pista | Pronto |
| RNF05 | Uma data só em todo o portal: "21 ago 2026" | Pronto |
| RNF06 | Taxonomia visual: rótulo, contagem, link, botão e menu nunca se confundem | Pronto |
| RNF07 | Persistência dos dados | A fazer: recarregar a página volta ao cenário de demonstração |
| RNF08 | Testes automatizados no repositório | A fazer: a verificação acima foi feita com scripts fora do repositório |
| RNF09 | LGPD: contato da organização só para quem tem projeto, telefone do docente só nos projetos | Parcial: regra na interface; falta política e registro de acesso no backend |

---

## 5. O que falta para cumprir o objetivo

Em ordem de prioridade para um piloto com docentes e organizações reais.

| Prioridade | O que | Por quê |
| --- | --- | --- |
| 1 | **Backend real** (`plataforma-lei-api`) com os ajustes da seção 5 do plano de reestruturação | Sem persistência nada do que o docente faz fica guardado |
| 1 | **Login institucional da UFPE** | Identificar o docente de verdade e calcular "minha reserva" |
| 1 | **Calendário acadêmico oficial** | Prazo de vinculação, meio e fim do semestre vêm dele |
| 2 | **Triagem do L.E.I.**: aprovar, pedir ajuste ou recusar demanda antes do cardápio, definindo altura do curso e recorte | O portal da organização já envia; sem a triagem, nada novo chega ao cardápio |
| 2 | **Portal das organizações, o que falta**: confirmar o recebimento das entregas, retirar demanda do cardápio | O envio, as respostas e o acompanhamento já existem |
| 2 | **Avisos por e-mail**: reserva perto de vencer, demanda liberada ("Avise-me"), resposta da organização, convite de colega, etapa atrasada | Hoje esses avisos só aparecem quando o docente abre o portal |
| 3 | **Plano gerado por modelo de linguagem** a partir da demanda e da disciplina | Hoje o texto vem pronto do seed |
| 3 | **Dados completos da disciplina** (ementa, carga horária) e ações de semestre (duplicar, pausar, arquivar) | Pedido nas telas, depende do modelo `Course` |
| 3 | **Participantes e horas por estudante**: lista da turma, equipes e planilha para o SIGAA | A maior dor de registro relatada (Gusto, Kiev); fica para quando os estudantes escolherem projeto |
| 3 | **Propor projeto a uma organização** | Docente com ideia própria procurando parceiro |
| 4 | **Painel da coordenação**: projetos por semestre, organizações atendidas, taxa de uso das entregas | Mostrar o impacto da extensão |
| 4 | **Testes automatizados** (Playwright para os fluxos, Vitest para `src/domain`) | Manter as regras acima verificadas a cada mudança |

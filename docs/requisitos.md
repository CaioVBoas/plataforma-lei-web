# Requisitos · Aperta o PLEI

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
| Organização parceira | Publicar demanda, acompanhar o projeto, receber o resultado | A fazer: portal das organizações |
| Equipe do L.E.I. | Triar demandas, manter o calendário, acompanhar os projetos | A fazer: painel da coordenação |

---

## 2. Requisitos funcionais do portal do docente

### 2.1. Acesso e conta

| # | Requisito | Status |
| --- | --- | --- |
| RF01 | Entrar só com e-mail `@ufpe.br` ou `@cin.ufpe.br` | Parcial: validação pronta, sem autenticação real |
| RF02 | Rota do portal sem sessão leva à entrada e, depois de entrar, volta para a página pedida com aba e âncora | Pronto |
| RF03 | Editar nome, departamento e telefone; e-mail só leitura | Parcial: salva no backend simulado |
| RF04 | Sair limpa a sessão e o cache | Pronto |
| RF05 | Recuperar senha | A fazer: chega com o login da UFPE |

### 2.2. Início

| # | Requisito | Status |
| --- | --- | --- |
| RF06 | Convite para o tutorial no primeiro acesso, dispensável | Pronto |
| RF07 | Sem disciplina cadastrada, pedir o cadastro antes de tudo (F4) | Pronto |
| RF08 | Próximos passos: reservas a decidir (F5) e a próxima etapa de cada projeto, com atraso em destaque | Pronto |
| RF09 | Sugestões do cardápio que combinam com turma com vaga | Pronto |
| RF10 | Contador único na navegação: reservas abertas e etapas nos próximos 14 dias | Pronto |

### 2.3. Cardápio e reserva

| # | Requisito | Status |
| --- | --- | --- |
| RF11 | Filtros "Para minhas turmas", "Minhas reservas" e "Todas", com busca; filtro e busca ficam na URL | Pronto |
| RF12 | Cartão com organização, problema, competências cobertas, disciplina que combina e se cabe no semestre, em tags | Pronto |
| RF13 | Detalhe da demanda com problema, o que a organização oferece, cobertura por disciplina, escopo, "Para se inspirar" e sobre a organização | Pronto |
| RF14 | Uma ação primária por estado: Reservar, Levar para uma disciplina, Avise-me se liberar, Abrir projeto | Pronto |
| RF15 | Reservar por 7 dias, até 3 reservas ativas, liberar com um clique, expirar sozinha | Pronto |
| RF16 | Reserva de colega visível com nome e data de fim | Pronto |
| RF17 | "Avise-me se liberar" liga e desliga o aviso | Parcial: o pedido é guardado, mas nenhum aviso é enviado |

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
| RF25 | Encerramento pede o resultado e se a organização usa a entrega | Pronto |
| RF26 | Ajustar equipes e desistir (só no planejamento) | Pronto |
| RF27 | Aba Organização com o contato do ponto focal | Pronto |
| RF28 | Lista de projetos em tabela, com abas por estado, "Com atraso", ações sempre visíveis e linha clicável | Pronto |

### 2.5. Disciplinas e organizações

| # | Requisito | Status |
| --- | --- | --- |
| RF29 | Cadastrar, editar e remover disciplina (remover só sem projeto) | Pronto |
| RF30 | Lista com vagas livres e demandas compatíveis; abas do semestre atual e anteriores | Pronto |
| RF31 | Detalhe com projetos da turma, demandas que combinam e formulário de competências | Pronto |
| RF32 | Ementa, carga horária, nível; duplicar para o próximo semestre, pausar recebimento, arquivar | A fazer: depende do modelo `Course` da API |
| RF33 | Lista de organizações com demanda aberta primeiro e contagens em texto | Pronto |
| RF34 | Detalhe com sobre, demandas abertas, seus projetos, contato (só com projeto) e histórico com o CIn | Pronto |
| RF35 | Propor um projeto a uma organização sem partir de demanda | A fazer: fluxo não desenhado |

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

**Fluxos verificados no navegador (31 passos, sem erro no console):** entrada e redirecionamento, Início (F4, F5, contador), cardápio (filtros e busca), F1 completo (reservar, levar, projeto criado na aba Plano, demanda fora do cardápio), F2 e F3 completos (plano, abertura, SIGAA com código, entregas, encerramento e histórico), desistência, liberar reserva, aviso, disciplinas (cadastrar, editar pelo kebab, remover, abas, link de compatíveis), organizações (linha e link da contagem), projetos (abas, linha, copiar plano), menu no celular, conta e saída.

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
| 2 | **Portal das organizações**: publicar demanda, ver quem reservou, acompanhar etapas, confirmar a entrega | O outro lado do produto; hoje as demandas vêm do seed |
| 2 | **Triagem do L.E.I.**: aprovar, pedir ajuste ou recusar demanda antes do cardápio | O cardápio promete demandas já triadas |
| 2 | **Avisos por e-mail**: reserva perto de vencer, demanda liberada ("Avise-me"), etapa atrasada, projeto criado para a organização | O "Avise-me" hoje não avisa; prazos dependem de o docente abrir o portal |
| 3 | **Plano gerado por modelo de linguagem** a partir da demanda e da disciplina | Hoje o texto vem pronto do seed |
| 3 | **Dados completos da disciplina** (ementa, carga horária, nível) e ações de semestre (duplicar, pausar, arquivar) | Pedido nas telas, depende do modelo `Course` |
| 3 | **Propor projeto a uma organização** | Docente com ideia própria procurando parceiro |
| 4 | **Painel da coordenação**: projetos por semestre, organizações atendidas, taxa de uso das entregas | Mostrar o impacto da extensão |
| 4 | **Testes automatizados** (Playwright para os fluxos, Vitest para `src/domain`) | Manter as regras acima verificadas a cada mudança |

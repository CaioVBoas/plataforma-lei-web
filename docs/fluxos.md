# Fluxos do Portal do Docente

Documento de referência para decidir como cada tela deve se comportar. O protótipo mostra telas bonitas, mas os estados não conversam entre si. Este documento é o modelo que as telas obedecem.

## 1. Objetivo

Um docente do CIn precisa cumprir extensão curricular com as turmas dele. A plataforma encurta o caminho **"problema real de um parceiro → projeto registrado no SIGAA → projeto executado e certificado"**.

Três promessas guiam as decisões:

1. **Sugestão confiável.** Todo percentual de compatibilidade abre a conta. Toda competência inferida pode ser corrigida.
2. **Nenhum passo a mais que o processo atual.** A plataforma escreve a proposta. O docente revisa, copia e registra.
3. **Honestidade sobre a fronteira institucional.** O registro acontece no SIGAA, e a plataforma só guarda a data que o docente declarou.

## 2. Entidades e ciclos de vida

A demanda percorre um único caminho, e cada tela mostra uma fase dele.

```
            reservar                 vincular à disciplina
Disponível ──────────▶ Reservada por mim ─────────────────────▶ Vinculada
    ▲    ◀──────────── (liberar ou expirar)                        │
    │                                                               │ gera
    └── Reservada por outro (fila de interesse)                     ▼
                                                     Proposta: Em edição ─▶ Pronta ─▶ Registrada
                                                                                         │ cria
                                                                                         ▼
                                                     Projeto: Em execução ─▶ Concluído ─▶ Relatório
                                                                                            enviado ─▶ Aprovado ─▶ Publicado
```

| Entidade | Estados | Onde aparece |
| --- | --- | --- |
| Demanda | disponível, reservada por mim, reservada por outro, vinculada | Cardápio (menos as vinculadas), detalhe da demanda |
| Reserva | ativa (5 dias úteis), liberada, expirada | Minhas reservas |
| Proposta | em edição, pronta, registrada (+ arquivada) | Propostas, editor da proposta |
| Projeto | em execução, concluído (relatório pendente, enviado, aprovado, publicado) | Meus projetos, detalhe do projeto |
| Disciplina | recebendo demandas, pausada | Minhas disciplinas, vínculo |
| Prática | confirmada, inferida, não conduzo | Meu perfil › Prática, disciplina › Prática |

**Invariantes.** Se uma tela contradiz uma destas regras, a tela está errada.

- Uma demanda vinculada **sai do cardápio** e **sai das reservas ativas**.
- Toda proposta nasce de um vínculo, então nunca existe proposta de demanda disponível.
- Todo projeto em execução tem proposta **registrada**.
- Registrar a proposta cria o projeto em execução.
- O número de demandas compatíveis de uma disciplina é **calculado**, nunca digitado.

## 3. Navegação (arquitetura de informação)

A ordem da sidebar segue o ciclo de vida:

1. **Cardápio de demandas**, para descobrir. O contador mostra as disponíveis.
2. **Minhas reservas**, para decidir. O contador mostra as ativas.
3. **Propostas**, para escrever e registrar. O contador mostra as que ainda não foram registradas.
4. **Meus projetos**, para executar: Em execução e Concluídos.
5. **Minhas disciplinas**, onde fica a base do cálculo.
6. **Organizações**, com contexto sobre os parceiros.
7. No rodapé, **Meu perfil** (Dados, Prática e Histórico) e **Ajuda**.

Os nomes seguem o glossário do kit: demanda, cardápio, reserva, proposta, disciplina e parceiro. O protótipo usava "Minhas propostas" para as reservas e "Rascunhos de projeto" para as propostas. Os dois rótulos confundiam fases diferentes e foram corrigidos.

## 4. Fluxos principais

### F1. Da demanda ao SIGAA (o fluxo que vende o produto)

| # | Tela | Ação | Resultado |
| --- | --- | --- | --- |
| 1 | Cardápio | "Tenho interesse" | Demanda reservada por 5 dias úteis. Toast oferece "Vincular agora" |
| 2 | Detalhe da demanda | "Por que combina?", corrigir competências, conversar com o parceiro | Decisão informada |
| 3 | Vincular à disciplina (**etapa 1 de 3**) | Escolher disciplina, equipes e coorientador | Demanda vinculada e proposta criada. Vai para o editor |
| 4 | Editor da proposta (**etapa 2 de 3**) | Revisar as seções e a carga horária, então "Marcar como pronta" | Proposta pronta |
| 5 | Editor da proposta (**etapa 3 de 3**) | Copiar as seções para o SIGAA e declarar a data do registro | Proposta registrada e projeto criado em Meus projetos |

O indicador "Etapa X de 3" é o mesmo nas duas telas, com os nomes *Disciplina · Proposta · Registro*.

### F2. Reserva que não vira projeto

As saídas são: liberar a reserva (a demanda volta ao cardápio), deixar expirar ou reservar de novo se a demanda ainda estiver livre. Liberar nunca pede justificativa.

### F3. Acompanhar o projeto

- Pela lista ou pelo detalhe, "Registrar andamento" abre **o mesmo formulário**, na aba Andamento do projeto. Um rótulo igual precisa ter um comportamento igual.
- Três semanas sem registro fazem o projeto "pedir atenção", e o filtro "Só o que pede atenção" o encontra.
- Concluído com relatório pendente, a ação é "Preparar relatório". Com o relatório aprovado, "Publicar na vitrine".

### F4. Calibrar a sugestão

Três entradas mexem no cálculo: o onboarding de prática (primeiro acesso), o perfil › Prática e a disciplina › Prática/Ementa. Toda correção vai para o Histórico. O painel de explicação sempre oferece o atalho para corrigir a prática.

### F5. Primeiro acesso

Na entrada, o docente escolhe o portal, faz login e, se tiver dois papéis, escolhe a área. Enquanto o onboarding de prática não for feito, o cardápio mostra um aviso com "Responder em 2 minutos". O onboarding também fica acessível pelo perfil › Prática.

## 5. Regras de design aplicadas

1. **Nenhum controle que não faz nada.** Se a ação não existe, o botão não aparece. Toast não é funcionalidade.
2. **Um rótulo, um comportamento.** A mesma palavra leva sempre ao mesmo lugar e faz a mesma coisa.
3. **Uma ação primária por tela.** Ações secundárias usam os estilos secundário e terciário.
4. **Contexto no rodapé fixo.** O texto de apoio da ação principal muda com o estado (reservar, continuar, abrir proposta).
5. **Estado derivado, não duplicado.** Contadores e compatibilidades são calculados a partir das entidades.
6. **Fronteira institucional explícita.** Tudo que depende do SIGAA ou da PROExC diz isso na tela.
7. **Voltar sempre possível.** Fluxos que saem para uma tela auxiliar (cadastrar disciplina no meio do vínculo) retornam ao ponto de origem.

## 6. Incoerências do protótipo e decisão tomada

| Problema no protótipo | Decisão |
| --- | --- |
| "Minhas propostas" listava reservas; "Rascunhos de projeto" listava propostas | Renomeados para **Minhas reservas** e **Propostas** |
| Vincular gerava rascunho, mas a demanda continuava reservada, com contagem regressiva, e no cardápio | Vincular muda a demanda para **vinculada**, que sai do cardápio e das reservas |
| Status "Pronto para registro" sem ação que levasse a ele | Botão **Marcar como pronta** no editor, habilitado quando nenhuma seção obrigatória está vazia |
| Dois botões de registro no editor ("Confirmar registro" e "Marcar como registrada no SIGAA") | Um só registro, na etapa 3 |
| Registrar não levava a lugar nenhum | Registrar **cria o projeto** e oferece "Ver projeto" |
| Projetos em execução com proposta em rascunho, e demandas do cardápio que já eram projetos | Dados de demonstração reorganizados para respeitar as invariantes da seção 2 |
| Projetos com 9 semanas corridas num semestre que ainda não começou | Semestre 2026.2 começa em 03/08. Em 24/08 é a semana 4 |
| "Registrar andamento" na lista marcava a semana sem texto; no detalhe abria formulário | Os dois abrem o formulário na aba Andamento |
| "Etapa 1 de 3" no vínculo sem etapas 2 e 3 | Indicador de jornada compartilhado entre vínculo e editor |
| Seletor de semestre no cabeçalho só exibia uma faixa, sem mudar dado nenhum | Removido. Semestres anteriores estão em Concluídos e em Disciplinas › Semestres anteriores |
| Rodapé do detalhe dizia "A reserva vale por 5 dias úteis" em qualquer estado | Texto contextual por estado |
| "Cadastrar outra disciplina" no vínculo não voltava para o vínculo | Depois do cadastro, retorna ao vínculo com a disciplina nova |
| Botões que só mostravam toast (Propor projeto, Enviar mensagem, Trocar foto, Duplicar, Sair de todos) | Removidos ou trocados por ação real (Sair) |
| Onboarding de prática sem porta de entrada | Aviso no cardápio enquanto não respondido e atalho no perfil › Prática |
| Contagem de demandas compatíveis digitada à mão por disciplina | Calculada a partir das demandas disponíveis (compatibilidade ≥ 50%) |

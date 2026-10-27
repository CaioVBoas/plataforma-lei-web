# Spec Delta

## Purpose

Faz as telas de Disciplinas do portal do docente lerem e gravarem as turmas do semestre e os co-docentes na API, para que o cadastro persista e respeite as regras de acesso do servidor.

## ADDED Requirements

### Requirement: Disciplinas vêm da API

No modo real (sem `VITE_USE_MOCKS=true`), o portal do docente SHALL obter a lista e o detalhe das disciplinas da API, enviando o token do docente autenticado. Cada disciplina SHALL trazer `activeProjects` e `isCurrent` como a API calcula, e o portal SHALL NOT recalculá-los. Os ids SHALL ser tratados como texto.

#### Scenario: Lista do docente
- **WHEN** o docente abre Disciplinas
- **THEN** a tela mostra as disciplinas que a API devolve, em que ele é principal ou co-docente, e as de semestres anteriores aparecem como histórico (`isCurrent = false`)

#### Scenario: Disciplina de outro docente
- **WHEN** o docente abre `/disciplinas/:id` de uma disciplina sem acesso e a API responde `404`
- **THEN** a tela mostra o estado de erro com a mensagem da API, sem quebrar o portal

#### Scenario: Modo demonstração
- **WHEN** `VITE_USE_MOCKS=true`
- **THEN** todas as operações de disciplina respondem pelo backend simulado, como antes desta change

### Requirement: Cadastro e edição persistem na API

Criar uma disciplina SHALL enviar à API `name`, `code`, `level`, `students`, `teamSize`, `projectSlots` e `skills`, sem `semester` e sem `coTeachers`. Editar SHALL usar atualização parcial da mesma disciplina. Em sucesso, a lista e o detalhe SHALL ser recarregados com o que a API devolveu. O código da disciplina SHALL ser obrigatório no formulário.

#### Scenario: Nova disciplina
- **WHEN** o docente preenche o formulário completo e confirma
- **THEN** a disciplina aparece na lista no semestre corrente definido pela API, e continua lá ao recarregar a página

#### Scenario: Código vazio
- **WHEN** o docente tenta salvar sem código
- **THEN** o formulário bloqueia o envio com uma mensagem no campo, sem chamar a API

#### Scenario: Regra rejeitada pela API
- **WHEN** a API responde `400` ou `409` (por exemplo, "A disciplina já tem 2 projetos em curso. As vagas não podem ficar abaixo disso.")
- **THEN** a tela mostra exatamente a mensagem da API e mantém o que o docente digitou

#### Scenario: Sem semestre corrente
- **WHEN** a API responde `409` porque não há semestre letivo corrente
- **THEN** a tela mostra a mensagem da API e nada é criado

### Requirement: Exclusão de disciplina

Excluir SHALL chamar a API e, em sucesso (`204`), remover a disciplina da lista sem buscar de novo o detalhe excluído. Se a API recusar (`409`, disciplina com projetos), a disciplina SHALL continuar na lista e a mensagem da API SHALL aparecer.

#### Scenario: Disciplina com projetos
- **WHEN** o docente tenta excluir uma disciplina que tem projeto
- **THEN** a tela mostra "Esta disciplina tem projetos. Ela fica guardada com o histórico deles." e a disciplina continua listada

### Requirement: Co-docentes pela API

Convidar SHALL enviar o e-mail digitado à API. Remover SHALL identificar o colega pelo e-mail na URL, codificado para trafegar com segurança. Em sucesso, a disciplina exibida SHALL refletir a lista de co-docentes devolvida pela API, com o nome quando a API o informar.

#### Scenario: Convite aceito pela API
- **WHEN** o docente convida um colega com conta de docente
- **THEN** o colega aparece na disciplina com o nome devolvido pela API

#### Scenario: Colega sem conta
- **WHEN** a API responde `404` ao convite
- **THEN** a tela mostra a mensagem da API e nenhum colega é acrescentado

#### Scenario: Remoção
- **WHEN** o docente tira um colega da disciplina
- **THEN** o colega some da lista assim que a API confirma

# Spec Delta

## Purpose

Faz a escolha de competências dos formulários de disciplina e de demanda oferecer os nomes do catálogo mantido pela API.

## ADDED Requirements

### Requirement: Catálogo de competências vem da API

No modo real, as opções de competência dos formulários SHALL ser a lista de nomes devolvida pela API, em ordem alfabética, autenticada pelo token da sessão. A lista SHALL ser buscada uma vez por sessão do navegador e reaproveitada por todos os formulários que a usam.

#### Scenario: Opções do catálogo
- **WHEN** o docente abre o formulário de disciplina
- **THEN** as competências oferecidas são as do catálogo da API

#### Scenario: Catálogo indisponível
- **WHEN** a chamada ao catálogo falha
- **THEN** o formulário não oferece opções novas e a validação de "ao menos uma competência" continua valendo, sem quebrar a tela

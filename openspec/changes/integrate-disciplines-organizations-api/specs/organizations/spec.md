# Spec Delta

## Purpose

Faz o catálogo e o perfil das organizações parceiras no portal do docente virem da API, que decide quando o contato do ponto focal pode aparecer (Regra 6).

## ADDED Requirements

### Requirement: Catálogo de organizações vem da API

No modo real, a tela Organizações SHALL listar as organizações devolvidas pela API, com o número de demandas abertas (`openDemands`) e o tipo como o rótulo legível que a API envia.

#### Scenario: Catálogo
- **WHEN** o docente abre Organizações
- **THEN** cada organização mostra nome, tipo e o número de demandas abertas calculado pela API

### Requirement: Perfil com contato condicionado

O perfil da organização SHALL mostrar o contato do ponto focal somente quando a resposta da API trouxer `contact`. O portal SHALL NOT montar nem guardar o contato por outro caminho.

#### Scenario: Com projeto
- **WHEN** a API devolve `contact`
- **THEN** o perfil mostra o ponto focal, o cargo, o e-mail e o canal preferido

#### Scenario: Sem projeto
- **WHEN** a API não devolve `contact`
- **THEN** o perfil mostra "Aparece quando uma demanda desta organização virar projeto seu." e nenhum dado do ponto focal

### Requirement: Demandas abertas e projetos em forma enxuta

O perfil SHALL listar as demandas abertas pelo título, cada uma com link para a página da demanda no cardápio, e os projetos do docente com a organização por título, disciplina e semestre, com link para o projeto. A contagem de demandas abertas SHALL ser o tamanho dessa lista. O backend simulado SHALL devolver a mesma forma enxuta.

#### Scenario: Demandas abertas
- **WHEN** a organização tem duas demandas publicadas sem projeto
- **THEN** o perfil lista os dois títulos, cada um levando a `/cardapio/:id`, e mostra "2 demandas abertas"

#### Scenario: Nenhuma demanda aberta
- **WHEN** a lista vem vazia
- **THEN** o perfil mostra "Nenhuma demanda no cardápio agora."

#### Scenario: Organização inexistente
- **WHEN** a API responde `404`
- **THEN** a tela mostra o estado de erro com a mensagem da API

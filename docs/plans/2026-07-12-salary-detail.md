# Plano: Salary Detail - Card e Modal de Detalhes Salariais (finance-mf)

Status: done

Autor: Daniel

Data: 2026-07-12

## TL;DR

Implementar o card de Detalhes do Salario do Usuario com fluxo completo de adicionar, editar e remover detalhes salariais, integrado ao finance-api conforme contrato OpenAPI. O fluxo inclui modal de cadastro/edicao, confirmacao extra para remocao, atualizacao da lista apos cada acao de CRUD, mapeamento visual por idType e definicao de IDs unicos em todos os elementos de view/input para automacao com Playwright.

## Steps

### Fase 1 - Contratos e Integracao HTTP de Salary Detail

1. Criar/estender modelos TypeScript para SalaryDetailResponse, SalaryDetailPageResponse, AddSalaryDetailRequest, UpdateSalaryDetailRequest e DeleteSalaryDetailRequest.
2. Definir estrutura de paginacao (content, totalElements, totalPages, size, number) alinhada ao backend.
3. Implementar no servico financeiro os metodos GET, POST, PUT e DELETE de salary detail com competencia na rota e page/size em query params.
4. Padronizar tratamento de erro de validacao (violacoes por campo) para reutilizacao no formulario de modal.

### Fase 2 - Enum de Tipo e Regras de Exibicao

5. Criar enum/local mapping para tipos de detalhe salarial: 1=Desconto, 2=Provento, 3=Beneficio.
6. Popular o select Tipo da modal com valores fixos do enum (sem dependencia de endpoint de tipos).
7. Nao exibir coluna de Tipo no card de detalhes.
8. Aplicar regra visual do valor por idType no card:
9. idType 1: valor em vermelho.
10. idType 2: valor em verde.
11. idType 3: valor em cinza.

### Fase 3 - Card Detalhes do Salario do Usuario

12. Criar componente standalone para exibir lista paginada de detalhes salariais da competencia ativa.
13. Exibir colunas: selecao, codigo, nome, qtd, valor (com cor por idType) e acoes.
14. Implementar botao Adicionar detalhe no cabecalho do card.
15. Implementar acoes por linha para editar e remover.
16. Integrar pagina e tamanho da listagem ao backend.
17. Integrar componente a tela principal de financas abaixo do resumo mensal.

### Fase 4 - Modal de Adicionar e Editar

18. Criar modal unica para adicionar e editar detalhe salarial.
19. Campos obrigatorios da modal: Tipo, Codigo, Nome, Qtd e Valor.
20. Em modo adicionar, enviar POST com AddSalaryDetailRequest.
21. Em modo editar, enviar PUT com UpdateSalaryDetailRequest.
22. Exibir mensagens de erro por campo quando backend retornar violacoes.
23. Fechar modal apos sucesso e refletir resposta paginada retornada pela API.

### Fase 5 - Remocao com Confirmacao Extra

24. Permitir remocao de um ou mais detalhes selecionados.
25. Exigir confirmacao extra em modal de confirmacao antes de executar DELETE.
26. Exibir mensagem de confirmacao no padrao visual esperado (acao explicita de cancelar/remover).
27. Enviar lista de IDs no payload DeleteSalaryDetailRequest.
28. Atualizar card com a resposta paginada retornada apos remocao.

### Fase 6 - IDs Unicos para Automacao Playwright

29. Definir convencao unica e estavel de IDs para elementos de view, input, botoes e mensagens.
30. Garantir IDs unicos no card (cabecalho, tabela, linhas, paginacao e acoes).
31. Garantir IDs unicos na modal de adicionar/editar (container, campos, erros e botoes).
32. Garantir IDs unicos na modal de confirmacao de remocao (container, texto, botoes).
33. Em elementos dinamicos por linha, incluir o ID da entidade no atributo para evitar duplicidade.

### Fase 7 - Feedback, Estado e Qualidade

34. Reutilizar toast para sucesso/erro nas operacoes de add/edit/delete.
35. Tratar estados de carregamento da lista e de submissao da modal para evitar acoes duplicadas.
36. Validar comportamento de recarga da lista apos cada acao de CRUD sem perder consistencia da paginacao.
37. Criar/atualizar testes unitarios do servico para os novos endpoints de salary detail.
38. Criar/atualizar testes de componente cobrindo: abertura de modal, submit add/edit, confirmacao de remocao, atualizacao da lista e regra de cor por idType.

## Criterios de aceite

1. Card de detalhes salariais visivel na tela de financas e carregando dados da competencia selecionada.
2. Modal de adicionar e editar funcional com todos os campos obrigatorios.
3. Select Tipo da modal alimentado por enum local (1, 2, 3) sem chamada extra de API.
4. Tipo nao aparece como coluna no card; valor aparece colorido conforme idType (1 vermelho, 2 verde, 3 cinza).
5. Acoes de adicionar, editar e remover atualizam a lista de detalhes com retorno da API.
6. Remocao exige confirmacao extra antes da chamada final de DELETE.
7. Todos os elementos de view/input relevantes possuem IDs unicos e estaveis para Playwright.
8. Fluxos de erro e sucesso exibem feedback ao usuario via toast e mensagens de campo quando aplicavel.
9. Testes unitarios minimos de servico/componente cobrem os fluxos principais.

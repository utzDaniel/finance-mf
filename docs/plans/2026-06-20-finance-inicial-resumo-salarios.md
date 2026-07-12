# Plano: Primeira Entrega da Tela Inicial de Financas (finance-mf)

Status: partially done

Autor: Copilot

Data: 2026-06-20

## TL;DR

Implementacao parcial do escopo inicial da tela de financas no frontend finance-mf: filtro de competencia com pesquisa, bloco de resumo salarial com dados do usuario e da familia, e fluxo de edicao do salario do usuario consumindo o finance-api. Estados dedicados de carregamento/erro/vazio e testes de componente nao foram entregues.

## Steps

### Fase 1 - Contratos e Integracao HTTP

1. Criar modelos TypeScript para representar a resposta do resumo mensal e o payload de edicao salarial.
2. Criar servico de integracao com endpoints do finance-api para buscar resumo por mes/ano e atualizar salario do usuario.
3. Configurar uso da URL da API via environments ja existentes.

### Fase 2 - Filtro de Competencia (Mes/Ano)

4. Implementar na tela os campos de mes/ano com valor inicial no mes corrente.
5. Adicionar botao Pesquisar para disparar carregamento dos dados do resumo.
6. Validar entrada para impedir consultas invalidas.

### Fase 3 - Bloco Resumo de Salarios

7. Renderizar secao com Nome do usuario e Nome da familia.
8. Exibir Salario Bruto do usuario e Salario Bruto da familia.
9. Exibir Salario Liquido do usuario e Salario Liquido da familia.
10. Aplicar formatacao monetaria consistente em BRL.

### Fase 4 - Edicao de Salario do Usuario

11. Adicionar botao Editar salario do usuario na secao de resumo.
12. Implementar fluxo de edicao com formulario e validacao de campos numericos.
13. Enviar atualizacao ao backend e, em sucesso, recarregar resumo da competencia ativa.

### Fase 5 - Estado de Tela e Feedback

14. Implementar estados de carregamento, erro e vazio.
15. Reutilizar padrao de toast ja presente para mensagens de sucesso e falha.
16. Garantir responsividade da secao para desktop e mobile.

### Fase 6 - Testes e Documentacao

17. Adicionar testes unitarios minimos de componente e servico para busca e edicao.
18. Registrar o resultado desta entrega em docs/plans do finance-mf com status e criterios de aceite.
# Add Survey Results

> ## Caso de Sucesso
1. ⏳ Recebe uma requisição do tipo **PUT** na rota **/api/surveys/:surveyId/results**
2. ⏳ Valida se a requisição foi feita por um **usuário logado**
3. 🏁 Valida o parâmetro **survey_id**
4. ⏳ Valida se o campo **answer** é uma resposta válida
5. ⏳ **Cria** um resultado de enquete com os dados fornecidos
6. ⏳ **Atualiza** um resultado de enquete com os dados fornecidos
7. ⏳ Retorna **200** com os dados do resultado da enquete

> ## Caso de Erro
1. ⏳ Retorna **404** se a API não existir
2. ⏳ Retorna **403** se o usuário não estiver logado
3. 🏁 Retorna **403** se o survey_id for inválido
4. ⏳ Retorna **403** se a respost enviada for inválida
5. ⏳ Retorna **500** se houver um erro ao tentar criar o resultado
6. ⏳ Retorna **500** se houver um erro ao tentar atualizar o resultado
6. ⏳ Retorna **500** se houver um erro ao tentar carregar a enquete
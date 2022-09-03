# List Surveys

> ## Caso de Sucesso
1. 🏁 Recebe uma requisição do tipo **GET** na rota **/api/surveys**
2. 🏁 Valida se a requisição foi feita por um usuário logado
3. 🏁 Retorna **204** se não houver nenhuma enquete
4. 🏁 Retorna **200** com os dados das enquetes

> ## Caso de Erro
1. 🏁 Retorna **404** se a API não existir
2. 🏁 Retorna **403** se o usuário não estiver logado
3. 🏁 Retorna **500** se houver um erro ao tentar listar as enquetes
# Refresh Token

> ## Caso de Sucesso
1. 🏁 Envia um refreshToken para o usuário na rota **/api/login**
2. 🏁 **Atualiza** os dados do usuário com o id do refreshToken gerado
3. 🏁 Recebe uma requisição do tipo **POST** na rota **/api/refresh**
4. 🏁 Valida o refreshToken recebido com o banco de dados
5. 🏁 Cria um novo accessToken e um novo refreshToken
6. 🏁 **Atualiza** os dados do usuário com ambos os tokens
7. 🏁 Envia os tokens atualizados para o usuário

> ## Caso de Erro
1. 🏁 Retorna **404** se a API não existir
2. 🏁 Retorna **401** se o refreshToken não existir
3. 🏁 Retorna **401** se o accessToken não for fornecido pelo cliente
4. 🏁 Retorna **401** se o accessToken não estiver expirado
5. 🏁 Retorna **500** se houver um erro ao tentar gerar o token
6. 🏁 Retorna **500** se houver um erro ao tentar atualizar os dados do usuário
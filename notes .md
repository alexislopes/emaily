# 1

A arquitetura da aplicação será de cliente e servidor: React será a parte do cliente e o node a parte do servidor comunicando com o banco de dados MongoDB.

# 2
Diferenças entre express e node:

node: baseado em javascript, usado para executar códigos fora do navegador.
express: baseado em node, usado para lidar com métodos http

Em teoria podemos contruir toda a aplicação sem a utilização do express, porém o mesmo possui uma serie de bibliotecas que torna mais facil a comunicação entre métod http.

O fluxo do servidor funciona da seguinte maneira:

- Possuímos um servidor node rodando em alguma porta de nossa máquina;
- Quando recebemos algum requerimento, o node escuta e direciona para o express;
- O express por sua vez, lida facilmente com esta requisição através do seu sistema de routing;
- As rotas são configuradas para  retornar alguma resposta;
- Esta resposta retorna ao node;
- O node a retorna para o remetente.

# 3

para criar um server express é bem simples:

```javascript
const express =require('express')
const app = express()

app.get('/', (req, res) => {
res.send({hi: 'there'})
})

app.listen(5000) //http://localhost:5000
```
# 4
No trecho acima:

- importamos o módulo do express para nosso `index.js`;
- criamos uma instância do express e a atribuimos ao app;

App possui vários métodos, dentre eles:

- `get`: usado para adquirir dados;
- `post`: usado para enviar dados;
- `put`: usado para atualizar dados;
- `delete`: usado para detetar dados;
- `patch`: usado para atualizar apenas alguns dados.

A seguir criamos uma rota `get` para o nosso app, esta rota funcionará em "/", caso esta rota for acessada, o dado "hi: 'there'" será enviado de volta para o remetente.

# 5 

Para que seja possível fazer o dploy de nossa aplicação no Heroku, é necessário seguir alguns passos:

## Dynamic Port Binding

Como o Heroku hospeda diversas aplicações em uma só máquina, é preciso informar que nossa aplicação possa rodar em alguma porta provida pelo Heroku, algumas modificações são necessárias:

```javascript
const PORT = process.env.PORT || 5000
app.listen(PORT)
```

Feito isso, a aplicação está preparada para funcionar em ambiente de desenvolvimento e produção. A variável `PORT` verifica se há alguma variável de ambiente configurada para utiliza-la, caso contrário, utilizará a porta 5000.

## Specify node environment

Precisamos avisar o Heroku sobre versão do node que gostariamos de utilizar, para que não haja demais problemas, para fazer isso, é preciso algumas modificações:

Em package.json faça as seguintes modificações entre `"main"` e `"scripts"`:

```json
"main": "index.js",
"engines": {
    "node": "8.1.1",
    "npm": "5.0.3"
},
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Ao adicionar o `"engines"` estamos dizendo ao Heroku que gostaríamos que a aplicação funcionasse com node 8.1.1 e npm 5.0.3

## Specify start script

Para que o Heroku saiba qual é o entry point da aplicação, precisamos adicionar um start script, para isso, na sessão scripts em packege.json:

```json
"start": "node index.js"
```

# 6 

Deploy da aplicação para o heroku utilizando o Heroku CLI

- Deve-se criar um repositorio local na pasta server `git init`
- Criar uma aplicação no heroku `heroku create`
- adicionar um remote para a aplicação `git remote add heroku <remote-url-from-heroku>`
-push da aplicação para o repositório remoto `git push heroku master`

# 7

Adicionando o Google OAuth

Google OAuth é uma tecnologia que permite usuários a autenticarem com "apenas um clique", poupando-os de preencher enormes formulários.

## Funcionamento do Google OAuth

Para o Google OAuth funcionar, ele basicamente precisa de três pilares:

- **Cliente**
- **Servidor**
- **Google**

Cliente é a parte que faz o contato com o usuário, ou seja, quando o usuário clica no botão de login, é disparado uma cadeia de funções. `click login` => `listen on localhost:5000/auth/google`

A partir daí, o servidor recebe a requisição que faz o papel de enviar para o Google dizendo o seguinte: "Este usuário deseja se autenticar usando seus serviços". **server sends the req with app id**

Quando chega no Google, é preciso perguntar para o usuário se ele permite que aquela aplicação utilize os dados providos pelo Google.

Enquanto isso, o usuário é posto em posição de espera. A partir do momento que o usuário garantiu as permissões para o Google, a mesma retorna um código para o servidor da aplicação, para que o servidor envie uma outra requisição contendo o código fornecido pelo Google.

Quando o Google recebe uma requisição com uma propriedade "code", ele retorna para o servidor da aplicação as informações do usuário.

Agora, que as informações foram fornecidas, fica fácil guarda-las em uma base de dados.

note que, para o usuário, ele precisou apenas clicar um ou dois botões para autenticar-se. Muito menos trabalho do que preencher extensos formulários.

Caso for preciso de mais informações, fica mais simples adquiri-las de dentro da aplicação de forma dinamica.

## passport.js

Passport.js é um modulo que auxilia a autenticação. O que este modulo faz é lidar com toda parte do servidor em contato com o google, como pedir permissões, pedir por informações do usuário, etc.

Passport.js também conta com mais de trezentas estratégias de login, entre elas: twitter, facebook, github e spotify.

## Utilizando passport.js

Para instala-lo:

```sh
$ npm install --save passport passport-google-oauth20
```

No comando acima, estamos instalando as dependencias do passport.js e uma estratégia de autenticação, a do Google.

Adicionando no arquivo do servidor `"index.js"`:

```javascript
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy())
```

No trecho de codigo acima, estamos inportando os modulos do passport e a estratégia de autenticação do google, logo após estamos indicando ao passport que gostaríamos de utilizar a estratégia do Google para nos autenticar

# section 4

Em servidor, o entry point foi refatorado, delegando serviços para outras partes, sendo elas, routes que tem o papel de mapear todas as rotas cadastradas e services, que está reservado, por enquanto para o passport.

## Mas como autenticar em um servidor stateless?

Imagina a seguinte situação:

Você possui uma conta em um serviços de rede social, como de costume você deve possuir postagens.

Um belo dia, você resolve rever suas postagens e pede uma lista de suas postagens para o servidor.

Como ele irá saber quem é você?

Simples: no ato do cadastro, foi vinculado à sua conta, um token, único. Este token é salvo em cookies, sendo assim, toda vez que uma requisição lançada, este token será enviado junto.
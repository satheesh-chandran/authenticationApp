# AuthenticationApp

This is simple enough application that helps you to understand how oauth flow works.

The contracts are almost same as github oAuth app.

In this application we pretended that some users have an account with username and password. In order to get the user data you need to follow the auth flow.

The server can run on localhost 8000. The client app can run on some other port number.

## Dependancies for the app

- **express**     : Routing dependancy 
- **dotenv**      : Loading enironmental variables from .env file. Helps to keep the variables confidential
- **redis**       : Used for caching of auth code and access token
- **sqlite3**     : Used as a persistant relational database
- **knex**        : Query builder for RDBMS
- **crypto**      : Encoder of ids
- **morgan**      : Request logger
- **querystring** : For parsing the query
- **url**         : For parsing the request url

## To begin with the app,

- Clone the repository
- Do `npm install`
- Start the redis-server
- migrate knex to the latest ```knex migrate:latest``` and seed the data ```knex seed:run```.
- Start the server
- Hit the url [http://localhost:8000](http://localhost:8000).
- Create a new app
- Keep the clientId and clientSecret confidential
- Use it as you like.

## Some of the key urls that you have to hit from the client

- ```http://localhost:8000/login/oauth/authorize?clientId=< ClientID >&callbackUrl=< callbackUrl >```  As a result the server will hit your call back url with short lasting code in query parameter
- Hit the post url ```http://localhost:8000/login/oauth/access_token``` and send the code, clientId and clientSecret along with it for getting access token
- Hit the get url ```http://localhost:8000/users``` for getting the user data. Set the token in ```req.headers``` as Authorization key.

For better understanding review my [client application](https://github.com/satheesh-chandran/authenticationClient).

# authenticationApp

This is simple enough application that helps you to understand how oauth flow works.

The contracts are almost same as github oAuth app.

In this application we pretended that some users have an account with username and pass word. In order to get the user data you need to follow the auth flow.

The server can run on localhost 8000. The client app can run on some other port number.

To begin with the app,

- Start the server
- Hit the url [http://localhost:8000](http://localhost:8000).
- Create a new app
- Keep the clientId and clientSecret confidential
- Use it as you like.

Some of the key urls that you have to hit from the client is,

- ```http://localhost:8000/login/oauth/authorize?clientId=< ClientID >&callbackUrl=< callbackUrl >```  As a result the server will hit your call back url with short lasting code in query parameter
- Hit the post url ```http://localhost:8000/login/oauth/access_token``` and send the code, clientId and clientSecret along with it for getting access token
- Hit the get url ```http://localhost:8000/users``` for getting the user data. Set the token in ```req.headers``` as Authorization key.

For better understanding review my [client application](https://github.com/satheesh-chandran/authenticationClient).

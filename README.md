chatbot
========================================
A bot designed for Slack.


Installation
========================================
1. Install Heroku Toolbet (https://toolbelt.heroku.com/) and Node.js, e.g.

```
    $ sudo port install npm
```

2. Install dependencies:

```
    $ npm install body-parser
    $ npm install express
    $ npm install request
```

3. Run app:

```
    $ node app.js
```

4. Push your changes to Heroku:

```
    $ heroku create
    $ heroku config:set CHAT_BOT_TOKEN=[Your API token]
    $ git push heroku master
```

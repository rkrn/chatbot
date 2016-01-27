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

4. Create a `token.txt` and write your API token to this file

```
    $ echo YOUR_API_TOKEN > token.txt
```

5. Find the desired target user (https://api.slack.com/methods/users.list/test) 
   and write his or her user ID to `userid.txt`:

   $ echo TARGET_USER_ID > userid.txt

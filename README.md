chatbot
========================================
A bot designed for Slack.


Installation
========================================
1. Install Node.js:

```
    $ sudo port install npm
```

2. Install dependencies:

```
    $ npm install
```

3. Create a `token.txt` and write your API token to this file

```
    $ echo YOUR_API_TOKEN > token.txt
```

4. Find the desired target user (https://api.slack.com/methods/users.list/test) 
   and write his or her user ID to `userid.txt`:

   $ echo TARGET_USER_ID > userid.txt

5. Run the bot:

    $ node app.js

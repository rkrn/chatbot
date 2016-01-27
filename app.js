require('babel/register');
var http = require('http');

try {
  var fs = require('fs');
  var pathToken = process.env.CHAT_BOT_TOKEN;
  var token = pathToken || fs.readFileSync('token.txt', 'utf8').trim();
} catch (error) {
  console.log("Your API token should be placed in a 'token.txt' file, which is missing.");
  return;
}

var ChatBot = require('./chatbot');
var bot = new ChatBot(token);
bot.login();

// Heroku requires the process to bind to this port within 60 seconds or it is killed 
http.createServer(function(req, res) {
  res.end('CHAT_BOT');
}).listen(process.env.PORT || 5000)

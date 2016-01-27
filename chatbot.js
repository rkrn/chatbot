const rx = require('rx');
const _ = require('underscore-plus');

const Slack = require('slack-client');
const SlackApiRx = require('./slack-api-rx');

const MessageHelpers = require('./message-helpers');
const PlayerInteraction = require('./interaction');

var fs = require('fs');
var targetUser = '' || fs.readFileSync('userid.txt', 'utf8').trim();

class ChatBot {
  // Public: Creates a new instance of the bot.
  //
  // token - An API token from the bot integration

  constructor(token) {
    this.slack = new Slack(token, true, true);
    
    this.gameConfig = {};
    this.gameConfigParams = ['timeout'];
  }

  // Public: Brings this bot online and starts handling messages sent to it.
  login() {
    rx.Observable.fromEvent(this.slack, 'open')
      .subscribe(() => this.onClientOpened());

    this.slack.login();
    this.respondToMessages();
  }

  // Private: Listens for messages directed at this bot that contain the word
  // 'deal,' and poll players in response.
  //
  // Returns a {Disposable} that will end this subscription
  respondToMessages() {
    let messages = rx.Observable.fromEvent(this.slack, 'message')
        .where(e => e.type === 'message' && e.user === targetUser); 

    let atMentions = messages.where(e => 
      MessageHelpers.containsUserMention(e.text));

    let disp = new rx.CompositeDisposable();
        
    disp.add(this.handleDealGameMessages(messages, atMentions));
    
    return disp;
  }
  
  // Private: Looks for messages directed at the bot that contain the word
  // "deal." When found, start polling players for a game.
  //
  // messages - An {Observable} representing messages posted to a channel
  // atMentions - An {Observable} representing messages directed at the bot
  //
  // Returns a {Disposable} that will end this subscription
  handleDealGameMessages(messages, atMentions) {
    return atMentions
      //.where(e => e.text && e.text.toLowerCase().match(/\bdeal\b/))
      .where(e => e.text && e.text.toLowerCase())
      .map(e => this.slack.getChannelGroupOrDMByID(e.channel))
      .where(channel => {
        if (this.isPolling) {
          return false;
        } 
        return true;
      })
      .flatMap(channel => this.pollPlayersForGame(messages, channel))
      .subscribe();
  }
  
  // Private: Polls players to join the game, and if we have enough, starts an
  // instance.
  //
  // messages - An {Observable} representing messages posted to the channel
  // channel - The channel where the deal message was posted
  //
  // Returns an {Observable} that signals completion of the game 
  pollPlayersForGame(messages, channel) {
    this.isPolling = true;
    
    // `reduce` can be taken out
    return PlayerInteraction.pollPotentialPlayers(messages, channel)
      .reduce((players, id) => {
        let user = this.slack.getUserByID(id);
        players.push({id: user.id, name: user.name});
        return players;
      }, [])
      .flatMap(players => {
        this.isPolling = false;
        return rx.Observable.return(null);
      });
  }

  // Private: Save which channels and groups this bot is in and log them.
  onClientOpened() {
    this.channels = _.keys(this.slack.channels)
      .map(k => this.slack.channels[k])
      .filter(c => c.is_member);

    this.groups = _.keys(this.slack.groups)
      .map(k => this.slack.groups[k])
      .filter(g => g.is_open && !g.is_archived);
      
    this.dms = _.keys(this.slack.dms)
      .map(k => this.slack.dms[k])
      .filter(dm => dm.is_open);

    console.log(`Welcome to Slack. You are ${this.slack.self.name} of ${this.slack.team.name}`);

    if (this.channels.length > 0) {
      console.log(`You are in: ${this.channels.map(c => c.name).join(', ')}`);
    } else {
      console.log('You are not in any channels.');
    }

    if (this.groups.length > 0) {
      console.log(`As well as: ${this.groups.map(g => g.name).join(', ')}`);
    }
    
    if (this.dms.length > 0) {
      console.log(`Your open DM's: ${this.dms.map(dm => dm.name).join(', ')}`);
    }
  }
}

module.exports = ChatBot;

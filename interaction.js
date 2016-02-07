const rx = require('rx');
const _ = require('underscore-plus');

var fs = require('fs');
var linksArray = fs.readFileSync('links.txt').toString().split("\n");

class Interaction {
  // Public: Responds and waits for a specified period.
  //
  // messages - An {Observable} representing new messages sent to the channel
  // channel - The {Channel} object, used for posting messages
  // timeout - (Optional) The amount of time to conduct polling, in seconds
  //
  // Returns an {Observable} that will `onNext` for each user that types 'abc'.
  static pollPotentialUsers(messages, channel, timeout=5) {

    let link = linksArray[Math.floor(Math.random() * linksArray.length)]
    channel.send(link);
    
    let timeExpired = Interaction.wait(timeout);

    // Look for messages containing the word 'abc' and map them to a unique user ID
    let newUsers = messages.where(e => e.text && e.text.toLowerCase().match(/\babc\b/))
      .map(e => e.user)
      .distinct()
      .publish();

    newUsers.connect();
    timeExpired.connect();

    // Once our timer has expired, we resume responding to messages from target
    // user.
    return newUsers.takeUntil(timeExpired);
  }

  // Private: Posts a message to the channel with some timeout.
  //
  // channel - The channel to post in.
  // formatMessage - A function that will be invoked once per second with the
  //                 remaining time, and returns the formatted message content.
  // timeout - The duration of the message, in seconds.
  //
  // Returns an {Observable} sequence that signals expiration of the message.
  static wait(timeout) {

    let timeExpired = rx.Observable.timer(0, 1000, rx.Scheduler.timeout)
      .take(timeout + 1)
      .publishLast();

    return timeExpired;
  }
}

module.exports = Interaction;

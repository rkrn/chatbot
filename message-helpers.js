class MessageHelpers {
  // Public: Checks whether the message text contains an @-mention for the
  // given user.
  static containsUserMention(text) {
    return text && ( text.startsWith('```') || text.startsWith('<http'));
  }
}

module.exports = MessageHelpers;

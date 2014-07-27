Template.challenge.challengerName = function() {
  if (this.type === "wild") {
    return "A wild Pokemon";
  } else if (this.type === "trainer"){
    if (globalUserId == this.playerId1)
      return this.playerName1;
    else
      return this.playerName2;
  }
};

Template.challenge.hasAccepted = function(){
  if (globalUserId == this.playerId1)
    return this.playerStatus1 === "accepted";
  else
    return this.playerStatus2 === "accepted";
}

Template.challenge.challengeIsRejected = function() {
  return this.rejected;
}


Template.challenge.events = {
  'click .accept': function(evt) {
    var playerId = globalUserId;
    Meteor.call("acceptChallenge", playerId, this._id);
  },

  'click .reject': function(evt) {
    var playerId = globalUserId;
    Meteor.call("rejectChallenge", playerId, this._id);
  }

}
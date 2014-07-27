Template.challenge.challengerName = function() {
  if (this.type === "wild") {
    return "A wild Pokemon";
  } else if (this.type === "trainer"){
    if (Meteor.userId() == this.playerId1)
      return this.playerName2;
    else
      return this.playerName1;
  }
};

Template.challenge.hasAccepted = function(){
  if (Meteor.userId() == this.playerId1)
    return this.playerStatus1 === "accepted";
  else
    return this.playerStatus2 === "accepted";
}

Template.challenge.challengeIsRejected = function() {
  return this.rejected;
}

Template.challenge.acceptanceResult = function() {
  if (Template.challenge.hasAccepted.call(this)) {
    var status = (Meteor.userId() === this.playerId1) ? 
                  this.playerStatus2 : this.playerStatus1;
    switch (status) {
      case "accepted":
        return otherPlayerAccepted.call(this);
      case "rejected":
        return otherPlayerRejected.call(this);
      default:
        return;
    }
  }
}

Template.challenge.events = {
  'click .accept': function(evt) {
    var playerId = Meteor.userId();
    Meteor.call("acceptChallenge", playerId, this._id);
  },

  'click .reject': function(evt) {
    var playerId = Meteor.userId();
    Meteor.call("rejectChallenge", playerId, this._id);
    window.location.href = "/";
  }

}


function otherPlayerRejected() {
  window.setTimeout(function() {
    window.location.href = "/";
  }, 2000)
  return "Other player rejected. Returning to main menu..."

}

function otherPlayerAccepted() {
  window.setTimeout(function() {
    window.location.href = "/battle/" + this.battleId;
  }, 2000)
  return "Other player accepted! Now heading into battle..."

}
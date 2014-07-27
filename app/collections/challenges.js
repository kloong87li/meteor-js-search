Challenges = new Meteor.Collection('challenges');

if (Meteor.isServer) {
  Meteor.publish('singleChallenge', function(id) {
    return id && Challenges.find(id);
  });
}

Meteor.methods({

  createChallenge: function (type, id1, id2) {
    var challenge = {
      type: type,
      playerId1: id1,
      playerName1: "testguy1",
      playerStatus1: null,
      playerId2: id2,
      playerName2: "testguy2",
      playerStatus2: null,
      rejected: false
    }
    return Challenges.insert(challenge);
  },

  acceptChallenge: function(player_id, challenge_id) {
    var challenge = Challenges.findOne({_id:challenge_id});
    if (challenge.playerId1 === player_id) {
      Challenges.update({_id: challenge_id}, {$set: {'playerStatus1': "accepted"}});
    } else {
      Challenges.update({_id: challenge_id}, {$set: {'playerStatus2': "accepted"}});
    }
  },

  rejectChallenge: function(player_id, challenge_id) {
    var challenge = Challenges.findOne({_id:challenge_id});
    if (challenge.playerId1 === player_id) {
      Challenges.update({_id: challenge_id}, 
        {$set:{'playerStatus1': "rejected", 'rejected': 'true'}});
    } else {
      Challenges.update({_id: challenge_id}, 
        {$set:{'playerStatus2': "rejected", 'rejected': 'true'}});
    }
  }

});
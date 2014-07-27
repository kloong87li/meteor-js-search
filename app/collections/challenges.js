Challenges = new Meteor.Collection('challenges');

if (Meteor.isServer) {
  Meteor.publish('singleChallenge', function(id) {
    return id && Challenges.find(id);
  });

  Meteor.methods({

    createChallenge: function (type, id1, id2) {
      var p1 = Meteor.users.findOne(id1);
      var p2 = Meteor.users.findOne(id2)
      var challenge = {
        type: type,
        playerId1: id1,
        playerName1: p1.profile ? p1.profile.name : p1.username,
        playerStatus1: null,
        playerId2: id2,
        playerName2: p2.profile ? p2.profile.name : p2.username,
        playerStatus2: null,
        rejected: false,
        battleId: null
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
}

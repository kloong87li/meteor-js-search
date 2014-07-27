Challenges = new Meteor.Collection('challenges');
Challenges.remove({});

createChallenge= function(type_, user1, user2, id1, id2){
	if(id1!=id2){
		console.log("initChallenge");
		Challenges.insert({type: type_,
						   player1: {userId: user1},
						   player2: {userId: user2},
						   challengeSuccess: false});
	}
}

endChallenge= function(){
	console.log("Battles.remove...");
}

if (Meteor.isServer) {
  Meteor.publish('singleChallenge', function(id) {
    return id && Challenges.find(id);
  });
}


acceptChallenge= function(player_id, challenge_id) {
var challenge = Challenges.findOne({_id:challenge_id});
if (challenge.playerId1 === player_id) {
  Challenges.update({_id: challenge_id}, {$set: {'playerStatus1': "accepted"}});
} else {
  Challenges.update({_id: challenge_id}, {$set: {'playerStatus2': "accepted"}});
}
},

rejectChallenge= function(player_id, challenge_id) {
var challenge = Challenges.findOne({_id:challenge_id});
if (challenge.playerId1 === player_id) {
  Challenges.update({_id: challenge_id}, 
    {$set:{'playerStatus1': "rejected", 'rejected': 'true'}});
} else {
  Challenges.update({_id: challenge_id}, 
    {$set:{'playerStatus2': "rejected", 'rejected': 'true'}});
}
}

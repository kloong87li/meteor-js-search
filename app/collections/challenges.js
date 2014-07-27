Challenges = new Meteor.Collection('challenges');
Challenges.remove({});

createChallenge= function(type_, user1, user2, id1, id2){
	console.log("initChallenge");
	console.log(id1);
	console.log(id2);
	Challenges.insert({type: type_,
					player1: {userId: user1},
				    player2: {userId: user2},
					challengeSuccess: false});
}

endChallenge= function(){
	console.log("Battles.remove...");
}


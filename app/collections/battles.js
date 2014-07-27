Battles = new Meteor.Collection('battles');

doMove= function(pokemon, movenum) {
	console.log("do move");
}

changePokemon= function(pokemon) {
	console.log("change pokemon");
}

initBattle= function(user1, user2, p1, p2){
	console.log("initBattle");
	Battles.insert({player1: {userId: user1, pokemonId: p2},
				    player2: {userId: user2, pokemonId: p2},
				    turn: 0,
					isOver: false});
}

endBattle= function(){
	console.log("Battles.remove...");
}
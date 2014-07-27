Battles = new Meteor.Collection('battles');

function getFirstPokemon(userId){
	// TODO: get first pokemon
	var pokemon = {};
	return pokemon;
}

function calculateDamage(attackingPokemon, defendingPokemon, move) { 
	//TODO: calculate damage
	return 0;
}

Meteor.methods({
	startBattle: function(userId1, userId2) { 
		var battle = {
			player1: {
				userId: userId1,
				username: Meteor.users.findOne({_id: userId1}).username,
				pokemon: getFirstPokemon(userId1)
			},
			player2: {
				userId: userId2,
				username: Meteor.users.findOne({_id: userId2}).username,
				pokemon: getFirstPokemon(userId2)
			},
			turn: userId1,
			isOver: false
		}

		Battles.insert(battle);
	},

	doMove: function(battleId, moveName) {
		var battle = Battles.findOne({_id: battleId});

		if(battle.turn !== Meteor.user._id) {
			throw new Meteor.Error(400, "It's not your turn");
		}

		if(user._id === battle.player1.userId){
			var me = battle.player1;
			var other = battle.player2
		} else {
			var me = battle.player2;
			var other = battle.player1
		}

		var myPokemon = Pokemon.findOne({_id: me.pokemonId});
		var otherPokemon = Pokemon.findOne({_id: other.pokemonId});
		var move = Move.findOne({name: moveName});

		// reduce pp by 1

		var damage = calculateDamage(myPokemon, otherPokemon, move);

		otherPokemon.hp = Math.max(0, otherPokemon.hp - damage);

		console.log("do move");
	},

	changePokemon: function(pokemon) {
		console.log("change pokemon");
	}
})
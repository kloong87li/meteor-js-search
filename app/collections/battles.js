Battles = new Meteor.Collection('battles');

function getFirstPokemon(userId){
	// TODO: get first pokemon
	var pokemon = {};
	return pokemon;
}

function calculateDamage(attackingPokemon, defendingPokemon, move) {
    var damage;
    damage = (((2 * attackingPokemon.level / 5 + 2)
               * move.power * attackingPokemon.attack 
               / defendingPokemon.defense) / 50 + 2)
        * (0.85 + Math.random() * 0.15);
	return damage;
}

Meteor.methods({
	startBattle: function(userId1, userId2) { 
		var battle = {
			userId1: userId1,
			username1: Meteor.users.findOne({_id: userId1}).username,
			pokemon1: getFirstPokemon(userId1),
			userId2: userId2,
			username2: Meteor.users.findOne({_id: userId2}).username,
			pokemon2: getFirstPokemon(userId2),
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

    doTurn: function(battleId) {
        var current_turn = Battles.findOne({_id:battleId}).current_turn;
        Battles.update({_id:battleId}, $set: {turn: current_turn + 1});
    }

                      
	changePokemon: function(battleId, pokemonId) {
        var battle = Battles.findOne({_id:battleId});
        var pokemon = Pokemon.findOne({_id:pokemonId});
        if (battle.playerId1 == pokemon.user_id) {
            Battles.update({_id:battleId},
                           {$set: {pokemonId1: pokemonId}});
        } else {
            Battles.update({_id:battleId},
                           {$set: {pokemonId2: pokemonId}});
        }
		console.log("changed pokemon:" + pokemonId);
	}
    
    endBattle: function(battleId, winnerId) {
        
    }

})
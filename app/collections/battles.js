Battles = new Meteor.Collection('battles');

function getFirstPokemon(userId){
	return Pokemon.findOne({userId: userId, current_hp: {$ne: 0}}, {partyPosition: 1}, {sort: {partyPosition: 1}});
}

function getEffectiveness(attackType, defendingPokemon) {
	effectiveness = 1;

	_.each(attackType.super_effective, function(se_type){
		_.each(defendingPokemon.types, function(type) { 
			if(se_type === type){
				effectiveness *=2;
			}
   		})
    })

    _.each(attackType.ineffective, function(ie_type){
		_.each(defendingPokemon.types, function(type) { 
			if(ie_type === type){
				effectiveness *=.5;
			}
   		})
    })

    _.each(attackType.no_effect, function(ne_type){
		_.each(defendingPokemon.types, function(type) { 
			if(ne_type === type){
				effectiveness *=0;
			}
   		})
    })
    return effectiveness;
}

function calculateDamage(attackingPokemon, defendingPokemon, move) {
    var damage;
    var stab = _.contains(attackingPokemon.types, move.type) ? 1.5 : 1;
    var attackStat = move.category === 'special' ? attackingPokemon.sp_atk : attackingPokemon.attack;
    var defenseStat = move.category === 'special' ? attackingPokemon.sp_def : attackingPokemon.defense;

    var effectiveness = getEffectiveness(move.type, defendingPokemon);

    
    damage = (((2 * attackingPokemon.level / 5 + 2)
               * move.power * attackStat
               / defenseStat) / 50 + 2)
        * stab * effectiveness * (0.85 + Math.random() * 0.15);
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
			offTurn: userId2,
			isOver: false
		}
        Meteor.users.update({_id:userId1}, {$set: {currentlyBusy:true}});
        Meteor.users.update({_id:userId2}, {$set: {currentlyBusy:true}});
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

		//decrement pp
		_.each(myPokemon.moves, function(move){
			if(move.name == moveName){
				move.pp--;
			}
		})
		Pokemon.update(myPokemon);

		var damage = calculateDamage(myPokemon, otherPokemon, move);

		Pokemon.update({_id: otherPokemon._id}, {$set: {current_hp : Math.max(0, otherPokemon.current_hp - damage)}});

		var effectiveness = getEffectivenss(move.type, otherPokemon);
		var effectivenessMessage = "";

		if(effectiveness > 1){
			effectivenessMessage = "super effective";
		} else if (effectiveness === 0){
			effectivenessMessage = "not effective";
		} else if (effectiveness < 1) {
			effectivenessMessage = "not very effective";
		}

		battle.lastMove = {
			effectivenessMessage: effectivenessMessage,
			otherPokemonFainted: otherPokemon.current_hp === 0,
			moveName: move.name
		}
		Battles.update(battle);
		console.log("do move");
	},


    changeTurn: function(battleId) {
        Battles.update({_id:battleId}, {$set: {turn: offTurn, offTurn: turn}});
    },

                      
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
	},
    
    endBattle: function(battleId, winnerId) {

        var battle = Battles.findOne({_id:battleId});
        var loserId;
        if (battle.playerId1 == winnerId) {
            loserId = battle.playerId2;
        } else {
            loserId = battle.playerId1;
        }
        var winnerMoney = Users.findOne({_id:winnerId}).money;
        var loserMoney = Users.findOne({_id:loserId}).money;
        loserMoney = Math.max(0, loserMoney-100);
        Meteor.users.update({_id:winnerId}, {$set: {money: winnerMoney, currentlyBusy: false}});
        Meteor.users.update({_id:loserId}, {$set: {money: loserMoney, currentlyBusy: false}});
        Battles.update({_id: battleId}, {$set: {isOver: true}});
    }

})

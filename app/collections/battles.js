Battles = new Meteor.Collection('battles');

if (Meteor.isServer) {
  Meteor.publish('singleBattleAndPokemon', function(id) {
    var battles = Battles.find(id);
    var battle = Battles.findOne(id);
    return [battles, 
        Pokemon.find()];
  });

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
      console.log(attackType, defendingPokemon.types, effectiveness)
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
    createBattle: function(userId1, userId2) { 
      var battle = {
        userId1: userId1,
        username1: Meteor.users.findOne({_id: userId1}).username,
        pokemonId1: getFirstPokemon(userId1)._id,
        userId2: userId2,
        username2: Meteor.users.findOne({_id: userId2}).username,
        pokemonId2: getFirstPokemon(userId2)._id,
        turn: userId1,
        offTurn: userId2,
        isOver: false,
        active: false
      }
          Meteor.users.update({_id:userId1}, {$set: {currentlyBusy:true}});
          Meteor.users.update({_id:userId2}, {$set: {currentlyBusy:true}});
      return Battles.insert(battle);
    },

    startBattle: function(battleId) {
      battle.update({_id: battleId}, {$set: {active: true}});
    },

    doMove: function(battleId, playerId, moveName) {
      var battle = Battles.findOne({_id: battleId});
      console.log(battle);

      if(battle.turn !== playerId) {
        throw new Meteor.Error(400, "It's not your turn");
      }

      if(playerId === battle.userId1){
        var myPokemon = Pokemon.findOne({_id: battle.pokemonId1});
      	var otherPokemon = Pokemon.findOne({_id: battle.pokemonId2});
      } else {
        var myPokemon = Pokemon.findOne({_id: battle.pokemonId2});
      	var otherPokemon = Pokemon.findOne({_id: battle.pokemonId1});
      }

      var move = Moves.findOne({name: stripMoveName(moveName)});

      //decrement pp
      _.each(myPokemon.moves, function(move){
        if(move.move == moveName){
          move.pp--;
        }
      })
      Pokemon.update(myPokemon._id, myPokemon);
      console.log("my pokemon:", Pokemon.findOne(myPokemon._id));

      var missed = Math.random()*100 > move.accuracy;
      var lastMoveText = "";
      if(missed){
        lastMoveText = "It missed!";
      } else {
        var damage = calculateDamage(myPokemon, otherPokemon, move);

        Pokemon.update({_id: otherPokemon._id}, {$set: {current_hp : Math.max(0, otherPokemon.current_hp - damage)}});

        var effectiveness = getEffectiveness(move.type, otherPokemon);
        var effectivenessMessage = "";

        if(effectiveness > 1){
          lastMovetext += "It was super effective!";
        } else if (effectiveness === 0){
          lastMoveText += "It had no effect...";
        } else if (effectiveness < 1) {
          lastMoveText += "It was not very effective...";
        }

        if(otherPokemon.current_hp === 0){
          if(lastMoveText.length > 0){
            lastMoveText += " ";
          }
          lastMoveText += otherPokemon.name + " fainted!"; 
        }
      }
      battle.lastMoveText = lastMoveText;
      battle.lastMoveName = move.name;
      Battles.update(battle._id, battle);
      console.log("do move server");
    },


      changeTurn: function(battleId) {
          var battle = Battles.findOne({_id:battleId});
          Battles.update({_id:battleId}, {$set: {turn: battle.offTurn, offTurn: battle.turn}});
      },

                        
    changePokemon: function(battleId, pokemonId) {
          var battle = Battles.findOne({_id:battleId});
          var pokemon = Pokemon.findOne({_id:pokemonId});
          if (battle.playerId1 == pokemon.userId) {
              Battles.update({_id:battleId},
                             {$set: {pokemonId1: pokemonId}});
          } else {
              Battles.update({_id:battleId},
                             {$set: {pokemonId2: pokemonId}});
          }
      console.log("changed pokemon:" + pokemonId);
    },
      
      expPokemon: function(killerId, victimId) {
          var killer = Pokemon.findOne({_id:killerId});
          var victim = Pokemon.findOne({_id:victimId});
          var exp_required = expForLevel(killer.level, 0);
          var exp_gained = victim.level
              * victim.level
              * victim.level
              * (100 - victim.level) / 50;
          var text = killer.name + " gained " + exp_gained + " experience. ";
          var current_exp = killer.exp;
          if (exp_required <= exp_gained + current_exp) {
              Pokemon.update({_id:killerId}, {$set: {level: killer.level+1,exp: exp_required-exp_gained + current_exp}});
              text = text + kill.name + " leveled up to " + killer.level + ". ";
          } else {
              Pokemon.update({_id:killerId}, {$set: {exp: exp_gained + current_exp}});
          }
          return text;
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

      Pokemon.find({userId: loserId}, {current_hp:1, hp: 1}).forEach(function(pokemon){
      	Pokemon.update({_id: pokemon._id}, {$set: {current_hp: pokemon.hp}});
      });

      Battles.update({_id: battleId}, {$set: {isOver: true}});
    }
  });
}

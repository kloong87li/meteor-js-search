Template.battle.rendered = function() {
  Session.set("isFighting", false);
}

Template.battle.battleId = function() {
  if (!this.battle) return;
  Session.set("battleId", this.battle._id);
}

Template.battle.isFighting = function() {
  return Session.get("isFighting");
}

Template.battle.hpBarWidth = function(pokemon) {
  if (!pokemon) return "100%";
  return Math.round((pokemon.current_hp / pokemon.hp) * 100) + "%";
}

Template.battle.backImage = function(pokemon) {
  if (!pokemon) return '';
  var name = pokemon.name.toLowerCase();
  var url = "http://img.pokemondb.net/sprites/black-white/anim/back-normal/";

  return url + name + ".gif";
}

Template.battle.frontImage = function(pokemon) {
  if (!pokemon) return '';
  var name = pokemon.name.toLowerCase();
  var url = "http://img.pokemondb.net/sprites/black-white/anim/normal/";
  return url + name + ".gif";
}


Template.battle.events = {
  "click #fight-button": function(e) {
    Session.set("isFighting", true);
  },

  "click .battlemenu-move": function (e) {
    Meteor.call("doMove", Session.get("battleId"), Meteor.userId(), this.move, 
      function(e, res) {
        if (!e) {
          Session.set("isFighting", false);
          Meteor.call("changeTurn", Session.get("battleId"));
        }
    });
  }
}

Template.battle.turnText = function() {
  if (!this.battle) return;
  if (Meteor.userId() == this.battle.turn) {
    return "It's your turn";
  } else {
    return "It's not your turn";
  }
}

Template.battle.myPokemon = function() {
  if (!this.battle) return;
  if (this.battle.userId1 == Meteor.userId()) {
    return this.pokemon1;
  } else {
    return this.pokemon2;
  }
}

Template.battle.oppPokemon = function() {
  if (!this.battle) return;
  if (this.battle.userId1 == Meteor.userId()) {
    return this.pokemon2;
  } else {
    return this.pokemon1;
  }
}

Template.battle.myPokemonFainted = function (){
  var mine = Template.battle.myPokemon.call(this);
  if (!mine) return;
  var fainted = mine.current_hp <= 0;
  if (!Pokemon.findOne({userId: Meteor.userId(), current_hp: {$gt: 0}})) {
    endBattle.call(this);
  } else {
    switchPokemon.call(this);
    return fainted;
  }
  
}

Template.battle.flavorText = function (){
  if (!this.battle || ! this.battle.lastMovePokemon) return ""; 
  var res = this.battle.lastMovePokemon + " used " + this.battle.lastMoveName + ". ";
  res += this.battle.lastMoveText;
  return res;
}


Template.battle.myPartyPokemon = function() {
  return Pokemon.find({userId: Meteor.userId()});
}

function endBattle() {
  var winner = Meteor.userId() === this.battle.userId1 ? this.battle.userId2 : this.battle.userId1;
  Meteor.call("endBattle", this.battle._id, winner, function(e, res) {
    if (e) console.log("Error ending battle", e);
  })
}

function switchPokemon() {
  var newPoke = Pokemon.findOne({userId: Meteor.userId(), current_hp: {$gt: 0}});
  Meteor.call("changePokemon", this.battle._id, newPoke._id, function(e) {
    if (e) console.log("Error switching pokemon", e);
  });
}

Template.battle.battleOverText = function (){
  var status = Meteor.userId() === this.battle.winnerId ? "won!" : "lost.";
  return "Battle Over. You " + status;
}
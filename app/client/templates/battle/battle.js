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
    console.log("do move client");
    Meteor.call("doMove", Session.get("battleId"), Meteor.userId(), this.move, 
      function(e, res) {
        console.log(this.battle);
        Meteor.call("changeTurn", Session.get("battleId"));
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
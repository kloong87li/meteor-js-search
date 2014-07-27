Template.battle.created = function() {
  Session.set("isFighting", false);
  Session.set("battleId", this.data.battle._id);
}

Template.battle.isFighting = function() {
  return Session.get("isFighting");
}

Template.battle.hpBarWidth = function(pokemon) {
  return Math.round((pokemon.current_hp / pokemon.hp) * 100) + "%";
}

Template.battle.backImage = function(pokemon) {
  var name = pokemon.name.toLowerCase();
  var url = "http://img.pokemondb.net/sprites/black-white/anim/back-normal/";

  return url + name + ".gif";
}

Template.battle.frontImage = function(pokemon) {
  var name = pokemon.name.toLowerCase();
  var url = "http://img.pokemondb.net/sprites/black-white/anim/normal/";

  return url + name + ".gif";
}


Template.battle.events = {
  "click #fight-button": function(e) {
    Session.set("isFighting", true);
  },

  "click .battlemenu-move": function (e) {
    Meteor.call("doMove", Session.get("battleId"), this.name,
      function(e, res) {

    });
  }


}
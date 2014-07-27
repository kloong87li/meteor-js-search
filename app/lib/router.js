if (Meteor.isClient) {
  Router.configure({
    layoutTemplate: "index"
  });


  Router.map(function() {
    this.route('home', {
      path: '/',
      template: 'home'
    });

    this.route('challenge', {
      path: '/challenge/:_id',
      template: 'challenge',
      waitOn: function() {
        return Meteor.subscribe("singleChallenge", this.params._id);
      },
      data: function() {
        var challenge = Challenges.findOne({_id: this.params._id});
        return challenge;
      }
    });

    this.route('battle', {
      path: '/battle/:_id',
      template: 'battle',
      waitOn: function() {
        return Meteor.subscribe("singleBattleAndPokemon", this.params._id);
      },
      data: function() {
        var battle = Battles.findOne({_id: this.params._id});
        var poke1 = Pokemon.findOne({_id: battle.pokemonId1});
        var poke2 = Pokemon.findOne({_id: battle.pokemonId2});
        // var battle = {
        //   _id: "dasgs",
        //   playerId1: 1,
        //   pokemonId1: 1,
        //   playerId2: 2,
        //   pokemoneId2: 2,
        //   lastMoveName: "Fireball",
        //   lastMoveText: "Critical",
        //   turn: 1,
        //   isOver: false
        // }
        // var poke1 = {
        //   name: "Charizard",
        //   level: 5,
        //   exp: 134,
        //   hp: 100,
        //   current_hp: 90,
        //   moves: [
        //     {
        //       name: "Tackle",
        //       pp: 5,
        //       max_pp: 10 
        //     },
        //     {
        //       name: "Slash",
        //       pp: 7,
        //       max_pp: 15 
        //     }
        //   ]
        // }
        // var poke2 = {
        //   name: "Gastly",
        //   level: 10,
        //   exp: 1200,
        //   hp: 200,
        //   current_hp: 200,
        //   moves: [
        //     {
        //       name: "Water Gun",
        //       pp: 10,
        //       max_pp: 10 
        //     },
        //     {
        //       name: "Slash",
        //       pp: 7,
        //       max_pp: 15 
        //     }
        //   ]
        // }
        return {battle: battle, pokemon1: poke1, pokemon2: poke2};
      }
    });
    
    this.route('pokedex', {
      path: '/pokedex/',
      template: 'pokedex',
      waitOn: function() {
        return [Meteor.subscribe("pokemonData"), Meteor.subscribe("sprites")];
      },
      data: function() {
        PokemonData.find();
      }
    })
  });
}
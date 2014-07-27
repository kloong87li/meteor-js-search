Meteor.publish('pokemonData', function(options) {
  return PokemonData.find({}, options);
});

Meteor.publish('moves', function(options) {
  return Moves.find({}, options);
});

Meteor.publish('sprites', function(options) {
  return Sprites.find({}, options);
});
Battles = new Meteor.Collection('battles');

Meteor.methods({
	doMove: function(pokemon, movenum) {
		console.log("do move");
	},

	changePokemon: function(pokemon) {
		console.log("change pokemon");
	}
})
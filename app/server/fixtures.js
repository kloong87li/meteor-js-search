var totalPokemon = 0;
var totalMoves = 0;
var totalTypes = 0;

loadData = false;

if(loadData) {
	var totalPokemon = 150;
	var totalMoves = 625;
	var totalTypes = 18;
}

function loadPokemon(number) { 
	console.log("load" + number);
	if(number > 0 && number <= totalPokemon) {
		var prefix = 'http://www.pokeapi.co/api/v1/pokemon/';
		console.log(prefix + number);
		data = Meteor.http.get(prefix + number, function(err, data) { 
			if(err){
				console.log(err);
			} else {
				PokemonData.insert(data.data);
				loadPokemon(number+1);
			}
		});
	}
	
}

function loadMove(number) { 
	console.log("load" + number);
	if(number > 0 && number <= totalMoves) {
		var prefix = 'http://www.pokeapi.co/api/v1/move/';
		console.log(prefix + number);
		data = Meteor.http.get(prefix + number, function(err, data) { 
			if(err){
				console.log(err);
			} else {
				Moves.insert(data.data);
				loadMove(number+1);
			}
		});
	}
	
}

function loadType(number) { 
	console.log("load" + number);
	if(number > 0 && number <= totalTypes) {
		var prefix = 'http://www.pokeapi.co/api/v1/type/';
		console.log(prefix + number);
		data = Meteor.http.get(prefix + number, function(err, data) { 
			if(err){
				console.log(err);
			} else {
				Types.insert(data.data);
				loadType(number+1);
			}
		});
	}
	
}


loadPokemon(PokemonData.find().count() + 1);
loadMove(Moves.find().count() + 1);
loadType(Types.find().count() + 1);

// Meteor.call('createPokemon', 1, 30);
// createPokemon(1, 10);
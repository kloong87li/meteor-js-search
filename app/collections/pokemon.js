Pokemon = new Meteor.Collection('pokemon');

function calculateStat(base, level) {
	var iv = 10;
	var ev = 100;
	return Math.floor(level*(iv + 2*base + ev/4)/100 + 5);
}

function calculateHp(base, level) { 
	var iv = 10;
	var ev = 100;
	return Math.floor(level*(iv + 2*base + ev/4 + 100)/100 + 5);
}

function expForLevel(level, growthRate) { 
	//TODO: do legitimately
	var exp = 0;
	for(var i = 0; i < level; i++){
		exp += i;
	}
	return exp*1000;
}

Meteor.methods({
	createPokemon: function(pokemonNum, level) {
		console.log("Creating pokemon with number " + pokemonNum + " and level " + level);
		var pokemonData = PokemonData.findOne({national_id: pokemonNum});
		var moves = _.last(
			_.sortBy(
				_.filter(pokemonData.moves, function(move){
					return move.learn_type === "level up" && move.level <= level;
				})
			, function(move){
				return move.level;
			})
		, 4);

		var moveSet = []
		for(var i = 0; i < moves.length; i++) {
			moveSet[i] = {
				move: moves[i].name,
				pp: Moves.findOne({name: moves[i].name}).pp
			}
		}

		var stats = {
			hp: calculateHp(pokemonData.hp, level),
			attack: calculateStat(pokemonData.attack, level),
			defense: calculateStat(pokemonData.defense, level),
			sp_atk: calculateStat(pokemonData.sp_atk, level),
			sp_def: calculateStat(pokemonData.sp_def, level),
			speed: calculateStat(pokemonData.speed, level)
		}

		pokemon = {
			name: pokemonData.name,
			level: level,
			types: pokemonData.types, 
			moves: moveSet,
			exp: expForLevel(level),
			stats: stats,
			hp: stats.hp
		}
		Pokemon.insert(pokemon);
	}
}) 
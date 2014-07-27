Pokemon = new Meteor.Collection('pokemon');

if (Meteor.isServer) {
	// Pokemon.remove({}); 
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

	function createPokemon(pokemonNum, level) {
		console.log("Creating pokemon with number " + pokemonNum + " and level " + level);
		var pokemonData = PokemonData.findOne({national_id: pokemonNum});
		var moves = _.last(
			_.sortBy(
				_.filter(pokemonData.moves, function(move){
					var moveData = Moves.findOne({name: stripMoveName(move.name)});
					return move.learn_type === "level up" && move.level <= level && moveData.category !== "status";
				})
			, function(move){
				return move.level;
			})
		, 4);

		var moveSet = []
		for(var i = 0; i < moves.length; i++) {
			max_pp = Moves.findOne({name: stripMoveName(moves[i].name)}).pp;
			moveSet[i] = {
				move: moves[i].name,
				pp: max_pp,
				max_pp: max_pp
			}
		}

		var types = _.map(pokemonData.types, function(type){
			return type.name;
		})
		console.log(types);

		pokemon = {
			name: pokemonData.name,
			level: level,
			//image_url: "http://pokeapi.co" + Sprites.findOne({id: pokemonData.national_id+1}).image,
			types: types,
			moves: moveSet,
			exp: expForLevel(level),
			hp: calculateHp(pokemonData.hp, level),
			attack: calculateStat(pokemonData.attack, level),
			defense: calculateStat(pokemonData.defense, level),
			sp_atk: calculateStat(pokemonData.sp_atk, level),
			sp_def: calculateStat(pokemonData.sp_def, level),
			speed: calculateStat(pokemonData.speed, level),
			current_hp: calculateHp(pokemonData.hp, level),
		}
		return pokemon;
	}
	Meteor.methods({
		createFirstPokemon: function(userId) {
			var level = 25;
			var pokemonNum = 1 + Math.floor(Math.random() * 3)*3;
			var pokemon = createPokemon(pokemonNum, level);
			pokemon.userId = userId;
			pokemon.partyPosition = 1;
			
			console.log(Pokemon.findOne(Pokemon.insert(pokemon)));
			return pokemon;
		},

		createPokemon: function(pokemonNum, level) {
			Pokemon.insert(createPokemon(pokemonNum, level));
			return pokemon;
		}
	})
}

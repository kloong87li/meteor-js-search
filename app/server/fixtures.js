// var cheerio = Meteor.require('cheerio');

function scrape() {
	Meteor.http.get('http://pokemondb.net/move/all', function(err, data) { 
		if(err){
			console.log(err);
			return;
		}
		var $ = cheerio.load(data.content);
		$('#moves tbody tr').each(function(row){
			var name = $(this).find('.ent-name').first().text()
			var type = $(this).find('.type-icon').first().text().toLowerCase();
			var category = $(this).find('.icon-move-cat').first().text().toLowerCase();
			var strippedName = stripMoveName(name);
			if(!Moves.findOne({name: strippedName})){
				console.log('move ' + name + ' not found!!');
			} else {
				Moves.update({name: strippedName}, {$set: {type: type, category: category}});
			}
		})
	});
}


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
				data.data.name = stripMoveName(data.data.name);
				Moves.insert(data.data);
				loadMove(number+1);
			}
		});
	} else {
		//scrape();
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

if(loadData){
	loadPokemon(PokemonData.find().count() + 1);
	loadMove(Moves.find().count() + 1);
	loadType(Types.find().count() + 1);
}


if(Meteor.users.find().count() == 0) {
	// initialize fake users;

}

// Meteor.call('createPokemon', 1, 30);
// createPokemon(1, 10);

//===============location stuff ===========================================
FakeUsers= new Meteor.Collection("FakeUsers");
FakeUsers.remove({});
Challenges.remove({});
FakeUsers.insert({name: 'testing1',
				  location: {lat: 1.0, lon: 1.1},
				  numpokeballs: 0,
				  money: 100,
				  currentlyBusy: false});
FakeUsers.insert({name: 'testing2',
				  location: {lat: 2.0, lon: 2.1},
				  numpokeballs: 0,
				  money: 100,
				  currentlyBusy: false});
FakeUsers.insert({name: 'testing3',
				  location: {lat: 3.0, lon: 3.1},
				  numpokeballs: 0,
				  money: 100,
				  currentlyBusy: false});

var rangeSensitivity=10;

function calcDis(lo1, lo2){
	return (lo1.lat-lo2.lat)^2+(lo1.lon-lo2.lon)^2;
}


function lookForChallenge(this_id) {
	FakeUsers.find().forEach(function(oneUser){
		UserInfo = FakeUsers.find({_id: this_id}).fetch();
		if (oneUser._id!=this_id
			&& oneUser.location
			&& oneUser.currentlyBusy == false
			&& UserInfo[0].currentlyBusy==false){
				//console.log(oneUser._id);
				//console.log(UserInfo[0]._id);
			UserInfo = FakeUsers.find({_id: this_id}).fetch();
			//console.log("checking user");
			//console.log(oneUser);
			//console.log(UserInfo[0]);
			if(calcDis(oneUser.location, UserInfo[0].location) < rangeSensitivity){

				//console.log(oneUser._id);
				//console.log(UserInfo[0]._id);
  				FakeUsers.update(oneUser._id, {$set: {currentlyBusy: true}});
  				FakeUsers.update(UserInfo[0], {$set: {currentlyBusy: true}});
				return createChallenge("trainer", oneUser.name, UserInfo[0].name, oneUser._id, UserInfo[0]._id);
			}
		}
	 	//console.log( "No Qualified user"); 
	})
}

HTTP.methods({
'/test': {
  method: function(data) {
  	//console.log("printing received JSON:");
  	//console.log(data);
	var UserInfo = FakeUsers.find({name: data.name}).fetch();
  	if(data.lon)
  	{
  		FakeUsers.update(UserInfo[0]._id,
  			{$set: {location:{lat: data.lat, lon: data.lon}}});
  		if(UserInfo[0].currentlyBusy==false){
  			lookForChallenge(UserInfo[0]._id);
			///console.log(Challenges.find().fetch());

  		}
	}
	//console.log("updated location info");
  	return "Battle is here";//JSON.stringify(Battles.find().fetch());
  }
}
});


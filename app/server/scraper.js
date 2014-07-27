var cheerio = Meteor.require('cheerio');

function scrape() {
	Meteor.http.get('http://pokemondb.net/move/all', function(err, data) { 
		if(err){
			console.log(err);
			return;
		}
		var $ = cheerio.load(data.content);
		$('#moves tbody tr').each(function(row){
			var name = $(this).find('.ent-name').first().text();
			var type = $(this).find('.type-icon').first().text();
			var category = $(this).find('.icon-move-cat').first().text();
			if(!Moves.findOne({name: stripMoveName(name)})){
				console.log('move ' + name + 'not found!!');
			}
			Moves.update({name: stripMoveName(name)}, {$set: {type: type, category: category}});
		})
	});
}



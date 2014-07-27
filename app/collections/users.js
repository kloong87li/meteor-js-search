if (Meteor.isServer) {
  Accounts.onCreateUser(function(options, user) {
  	user.money = 1000;
  	user.currentlyBusy = false;
  	user.numpokeballs = 5;
  	
    	// We still want the default hook's 'profile' behavior.
    	if (options.profile)
      	user.profile = options.profile;
    	return user;
  });

  Accounts.onLogin(function(){
  	// If the user has no pokemon yet, create one
  	if(Pokemon.find({userId: Meteor.user._id}).count() === 0){
  		Meteor.call('createFirstPokemon', Meteor.user._id);
  	}
  })
}
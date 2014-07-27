
Accounts.onCreateUser(function(options, user) {
	user.money = 1000;
	user.currentlyBusy = false;
	user.numpokeballs = 5;
	
  	// We still want the default hook's 'profile' behavior.
  	if (options.profile)
    	user.profile = options.profile;
  	return user;
});
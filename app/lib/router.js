Router.configure({
  layoutTemplate: "index"
});


Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home'
  });

  this.route('challenge', {
    path: '/challenge/:_challenge_id',
    template: 'challenge',
    data: function() { 
      // var challenge = Challenges.findOne(this.params._challenge_id)
      var challenge = {
        id: this.params._challenge_id,
        type: "wild", /* 'trainer' or 'wild' */
        challenger_id: null, /* option id of challenging player */
        challenger: null
      }
      // var player = Users.findOne(challenge.challenger_id);
      // challenge.challenger = player;
      return challenge; 
    }
  });
  
});
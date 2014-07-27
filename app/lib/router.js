Router.configure({
  layoutTemplate: "index"
});


Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home'
  });

  this.route('challenge', {
    path: '/challenge/:_id',
    template: 'challenge',
    waitOn: function() {
      return Meteor.subscribe("singleChallenge", this.params._id);
    },
    data: function() {
      var challenge = Challenges.findOne({_id: this.params._id});
      return challenge;
    }
  });
  
});
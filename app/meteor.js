if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Add a player:";
  };

  Template.hello.longitude = function() {
    return Session.get("longitude");
  };

  Template.hello.latitude = function() {
    return Session.get("latitude");
  };

  Template.hello.createPlayer = function() {
      alert(d3.select(".name").property("value"));
  };
    Template.hello.getLocation = function() {
	navigator.geolocation.getCurrentPosition(function(pos) {
          Session.set("longitude", pos.coords.longitude);
          Session.set("latitude", pos.coords.latitude);
    });
    }
  /*Template.hello.events({
    'click input': function () {
        navigator.geolocation.getCurrentPosition(function(pos) {
          Session.set("longitude", pos.coords.longitude);
          Session.set("latitude", pos.coords.latitude);
        });
    }
  });*/
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

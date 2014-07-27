if (Meteor.isClient) {
  globalUserId = 1;

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

 //  Template.hello.greeting = function () {
 //    return "Add a player:";
 //  };

 //  Template.hello.longitude = function() {
 //    return Session.get("longitude");
 //  };

 //  Template.hello.latitude = function() {
 //    return Session.get("latitude");
 //  };

 //  Template.hello.createPlayer = function() {
 //      var player = d3.select(".name").property("value");
 //      Players.insert({name : player});
 //      alert(player);
 //  };
 //    Template.hello.getLocation = function() {
	// navigator.geolocation.getCurrentPosition(function(pos) {
 //          Session.set("longitude", pos.coords.longitude);
 //          Session.set("latitude", pos.coords.latitude);
 //    });
 //    }
  /*Template.hello.events({
    'click input': function () {
        navigator.geolocation.getCurrentPosition(function(pos) {
          Session.set("longitude", pos.coords.longitude);
          Session.set("latitude", pos.coords.latitude);
        });
    }
//   });*/
 //HTTP.post('/challengesForLocation', {
 //    data: {
 //      userId: 'rex',
 //     lng: 0.5, 
 //     lat: 0.5
 //    }
 //  }, function(err, result) {
 //    console.log('Got back: ' + result.content);
 //  });

// HTTP.post('/test', {
//     data: {
//       'name': 'testing2',
//       'lon': '22.324',
//       'lat': '26.324'
//     }
//   }, function(err, result) {
//     console.log('Got back: ' + result.content);
//   });

// HTTP.post('/test', {
//     data: {
//       'name': 'testing3',
//       'lon': '32.324',
//       'lat': '36.324'
//     }
//   }, function(err, result) {
//     console.log('Got back: ' + result.content);
//   });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
    Meteor.users._ensureIndex({ loc : "2d" })
    // code to run on server at startup
  });
}

Template.home.longitude = function () {
  return Session.get("longitude");
};

Template.home.getLocation = function() {
  navigator.geolocation.getCurrentPosition(function(pos) {
     Session.set("longitude", pos.coords.longitude);
     Session.set("latitude", pos.coords.latitude);
 });
};

Template.home.events = {
  "click .pokedex": function() {
    console.log("passing id");
    if (Android)
      Android.getId(Meteor.userId());
  }
}
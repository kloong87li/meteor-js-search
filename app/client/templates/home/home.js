Template.home.longitude = function () {
  return Session.get("longitude");
};

Template.home.getLocation = function() {
  navigator.geolocation.getCurrentPosition(function(pos) {
     Session.set("longitude", pos.coords.longitude);
     Session.set("latitude", pos.coords.latitude);
 });
};
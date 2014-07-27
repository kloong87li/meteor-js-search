Template.challenge.challengerName = function() {
  if (this.type === "wild") {
    return "A wild Pokemon";
  } else if (this.type === "trainer" && this.challenger){
    return this.challenger.name;
  }
};
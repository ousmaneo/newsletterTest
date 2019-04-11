angular.module("user").filter("dateToBirthdate", function() {
  return function(input) {
    var ageDifMs = Date.now() - new Date(input).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    console.log(ageDate);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
});

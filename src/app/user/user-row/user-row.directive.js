var userRow = {
  restrict: "A",
  scope: {
    id: "@",
    firstname: "@",
    lastname: "@",
    dob: "@",
    onDelete: "&",
    onShow: "&",
    onSelect: "&"
  },
  templateUrl: "./user-row.html"
};

angular.module("user").directive("userRow", function() {
  return userRow;
});

var userDetails = {
  bindings: { user: "<" },
  controller: "UserDetailsController",
  templateUrl: "./user-details.html"
};

angular.module("user").component("userDetails", userDetails);

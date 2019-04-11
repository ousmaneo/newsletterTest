var users = {
  bindings: { users: "<" },
  controller: "UsersController",
  templateUrl: "./users.html"
};

angular.module("user").component("users", users);

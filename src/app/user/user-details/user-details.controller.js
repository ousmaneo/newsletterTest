function UserDetailsController($filter, $state) {
  var ctrl = this;

  ctrl.$onInit = function() {
    console.log("the user ", ctrl.user);
  };
}

angular
  .module("user")
  .controller("UserDetailsController", UserDetailsController);

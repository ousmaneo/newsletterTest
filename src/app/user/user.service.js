function UserService($http) {
  return {
    getUserList: function() {
      return $http
        .get("../../data/users.json", { cache: true })
        .then(resp => resp.data);
    }
  };
}

angular.module("user").factory("UserService", UserService);

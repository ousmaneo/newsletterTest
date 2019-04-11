angular
  .module("user", ["ui.router", "ui.bootstrap"])
  .config(function($stateProvider, $urlServiceProvider) {
    $urlServiceProvider.rules.otherwise({ state: "userlist" });
    $stateProvider.state("userlist", {
      url: "/users",
      views: {
        main: {
          component: "users"
        }
      },
      resolve: {
        users: function(UserService) {
          return UserService.getUserList();
        }
      }
    });
    $stateProvider.state("userdetail", {
      url: "/:userId",
      resolve: {
        user: function($transition$, UserService) {
          return UserService.getUserList().then(function(res) {
            return res.find(user => user.id == $transition$.params().userId);
          });
        }
      },
      views: {
        main: {
          component: "userDetails"
        }
      }
    });
  });

(function(angular){
'use strict';
angular.module("app", [
  "ui.router",
  "user",
  "common",
  "templates",
  "ui.bootstrap"
]);
})(window.angular);
(function(angular){
'use strict';
angular.module("common", []);
})(window.angular);
(function(angular){
'use strict';
angular
  .module("user", ["ui.router", "ui.bootstrap"])
  .config(["$stateProvider", "$urlServiceProvider", function($stateProvider, $urlServiceProvider) {
    $urlServiceProvider.rules.otherwise({ state: "userlist" });
    $stateProvider.state("userlist", {
      url: "/users",
      views: {
        main: {
          component: "users"
        }
      },
      resolve: {
        users: ["UserService", function(UserService) {
          return UserService.getUserList();
        }]
      }
    });
    $stateProvider.state("userdetail", {
      url: "/:userId",
      resolve: {
        user: ["$transition$", "UserService", function($transition$, UserService) {
          return UserService.getUserList().then(function(res) {
            return res.find(user => user.id == $transition$.params().userId);
          });
        }]
      },
      views: {
        main: {
          component: "userDetails"
        }
      }
    });
  }]);
})(window.angular);
(function(angular){
'use strict';
var app = {
  templateUrl: "./app.html"
};

angular.module("app").component("app", app);
})(window.angular);
(function(angular){
'use strict';
angular.module("user").filter("dateToBirthdate", function() {
  return function(input) {
    var ageDifMs = Date.now() - new Date(input).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    console.log(ageDate);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
});
})(window.angular);
(function(angular){
'use strict';
UserService.$inject = ["$http"];
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
})(window.angular);
(function(angular){
'use strict';
angular
  .module("common")
  .controller("ModalShowInstanceCtrl", ["$uibModalInstance", "user", function($uibModalInstance, user) {
    var ctrl = this;
    ctrl.user = user;
    console.log(user);
    ctrl.ok = function() {
      $uibModalInstance.close();
    };

    ctrl.cancel = function() {};
  }]);
})(window.angular);
(function(angular){
'use strict';
var navCmp = {
  templateUrl: "./nav.html"
};

angular.module("common").component("navCmp", navCmp);
})(window.angular);
(function(angular){
'use strict';
var userDetails = {
  bindings: { user: "<" },
  controller: "UserDetailsController",
  templateUrl: "./user-details.html"
};

angular.module("user").component("userDetails", userDetails);
})(window.angular);
(function(angular){
'use strict';
UserDetailsController.$inject = ["$filter", "$state"];
function UserDetailsController($filter, $state) {
  var ctrl = this;

  ctrl.$onInit = function() {
    console.log("the user ", ctrl.user);
  };
}

angular
  .module("user")
  .controller("UserDetailsController", UserDetailsController);
})(window.angular);
(function(angular){
'use strict';
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
})(window.angular);
(function(angular){
'use strict';
var users = {
  bindings: { users: "<" },
  controller: "UsersController",
  templateUrl: "./users.html"
};

angular.module("user").component("users", users);
})(window.angular);
(function(angular){
'use strict';
UsersController.$inject = ["$filter", "$state", "$uibModal"];
function UsersController($filter, $state, $uibModal) {
  var ctrl = this;
  ctrl.totalItems = 0;
  ctrl.currentPage = 1;
  ctrl.selectedItem = [];
  ctrl.setPage = function(pageNo) {
    ctrl.currentPage = pageNo;
  };

  ctrl.pageChanged = function() {};

  ctrl.maxSize = 10;

  ctrl.deleteUser = function(id) {
    console.log(id);
    var index = ctrl.users
      .map(i => {
        return i.id;
      })
      .indexOf(id);
    ctrl.users.splice(index, 1);
  };
  ctrl.showUser = function(user) {
    var modalInstance = $uibModal.open({
      animation: false,
      ariaLabelledBy: "modal-title",
      ariaDescribedBy: "modal-body",
      templateUrl: "showUser.html",
      controller: "ModalShowInstanceCtrl",
      controllerAs: "ctrl",
      size: "sm",
      resolve: {
        user: function() {
          return user;
        }
      }
    });

    modalInstance.result.then(function() {}, function() {});
  };
  ctrl.selectUser = function(id) {
    console.log(id);
    var index = ctrl.selectedItem
      .map(i => {
        return i;
      })
      .indexOf(id);
    if (index > -1) {
      ctrl.selectedItem.splice(index, 1);
    } else {
      ctrl.selectedItem.push(id);
    }
  };
  ctrl.getSelectedUser = function() {
    let selectedUser = [];

    selectedUser = ctrl.users.filter(i => ctrl.selectedItem.includes(i.id));

    console.log(selectedUser);
    return selectedUser;
  };
  ctrl.download = function(fileName) {
    const csvStr = insertCommaForCSV(ctrl.getSelectedUser());
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName + ".csv");
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName + ".csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    ctrl.selectedItem = [];
  };
  ctrl.deleteAllSelected = function() {
    ctrl.selectedItem.map(i => {
      ctrl.deleteUser(i);
    });
    ctrl.selectedItem = [];
  };

  function insertCommaForCSV(data) {
    let csvString = "";
    for (let i = 0; i < data.length; i++) {
      let line = "";
      for (const prop in data[i]) {
        if (prop) {
          if (line !== "") {
            line += ";";
          }
          line += data[i][prop];
        }
      }
      csvString += line + "\r\n";
    }
    return csvString;
  }

  ctrl.$onInit = function() {
    ctrl.totalItems = ctrl.users.length;
    ctrl.itemsPerPage = 10;
  };
}

angular.module("user").controller("UsersController", UsersController);
})(window.angular);
(function(angular){
'use strict';
angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./app.html','<div class="root container"><nav-cmp></nav-cmp><div ui-view="main"></div></div>');
$templateCache.put('./nav.html','<nav class="navbar navbar-default"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="#">Newsletter</a></div></div></nav>');
$templateCache.put('./user-details.html','<h1>Users Details</h1><div class="jumbotron>"><form class="form-horizontal"><div class="form-group"><label for="inputFirstName" class="col-sm-2 control-label">First Name</label><div class="col-sm-10"><input type="text" class="form-control" id="inputFirstName" ng-model="$ctrl.user.firstName"></div></div><div class="form-group"><label for="inputLastName" class="col-sm-2 control-label">Last Name</label><div class="col-sm-10"><input type="text" class="form-control" id="inputLastName" ng-model="$ctrl.user.lastName"></div></div><div class="form-group"><label for="inputdob" class="col-sm-2 control-label">Date of birth</label><div class="col-sm-10"><input type="text" class="form-control" id="inputdob" ng-model="$ctrl.user.dateOfBirth" disabled="disabled"></div></div><div class="form-group"><label for="inputEmail" class="col-sm-2 control-label">Email</label><div class="col-sm-10"><input type="text" class="form-control" id="inputEmail" ng-model="$ctrl.user.email" disabled="disabled"></div></div><div class="form-group"><label for="inputCountry" class="col-sm-2 control-label">Country</label><div class="col-sm-10"><input type="text" class="form-control" id="inputCountry" ng-model="$ctrl.user.country" disabled="disabled"></div></div><div class="form-group"><div class="col-sm-offset-2 col-sm-10"><button type="submit" class="btn btn-default">Save</button></div></div></form></div>');
$templateCache.put('./user-row.html','<td><input type="checkbox" ng-click="onSelect()" value="{{ id }}"></td><td>{{ firstname }} {{ lastname }}, age:{{ dob | dateToBirthdate }}</td><td><button type="button" class="btn btn-primary" ng-click="onShow()">Show</button></td><td><a class="btn btn-info" ui-sref="userdetail({ userId: id })">Edit</a></td><td><button type="button" class="btn btn-danger" ng-click="onDelete()">Delete</button></td>');
$templateCache.put('./users.html','<h1>Users Liste</h1><button ng-disabled="$ctrl.selectedItem.length<1" ng-click="$ctrl.download()" class="btn btn-primary">Download</button> <button ng-disabled="$ctrl.selectedItem.length<1" ng-click="$ctrl.deleteAllSelected()" class="btn btn-danger">Delete</button><div ng-show="$ctrl.selectedItem.length>=1">Selected count: {{ $ctrl.selectedItem.length }}</div><table class="table table-bordered table-striped"><tr user-row ng-repeat="user in $ctrl.users.slice((($ctrl.currentPage-1)*$ctrl.itemsPerPage), (($ctrl.currentPage)*$ctrl.itemsPerPage))" id="{{ user.id }}" firstname="{{ user.firstName }}" lastname="{{ user.lastName }}" dob="{{ user.dateOfBirth }}" on-delete="$ctrl.deleteUser(user.id)" on-show="$ctrl.showUser(user)" on-select="$ctrl.selectUser(user.id)"></tr></table><ul uib-pagination total-items="$ctrl.totalItems" ng-model="$ctrl.currentPage" items-per-page="$ctrl.itemsPerPage" ng-change="$ctrl.pageChanged()"></ul><script type="text/ng-template" id="showUser.html"><div class="modal-header">\n      <h4 class="modal-title" id="modal-title">User: {{ ctrl.user.id}}</h4>\n  </div>\n  <div class="modal-body" id="modal-body">\n      <div>{{ ctrl.user.firstName }} {{ ctrl.user.lastName }}, age:{{ ctrl.user.dateOfBirth | dateToBirthdate }}</div>\n  </div>\n  <div class="modal-footer">\n      <button class="btn btn-primary" type="button" ng-click="ctrl.ok()">OK</button>\n\n  </div></script>');}]);})(window.angular);
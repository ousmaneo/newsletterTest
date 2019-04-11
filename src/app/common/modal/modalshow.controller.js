angular
  .module("common")
  .controller("ModalShowInstanceCtrl", function($uibModalInstance, user) {
    var ctrl = this;
    ctrl.user = user;
    console.log(user);
    ctrl.ok = function() {
      $uibModalInstance.close();
    };

    ctrl.cancel = function() {};
  });

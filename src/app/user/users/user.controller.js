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

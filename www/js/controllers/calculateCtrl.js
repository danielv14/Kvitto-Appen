app.controller('calculateCtrl', ['$scope', '$http', 'Config', 'Items', 'WhoOwesWho', 'Calculate', 'User', function($scope, $http, Config, Items, WhoOwesWho, Calculate, User) {

    // get authData from current user as an object
    var currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));
    // set scope variable from factories
    $scope.config = Config.getConfigArray(currentUser.google.id);

    // calculate click button
    $scope.calculate = function() {

      // create variables that read from the input fields
      var amount = $scope.amount;
      var person1 = $scope.person1;
      var person2 = $scope.person2;
      var whoPaid = $scope.data.singleSelect;
      var category = $scope.category.name;
      var note = $scope.note;

      // call factory function to do calculations
      Calculate.calculate(amount, person1, person2, whoPaid, category, note);

    }

  }])

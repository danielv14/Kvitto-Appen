app.controller('calculateCtrl', ['$scope', '$http', 'Config', 'Items', 'WhoOwesWho', 'Calculate', function($scope, $http, Config, Items, WhoOwesWho, Calculate) {

    // set scope variable from factories
    $scope.items = Items;
    $scope.config = Config;
    $scope.who = WhoOwesWho;

    // calculate click button
    $scope.calculate = function() {

      // create variables that read from the input fields
      var amount = $scope.amount;
      var person1 = $scope.person1;
      var person2 = $scope.person2;
      var whoPaid = $scope.data.singleSelect;
      var category = $scope.category.name;

      // call factory function to do calculations
      Calculate.calculate(amount, person1, person2, whoPaid, category);

    }

  }])

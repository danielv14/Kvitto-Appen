app.controller('calculationsCtrl', ['$scope', '$http', 'Config', 'Items', 'WhoOwesWho', 'DetermineDebt', function($scope, $http, Config, Items, WhoOwesWho, DetermineDebt) {
    // set scope variable from factories
    $scope.items = Items;
    $scope.config = Config;
    $scope.who = WhoOwesWho;


    // attach sessionStorage values (cost for each person and percentage)
    // to scope variables and use them later of to save receipt to db
    $scope.person1 = parseFloat(sessionStorage.costPerson1);
    $scope.person2 = parseFloat(sessionStorage.costPerson2);

    // set percentage to scope
    $scope.person1_percent = parseFloat(sessionStorage.percentagePerson1);
    $scope.person2_percent = parseFloat(sessionStorage.percentagePerson2);

    // function to save values to db
    $scope.save = function() {
      console.log('saving');

      // add to reciept database
      $scope.items.$add({
        costPerson1: $scope.person1,
        costPerson2: $scope.person2,
        namePerson1: $scope.config[0].$value,
        namePerson2: $scope.config[1].$value,
        'createdAt': Firebase.ServerValue.TIMESTAMP,
        'done': false,
        'whoPayed': sessionStorage.whoPaid,
        'category': sessionStorage.category
      })

      // call factory to determine debt's and update firebase db
      DetermineDebt.increaseDebt($scope.who[0].$value, $scope.who[1].$value);

    }
  }])

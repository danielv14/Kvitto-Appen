app.controller('calculationsCtrl', ['$scope', '$http', 'Config', 'Items', 'DetermineDebt', function($scope, $http, Config, Items, DetermineDebt) {

    // get authData from current user as an object
    var currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));

    // create variable for id of current user depending on OAuth
    if (currentUser.provider == 'google') {
      var id = currentUser.google.id;
    } else if (currentUser.provider == 'facebook') {
      var id = currentUser.facebook.id;
    }

    // set scope variable from factories
    $scope.items = Items.getItemsArray(id);
    $scope.config = Config.getConfigArray(id);
    $scope.debt = DetermineDebt.getDebtArray(id);

    // attach sessionStorage values (cost for each person and percentage)
    // to scope variables and use them later of to save receipt to db
    $scope.person1 = parseFloat(sessionStorage.costPerson1);
    $scope.person2 = parseFloat(sessionStorage.costPerson2);

    // set percentage to scope
    $scope.person1_percent = parseFloat(sessionStorage.percentagePerson1);
    $scope.person2_percent = parseFloat(sessionStorage.percentagePerson2);

    // function to save values to db
    $scope.save = function() {

      // add to reciept database
      $scope.items.$add({
        costPerson1: $scope.person1,
        costPerson2: $scope.person2,
        namePerson1: $scope.config[0].$value,
        namePerson2: $scope.config[1].$value,
        'createdAt': Firebase.ServerValue.TIMESTAMP,
        'done': false,
        'whoPaid': sessionStorage.whoPaid,
        'category': sessionStorage.category,
        'note': sessionStorage.note
      })

      // call factory to determine debt's and update firebase db
      DetermineDebt.increaseDebt($scope.debt[0].$value, $scope.debt[1].$value, id);

    }
  }])

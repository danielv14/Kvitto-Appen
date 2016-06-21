// controller for the not finished page
app.controller('unpaidCtrl',['$scope', '$http', 'Items', 'Config', 'WhoOwesWho', 'DetermineDebt', function($scope, $http, Items, Config, WhoOwesWho, DetermineDebt) {

  // get authData from current user as an object
  var currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));

  // create variable for id of current user
  var id = currentUser.google.id;
  
  // set up scope variables
  $scope.notFinished = Items.getItemsArray(currentUser.google.id);
  $scope.config = Config.getConfigArray(currentUser.google.id);
  $scope.who = WhoOwesWho.getDebtArray(currentUser.google.id);
  $scope.totalPerson1 = 0;
  $scope.totalPerson2 = 0;

  // function to mark a object as done
  $scope.markDone = function(object) {
    console.log('marking item done with id', object);
    // set receipt to done
    var receipt = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt/' + object);
    receipt.update({
      done: true
    });

    // varaibles for cost for person1 and person2
    var person1Cost = 0;
    var person2Cost = 0;
    var whoPayed = '';

    // get snapshot once
    receipt.once("value", function(snapshot) {
      // change the variables with data from the snapshot
      console.log(snapshot.val().whoPayed);
      person1Cost = snapshot.val().costPerson1;
      person2Cost = snapshot.val().costPerson2;
      whoPayed = snapshot.val().whoPayed;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    console.log(whoPayed);
    // call factory to determine the debt
    DetermineDebt.decreaseDebt($scope.who[0].$value, $scope.who[1].$value,
                              whoPayed, person1Cost, person2Cost, id);




  }

}])

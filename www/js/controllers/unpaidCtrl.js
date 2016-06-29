// controller for the not finished page
app.controller('unpaidCtrl',['$scope', '$http', 'Items', 'Config', 'DetermineDebt', function($scope, $http, Items, Config, DetermineDebt) {

  // get authData from current user as an object
  var currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));

  // create variable for id of current user depending on OAuth
  if (currentUser.provider == 'google') {
    var id = currentUser.google.id;
  } else if (currentUser.provider == 'facebook') {
    var id = currentUser.facebook.id;
  }

  // open up a new connection to receipts section in db
  var qRef =  new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt');

  // snapshot to get done and not done receipts
  qRef.on("value", function(snapshot) {
    var person1Count = 0;
    var person2Count = 0;
    // loop through each snapshot
    snapshot.forEach(function(receipt) {
      var obj = receipt.val();
      // if receipt is not done, iterate count
      if (obj.whoPaid === 'person1') {
        person1Count += 1;
      } else if (obj.whoPaid === 'person2') {
        person2Count += 1;
      }
    })

    // attach unpaid and paid count to scope
    $scope.person1Count = person1Count;
    $scope.person2Count = person2Count;
  });



  // set up scope variables
  $scope.notFinished = Items.getItemsArray(id);
  $scope.config = Config.getConfigArray(id);
  $scope.debt = DetermineDebt.getDebtArray(id);
  $scope.totalPerson1 = 0;
  $scope.totalPerson2 = 0;

  // function to mark a object as done
  $scope.markDone = function(object) {

    // set receipt to done
    var receipt = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt/' + object);
    receipt.update({
      done: true
    });

    // varaibles for cost for person1 and person2
    var person1Cost = 0;
    var person2Cost = 0;
    var whoPaid = '';

    // get snapshot once
    receipt.once("value", function(snapshot) {
      // change the variables with data from the snapshot
      console.log(snapshot.val().whoPaid);
      person1Cost = snapshot.val().costPerson1;
      person2Cost = snapshot.val().costPerson2;
      whoPaid = snapshot.val().whoPaid;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // call factory to determine the debt
    DetermineDebt.decreaseDebt($scope.debt[0].$value, $scope.debt[1].$value,
                              whoPaid, person1Cost, person2Cost, id);




  }

}])

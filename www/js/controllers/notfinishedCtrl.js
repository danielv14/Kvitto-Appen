// controller for the not finished page
app.controller('notFinishedCtrl',['$scope', '$http', 'Items', 'Config', 'WhoOwesWho', function($scope, $http, Items, Config, WhoOwesWho) {
  console.log('notFinishedCtrl working');

  // set up scope variables
  $scope.notFinished = Items;
  $scope.config = Config;
  $scope.who = WhoOwesWho;
  $scope.totalPerson1 = 0;
  $scope.totalPerson2 = 0;

  // function to mark a object as done
  $scope.markDone = function(object) {
    console.log('marking item done with id', object);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: true
    });

    // get whoRef
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');

    // varaibles for cost for person1 and person2
    var person1Cost = 0;
    var person2Cost = 0;
    var whoPayed = '';

    // get snapshot once
    itemRef.once("value", function(snapshot) {
      // change the variables with data from the snapshot
      person1Cost = snapshot.val().costPerson1;
      person2Cost = snapshot.val().costPerson2;
      whoPayed = snapshot.val().whoPayed;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // update who owes who values
    if (whoPayed == 'person1') {
      tempValue = $scope.who[1].$value; // create temp-value from person 2
      whoRef.update({
        person2owesperson1: tempValue - person2Cost
      })
    }

    if (whoPayed == 'person2') {
      tempValue = $scope.who[0].$value;
      whoRef.update({
        person1owesperson2: tempValue - person1Cost
      })
    }

  }

}])

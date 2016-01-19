// controller for the database
app.controller('databaseCtrl',['$scope', '$http','$firebaseArray' , 'Items', 'Config', 'WhoOwesWho', function($scope, $http, $firebaseArray, Items, Config, WhoOwesWho) {
  console.log('databaseCtrl working');

  // set up scope variables from factories
  $scope.config = Config
  $scope.who = WhoOwesWho;

  // create a connection to Firebase
  var baseRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt');
  // create a scrollable reference
  var scrollRef = new Firebase.util.Scroll(baseRef, 'createdAt');

  // set scope as the scroll ref
  $scope.items = $firebaseArray(scrollRef);
  // set 5 items to display at first
  scrollRef.scroll.next(5);

  // This function is called whenever the user reaches the bottom
  $scope.loadMore = function() {
    // load the items
    scrollRef.scroll.next(2);
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  // function to mark a object as done
  $scope.markDone = function(object) {
    console.log('marking item done with id', object);

    // get whoRef
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');

    // set object to done
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: true
    });

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

  // function to mark a object as undone
  $scope.markUnDone = function(object) {
    console.log('marking item undone with id', object);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: false
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
        person2owesperson1: tempValue + person2Cost
      })
    }

    if (whoPayed == 'person2') {
      tempValue = $scope.who[0].$value;
      whoRef.update({
        person1owesperson2: tempValue + person1Cost
      })
    }

  }

  // function to delete single entry in db
  $scope.remove = function(object) {
    console.log('deleting item with it', object);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);

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

    console.log('caroline kost utanför', person1Cost);
    console.log('betalade gjorde ' + whoPayed);

    // update who owes who values
    if (whoPayed == 'person1') {
      tempValue = $scope.who[1].$value; // create temp-value from person 2
      // if the value is not zero
      if (tempValue != 0) {
        whoRef.update({
          person2owesperson1: tempValue - person2Cost
        })
      } else {
        whoRef.update({
          person2owesperson1: 0
        })
      }

    }
    // if person2 payed
    if (whoPayed == 'person2') {
      tempValue = $scope.who[0].$value;
      // if the value is not zero
      if (tempValue != 0) {
        whoRef.update({
          person1owesperson2: tempValue - person1Cost
        })
      } else {
        whoRef.update({
          person1owesperson2: 0
        })
      }

    }

    // finally remove the item from db
    itemRef.remove();

  }
}])

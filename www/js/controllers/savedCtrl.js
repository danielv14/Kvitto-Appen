// controller for the database
app.controller('savedCtrl',['$scope', '$http','$firebaseArray' , 'Items', 'Config', 'WhoOwesWho', 'DetermineDebt', function($scope, $http, $firebaseArray, Items, Config, WhoOwesWho, DetermineDebt) {


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

  $scope.items_unpaid = Items;
  // open up a new connection to receipts section in db
  var qRef =  new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt');


  qRef.on("value", function(snapshot) {
    var unpaidCount = 0;
    // loop through each snapshot
    snapshot.forEach(function(receipt) {
      // if receipt is not done, iterate count
      if (!receipt.child('done').val()) {
        unpaidCount += 1
      }
    })
    // attach unpaid count to scope
    $scope.unpaidReceiptCount = unpaidCount;

  });


  // This function is called whenever the user reaches the bottom
  $scope.loadMore = function() {
    // load the items
    scrollRef.scroll.next(2);
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  // function to mark a object as done
  $scope.markDone = function(object) {

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

    DetermineDebt.decreaseDebt($scope.who[0].$value, $scope.who[1].$value,
                              whoPayed, person1Cost, person2Cost);

  }

  // function to mark a object as undone
  $scope.markUnDone = function(object) {

    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: false
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


    // call factory to determine debt's and update firebase db
    DetermineDebt.increaseDebtWithoutSessionStorageWho($scope.who[0].$value, $scope.who[1].$value, whoPayed, person1Cost, person2Cost);



  }

  // function to delete single entry in db
  $scope.remove = function(object) {

    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    // remove the item from db
    itemRef.remove();

  }
}])

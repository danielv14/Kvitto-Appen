// controller for the database
app.controller('savedCtrl',['$scope','$firebaseArray' , 'Items', 'Config', 'DetermineDebt', function($scope, $firebaseArray, Items, Config, DetermineDebt) {

  // get authData from current user as an object
  var currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));

  // create variable for id of current user depending on OAuth
  if (currentUser.provider == 'google') {
    var id = currentUser.google.id;
  } else if (currentUser.provider == 'facebook') {
    var id = currentUser.facebook.id;
  }


  // set up scope variables from factories
  $scope.config = Config.getConfigArray(id);
  $scope.debt = DetermineDebt.getDebtArray(id);

  // create a connection to Firebase
  var baseRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt');

  // create a scrollable reference
  var scrollRef = new Firebase.util.Scroll(baseRef, 'createdAt');

  // set scope as the scroll ref
  $scope.items = $firebaseArray(scrollRef);

  // set 5 items to display at first
  scrollRef.scroll.next(5);

  $scope.items_unpaid = Items.getItemsArray(id);

  // open up a new connection to receipts section in db
  var qRef =  new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt');

  // snapshot to get unsettled receipts
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

  // function to mark a object as undone
  $scope.markUnDone = function(object) {

    // set receipt to not done
    var receipt = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt/' + object);
    receipt.update({
      done: false
    });

    // varaibles for cost for person1 and person2
    var person1Cost = 0;
    var person2Cost = 0;
    var whoPaid = '';

    // get snapshot once
    receipt.once("value", function(snapshot) {
      // change the variables with data from the snapshot
      person1Cost = snapshot.val().costPerson1;
      person2Cost = snapshot.val().costPerson2;
      whoPaid = snapshot.val().whoPaid;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


    // call factory to determine debt's and update firebase db
    DetermineDebt.increaseDebtWithoutSessionStorageWho($scope.debt[0].$value, $scope.debt[1].$value,
                                                      whoPaid, person1Cost, person2Cost, id);



  }

  // function to delete single entry in db
  $scope.remove = function(object) {

    var receipt = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt/' + object);
    // remove the item from db
    receipt.remove();

  }
}])

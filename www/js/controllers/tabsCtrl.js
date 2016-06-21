app.controller('tabsCtrl',['$scope','Items', function($scope, Items) {

  // get authData from current user as an object
  var currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));

  // open up a new connection to receipts section in db
  var qRef =  new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + currentUser.google.id + '/receipt');


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


}])

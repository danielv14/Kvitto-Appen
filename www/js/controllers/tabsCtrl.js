app.controller('tabsCtrl',['$scope','Items', function($scope, Items) {

  // get authData from current user as an object
  var currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));

  // attach id to scope depending on which OAuth provider
  if (currentUser.provider == 'google') {
    var id = currentUser.google.id;
  } else if (currentUser.provider == 'facebook') {
    var id = currentUser.facebook.id;
  }

  // open up a new connection to receipts section in db
  var qRef =  new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt');


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

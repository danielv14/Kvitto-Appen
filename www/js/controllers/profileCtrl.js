// controller for settings page.
app.controller('profileCtrl',['$scope', '$location', 'Config', 'User', '$firebaseAuth','Auth', 'Items', function($scope, $location, Config, User, $firebaseAuth, Auth, Items) {
  $scope.authData = '';

  // get authData from current user as an object
  $scope.currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));

  // create variable for id of current user
  var id = $scope.currentUser.google.id;

  console.log($scope.currentUser);

  $scope.profileImage = $scope.currentUser.google.profileImageURL;

  $scope.items = Items.getItemsArray(id);

  $scope.config = Config.getConfigArray(id);

  // open up a new connection to receipts section in db
  var qRef =  new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/receipt');

  // snapshot to fetch all receipts with unpaid value
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
    $scope.unPaid = unpaidCount;
  });




  // function to update names
  $scope.updateNames = function() {

    var configRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id + '/config');
    configRef.update({
      'person1': $scope.newNamePerson1,
      'person2': $scope.newNamePerson2
    });
  }

  $scope.resetOwes = function() {
    // create variable for who db
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + $scope.authData.uid + '/who-owes-who');
    whoRef.update({
      'person1owesperson2': 0,
      'person2owesperson1': 0,
    })
  }

  // end the auth session and change location to login state
  $scope.logout = function() {

    $scope.authObj = Auth;
    $scope.authObj.$unauth();
    $location.path('login');

  }


}])

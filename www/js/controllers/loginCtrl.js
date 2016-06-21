app.controller('loginCtrl',['$scope', '$http','$firebaseArray','User', 'Auth', function($scope, $http, $firebaseArray, User, Auth) {

  // setup reference variable
  var ref = new Firebase("https://ionic-kvitto-app.firebaseio.com/");
  var usersRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users');

  $scope.auth = Auth;


  // get authData
  $scope.authDataCallback = function(authData) {
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      // check if user exist already
      // if not, create data
      // else do nothing
      var currentUser = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + authData.uid);
      console.log(currentUser);
      currentUser.once("value", function(snapshot) {
        var a = snapshot.exists();
        if (a === true) {
          console.log('användaren finns');
        } else {
          console.log('användaren finns inte');
          User.newUser(authData);
        }
      });
      // User.newUser(authData);

    } else {
      console.log("User is logged out");
    }
  }


  // login with google
  $scope.loginWithGoogle = function() {

    // call user factory to authenticate with google
    User.loginGoogle();


  }

  $scope.amILoggedIn = function() {


    // Register the callback to be fired every time auth state changes
    ref.onAuth($scope.authDataCallback);

  }

}])

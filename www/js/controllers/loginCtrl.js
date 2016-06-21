app.controller('loginCtrl',['$scope', '$http','$firebaseArray','User', 'Auth', function($scope, $http, $firebaseArray, User, Auth) {

  // setup reference variable
  var ref = new Firebase("https://ionic-kvitto-app.firebaseio.com/");
  var usersRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users');

  $scope.auth = Auth;


  // get authData
  $scope.authDataCallback = function(authData) {
    if (authData) {
      User.exist(authData);
      User.exist(authData, authData.google.id);
      sessionStorage.currentUserId = authData.google.id;

    } else {
      console.log("User is logged out");
    }
  }


  // login with google
  $scope.loginWithGoogle = function() {

    // call user factory to authenticate with google
    User.loginGoogle();
    // setup new user if not user exists already
    ref.onAuth($scope.authDataCallback);


  }

  $scope.amILoggedIn = function() {


    // Register the callback to be fired every time auth state changes
    ref.onAuth($scope.authDataCallback);

  }

}])

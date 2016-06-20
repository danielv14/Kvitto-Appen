app.controller('loginCtrl',['$scope', '$http','$firebaseArray','User', function($scope, $http, $firebaseArray, User) {


  // login with google
  $scope.loginWithGoogle = function() {

    // call user factory to authenticate with google
    User.loginGoogle();

  }

}])

app.controller('loginCtrl',['$scope', '$location','$firebaseArray','User', 'Auth', function($scope, $location, $firebaseArray, User, Auth) {

  // setup reference variable
  var ref = new Firebase("https://ionic-kvitto-app.firebaseio.com/");
  var usersRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users');

  $scope.auth = Auth;

  // fix from http://stackoverflow.com/questions/26390027/firebase-authwithoauthredirect-woes
  // if reload is true then setTimeout to reload page and change location
  if (sessionStorage.reload) {
    delete sessionStorage.reload;
    setTimeout(function() {
      location.reload();
      $location.path('tab.calculate');
    }, 1000)
}

  // check Auth status, redirect to app if user is signed in
  Auth.$onAuth(function(authData){
    if (authData) {
      console.log('user logged in');
      console.log(authData);
      User.exist(authData, authData.google.id);
      $location.path('tab.calculate');
    } else {
      console.log('user not logged in');
    }
  })

  // login with google
  $scope.loginWithGoogle = function() {

    // set reload to true
    sessionStorage.reload = true;


    ref.authWithOAuthRedirect("google", function(error) {
      if (error) {
        console.log("Authentication Failed!", error);
      } else {
        // We'll never get here, as the page will redirect on success.
      }
    });


  }

}])

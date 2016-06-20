var app = angular.module('app')

// factory for handling user auth and such
.factory("User", function($firebaseArray) {

  var user = {
    baseRef: 'https://ionic-kvitto-app.firebaseio.com',
    usersRef: 'https://ionic-kvitto-app.firebaseio.com/users',
    uid: '',

    // login with google
    loginGoogle: function() {
      var ref = new Firebase(this.baseRef);
      ref.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      });
    },
  } // end of user object


  return {

    // login with google
    loginGoogle: function() {
      // call user function that does the authentication
      user.loginGoogle();
    }
  }
})

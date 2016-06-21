var app = angular.module('app')

// factory for handling user auth and such
.factory("User", function($firebaseArray) {

  var user = {
    baseRef: new Firebase('https://ionic-kvitto-app.firebaseio.com'),
    usersRef: new Firebase('https://ionic-kvitto-app.firebaseio.com/users'),
    uid: '',

    // login with google
    loginGoogle: function() {
      this.baseRef.authWithOAuthPopup("google", function(error, authData) {
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
    },
  }
})

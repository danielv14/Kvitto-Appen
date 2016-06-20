var app = angular.module('app')

// factory for handling user auth and such
.factory("User", function($firebaseArray) {

  var user = {
    baseRef: 'https://ionic-kvitto-app.firebaseio.com',

    hello: function() {
      console.log('hello world');
    },

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
    }
  } // end of user object


  return {

    hello: function(){
      user.hello();
    },
    // login with google
    loginGoogle: function() {
      // call user function that does the authentication
      user.loginGoogle();
    }
  }
})

var app = angular.module('app')

// factory for handling user auth and such
.factory("User", function($firebaseArray) {

  var user = {
    baseRef: new Firebase('https://ionic-kvitto-app.firebaseio.com'),
    usersRef: new Firebase('https://ionic-kvitto-app.firebaseio.com/users'),
    uid: '',

    // login with google
    loginGoogle: function() {
      this.baseRef.authWithOAuthRedirect("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      });
    },

    // check if current user exist in db or not
    // setup user if not in db
    userExist: function(authData, id) {
      // create a ref for current user
      var currentUser = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + id);
      // take a snapsot uf current user
      currentUser.once("value", function(snapshot) {
        // create variable for current user (bool value)
        var a = snapshot.exists();
        // create new user if user doesnt already exist
        if (a === false) {
          console.log('användaren finns inte. Skapar ny');
          // call function to setup new user and pass it the authData
          user.setupUser(authData);
        }
      });
    },

    // setup new user upon first login
    setupUser: function(authData) {
      if (authData.provider == 'google') {
        var user = this.usersRef.child(authData.google.id);
      } else if (authData.provider == 'facebook') {
        var user = this.usersRef.child(authData.facebook.id);
      }
      user.set({
        config: {
          person1: "John Doe",
          person2: "Jane Doe",
        },
        who_owes_who: {
          person1owesperson2: 0,
          person2owesperson1: 0
        }
      });
    }

  } // end of user object


  return {

    // login with google
    loginGoogle: function() {
      // call user function that does the authentication
      user.loginGoogle();
    },

    // create new user with setup data
    // call it if user with uid doesnt already exist
    newUser: function(authData) {
      user.setupUser(authData);
    },

    // create new user in db if user doesnt already exist
    exist: function(authData, id) {
      user.userExist(authData, id);
    }
  }
})

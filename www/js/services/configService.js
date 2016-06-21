var app = angular.module('app')

// factory for connecting to firebase db config
.factory("Config", function($firebaseArray) {

  return {
    // function to get and return $firebaseArray for current user
    // determine current user by passed uid variable
    getConfigArray: function(uid) {
      var configRef = new Firebase("https://ionic-kvitto-app.firebaseio.com/users/" + uid + "/config");
      return $firebaseArray(configRef);
    }
  }
})

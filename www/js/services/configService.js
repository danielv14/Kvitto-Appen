var app = angular.module('app')

// factory for connecting to firebase db config
.factory("Config", function($firebaseArray) {

  return {
    getConfigArray: function(uid) {
      var configRef = new Firebase("https://ionic-kvitto-app.firebaseio.com/users/" + uid + "/config");
      return $firebaseArray(configRef);
    }
  }
})

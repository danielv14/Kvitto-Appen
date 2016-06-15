var app = angular.module('app')

// factory for connecting to firebase db config
.factory("Config", function($firebaseArray) {
  var itemsRef = new Firebase("https://ionic-kvitto-app.firebaseio.com/config");
  return $firebaseArray(itemsRef);
})

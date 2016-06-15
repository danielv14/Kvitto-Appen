var app = angular.module('app')

// factory for connecting to firebase db who-owns-who
.factory("WhoOwesWho", function($firebaseArray) {
  var itemsRef = new Firebase("https://ionic-kvitto-app.firebaseio.com/who-owes-who");
  return $firebaseArray(itemsRef);
})

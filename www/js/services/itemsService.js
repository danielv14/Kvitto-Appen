var app = angular.module('app')

// factory for connecting to firebase db receipt
.factory("Items", function($firebaseArray) {
  var itemsRef = new Firebase("https://ionic-kvitto-app.firebaseio.com/receipt");
  return $firebaseArray(itemsRef);
})

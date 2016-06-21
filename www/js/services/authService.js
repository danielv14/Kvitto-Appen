var app = angular.module('app')
// let's create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://ionic-kvitto-app.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);

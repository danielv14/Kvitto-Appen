var app = angular.module('app')

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://ionic-kvitto-app.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);

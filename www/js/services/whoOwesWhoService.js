var app = angular.module('app')

// factory for connecting to firebase db who-owns-who
.factory("WhoOwesWho", function($firebaseArray) {

  return {

    getDebtArray: function(uid) {
      var debtRef = new Firebase("https://ionic-kvitto-app.firebaseio.com/users/" + uid + "/who_owes_who");
      console.log($firebaseArray(debtRef));
      return $firebaseArray(debtRef);

    }
  }
})

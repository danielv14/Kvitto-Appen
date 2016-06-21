var app = angular.module('app')

// factory for connecting to firebase db receipt
.factory("Items", function($firebaseArray) {

  return {

    // function to get and return $firebaseArray for current user and recepies
    getItemsArray: function(uid) {
      var itemsRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + uid + '/receipt');
      return $firebaseArray(itemsRef);
    }

  }
})

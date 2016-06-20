var app = angular.module('app')

// factory for connecting to firebase db config
.factory("User", function($firebaseArray) {

  function hello () {
    console.log('hello world');
  }


  return {

    hello: function(){
      hello();

    }
  }
})

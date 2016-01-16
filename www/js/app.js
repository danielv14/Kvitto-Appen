
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic', 'app.controllers', 'angularMoment'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.calculate', {
    url: '/calculate',
    views: {
      'tab-calculate': {
        templateUrl: 'templates/calculate.html'

      }
    }
  })

  .state('tab.saved', {
    url: '/saved',
    views: {
      'tab-saved': {
        templateUrl: 'templates/saved.html',
        controller: 'databaseCtrl'
      }
    }

  })

  .state('tab.notFinished', {
    url: '/notfinished',
    views: {
      'tab-notfinished': {
        templateUrl: 'templates/notFinished.html',
        controller: 'notFinishedCtrl'
      }
    }

  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/settings.html'
      }
    }

  })
  $urlRouterProvider.otherwise('/tab/calculate')

})


// factory for connecting to firebase db receipt
.factory("Items", function($firebaseArray) {
  var itemsRef = new Firebase("https://ionic-kvitto-app.firebaseio.com/receipt");
  return $firebaseArray(itemsRef);
})

// factory for connecting to firebase db receipt
.factory("Config", function($firebaseArray) {
  var itemsRef = new Firebase("https://ionic-kvitto-app.firebaseio.com/config");
  return $firebaseArray(itemsRef);
})

var app = angular.module('app', ['ionic', 'angularMoment', 'firebase', 'angularMoment'])

.run(function($ionicPlatform, amMoment) {

  // set moment.js to swedish
  amMoment.changeLocale('sv');

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

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tab.calculate', {
    url: '/calculate',
    views: {
      'tab-calculate': {
        templateUrl: 'templates/calculate.html',

      }
    }
  })

  .state('tab.calculations', {
    url: '/calculations',
    views: {
      'tab-calculate': {
        templateUrl: 'templates/calculations.html',
        controller: 'calculationsCtrl'
      }
    }
  })

  .state('tab.saved', {
    url: '/saved',
    views: {
      'tab-saved': {
        templateUrl: 'templates/saved.html',
        controller: 'savedCtrl'
      }
    }

  })

  .state('tab.notFinished', {
    url: '/unpaid',
    views: {
      'tab-unpaid': {
        templateUrl: 'templates/unpaid.html',
      }
    }

  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }

  })
  $urlRouterProvider.otherwise('/tab/calculate')

})

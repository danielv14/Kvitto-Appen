// controller for settings page.
app.controller('settingsCtrl',['$scope', '$http', 'Config', 'WhoOwesWho', function($scope, $http, Config, WhoOwesWho) {
  $scope.config = Config;
  $scope.authData = '';

  var ref = new Firebase("https://ionic-kvitto-app.firebaseio.com");
  ref.onAuth(function(authData) {
    if (authData) {
      console.log("Authenticated with uid:", authData.uid);
      console.log(authData);
      $scope.authData = authData;
    } else {
      console.log("Client unauthenticated.")
    }
  });

  // function to init names in config db
  $scope.initNames = function() {
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com');
    itemRef.set({
      config: {
        'person1': 'Jane Doe',
        'person2': 'John Doe',
        'qhasInit': true
      }
    })
  }

  // function to update names
  $scope.updateNames = function() {
    console.log($scope.newNamePerson1);
    console.log($scope.newNamePerson2);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/config');
    itemRef.update({
      'person1': $scope.newNamePerson1,
      'person2': $scope.newNamePerson2
    });
  }

  $scope.resetOwes = function() {
    console.log('click click');
    // create variable for who db
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');
    whoRef.update({
      'person1owesperson2': 0,
      'person2owesperson1': 0,
    })
  }

}])

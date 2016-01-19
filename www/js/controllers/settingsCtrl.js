// controller for settings page.
app.controller('settingsCtrl',['$scope', '$http', 'Config', 'WhoOwesWho', function($scope, $http, Config, WhoOwesWho) {
  console.log('controller working');
  $scope.config = Config;
  console.log($scope.config);

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

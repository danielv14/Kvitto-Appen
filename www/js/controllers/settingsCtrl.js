// controller for settings page.
app.controller('settingsCtrl',['$scope', '$http', 'Config', 'WhoOwesWho', function($scope, $http, Config, WhoOwesWho) {
  $scope.authData = '';

  // get authData from current user as an object
  $scope.currentUser = JSON.parse(localStorage.getItem('firebase:session::ionic-kvitto-app'));
  console.log($scope.currentUser);

  // create variable for id of current user
  var id = $scope.currentUser.google.id;

  $scope.config = Config.getConfigArray($scope.currentUser.google.id);




  // // function to init names in config db
  // $scope.initNames = function() {
  //   var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com');
  //   itemRef.set({
  //     config: {
  //       'person1': 'Jane Doe',
  //       'person2': 'John Doe',
  //       'qhasInit': true
  //     }
  //   })
  // }

  // function to update names
  $scope.updateNames = function() {

    var configRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + $scope.authData.uid + '/config');
    configRef.update({
      'person1': $scope.newNamePerson1,
      'person2': $scope.newNamePerson2
    });
  }

  $scope.resetOwes = function() {
    console.log('click click');
    // create variable for who db
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + $scope.authData.uid + '/who-owes-who');
    whoRef.update({
      'person1owesperson2': 0,
      'person2owesperson1': 0,
    })
  }

}])

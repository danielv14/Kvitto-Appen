app.controller('calculationsCtrl', ['$scope', '$http', 'Config', 'Items', 'WhoOwesWho', function($scope, $http, Config, Items, WhoOwesWho) {
    // set scope variable from factories
    $scope.items = Items;
    $scope.config = Config;
    $scope.who = WhoOwesWho;

    // attach sessionStorage values (cost for each person and percentage)
    // to scope variables and use them later of to save receipt
    $scope.person1 = parseFloat(sessionStorage.costPerson1);
    $scope.person1_percent = parseFloat(sessionStorage.percentagePerson1);
    $scope.person2 = parseFloat(sessionStorage.costPerson2);
    $scope.person2_percent = parseFloat(sessionStorage.percentagePerson2);

    // function to save values to db
    $scope.save = function() {
      console.log('saving');

      // add to reciept database
      $scope.items.$add({
        costPerson1: $scope.person1,
        costPerson2: $scope.person2,
        namePerson1: $scope.config[0].$value,
        namePerson2: $scope.config[1].$value,
        'createdAt': Firebase.ServerValue.TIMESTAMP,
        'done': false,
        'whoPayed': sessionStorage.whoPaid,
        'category': sessionStorage.category
      })

      // create variable for who db
      var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');

      /*
      * logic for updating who-owes-who db depending on person1 or person2 payed
      */
      // If person1 payed
      if (sessionStorage.whoPaid == 'person1') {
        // if the value is not zero = append
        if ($scope.who[1].$value != 0) {
          tempValue = $scope.who[1].$value; // create temp-value from person 2
          whoRef.update({
            person2owesperson1: $scope.person2 + tempValue
          });
        } else {
          whoRef.update({
            person2owesperson1 : $scope.person2
          })
        }

      }
      // if person 2 payed
      if (sessionStorage.whoPaid == 'person2') {
        // if value is not zero = append
        if ($scope.who[0].$value != 0) {
          tempValue = $scope.who[0].$value;
          whoRef.update({
            person1owesperson2: $scope.person1 + tempValue
          });
          } else {
            whoRef.update({
              person1owesperson2: $scope.person1
            })
          }

      }

    }
  }])

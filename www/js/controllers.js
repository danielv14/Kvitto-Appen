angular.module('app.controllers', ['firebase', 'angularMoment'])


.controller('calculateCtrl', function($scope, $http, Config, Items) {
  console.log('calculateCtrl working!');

  // inject current names from config db to scope
  // var personRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/config');
  // console.log($firebaseArray(personRef));
  // $scope.names = $firebaseArray(personRef);
  $scope.config = Config;
  console.log($scope.config);

  // Declare global variables
  var person2_round, person1_round, person2_round_percent, person1_round_percent;

  // calculate click button
  $scope.calculate = function() {

    // create variables that read from the input fields
    var amount = $scope.amount;
    var person1 = $scope.person1;
    var person2 = $scope.person2;

    // create a total variable
    var total = Number(amount);

    // What is left after each persons own stuff is out of the picture
    var var_av_total = (parseFloat(amount) - parseFloat(person2) - parseFloat(person1)) / 2;

    // Total for each person
    var person2_total = parseFloat(person2) + parseFloat(var_av_total);
    var person1_total = parseFloat(person1) + parseFloat(var_av_total);

    // Percent for each person
    var person1_percent = (parseFloat(person1_total)*100/parseFloat(total));
    var person2_percent = (parseFloat(person2_total)*100/parseFloat(total));

    // rounded varaibles for person1.
    person1_round = Math.round(person1_total * 100) / 100; // variable for total kr
    person1_round_percent = Math.round(person1_percent * 100) / 100; // variable for % of total

    //  rounded variables for person2.
    person2_round = Math.round(person2_total * 100) / 100; // variable for total kr
    person2_round_percent = Math.round(person2_percent * 100) / 100; // variable for % of total


    // inject into scope
    $scope.person1 = person1_round;
    $scope.person1_percent = person1_round_percent;
    $scope.person2 = person2_round;
    $scope.person2_percent = person2_round_percent;

    // Fade-in the card
    $('#hidden-person1-card').addClass('visible animated bounceIn');
    $('#hidden-person2-card').addClass('visible animated bounceIn');
    $('#hidden-save-button').addClass('visible animated bounceIn');

  }

  // function to save values to db
  $scope.save = function() {
    console.log('saving');
    console.log($scope.config);

    // create variables from $scope.cofig names
    var person1 = $scope.config[0].$value;
    var person2 = $scope.config[1].$value;
    console.log('person1', person1);

    $scope.items = Items;
    console.log($scope.items);
    $scope.items.$add({
      costPerson1: $scope.person1,
      costPerson2: $scope.person2,
      namePerson1: person1,
      namePerson2: person2,
      'createdAt': Firebase.ServerValue.TIMESTAMP,
      'done': false,
    })
  }

})

// controller for the database
.controller('databaseCtrl', function($scope, $http, Items) {
  console.log('databaseCtrl working');


  $scope.items = Items;
  console.log($scope.items);

  // function to mark a object as done
  $scope.markDone = function(object) {
    console.log('marking item done with id', object);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: true
    });
  }

  // function to mark a object as undone
  $scope.markUnDone = function(object) {
    console.log('mark undone');
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: false
    });
  }

  // function to delete single entry in db
  $scope.remove = function(object) {
    console.log('deleting item with it', object);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.remove();
  }
})

// controller for the database
.controller('notFinishedCtrl', function($scope, $http, Items) {
  console.log('notFinishedCtrl working');

})

// controller for settings page, mostly handling of names for persons.
.controller('settingsCtrl', function($scope, $http, Config) {
  console.log('controller working');
  $scope.config = Config;
  console.log($scope.config);

  // function to init names in config db
  $scope.initNames = function() {
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com');
    itemRef.set({
      config: {
        'person1': 'Jane Doe',
        'person2': 'John Doe'
      }
    })
  }

  // function to update names
  $scope.updateNames = function() {
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/config');
    itemRef.update({
      'person1': $scope.person_newNamePerson1,
      'person2': $scope.person_newNamePerson2
    });
  }

})

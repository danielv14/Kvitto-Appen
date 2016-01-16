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
  var daniel_round, caroline_round, daniel_round_percent, caroline_round_percent;

  // calculate click button
  $scope.calculate = function() {

    // create variables that read from the input fields
    var amount = $('#amount').val();
    var daniel = $('#daniel').val();
    var caroline = $('#caroline').val();

    // create a total variable
    var total = Number(amount);

    // What is left after each persons own stuff is out of the picture
    var var_av_total = (parseFloat(amount) - parseFloat(daniel) - parseFloat(caroline)) / 2;

    // Total for each person
    var daniel_total = parseFloat(daniel) + parseFloat(var_av_total);
    var caroline_total = parseFloat(caroline) + parseFloat(var_av_total);

    // Percent for each person
    var caroline_percent = (parseFloat(caroline_total)*100/parseFloat(total));
    var daniel_percent = (parseFloat(daniel_total)*100/parseFloat(total));

    //  rounded variables for daniel.
    daniel_round = Math.round(daniel_total * 100) / 100; // variable for total kr
    daniel_round_percent = Math.round(daniel_percent * 100) / 100; // variable for % of total

    // rounded varaibles for caroline.
    caroline_round = Math.round(caroline_total * 100) / 100; // variable for total kr
    caroline_round_percent = Math.round(caroline_percent * 100) / 100; // variable for % of total

    // inject into scope
    $scope.daniel = daniel_round;
    $scope.caroline = caroline_round;
    $scope.daniel_percent = daniel_round_percent;
    $scope.caroline_percent = caroline_round_percent;

    // Fade-in the card
    $('#hidden-caroline-card').addClass('visible animated bounceIn');
    $('#hidden-daniel-card').addClass('visible animated bounceIn');
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
      costPerson1: $scope.caroline,
      costPerson2: $scope.daniel,
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

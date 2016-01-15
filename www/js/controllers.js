angular.module('app.controllers', ['firebase', 'angularMoment'])

// .run(function(amMoment) {
//     amMoment.changeLocale('de');
// })

.controller('calculateCtrl', function($scope, $http, Items) {
  console.log('calculateCtrl working!');
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
    console.log(Items);

    $scope.items = Items;
    $scope.items.$add({
      'caroline': $scope.caroline,
      'daniel': $scope.daniel,
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

})

app.controller('calculateCtrl', ['$scope', '$http', 'Config', 'Items', 'WhoOwesWho', function($scope, $http, Config, Items, WhoOwesWho) {
    console.log('calculateCtrl working!');
    // set scope variable as factory variable
    $scope.items = Items;
    $scope.config = Config;
    $scope.who = WhoOwesWho;

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

      // create variables from $scope.cofig names
      var person1 = $scope.config[0].$value;
      var person2 = $scope.config[1].$value;



      // add to reciept database
      $scope.items.$add({
        costPerson1: $scope.person1,
        costPerson2: $scope.person2,
        namePerson1: person1,
        namePerson2: person2,
        'createdAt': Firebase.ServerValue.TIMESTAMP,
        'done': false,
        'whoPayed': $scope.data.singleSelect,
        'category': $scope.category.name
      })

      // create variable for who db
      var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');

      /*
      * logic for updating who-owes-who db depending on person1 or person2 payed
      */
      // If person1 payed
      if ($scope.data.singleSelect == 'person1') {
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
      if ($scope.data.singleSelect == 'person2') {
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

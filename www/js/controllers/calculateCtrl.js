app.controller('calculateCtrl', ['$scope', '$http', 'Config', 'Items', 'WhoOwesWho', function($scope, $http, Config, Items, WhoOwesWho) {
    // set scope variable from factories
    $scope.items = Items;
    $scope.config = Config;
    $scope.who = WhoOwesWho;

    // Declare global variables
    var person2_round, person1_round, person2_round_percent, person1_round_percent;

    // variable to determine if save-button can be clicked or not
    $scope.preventSave = true;

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

      // store values to sessionStorage for person 1
      sessionStorage.costPerson1 = person1_round;
      sessionStorage.percentagePerson1 = person1_round_percent;
      // store values to sessionStorage for person 2
      sessionStorage.costPerson2 = person2_round;
      sessionStorage.percentagePerson2 = person2_round_percent;
      // store value to sessionStorage about who paid
      sessionStorage.whoPaid = $scope.data.singleSelect;
      // store value to sessionStorage about receipt category
      sessionStorage.category = $scope.category.name;
    }

  }])

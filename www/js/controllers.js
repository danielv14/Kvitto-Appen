angular.module('app.controllers', ['firebase', 'angularMoment'])


.controller('calculateCtrl', function($scope, $http, Config, Items, WhoOwesWho) {
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
})

// controller for the database
.controller('databaseCtrl', function($scope, $http, Items, Config, WhoOwesWho) {
  console.log('databaseCtrl working');

  // set up scope variables from factories
  $scope.config = Config
  $scope.items = Items;
  $scope.who = WhoOwesWho;



  // function to mark a object as done
  $scope.markDone = function(object) {
    console.log('marking item done with id', object);

    // get whoRef
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');

    // set object to done
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: true
    });

    // varaibles for cost for person1 and person2
    var person1Cost = 0;
    var person2Cost = 0;
    var whoPayed = '';

    // get snapshot once
    itemRef.once("value", function(snapshot) {
      // change the variables with data from the snapshot
      person1Cost = snapshot.val().costPerson1;
      person2Cost = snapshot.val().costPerson2;
      whoPayed = snapshot.val().whoPayed;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


    // update who owes who values
    if (whoPayed == 'person1') {
      tempValue = $scope.who[1].$value; // create temp-value from person 2
      whoRef.update({
        person2owesperson1: tempValue - person2Cost
      })
    }

    if (whoPayed == 'person2') {
      tempValue = $scope.who[0].$value;
      whoRef.update({
        person1owesperson2: tempValue - person1Cost
      })
    }


  }

  // function to mark a object as undone
  $scope.markUnDone = function(object) {
    console.log('marking item undone with id', object);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: false
    });

    // get whoRef
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');

    // varaibles for cost for person1 and person2
    var person1Cost = 0;
    var person2Cost = 0;
    var whoPayed = '';

    // get snapshot once
    itemRef.once("value", function(snapshot) {
      // change the variables with data from the snapshot
      person1Cost = snapshot.val().costPerson1;
      person2Cost = snapshot.val().costPerson2;
      whoPayed = snapshot.val().whoPayed;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });



    // update who owes who values
    if (whoPayed == 'person1') {
      tempValue = $scope.who[1].$value; // create temp-value from person 2
      whoRef.update({
        person2owesperson1: tempValue + person2Cost
      })
    }

    if (whoPayed == 'person2') {
      tempValue = $scope.who[0].$value;
      whoRef.update({
        person1owesperson2: tempValue + person1Cost
      })
    }

  }

  // function to delete single entry in db
  $scope.remove = function(object) {
    console.log('deleting item with it', object);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);

    // get whoRef
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');

    // varaibles for cost for person1 and person2
    var person1Cost = 0;
    var person2Cost = 0;
    var whoPayed = '';

    // get snapshot once
    itemRef.once("value", function(snapshot) {
      // change the variables with data from the snapshot
      person1Cost = snapshot.val().costPerson1;
      person2Cost = snapshot.val().costPerson2;
      whoPayed = snapshot.val().whoPayed;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    console.log('caroline kost utanför', person1Cost);
    console.log('betalade gjorde ' + whoPayed);

    // update who owes who values
    if (whoPayed == 'person1') {
      tempValue = $scope.who[1].$value; // create temp-value from person 2
      if (tempValue != 0) {
        whoRef.update({
          person2owesperson1: tempValue - person2Cost
        })
      } else {
        whoRef.update({
          person2owesperson1: 0
        })
      }

    }

    if (whoPayed == 'person2') {
      tempValue = $scope.who[0].$value;
      if (tempValue != 0) {
        whoRef.update({
          person1owesperson2: tempValue - person1Cost
        })
      } else {
        whoRef.update({
          person1owesperson2: 0
        })
      }

    }

    // finally remove the item from db
    itemRef.remove();



  }
})

// controller for the not finished page
.controller('notFinishedCtrl', function($scope, $http, Items, Config, WhoOwesWho) {
  console.log('notFinishedCtrl working');

  // set up scope variables
  $scope.notFinished = Items;
  $scope.config = Config;
  $scope.who = WhoOwesWho;
  $scope.totalPerson1 = 0;
  $scope.totalPerson2 = 0;

  // function to mark a object as done
  $scope.markDone = function(object) {
    console.log('marking item done with id', object);
    var itemRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/receipt/' + object);
    itemRef.update({
      done: true
    });

    // get whoRef
    var whoRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who');

    // varaibles for cost for person1 and person2
    var person1Cost = 0;
    var person2Cost = 0;
    var whoPayed = '';

    // get snapshot once
    itemRef.once("value", function(snapshot) {
      // change the variables with data from the snapshot
      person1Cost = snapshot.val().costPerson1;
      person2Cost = snapshot.val().costPerson2;
      whoPayed = snapshot.val().whoPayed;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    console.log('caroline kost utanför', person1Cost);
    console.log('betalade gjorde ' + whoPayed);

    // update who owes who values
    if (whoPayed == 'person1') {
      tempValue = $scope.who[1].$value; // create temp-value from person 2
      whoRef.update({
        person2owesperson1: tempValue - person2Cost
      })
    }

    if (whoPayed == 'person2') {
      tempValue = $scope.who[0].$value;
      whoRef.update({
        person1owesperson2: tempValue - person1Cost
      })
    }

  }

})

// controller for settings page.
.controller('settingsCtrl', function($scope, $http, Config, WhoOwesWho) {
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

})

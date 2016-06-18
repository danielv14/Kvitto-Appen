var app = angular.module('app')

// factory for determine who is in debt
.factory("DetermineDebt", function() {

  var debt = {
    whoPaid: '',
    currentDebtPerson1: '',
    currentDebtPerson2: '',
    newDebtPerson1: '',
    newDebtPerson2: '',
    firebase: new Firebase('https://ionic-kvitto-app.firebaseio.com/who-owes-who'),

    // set who paid the receipt
    // get value from sessionStorage
    setWhoPaid: function() {
      this.whoPaid = sessionStorage.whoPaid;
    },

    // determine current debt
    setCurrentDebt: function(person1, person2) {
      this.currentDebtPerson1 = parseFloat(person1);
      this.currentDebtPerson2 = parseFloat(person2);
    },

    // handle person1 debt if person2 paid
    person2Paid: function(value) {
      console.log('person2 betalade');
      if (debt.currentDebtPerson1 == 0) {
        debt.newDebtPerson1 = parseFloat(value);
      } else {
        debt.newDebtPerson1 = debt.currentDebtPerson1 + parseFloat(value);
      }
    },

    // handle person2 debt if person1 paid
    person1Paid: function(value) {
      console.log('person1 betalade');
      if (debt.currentDebtPerson2 == 0) {
        debt.newDebtPerson2 = parseFloat(value);
      } else {
        debt.newDebtPerson2 = debt.currentDebtPerson2 + parseFloat(value);
      }
    },

    // decrease value of person 1 if a debt is settled
    decreasePerson1: function(value) {
      if (debt.currentDebtPerson1 == 0) {
        debt.currentDebtPerson1 = 0;
      } else {
        debt.currentDebtPerson1 -= value;
      }
    },

    // decrease value of person 2 if a debt is settled
    decreasePerson2: function(value) {
      if (debt.currentDebtPerson2 == 0) {
        debt.currentDebtPerson2 = 0;
      } else {
        debt.currentDebtPerson2 -= value
      }

    }

  }

  return {

    increaseDebt: function(currentDebtPerson1, currentDebtPerson2) {
      debt.setWhoPaid();
      debt.setCurrentDebt(currentDebtPerson1, currentDebtPerson2);

      if (debt.whoPaid == 'person1') {
        debt.person1Paid(sessionStorage.costPerson2);
        debt.firebase.update({
          person2owesperson1: debt.newDebtPerson2
        });
      }

      if (debt.whoPaid == 'person2') {
        debt.person2Paid(sessionStorage.costPerson1);
        debt.firebase.update({
          person1owesperson2: debt.newDebtPerson2
        });
      }

    },

    decreaseDebt: function(currentDebtPerson1, currentDebtPerson2) {
      
    }

  }
})

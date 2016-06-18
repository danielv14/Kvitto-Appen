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

    // set who paid without utilizing sessionStorage
    // needed if the session hasn't set sessionStorage yet
    setWhoPaidWithoutSession: function(who) {
      this.whoPaid = who;
    },

    // determine current debt
    setCurrentDebt: function(person1, person2) {
      this.currentDebtPerson1 = parseFloat(person1);
      this.currentDebtPerson2 = parseFloat(person2);
    },

    // handle person1 debt if person2 paid
    // append value only if it's not zero
    person2Paid: function(value) {
      console.log('person2 betalade');
      if (debt.currentDebtPerson1 == 0) {
        debt.newDebtPerson1 = parseFloat(value);
      } else {
        debt.newDebtPerson1 = debt.currentDebtPerson1 + parseFloat(value);
      }
    },

    // handle person2 debt if person1 paid
    // append value only if it's not zero
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
        debt.currentDebtPerson2 -= value;
      }

    }

  }

  return {

    increaseDebt: function(currentDebtPerson1, currentDebtPerson2) {
      debt.setWhoPaid();
      debt.setCurrentDebt(currentDebtPerson1, currentDebtPerson2);

      // if person 1 paid
      if (debt.whoPaid == 'person1') {
        // up person 2's debt
        debt.person1Paid(sessionStorage.costPerson2);
        // update db with person 2's debt
        debt.firebase.update({
          person2owesperson1: debt.newDebtPerson2
        });
      }

      // if person 2 paid
      if (debt.whoPaid == 'person2') {
        // up person1's debt
        debt.person2Paid(sessionStorage.costPerson1);
        // update db with person 1's debt
        debt.firebase.update({
          person1owesperson2: debt.newDebtPerson2
        });
      }

    },

    // increase debt without knowing sessionStorage beforehand
    increaseDebtWithoutSessionStorageWho: function(currentDebtPerson1, currentDebtPerson2, who, costPerson1, costPerson2) {
      debt.setWhoPaidWithoutSession(who);

      console.log('person1Cost', costPerson1);
      console.log('person2Cost', costPerson2);


      // if person 1 paid
      if (debt.whoPaid == 'person1') {
        // up person 2's debt
        debt.person1Paid(costPerson2);
        console.log('ny skuld för person 1', debt.newDebtPerson1);
        // update db with person 2's debt
        debt.firebase.update({
          person2owesperson1: debt.newDebtPerson2
        });
      }

      // if person 2 paid
      if (debt.whoPaid == 'person2') {
        // up person1's debt
        debt.person2Paid(costPerson1);
        console.log('ny skuld för person 2', debt.newDebtPerson2);
        // update db with person 1's debt
        debt.firebase.update({
          person1owesperson2: debt.newDebtPerson1
        });
      }

    },

    decreaseDebt: function(debtPerson1, debtPerson2, whoPaid, person1Cost, person2Cost) {
      debt.setCurrentDebt(debtPerson1, debtPerson2);


      // if person 1 paid
      if (whoPaid == 'person1') {
        console.log('person 1 paid');
        debt.decreasePerson2(person2Cost);
        debt.firebase.update({
          person2owesperson1: debt.currentDebtPerson2
        });
      }

      // if person 2 paid
      if (whoPaid == 'person2') {
        console.log('person2 paid');
        debt.decreasePerson1(person1Cost);
        console.log()
        debt.firebase.update({
          person1owesperson2: debt.currentDebtPerson1
        });
      }

    }

  }
})

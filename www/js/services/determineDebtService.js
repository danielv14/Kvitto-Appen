var app = angular.module('app')

// factory for determine who is in debt
.factory("DetermineDebt", function() {

  var debt = {
    whoPaid: '',
    currentDebtPerson1: '',
    currentDebtPerson2: '',
    newDebtPerson1: '',
    newDebtPerson2: '',

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
      if (debt.currentDebtPerson1 == 0) {
        debt.newDebtPerson1 = parseFloat(value);
      } else {
        debt.newDebtPerson1 = debt.currentDebtPerson1 + parseFloat(value);
      }
    },

    // handle person2 debt if person1 paid
    // append value only if it's not zero
    person1Paid: function(value) {
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

    increaseDebt: function(currentDebtPerson1, currentDebtPerson2, uid) {
      debt.setWhoPaid();
      debt.setCurrentDebt(currentDebtPerson1, currentDebtPerson2);

      var debtRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + uid + '/who_owes_who');


      // if person 1 paid
      if (debt.whoPaid == 'person1') {
        // up person 2's debt
        debt.person1Paid(parseFloat(sessionStorage.costPerson2));
        // update db with person 2's debt
        debtRef.update({
          person2owesperson1: debt.newDebtPerson2
        });
      }

      // if person 2 paid
      if (debt.whoPaid == 'person2') {
        // up person1's debt
        debt.person2Paid(parseFloat(sessionStorage.costPerson1));
        // update db with person 1's debt
        debtRef.update({
          person1owesperson2: debt.newDebtPerson1
        });
      }

    },

    // increase debt without knowing sessionStorage beforehand
    increaseDebtWithoutSessionStorageWho: function(currentDebtPerson1, currentDebtPerson2, who, costPerson1, costPerson2, uid) {
      debt.setWhoPaidWithoutSession(who);

      var debtRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + uid + '/who_owes_who');


      // if person 1 paid
      if (debt.whoPaid == 'person1') {
        // up person 2's debt
        debt.person1Paid(costPerson2);
        // update db with person 2's debt
        debtRef.update({
          person2owesperson1: debt.newDebtPerson2
        });
      }

      // if person 2 paid
      if (debt.whoPaid == 'person2') {
        // up person1's debt
        debt.person2Paid(costPerson1);
        // update db with person 1's debt
        debtRef.update({
          person1owesperson2: debt.newDebtPerson1
        });
      }

    },

    decreaseDebt: function(debtPerson1, debtPerson2, whoPaid, person1Cost, person2Cost, uid) {

      debt.setCurrentDebt(debtPerson1, debtPerson2);
      debt.setWhoPaidWithoutSession(whoPaid);


      var debtRef = new Firebase('https://ionic-kvitto-app.firebaseio.com/users/' + uid + '/who_owes_who');

      // if person 1 paid
      if (debt.whoPaid == 'person1') {
        console.log('person1 betalade');
        debt.decreasePerson2(person2Cost);
        debtRef.update({
          person2owesperson1: debt.currentDebtPerson2
        });
      }

      // if person 2 paid
      if (debt.whoPaid == 'person2') {
        console.log('person2 betalade');
        debt.decreasePerson1(person1Cost);
        console.log()
        debtRef.update({
          person1owesperson2: debt.currentDebtPerson1
        });
      }

    }

  }
})

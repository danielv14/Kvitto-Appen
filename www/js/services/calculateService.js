var app = angular.module('app')

// factory to do calculations and set sessionStorage
.factory("Calculate", function() {

    var receipt = {

      amount: '',
      costPerson1: '',
      costPerson2: '',
      percentagePerson1: '',
      percentagePerson2: '',
      eachOfTotal: '',
      whoPaid: '',
      category: '',

      // set total amount
      setAmount: function(amount) {
        this.amount = amount;
      },

      // set total cost for each person
      // is dependant on setEachofTotal()
      setCostPerson: function(costPerson1, costPerson2) {
        this.costPerson1 = parseFloat(this.eachOfTotal + costPerson1);
        this.costPerson2 = parseFloat(this.eachOfTotal + costPerson2);
      },

      // set how much cost is after each individual part is gone
      // and it is divided by two
      setEachofTotal: function(amount, costPerson1, costPerson2) {
        this.eachOfTotal = (parseFloat(amount) - parseFloat(costPerson2) - parseFloat(costPerson1)) / 2;
      },

      // set who paid the receipt
      setWhoPaid: function(whoPaid) {
        this.whoPaid = whoPaid;
      },

      // set category of receipt
      setCategory: function(category) {
        this.category = category;
      },

      // set rounded percentage values for each person
      // is dependant of setCostPerson() since it uses values set from that function
      setRoundPercentage: function() {
        var person1_percent = (parseFloat(this.costPerson1)*100/parseFloat(this.amount));
        var person2_percent = (parseFloat(this.costPerson2)*100/parseFloat(this.amount));
        this.percentagePerson1 = Math.round(person1_percent * 100) / 100;
        this.percentagePerson2 = Math.round(person2_percent * 100) / 100;
      }
    }

    return {

      calculate: function(amount, costPerson1, costPerson2, whoPaid, category, note) {

        // call function to set total amount
        receipt.setAmount(amount);
        // call function to set receipt cateogry
        receipt.setCategory(category);
        // call function to set who paid
        receipt.setWhoPaid(whoPaid);
        // call function to determine the common cost of the receipt
        receipt.setEachofTotal(amount, costPerson1, costPerson2);
        // call function to set individual item cost of each person
        receipt.setCostPerson(costPerson1, costPerson2);
        // call function to set percentage for each person
        receipt.setRoundPercentage();

        /*
        * attach values to sessionStorage
        */
        // store values to sessionStorage for person 1
        sessionStorage.costPerson1 = receipt.costPerson1;
        sessionStorage.percentagePerson1 = receipt.percentagePerson1;
        // store values to sessionStorage for person 2
        sessionStorage.costPerson2 = receipt.costPerson2;
        sessionStorage.percentagePerson2 = receipt.percentagePerson2;
        // store value to sessionStorage about who paid
        sessionStorage.whoPaid = receipt.whoPaid;
        // store value to sessionStorage about receipt category
        sessionStorage.setItem("category", receipt.category);
        // can save passed note variable directly to sessionStorage
        // since it doesn't have to be altered somehow
        sessionStorage.setItem("note", note);

      }

    }



})

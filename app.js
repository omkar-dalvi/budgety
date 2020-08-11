// *BUDGET CONTROLLER
var budgetController = (function () {
  // ! Expense Constructor
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  // ! Prototype method: calcPercentage() 
  Expense.prototype.calcPercentage = function (totalIncome) {

    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else
      this.percentage = -1;
  };


  // ! Prototype method: getPercentage() 
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }

  // ! Income constructor
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // !calculateTotal sums either the inc or exp 
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });

    data.totals[type] = sum;

  };

  // ! Data structure
  var data = {
    allItems: {
      inc: [],
      exp: []
    },
    totals: {
      inc: 0,
      exp: 0
    },
    budget: 0,
    percentage: -1
  };

  // !Public object
  return {
    // ! addItem() adds an item to the data 
    addItem: function (type, desc, val) {

      var ID, newItem;
      // todo Creating ID
      // todo [1,2,3,4], next ID = 5
      // todo [1,3,5] , next ID = 6
      // todo next ID = last ID + 1 

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
      else {
        ID = 0;
      }


      //todo Creating object
      if (type === 'inc')
        newItem = new Income(ID, desc, val);
      else if (type === 'exp')
        newItem = new Expense(ID, desc, val);

      // todo Adding to data structure
      data.allItems[type].push(newItem);

      return newItem;


    },

    // !calculateBudget() calculates the total sum, expenses and budget
    calculateBudget: function () {

      // todo 1. Calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

      // todo 2. Calculate the budget
      data.budget = data.totals.inc - data.totals.exp;

      // todo 3. Calculate the percentage
      if (data.totals.inc > 0)
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      else
        data.percentage = -1;

    },

    // !getBudget() returns an object of budget, totalInc, totalExp and percentage
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },


    // !calculatePercentages() calculates the percentages of each element of expenses
    calculatePercentages: function () {

      data.allItems.exp.forEach(function (curr) {
        curr.calcPercentage(data.totals.inc);
      });
    },

    // !getPercentages returns an array of percentages
    getPercentages: function () {
      var allPerc;

      allPerc = data.allItems.exp.map(function (curr) {
        return curr.getPercentage();
      });

      return allPerc;
    },

    // !deleteItem() deletes the item from the data structure
    deleteItem: function (type, id) {
      var ids, index;

      ids = data.allItems[type].map(function (curr) {
        return curr.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }


    },

    // !testing() prints the data
    testing: function () {
      console.log(data)
    }
  }
})();



// *UI CONTROLLER
var UIController = (function () {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    itemPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function (num, type) {
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
    }

    return (type == 'inc' ? '+' : ' -') + ' ' + int + '.' + dec;

  };

  var nodeForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  // !UIController public object
  return {

    // !getInput() returns an object of the inputs from the UI
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    // ! getDOMString() returns the DOMStrings
    getDOMString: function () {
      return DOMStrings;
    },

    // !addItem() adds item to the UI
    addItem: function (obj, type) {
      var html, newHtml, element;

      // todo: 1. Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

      }
      else if (type === 'exp') {
        element = DOMStrings.expenseContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // todo: 2. Replace the placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // todo 3: Add HTML to the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },





    // !displayBudget displays the budget on the DOM
    displayBudget: function (obj) {
      var type;

      obj.budget >= 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0)
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      else
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
    },


    // !deleteListItem() deletes the item
    deleteListItem: function (selectorID) {
      var el;

      el = document.getElementById(selectorID);

      el.parentNode.removeChild(el);

    },

    // !displayPercentages() displays all percentages
    displayPercentages: function (percentages) {
      var fields;

      fields = document.querySelectorAll(DOMStrings.itemPercentageLabel);



      nodeForEach(fields, function (current, index) {
        if (percentages[index] > 0)
          current.textContent = percentages[index] + '%';
        else
          current.textContent = '---';
      });

    },

    // !displayMonth()
    displayMonth: function () {
      var now, year, monthArr, month;

      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();

      monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


      document.querySelector(DOMStrings.dateLabel).textContent = monthArr[month] + ', ' + year;


    },

    // !changedType()
    changedType: function () {
      var fields;

      fields = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputDescription + ',' +
        DOMStrings.inputValue
      );

      nodeForEach(fields, function (cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');



    },

    // ! clearFields() clears all the input fields
    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    }

  };

})();



// *GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

  // !setupEventListeners() sets the event listeners
  var setupEventListeners = function () {
    var DOMStrings = UIController.getDOMString();

    document.querySelector(DOMStrings.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {

      if (event.keyCode == 13 || event.which == 13)
        ctrlAddItem();
    });

    document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOMStrings.inputType).addEventListener('change', UIController.changedType);
  };


  // !updateBudget() updates the budget 
  var updateBudget = function () {
    var budget;

    // todo 1. Calculate the budget
    budgetController.calculateBudget();

    // todo 2. Return the budget
    budget = budgetController.getBudget();

    // todo 3. Update the budget in the UI
    UIController.displayBudget(budget);

  };

  // !updatePercentages() updates the percentages
  var updatePercentages = function () {
    var percentages;

    // todo 1. Calculate the percentages
    budgetController.calculatePercentages();

    // todo 2. Read the percentages
    percentages = budgetController.getPercentages();

    // todo 3. Update the user interface
    UIController.displayPercentages(percentages);
    console.log(percentages);


  };

  // !ctrlAddItem() adds the item
  var ctrlAddItem = function () {

    var input, newItem;

    // todo 1. Take input from the UI
    input = UIController.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {


      // todo 2. Store in data structure
      newItem = budgetController.addItem(input.type, input.description, input.value);

      // todo 3. Insert into the UI
      UIController.addItem(newItem, input.type);

      // todo 4. Clear fields
      UIController.clearFields();

      // todo 5. Calculate and update the budget
      updateBudget();

      // todo 6. Calculate and update percentages
      updatePercentages();


    }
  };


  // !ctrlDeleteItem() deletes the item
  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // todo 1. Delete the item from the data structure
      budgetController.deleteItem(type, ID);

      // todo 2. Delete the item from the UI
      UIController.deleteListItem(itemID);

      // todo 3. Update budget
      updateBudget();

      // todo 4. Calculate and update percentages
      updatePercentages();

    }
  };




  // !controller public object
  return {
    init: function () {
      console.log("Application started");
      UIController.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
      UIController.displayMonth();
    }
  }


})(budgetController, UIController);

// *INIT CALL
controller.init();















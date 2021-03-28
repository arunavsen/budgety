// BUDJET Controller
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum = sum + cur.value;
    });
    data.totals[type] = sum;
  }

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budjet: 0,
    percentage: -1
  };

  return {
    addItem: function (type, des, val) {
      var newItem;

      // Create new Id
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // Create new item based on 'inc' or 'exp'
      if (type === "exp") {
        newItem = new Expense(id, des, val);
      } else if (type === "inc") {
        newItem = new Income(id, des, val);
      }

      // Post it into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    calculateBudget: function(){
      // calculate total income and total expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budjet: income - expense
      data.budjet = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
      }else{
        data.percentage = -1;
      }
    },
    getBudjet:function(){
      return {
        budget: data.budjet,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },
    testing: function () {
      console.log(data);
    },
  };
})();

// UI Controller
var UIController = (function () {
  // We are creating a private object 'DOMstrings' by which we can change our class dynamicaaly
  var DOMstrings = {
    inpuType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputAddBtn: ".add__btn",
    incomeContainer: ".income__list",
    expressContainer: ".expenses__list",
    budgetLevel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage"
  };

  return {
    //  This controller is returning the Inputs by getInput function
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inpuType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml, element;

      // Create HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expressContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget:function(obj){
      document.querySelector(DOMstrings.budgetLevel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

      if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+'%';
      }else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }

    },
    // our private DOMstrings now will be public
    getDomstrings: function () {
      return DOMstrings;
    },
  };
})();

// Global App Controller
var controller = (function (budjetCtrl, UICtrl) {
  var setupEventListeners = function () {
    // We can get all DOMstrings in the 'controller' from UIController. It is now public
    var DOM = UICtrl.getDomstrings();

    // If we click the add_btn
    document
      .querySelector(DOM.inputAddBtn)
      .addEventListener("click", ctrlAddItem);

    // If we press the Enter button for adding the product
    document.addEventListener("keypress", function (event) {
      if (event.keyCode == 13 || event.which == 13) {
        ctrlAddItem();
      }
    });
  };

  var updateBudjet = function(){
    // 1. Calculate the budjet
    budjetCtrl.calculateBudget();
    // 2. Return the budjet
    var budget = budjetCtrl.getBudjet();
    // 3. Display the budjet on the UI
    UICtrl.displayBudget(budget);
  }


  var ctrlAddItem = function () {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description != "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the BudjetController
      newItem = budjetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add Item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clean the input fields
      UICtrl.clearFields();

      // calculate and update budget
      updateBudjet();
    }
  };

  return {
    init: function () {
      console.log("Application has started");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();

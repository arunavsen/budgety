// BUDJET Controller
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome>0){
      this.percentage = Math.round((this.value/totalIncome)*100);
    }else{
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
  }

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

    deleteItem: function(type,id){
      var ids, index;

      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1){
        data.allItems[type].splice(index,1);
      }
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

    calculatePercentages: function(){
      /*
      Expenses:
      a=20,
      b=30,
      c=40
      Total income: 100
      Percentage expenses:
      a=20/100 = 20%
      b=30/100 = 33.33%
      c=40/100 = 40%
      */

      data.allItems.exp.forEach(function(cur){
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function(){
      var allPerc = data.allItems.exp.map(function(cur){
        return cur.getPercentage();
      });
      return allPerc;
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
    percentageLabel: ".budget__expenses--percentage",
    container: '.container',
    expensePercLabel:'.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var nodeListForSearch = function(list, callback){
    for(var i=0; i<list.length; i++){
      callback(list[i], i);
    }
  };

  var formatNumber = function(num, type){
    var numSplit, int, dec, type;
    /*
      i) + or - before number
     ii) exctly 2 decimal points
    iii) comma separating the thousands
     ex. 2310.4576 -> +2,310.46
         2000 -> 2,000.00
         25130 -> + 25,130.00
    */

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');

    int = numSplit[0];
    dec = numSplit[1];
    if(int.length>3){
      int = int.substr(0,int.length - 3)+','+int.substr(int.length-3, int.length);
    }

    return (type === 'exp'?'-':'+')+' '+ int+'.'+dec;
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expressContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selectorId){
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
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
      var type;
      obj.budget > 0 ? type = 'inc': type='exp';

      document.querySelector(DOMstrings.budgetLevel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+'%';
      }else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }

    },

    displayPercentage: function(percentages){
      var fields = document.querySelectorAll(DOMstrings.expensePercLabel);

      var nodeListForSearch = function(list, callback){
        for(var i=0; i<list.length; i++){
          callback(list[i], i);
        }
      };

      nodeListForSearch(fields, function(current, index){
        if(percentages[index] > 0){
          current.textContent = percentages[index]+'%';
        }else{
          current.textContent='---';
        }
      });
    },


    displayMonth: function(){
      var now,month,months, year;
      now = new Date();
      months=['January','February','March','April','May','June','July','August','September','November','December'];
      year = now.getFullYear();
      month = now.getMonth();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month]+' '+year;
    },

    changedType: function(){
      var fields;

      fields = document.querySelectorAll(
        DOMstrings.inpuType+','+
        DOMstrings.inputDescription+','+
        DOMstrings.inputValue);

        nodeListForSearch(fields,function(cur){
          cur.classList.toggle('red-focus');
        });

        document.querySelector(DOMstrings.inputAddBtn).classList.toggle('red');
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

    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

    document.querySelector(DOM.inpuType).addEventListener('change', UICtrl.changedType);

  };

  var updateBudjet = function(){
    // 1. Calculate the budjet
    budjetCtrl.calculateBudget();
    // 2. Return the budjet
    var budget = budjetCtrl.getBudjet();
    // 3. Display the budjet on the UI
    UICtrl.displayBudget(budget);
  }

  var updatePercentages = function(){
    // 1. Calculate percentage
    budjetCtrl.calculatePercentages();
    // 2. Read percentages from the budget controller
    var percentages = budjetCtrl.getPercentage();
    // 3. Update the UI with the new percentages
    UICtrl.displayPercentage(percentages);
    console.log(percentages);
  };


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

      // 5. calculate and update budget
      updateBudjet();

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event){
    var itemId, splitId, type, ID;

    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemId){
      //inc-1 
      splitId = itemId.split('-');
      type = splitId[0];
      ID = parseInt(splitId[1]);

      // 1. delete the item from the data structure
      budjetCtrl.deleteItem(type,ID);
      // 2. delete the item from the UI
      UICtrl.deleteListItem(itemId);
      // 3. Update and show the new budget
      updateBudjet();
      // 4. Calculate and update percentages
      updatePercentages();
    }
  }

  return {
    init: function () {
      console.log("Application has started");
      UICtrl.displayMonth();
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

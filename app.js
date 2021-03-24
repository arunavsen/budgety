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

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }

            // Post it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },
        testing: function () {
            console.log(data);
        }
    };
})();


// UI Controller
var UIController = (function () {

    // We are creating a private object 'DOMstrings' by which we can change our class dynamicaaly
    var DOMstrings = {
        inpuType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputAddBtn: '.add__btn',
        incomeContainer: '.income__list',
        expressContainer: '.expenses__list'
    }

    return {
        //  This controller is returning the Inputs by getInput function
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inpuType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expressContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);


            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        // our private DOMstrings now will be public
        getDomstrings: function () {
            return DOMstrings;
        }
    };
})();



// Global App Controller
var controller = (function (budjetCtrl, UICtrl) {

    var setupEventListeners = function () {
        // We can get all DOMstrings in the 'controller' from UIController. It is now public
        var DOM = UICtrl.getDomstrings();

        // If we click the add_btn
        document.querySelector(DOM.inputAddBtn).addEventListener('click', ctrlAddItem);

        // If we press the Enter button for adding the product
        document.addEventListener('keypress', function (event) {
            if (event.keyCode == 13 || event.which == 13) {
                ctrlAddItem();
            }
        });
    };


    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the BudjetController
        newItem = budjetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add Item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Calculate the budjet

        // 5. Display the budjet on the UI
    }

    return {
        init: function () {
            console.log("Application has started");
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
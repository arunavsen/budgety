// BUDJET Controller
var budgetController = (function(){
    
})();



// UI Controller
var UIController = (function(){
    
    // We are creating a private object 'DOMstrings' by which we can change our class dynamicaaly
    var DOMstrings = {
        inpuType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputAddBtn: '.add__btn'
    }
    
    return {
        //  This controller is returning the Inputs by getInput function
        getInput:function(){
            return {
                type: document.querySelector(DOMstrings.inpuType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        // our private DOMstrings now will be public
        getDomstrings:function(){
            return DOMstrings;
        }
    };
})();



// Global App Controller
var controller = (function(budjetCtrl,UICtrl){

    // We can get all DOMstrings in the 'controller' from UIController. It is now public
    var DOM = UICtrl.getDomstrings();

    var ctrlAddItem = function(){
        // 1. Get the field input data

        var input = UICtrl.getInput();
        console.log(input);
        // 2. Add the item to the BudjetController

        // 3. Add Item to the UI

        // 4. Calculate the budjet

        // 5. Display the budjet on the UI
    }

    // If we click the add_btn
    document.querySelector(DOM.inputAddBtn).addEventListener('click',ctrlAddItem);

    // If we press the Enter button for adding the product
    document.addEventListener('keypress', function(event){
        if(event.keyCode==13 || event.which==13){
            ctrlAddItem();
        }
    });
})(budgetController,UIController);
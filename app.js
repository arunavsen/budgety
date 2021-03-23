// BUDJET Controller
var budgetController = (function(){
    
})();



// UI Controller
var UIController = (function(){
    // Some code
})();



// Global App Controller
var controller = (function(budjetCtrl,UICtrl){
    
    var ctrlAddItem = function(){
         // 1. Get the field input data

        // 2. Add the item to the BudjetController

        // 3. Add Item to the UI

        // 4. Calculate the budjet

        // 5. Display the budjet on the UI
        console.log("I am not robot");
    }




    document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);


    // If we press the Enter button for adding the product
    document.addEventListener('keypress', function(event){
        if(event.keyCode==13 || event.which==13){
            ctrlAddItem();
        }
    });
})(budgetController,UIController);
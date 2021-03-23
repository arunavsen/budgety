var budgetController = (function(){
    var x = 23;
    var add = function(a){
        return x+a;
    }

    var minus = function(b){
        return x-b;
    }

    return{
        publicTest: function(b){
            return add(b);
        },
        publicTest2: function(x){
            console.log(minus(x));
        }
    }
})();


var UIController = (function(){
    // Some code
})();


var controller = (function(budjetCtrl,UICtrl){
    var o = budjetCtrl.publicTest(5);

    return {
        anotherPublic: function(){
            console.log(o);
        }
    }
})(budgetController,UIController);
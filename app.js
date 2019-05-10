//BUDGET CONTROLLER
let budgetController = (function () {
    //Create expense constructor
    let Expense = function (id, description, expenseValue) {
        this.id = id;
        this.description = description;
        this.expenseValue = expenseValue;
    };

    //Create income constructor
    let Income = function (id, description, incomeValue) {
        this.id = id;
        this.description = description;
        this.incomeValue = incomeValue;
    };

    let data = {
        allItems: {
            exp: [],
            inc: [],

        },
        total: {
            exp: 0,
            inc: 0
        }
    };

    return{
        addItem: function (type, description, value) {
            let item, ID;

            // Create ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            //Create new item
            if(type === 'exp'){
                item = new Expense(ID, description, value);
            }else if(type === 'inc'){
                item = new Income(ID, description, value);
            }

            //Push the item to the data
            data.allItems[type].push(item);

            return item;
        },
        //Testing function
        testing: function () {
            console.log(data);
        }
    };


})();

//UI CONTROLLER
let UIController = (function () {
    let DOMStrings = {
        sign: '.add__type',
        description: '.add__description',
        value: '.add__value',
        addButton: '.add__btn'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.sign).value,
                description: document.querySelector(DOMStrings.description).value,
                value: document.querySelector(DOMStrings.value).value
            }
        },
        getDOM: function () {
            return DOMStrings;
        }
    };

})();

//GLOBAL APP CONTROLLER
let controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function(){
        let DOMStrings = UIController.getDOM();
        document.querySelector(DOMStrings.addButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    let ctrlAddItem = function () {
        //1. Get the field input data
        let input = UIController.getInput();

        //2. Add the item to the budget controller
        let newItem = budgetController.addItem(input.type, input.description, input.value);
        budgetController.testing();

        //3. Add the item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI
    };

    return{
        init: function () {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
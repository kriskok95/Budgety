//BUDGET CONTROLLER
let budgetController = (function () {
    //Some text

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
                sign: document.querySelector(DOMStrings.sign).value,
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

    let DOMStrings = UIController.getDOM();

    let ctrlAddItem = function () {
        //1. Get the field input data
        let input = UIController.getInput();
        console.log(input);

        //2. Add the item to the budget controller

        //3. Add the item to the UI

        //4. Calculate the budget

        //5. Display the budget on the UI
    };

    document.querySelector(DOMStrings.addButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });
})(budgetController, UIController);
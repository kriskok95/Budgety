//BUDGET CONTROLLER
let budgetController = (function () {
    //Create expense constructor
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Create income constructor
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Calculate the total sum of income or expenses
    let calculateTotal = function (type) {

        let sum = 0;

        data.allItems[type].forEach(function (current) {
            sum += current.value
        });

        data.total[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: [],

        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, description, value) {
            let item, ID;

            // Create ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item
            if (type === 'exp') {
                item = new Expense(ID, description, value);
            } else if (type === 'inc') {
                item = new Income(ID, description, value);
            }

            //Push the item to the data
            data.allItems[type].push(item);

            return item;
        },

        calculateBudget: function () {
            //Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //Calculate the budget: income - expenses
            data.budget = data.total.inc - data.total.exp;

            if(data.total.inc > 0){
                // Calculate the percentage of income that we spent
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100)
            }else{
                data.percentage = -1
            }
        },

        returnBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            };
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
        addButton: '.add__btn',
        incomeList: '.income__list',
        expensesList: '.expenses__list'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.sign).value,
                description: document.querySelector(DOMStrings.description).value,
                value: parseFloat(document.querySelector(DOMStrings.value).value)
            }
        },
        getDOM: function () {
            return DOMStrings;
        },
        addListItem: function (obj, type) {
            let html, newHtml, element;

            //Create HTML string with placeholder text
            if (type === 'exp') {
                element = DOMStrings.expensesList;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'inc') {
                element = DOMStrings.incomeList;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace placeholders with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            let fields, filedsArr;

            fileds = document.querySelectorAll(DOMStrings.description + ', ' + DOMStrings.value);
            fieldsArr = Array.prototype.slice.call(fileds);

            fieldsArr.forEach(function (current, index, arr) {
                current.value = "";
            });

            fieldsArr[0].focus();
        }
    };

})();

//GLOBAL APP CONTROLLER
let controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function () {
        let DOMStrings = UIController.getDOM();
        document.querySelector(DOMStrings.addButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    function calculateBudget() {
        //1. Calculate the budget
        budgetController.calculateBudget();
        //2. return the budget
        let budget = budgetController.returnBudget();

        console.log(budget);
        //3. Display the budget on the UI
    }

    let ctrlAddItem = function () {
        //1. Get the field input data
        let input = UIController.getInput();

        //Validate data
        if (input.description !== "" && !isNaN(input.value) && input.value !== 0) {
            //2. Add the item to the budget controller
            let newItem = budgetController.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI
            UIController.addListItem(newItem, input.type);

            //4. Clear fields value
            UIController.clearFields();

            //5. Calculate and update budget
            calculateBudget();
        }
    };

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
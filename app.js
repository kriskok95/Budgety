//BUDGET CONTROLLER
let budgetController = (function () {
    //Create expense constructor
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){

        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
      return this.percentage;
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

        deleteItem: function(type, id){
            let ids, index;

            ids = data.allItems[type].map(function(current) {
               return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function(){
          data.allItems.exp.forEach(function (cur) {
             cur.calcPercentage(data.total.inc);
          });
        },

        getPercentages: function(){
            let allPerc = data.allItems.exp.map(function (cur) {
               return cur.getPercentage();
            });
            return allPerc;
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
        expensesList: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage'
    };

    let formatNumber = function(num, type){
        let numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
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
            if (type === 'inc') {
                element = DOMStrings.incomeList;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesList;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>' +
                    '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div></div></div>'
            }

            //Replace placeholders with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID){
            let element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        clearFields: function () {
            let fields, filedsArr;

            fileds = document.querySelectorAll(DOMStrings.description + ', ' + DOMStrings.value);
            fieldsArr = Array.prototype.slice.call(fileds);

            fieldsArr.forEach(function (current, index, arr) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            let type;
            obj.budget > 0 ? type = 'inc' : 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {
            let fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            let nodeListForEach = function(list, callBack){
                for (let i = 0; i < list.length; i++) {
                    callBack(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index){

                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
        },
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

        document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);
    };

    function calculateBudget() {
        //1. Calculate the budget
        budgetController.calculateBudget();
        //2. return the budget
        let budget = budgetController.returnBudget();

        //3. Display the budget on the UI
        UIController.displayBudget(budget);

    }

    let updatePercentages = function(){
        //1. Calculate percentages
        budgetController.calculatePercentages();

        //2. Read percentages from the budget controller
        let percentages = budgetController.getPercentages();

        //3. Update the UI with the new percentages
        UIController.displayPercentages(percentages);
    };

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

            //6. Calculate and update the percentages
            updatePercentages();
        }
    };

    let ctrlDeleteItem = function (event) {
        let itemId, splitID, ID, type;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. Delete the item from the data structure
            budgetController.deleteItem(type, ID);

            //2. Delete the item from the UI
            UIController.deleteListItem(itemId);

            //3. Update and show the new budget
            calculateBudget();

            //4. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
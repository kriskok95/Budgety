let budgetController = (function () {
    //Some text
    let a = 5;

    function add(a) {
        return a + 10;
    }

    return {
        publicMethod: function (b) {
            console.log(add(a) + b)
        }
    }
})();

let UIController = (function () {
    //Some text
})();

let controller = (function () {
   //Some text
})();
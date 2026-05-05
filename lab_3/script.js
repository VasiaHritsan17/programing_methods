class KnapsackSolver {
    constructor(W, items) {
        this.W = W;
        this.items = items;
        this.n = items.length;
    }
}


const W_test = 24;
const items_test = [
    { weight: 9, value: 11 }, { weight: 3, value: 10 },
    { weight: 3, value: 6 },  { weight: 3, value: 4 },
    { weight: 5, value: 15 }, { weight: 8, value: 3 },
    { weight: 9, value: 12 }
];

function runTests() {
    console.log("ЗАПУСК ТЕСТІВ");
    const solver = new KnapsackSolver(W_test, items_test);
    
}
runTests();
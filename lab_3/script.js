class KnapsackSolver {
  constructor(W, items) {
    this.W = W;
    this.items = items;
    this.n = items.length;
  }
  // Метод перебору
  solveBruteForce() {
    let maxVal = 0;
    const totalCombinations = 1 << this.n;
    for (let i = 0; i < totalCombinations; i++) {
      let currentWeight = 0;
      let currentValue = 0;
      for (let j = 0; j < this.n; j++) {
        if (i & (1 << j)) {
          currentWeight += this.items[j].weight;
          currentValue += this.items[j].value;
        }
      }
      if (currentWeight <= this.W && currentValue > maxVal) {
        maxVal = currentValue;
      }
    }
    return { maxValue: maxVal };
  }

  // Метод рекурсії
  solveRecursive(W = this.W, n = this.n) {
    if (n === 0 || W === 0) return 0;
    if (this.items[n - 1].weight > W) {
      return this.solveRecursive(W, n - 1);
    } else {
      return Math.max(
        this.items[n - 1].value +
          this.solveRecursive(W - this.items[n - 1].weight, n - 1),
        this.solveRecursive(W, n - 1),
      );
    }
  }

  // Жадібний метод
  solveGreedy() {
    let sortedItems = [...this.items].sort(
      (a, b) => b.value / b.weight - a.value / a.weight,
    );
    let currentWeight = 0,
      currentValue = 0;
    for (let item of sortedItems) {
      if (currentWeight + item.weight <= this.W) {
        currentWeight += item.weight;
        currentValue += item.value;
      }
    }
    return { maxValue: currentValue };
  }
}

const W_test = 24;
const items_test = [
  { weight: 9, value: 11 },
  { weight: 3, value: 10 },
  { weight: 3, value: 6 },
  { weight: 3, value: 4 },
  { weight: 5, value: 15 },
  { weight: 8, value: 3 },
  { weight: 9, value: 12 },
];

function runTests() {
  console.log("ЗАПУСК ТЕСТІВ");
  const solver = new KnapsackSolver(W_test, items_test);
  console.assert(solver.solveBruteForce().maxValue === 47, "Помилка: Перебір");
  console.log("Метод 1 (Перебір) - тест пройдено. Очікувано: 47");
  console.assert(solver.solveRecursive() === 47, "Помилка: Рекурсія");
  console.log("Метод 2 (Рекурсія) - тест пройдено.");
  const greedyRes = solver.solveGreedy().maxValue;
  console.log(
    `Метод 3 (Жадібний) - завершено. Знайдено: ${greedyRes}. (Цей метод може не співпадати з 47)`,
  );
}
runTests();

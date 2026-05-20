// Поліном Лагранжа
function lagrange(x, points) {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) term *= (x - points[j].x) / (points[i].x - points[j].x);
        }
        sum += term;
    }
    return sum;
}

// Стійкий розв'язник Гауса (Partial Pivoting)
function solveGaussWithPivoting(A, B) {
    let n = B.length;
    for (let i = 0; i < n; i++) {
        let maxRow = i, maxEl = Math.abs(A[i][i]);
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > maxEl) { maxEl = Math.abs(A[k][i]); maxRow = k; }
        }
        let tempA = A[i]; A[i] = A[maxRow]; A[maxRow] = tempA;
        let tempB = B[i]; B[i] = B[maxRow]; B[maxRow] = tempB;
        for (let k = i + 1; k < n; k++) {
            let c = -A[k][i] / A[i][i];
            for (let j = i; j < n; j++) A[k][j] = i === j ? 0 : A[k][j] + c * A[i][j];
            B[k] += c * B[i];
        }
    }
    let X = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        X[i] = B[i] / A[i][i];
        for (let k = i - 1; k >= 0; k--) B[k] -= A[k][i] * X[i];
    }
    return X;
}

// Побудова дизайн-матриці МНК
function calculateLSMCoeffs(points, m) {
    let size = m + 1;
    let A = Array.from({length: size}, () => new Array(size).fill(0)), B = new Array(size).fill(0);
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) A[row][col] = points.reduce((s, p) => s + Math.pow(p.x, row + col), 0);
        B[row] = points.reduce((s, p) => s + p.y * Math.pow(p.x, row), 0);
    }
    return solveGaussWithPivoting(A, B);
}

// Обчислення значення МНК
function evalLSM(coeffs, x) {
    return coeffs.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
}
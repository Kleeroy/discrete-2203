document.addEventListener('DOMContentLoaded', function() {
    // Prime Factorization Tab
    document.getElementById('prime-factorize-btn').addEventListener('click', factorizeNumber);
    document.getElementById('prime-check-btn').addEventListener('click', checkPrime);
    
    // Chinese Remainder Theorem Tab
    document.getElementById('crt-calculate-btn').addEventListener('click', calculateCRT);
    
    // Exponentiation Tab
    document.getElementById('naive-exponent-btn').addEventListener('click', calculateNaiveExponent);
    document.getElementById('squaring-exponent-btn').addEventListener('click', calculateSquaringExponent);
    document.getElementById('modular-exponent-btn').addEventListener('click', calculateModularExponent);
    
    // Fermat's Little Theorem Tab
    document.getElementById('fermat-calculate-btn').addEventListener('click', calculateFermat);
    
    // Caesar Cipher Tab
    document.getElementById('caesar-encrypt-btn').addEventListener('click', encryptCaesar);
    document.getElementById('caesar-decrypt-btn').addEventListener('click', decryptCaesar);
    
    // RSA Tab
    document.getElementById('rsa-generate-btn').addEventListener('click', generateRSAKeys);
    document.getElementById('rsa-encrypt-btn').addEventListener('click', encryptRSA);
    document.getElementById('rsa-decrypt-btn').addEventListener('click', decryptRSA);
    
    // Matrix Tab
    document.getElementById('matrix-create-btn').addEventListener('click', createMatrixInputs);
    document.getElementById('matrix-calculate-btn').addEventListener('click', calculateMatrixOperation);
});

// Prime Factorization Functions
function factorizeNumber() {
    const number = parseInt(document.getElementById('prime-number-input').value);
    if (isNaN(number) || number < 2) {
        alert('Please enter a valid number greater than 1');
        return;
    }
    
    const divisionMethodResult = factorizeDivisionMethod(number);
    const treeMethodResult = factorizeTreeMethod(number);
    
    document.getElementById('division-method-result').innerHTML = divisionMethodResult.steps.join('<br>');
    document.getElementById('factor-tree-result').textContent = treeMethodResult.tree;
    document.getElementById('prime-factors-result').textContent = treeMethodResult.factors.join(' × ');
}

function factorizeDivisionMethod(n) {
    let steps = [];
    let factors = [];
    let current = n;
    
    steps.push(`Starting with number: ${current}`);
    
    for (let i = 2; i <= Math.sqrt(current); i++) {
        while (current % i === 0) {
            steps.push(`${current} ÷ ${i} = ${current / i}`);
            factors.push(i);
            current = current / i;
        }
    }
    
    if (current > 1) {
        factors.push(current);
        steps.push(`Final prime factor: ${current}`);
    }
    
    return { factors, steps };
}

function factorizeTreeMethod(n) {
    function buildTree(num, depth = 0) {
        if (isPrime(num)) {
            return { tree: ' '.repeat(depth * 2) + num, factors: [num] };
        }
        
        let factor = findFactor(num);
        let left = buildTree(factor, depth + 1);
        let right = buildTree(num / factor, depth + 1);
        
        return {
            tree: ' '.repeat(depth * 2) + num + '\n' + left.tree + '\n' + right.tree,
            factors: [...left.factors, ...right.factors].sort((a, b) => a - b)
        };
    }
    
    const result = buildTree(n);
    return result;
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function findFactor(num) {
    if (num % 2 === 0) return 2;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return i;
    }
    return num;
}

function checkPrime() {
    const number = parseInt(document.getElementById('prime-check-input').value);
    if (isNaN(number)) {
        alert('Please enter a valid number');
        return;
    }
    
    const result = isPrime(number);
    document.getElementById('prime-check-result').textContent = 
        `${number} is ${result ? '' : 'not '}a prime number.`;
}

// Chinese Remainder Theorem Functions
function calculateCRT() {
    const a1 = parseInt(document.getElementById('crt-a1').value);
    const m1 = parseInt(document.getElementById('crt-m1').value);
    const a2 = parseInt(document.getElementById('crt-a2').value);
    const m2 = parseInt(document.getElementById('crt-m2').value);
    
    if (isNaN(a1) || isNaN(m1) || isNaN(a2) || isNaN(m2)) {
        alert('Please enter valid numbers');
        return;
    }
    
    const result = solveCRT(a1, m1, a2, m2);
    let steps = [
        `Given equations:`,
        `x ≡ ${a1} mod ${m1}`,
        `x ≡ ${a2} mod ${m2}`,
        ``,
        `Step 1: Check if m1 and m2 are coprime`,
        `GCD(${m1}, ${m2}) = ${result.gcd}`,
    ];
    
    if (result.gcd !== 1) {
        steps.push(`Since GCD is not 1, there is no solution.`);
    } else {
        steps.push(
            ``,
            `Step 2: Find M = m1 × m2 = ${m1} × ${m2} = ${result.M}`,
            ``,
            `Step 3: Find M1 = M / m1 = ${result.M} / ${m1} = ${result.M1}`,
            `Find y1 such that M1 × y1 ≡ 1 mod m1`,
            `=> ${result.M1} × y1 ≡ 1 mod ${m1}`,
            `Solution: y1 = ${result.y1}`,
            ``,
            `Step 4: Find M2 = M / m2 = ${result.M} / ${m2} = ${result.M2}`,
            `Find y2 such that M2 × y2 ≡ 1 mod m2`,
            `=> ${result.M2} × y2 ≡ 1 mod ${m2}`,
            `Solution: y2 = ${result.y2}`,
            ``,
            `Step 5: Calculate solution x = (a1 × M1 × y1 + a2 × M2 × y2) mod M`,
            `x = (${a1} × ${result.M1} × ${result.y1} + ${a2} × ${result.M2} × ${result.y2}) mod ${result.M}`,
            `x = (${a1 * result.M1 * result.y1} + ${a2 * result.M2 * result.y2}) mod ${result.M}`,
            `x = ${a1 * result.M1 * result.y1 + a2 * result.M2 * result.y2} mod ${result.M}`,
            `x ≡ ${result.solution} mod ${result.M}`
        );
    }
    
    document.getElementById('crt-result').innerHTML = steps.join('<br>');
}

function solveCRT(a1, m1, a2, m2) {
    const gcd = extendedGCD(m1, m2).gcd;
    
    if (gcd !== 1) {
        return { gcd };
    }
    
    const M = m1 * m2;
    const M1 = M / m1;
    const M2 = M / m2;
    
    const y1 = modInverse(M1, m1);
    const y2 = modInverse(M2, m2);
    
    const solution = (a1 * M1 * y1 + a2 * M2 * y2) % M;
    
    return { gcd, M, M1, M2, y1, y2, solution };
}

function extendedGCD(a, b) {
    if (b === 0) {
        return { gcd: a, x: 1, y: 0 };
    }
    
    const temp = extendedGCD(b, a % b);
    return {
        gcd: temp.gcd,
        x: temp.y,
        y: temp.x - Math.floor(a / b) * temp.y
    };
}

function modInverse(a, m) {
    const gcd = extendedGCD(a, m);
    if (gcd.gcd !== 1) {
        return null; // inverse doesn't exist
    }
    return ((gcd.x % m) + m) % m;
}

// Exponentiation Functions
function calculateNaiveExponent() {
    const base = parseInt(document.getElementById('naive-base').value);
    const exponent = parseInt(document.getElementById('naive-exponent').value);
    
    if (isNaN(base) || isNaN(exponent)) {
        alert('Please enter valid numbers');
        return;
    }
    
    let result = 1;
    let steps = [`Calculating ${base}^${exponent} using naive method:`];
    
    for (let i = 0; i < exponent; i++) {
        result *= base;
        steps.push(`Step ${i+1}: ${base} × ${result/base} = ${result}`);
    }
    
    document.getElementById('naive-result').innerHTML = steps.join('<br>');
}

function calculateSquaringExponent() {
    const base = parseInt(document.getElementById('squaring-base').value);
    const exponent = parseInt(document.getElementById('squaring-exponent').value);
    
    if (isNaN(base) || isNaN(exponent)) {
        alert('Please enter valid numbers');
        return;
    }
    
    let result = 1;
    let currentBase = base;
    let currentExponent = exponent;
    let steps = [`Calculating ${base}^${exponent} using exponentiation by squaring:`];
    
    while (currentExponent > 0) {
        if (currentExponent % 2 === 1) {
            steps.push(`Exponent is odd (${currentExponent}): Multiply result by current base (${currentBase})`);
            result *= currentBase;
            currentExponent--;
        } else {
            steps.push(`Exponent is even (${currentExponent}): Square the base (${currentBase} → ${currentBase * currentBase})`);
            currentBase *= currentBase;
            currentExponent /= 2;
        }
    }
    
    steps.push(`Final result: ${result}`);
    document.getElementById('squaring-result').innerHTML = steps.join('<br>');
}

function calculateModularExponent() {
    const base = parseInt(document.getElementById('modular-base').value);
    const exponent = parseInt(document.getElementById('modular-exponent').value);
    const modulus = parseInt(document.getElementById('modular-modulus').value);
    
    if (isNaN(base) || isNaN(exponent) || isNaN(modulus)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (modulus === 1) {
        document.getElementById('modular-result').textContent = 'Result: 0 (any number mod 1 is 0)';
        return;
    }
    
    let result = 1;
    base = base % modulus;
    let steps = [`Calculating ${base}^${exponent} mod ${modulus}:`];
    
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            steps.push(`Exponent is odd (${exponent}): Multiply result by base (${result} × ${base} = ${result * base})`);
            result = (result * base) % modulus;
            steps.push(`Take mod ${modulus}: ${result}`);
        }
        
        exponent = Math.floor(exponent / 2);
        steps.push(`Exponent is now ${exponent}`);
        
        base = (base * base) % modulus;
        steps.push(`Square base and take mod ${modulus}: new base = ${base}`);
    }
    
    steps.push(`Final result: ${result}`);
    document.getElementById('modular-result').innerHTML = steps.join('<br>');
}

// Fermat's Little Theorem Functions
function calculateFermat() {
    const a = parseInt(document.getElementById('fermat-a').value);
    const p = parseInt(document.getElementById('fermat-p').value);
    
    if (isNaN(a) || isNaN(p)) {
        alert('Please enter valid numbers');
        return;
    }
    
    if (!isPrime(p)) {
        document.getElementById('fermat-result').innerHTML = 
            `${p} is not a prime number. Fermat's Little Theorem only applies when p is prime.`;
        return;
    }
    
    const result = (Math.pow(a, p-1) % p);
    const steps = [
        `Fermat's Little Theorem states that if p is prime and a is not divisible by p, then:`,
        `a^(p-1) ≡ 1 mod p`,
        ``,
        `Given a = ${a}, p = ${p}`,
        `Calculating ${a}^(${p}-1) mod ${p} = ${a}^${p-1} mod ${p}`,
        `Result: ${result} (should be 1 if a and p are coprime)`
    ];
    
    document.getElementById('fermat-result').innerHTML = steps.join('<br>');
}

// Caesar Cipher Functions
function encryptCaesar() {
    const text = document.getElementById('caesar-text').value;
    const shift = parseInt(document.getElementById('caesar-shift').value);
    
    if (isNaN(shift)) {
        alert('Please enter a valid shift value');
        return;
    }
    
    let result = '';
    let steps = [`Encrypting "${text}" with shift ${shift}:`];
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-z]/i)) {
            const code = text.charCodeAt(i);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            const shifted = ((code - base + shift) % 26) + base;
            steps.push(`${char} (${code}) → ${String.fromCharCode(shifted)} (${shifted})`);
            result += String.fromCharCode(shifted);
        } else {
            steps.push(`${char} → unchanged (not a letter)`);
            result += char;
        }
    }
    
    document.getElementById('caesar-result').innerHTML = steps.join('<br>') + `<br><strong>Encrypted text: ${result}</strong>`;
}

function decryptCaesar() {
    const text = document.getElementById('caesar-text').value;
    const shift = parseInt(document.getElementById('caesar-shift').value);
    
    if (isNaN(shift)) {
        alert('Please enter a valid shift value');
        return;
    }
    
    let result = '';
    let steps = [`Decrypting "${text}" with shift ${shift}:`];
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-z]/i)) {
            const code = text.charCodeAt(i);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            const shifted = ((code - base - shift + 26) % 26) + base;
            steps.push(`${char} (${code}) → ${String.fromCharCode(shifted)} (${shifted})`);
            result += String.fromCharCode(shifted);
        } else {
            steps.push(`${char} → unchanged (not a letter)`);
            result += char;
        }
    }
    
    document.getElementById('caesar-result').innerHTML = steps.join('<br>') + `<br><strong>Decrypted text: ${result}</strong>`;
}

// RSA Functions
function generateRSAKeys() {
    const p = parseInt(document.getElementById('rsa-p').value);
    const q = parseInt(document.getElementById('rsa-q').value);
    
    if (isNaN(p) || isNaN(q)) {
        alert('Please enter valid prime numbers for p and q');
        return;
    }
    
    if (!isPrime(p) || !isPrime(q)) {
        alert('Both p and q must be prime numbers');
        return;
    }
    
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    // Find e (public key exponent)
    let e = 65537; // Common choice
    while (extendedGCD(e, phi).gcd !== 1) {
        e--;
    }
    
    // Find d (private key exponent)
    const d = modInverse(e, phi);
    
    const steps = [
        `Step 1: Choose two prime numbers p and q`,
        `p = ${p}, q = ${q}`,
        ``,
        `Step 2: Calculate n = p × q`,
        `n = ${p} × ${q} = ${n}`,
        ``,
        `Step 3: Calculate φ(n) = (p-1) × (q-1)`,
        `φ(n) = (${p}-1) × (${q}-1) = ${phi}`,
        ``,
        `Step 4: Choose e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1`,
        `e = ${e}`,
        ``,
        `Step 5: Calculate d such that d × e ≡ 1 mod φ(n)`,
        `d = ${d}`,
        ``,
        `Public Key: (e, n) = (${e}, ${n})`,
        `Private Key: (d, n) = (${d}, ${n})`
    ];
    
    document.getElementById('rsa-result').innerHTML = steps.join('<br>');
    document.getElementById('rsa-public-key').value = `${e},${n}`;
    document.getElementById('rsa-private-key').value = `${d},${n}`;
}

function encryptRSA() {
    const message = document.getElementById('rsa-message').value;
    const publicKey = document.getElementById('rsa-public-key').value;
    
    if (!message || !publicKey) {
        alert('Please enter a message and public key');
        return;
    }
    
    const [e, n] = publicKey.split(',').map(Number);
    if (isNaN(e) || isNaN(n)) {
        alert('Invalid public key format. Use "e,n"');
        return;
    }
    
    let encrypted = [];
    let steps = [`Encrypting message "${message}" with public key (${e},${n}):`];
    
    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i);
        const cipher = modExp(charCode, e, n);
        steps.push(`'${message[i]}' (${charCode}) → ${charCode}^${e} mod ${n} = ${cipher}`);
        encrypted.push(cipher);
    }
    
    document.getElementById('rsa-encryption-result').innerHTML = 
        steps.join('<br>') + `<br><strong>Encrypted message: ${encrypted.join(' ')}</strong>`;
}

function decryptRSA() {
    const encrypted = document.getElementById('rsa-encrypted').value.split(' ').filter(x => x).map(Number);
    const privateKey = document.getElementById('rsa-private-key').value;
    
    if (encrypted.length === 0 || !privateKey) {
        alert('Please enter encrypted message and private key');
        return;
    }
    
    const [d, n] = privateKey.split(',').map(Number);
    if (isNaN(d) || isNaN(n)) {
        alert('Invalid private key format. Use "d,n"');
        return;
    }
    
    let decrypted = '';
    let steps = [`Decrypting message with private key (${d},${n}):`];
    
    for (let i = 0; i < encrypted.length; i++) {
        const cipher = encrypted[i];
        const charCode = modExp(cipher, d, n);
        steps.push(`${cipher} → ${cipher}^${d} mod ${n} = ${charCode} → '${String.fromCharCode(charCode)}'`);
        decrypted += String.fromCharCode(charCode);
    }
    
    document.getElementById('rsa-decryption-result').innerHTML = 
        steps.join('<br>') + `<br><strong>Decrypted message: ${decrypted}</strong>`;
}

function modExp(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}

// Matrix Functions
function createMatrixInputs() {
    const rows = parseInt(document.getElementById('matrix-rows').value);
    const cols = parseInt(document.getElementById('matrix-cols').value);
    
    if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
        alert('Please enter valid matrix dimensions');
        return;
    }
    
    let html = '<h5>Matrix A</h5>';
    for (let i = 0; i < rows; i++) {
        html += '<div class="matrix-row">';
        for (let j = 0; j < cols; j++) {
            html += `<input type="number" class="matrix-input" id="matrix-a-${i}-${j}" placeholder="A[${i}][${j}]">`;
        }
        html += '</div>';
    }
    
    html += '<h5 class="mt-3">Matrix B</h5>';
    for (let i = 0; i < rows; i++) {
        html += '<div class="matrix-row">';
        for (let j = 0; j < cols; j++) {
            html += `<input type="number" class="matrix-input" id="matrix-b-${i}-${j}" placeholder="B[${i}][${j}]">`;
        }
        html += '</div>';
    }
    
    document.getElementById('matrix-inputs').innerHTML = html;
}

function calculateMatrixOperation() {
    const operation = document.getElementById('matrix-operation').value;
    const rows = parseInt(document.getElementById('matrix-rows').value);
    const cols = parseInt(document.getElementById('matrix-cols').value);
    
    if (isNaN(rows) || isNaN(cols)) {
        alert('Please create matrix inputs first');
        return;
    }
    
    // Read matrix A
    let matrixA = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            const val = parseFloat(document.getElementById(`matrix-a-${i}-${j}`).value) || 0;
            row.push(val);
        }
        matrixA.push(row);
    }
    
    // Read matrix B
    let matrixB = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            const val = parseFloat(document.getElementById(`matrix-b-${i}-${j}`).value) || 0;
            row.push(val);
        }
        matrixB.push(row);
    }
    
    let result;
    let steps = [`Performing ${operation} on matrices:`];
    
    switch (operation) {
        case 'add':
            result = addMatrices(matrixA, matrixB);
            steps.push('Matrix A + Matrix B:');
            break;
        case 'subtract':
            result = subtractMatrices(matrixA, matrixB);
            steps.push('Matrix A - Matrix B:');
            break;
        case 'multiply':
            if (matrixA[0].length !== matrixB.length) {
                alert('For multiplication, columns of A must match rows of B');
                return;
            }
            result = multiplyMatrices(matrixA, matrixB);
            steps.push('Matrix A × Matrix B:');
            break;
        case 'scalar':
            const scalar = parseFloat(prompt('Enter scalar value:'));
            if (isNaN(scalar)) {
                alert('Invalid scalar value');
                return;
            }
            result = scalarMultiply(matrixA, scalar);
            steps.push(`Matrix A × ${scalar}:`);
            break;
        case 'transpose':
            result = transposeMatrix(matrixA);
            steps.push('Transpose of Matrix A:');
            break;
        case 'determinant':
            if (matrixA.length !== matrixA[0].length) {
                alert('Matrix must be square to calculate determinant');
                return;
            }
            const det = calculateDeterminant(matrixA);
            steps.push(`Determinant of Matrix A: ${det}`);
            document.getElementById('matrix-result').innerHTML = steps.join('<br>');
            return;
    }
    
    // Display result matrix
    steps.push('<table class="table table-bordered">');
    for (let i = 0; i < result.length; i++) {
        steps.push('<tr>');
        for (let j = 0; j < result[0].length; j++) {
            steps.push(`<td>${result[i][j]}</td>`);
        }
        steps.push('</tr>');
    }
    steps.push('</table>');
    
    document.getElementById('matrix-result').innerHTML = steps.join('');
}

function addMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function subtractMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function scalarMultiply(matrix, scalar) {
    return matrix.map(row => row.map(val => val * scalar));
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function calculateDeterminant(matrix) {
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
        const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
        det += matrix[0][i] * (i % 2 === 0 ? 1 : -1) * calculateDeterminant(minor);
    }
    return det;
}
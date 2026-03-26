const form = document.getElementById("kinematics-form");
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");

const offsetX = canvas.width / 2;
const offsetY = canvas.height / 2;
const scale = 2;

function drawAxes() {
  ctx.beginPath();
  ctx.strokeStyle = "#ccc";
  ctx.moveTo(0, offsetY);
  ctx.lineTo(canvas.width, offsetY);
  ctx.moveTo(offsetX, 0);
  ctx.lineTo(offsetX, canvas.height);
  ctx.stroke();
}

function drawGrid() {
    const step = 20; 

    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1; 

    for (let x = 0; x <= canvas.width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    for (let y = 0; y <= canvas.height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke(); 
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); 
    drawAxes(); 
}

clearCanvas();

function getCanvasX(x) {
  return offsetX + x * scale;
}
function getCanvasY(y) {
  return offsetY - y * scale;
}

let animationId; 

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    const x0 = parseFloat(document.getElementById('x0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const angleDeg = parseFloat(document.getElementById('angle').value);
    const v0 = parseFloat(document.getElementById('v0').value);
    const a = parseFloat(document.getElementById('a').value);
    const dt = parseFloat(document.getElementById('dt').value);
    const tMax = parseFloat(document.getElementById('tMax').value);

    const alphaRad = angleDeg * Math.PI / 180;
    
    const colorInput = document.getElementById('color');
    ctx.fillStyle = colorInput ? colorInput.value : '#007bff';

    let t = 0; 

    function animate() {
        if (t > tMax) return; 

        const S = v0 * t + (a * Math.pow(t, 2)) / 2;
        const xt = x0 + S * Math.cos(alphaRad);
        const yt = y0 + S * Math.sin(alphaRad);

        ctx.beginPath();
        ctx.arc(getCanvasX(xt), getCanvasY(yt), 3, 0, 2 * Math.PI);
        ctx.fill();

        t += dt;

        animationId = requestAnimationFrame(animate);
    }

    animate();
});

document.getElementById('btn-clear').addEventListener('click', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    clearCanvas();
});
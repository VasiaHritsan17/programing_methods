const form = document.getElementById("physics-form");
const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

const originX = 50;
const originY = canvas.height - 50;
const scale = 5;

let animationId;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#ccc";
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, canvas.height);
  ctx.moveTo(0, originY);
  ctx.lineTo(canvas.width, originY);
  ctx.stroke();
}

clearCanvas();

function getCanvasX(x) {
  return originX + x * scale;
}
function getCanvasY(y) {
  return originY - y * scale;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (animationId) cancelAnimationFrame(animationId);

  const v0 = parseFloat(document.getElementById("v0").value);
  const angle = parseFloat(document.getElementById("angle").value);
  const h0 = parseFloat(document.getElementById("h0").value);
  const g = parseFloat(document.getElementById("g").value);
  const dt = parseFloat(document.getElementById("dt").value);

  const alphaRad = (angle * Math.PI) / 180;
  const v0x = v0 * Math.cos(alphaRad);
  const v0y = v0 * Math.sin(alphaRad);

  let t = 0;
  const colorInput = document.getElementById("color");
  ctx.fillStyle = colorInput ? colorInput.value : "#007bff";

  function animate() {
    const x = v0x * t;
    const y = h0 + v0y * t - 0.5 * g * Math.pow(t, 2);

    if (y < 0) return;

    ctx.beginPath();
    ctx.arc(getCanvasX(x), getCanvasY(y), 3, 0, 2 * Math.PI);
    ctx.fill();

    t += dt;
    animationId = requestAnimationFrame(animate);
  }

  animate();
});

document.getElementById("btn-clear").addEventListener("click", () => {
  if (animationId) cancelAnimationFrame(animationId);
  clearCanvas();
});

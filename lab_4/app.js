const canvas = document.getElementById("approximationPlot");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("canvas-tooltip");
const dataInput = document.getElementById("dataInput");
let currentData = [];
let animId;

// Парсинг даних із вікна
function parseInputData() {
  const text = dataInput.value.trim();
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => {
      const parts = line
        .replace(",", ".")
        .trim()
        .split(/[\s,;]+/);
      return { x: parseFloat(parts[0]), y: parseFloat(parts[1]) };
    })
    .filter((p) => !isNaN(p.x) && !isNaN(p.y));
}

// Головна функція малювання
function processDataAndDraw() {
  currentData = parseInputData();
  if (currentData.length < 2) {
    alert("Введіть мінімум 2 точки!");
    return;
  }
  drawStatic();
}

// Статичний малюнок
function drawStatic() {
  cancelAnimationFrame(animId);
  let m = parseInt(document.getElementById("polyDegree").value);
  let mode = document.getElementById("displayMode").value;
  let s = getAutoScales(currentData, canvas.width, canvas.height);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxesAndGrid(ctx, s, canvas.width, canvas.height);

  if (mode === "all" || mode === "lagrange") {
    drawFunctionCurve(
      ctx,
      (x) => lagrange(x, currentData),
      s,
      canvas.width,
      canvas.height,
      "#228be6",
    );
  }
  if (mode === "all" || mode === "lsm") {
    let coeffs = calculateLSMCoeffs(currentData, m);
    drawFunctionCurve(
      ctx,
      (x) => evalLSM(coeffs, x),
      s,
      canvas.width,
      canvas.height,
      "#40c057",
    );
    drawResidualLines(ctx, currentData, coeffs, s, canvas.height, evalLSM);
  }
  drawNodes(ctx, currentData, s, canvas.height);
}

// Плавна анімація Лагранжа
function startLagrangeAnim() {
  cancelAnimationFrame(animId);
  currentData = parseInputData();
  if (currentData.length < 2) return;

  let s = getAutoScales(currentData, canvas.width, canvas.height);
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = (timestamp - startTime) / 800;
    let idx = Math.floor(progress);

    if (idx < currentData.length) {
      let active = currentData.slice(0, idx + 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAxesAndGrid(ctx, s, canvas.width, canvas.height);

      if (active.length > 1) {
        drawFunctionCurve(
          ctx,
          (x) => lagrange(x, active),
          s,
          canvas.width,
          canvas.height,
          "#228be6",
        );
      }
      drawNodes(ctx, active, s, canvas.height, idx);
      animId = requestAnimationFrame(step);
    } else {
      drawStatic();
    }
  }
  animId = requestAnimationFrame(step);
}

// Плавна анімація МНК
function startLSMAnim() {
  cancelAnimationFrame(animId);
  currentData = parseInputData();
  if (currentData.length < 2) return;

  let m = parseInt(document.getElementById("polyDegree").value);
  let s = getAutoScales(currentData, canvas.width, canvas.height);
  let coeffs = calculateLSMCoeffs(currentData, m);
  let meanY = currentData.reduce((sum, p) => sum + p.y, 0) / currentData.length;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;

    let t = (timestamp - startTime) / 2000;
    if (t > 1) t = 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxesAndGrid(ctx, s, canvas.width, canvas.height);

    drawFunctionCurve(
      ctx,
      (x) => (1 - t) * meanY + t * evalLSM(coeffs, x),
      s,
      canvas.width,
      canvas.height,
      "#40c057",
    );
    drawResidualLines(ctx, currentData, coeffs, s, canvas.height, evalLSM, t);
    drawNodes(ctx, currentData, s, canvas.height);

    if (t < 1) animId = requestAnimationFrame(step);
  }
  animId = requestAnimationFrame(step);
}

canvas.addEventListener("mousemove", (e) => {
  if (!currentData.length) return;
  let s = getAutoScales(currentData, canvas.width, canvas.height);
  let rect = canvas.getBoundingClientRect();

  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;

  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;

  let mx = mouseX * scaleX;
  let my = mouseY * scaleY;
  let found = null;

  currentData.forEach((p) => {
    let pt = toPx(p.x, p.y, s, canvas.height);
    if (Math.hypot(pt.cx - mx, pt.cy - my) < 12) found = p;
  });

  if (found) {
    let coeffs = calculateLSMCoeffs(
      currentData,
      parseInt(document.getElementById("polyDegree").value),
    );
    let lsmVal = evalLSM(coeffs, found.x);

    tooltip.style.left = e.clientX + 15 + "px";
    tooltip.style.top = e.clientY + 15 + "px";

    tooltip.innerHTML = `> Вузол X: ${found.x}<br>> Вузол Y: ${found.y}<br>> МНК Y: ${lsmVal.toFixed(3)}<br>> Похибка: ${(found.y - lsmVal).toFixed(3)}`;
    tooltip.style.display = "block";
  } else {
    tooltip.style.display = "none";
  }
});

canvas.addEventListener("mouseleave", () => {
  tooltip.style.display = "none";
});

function loadVariantData(count) {
  const v5 = "0, 0.5\n1, 0.9\n2, 1.5\n3, 2.8\n4, 4.2";
  const v10 =
    "0, -1\n1, 0.5\n2, 1.2\n3, 1.8\n4, 2.2\n5, 2.5\n6, 2.7\n7, 2.9\n8, 3.1\n9, 3.3";
  const v20 =
    "1, 5.0\n1.5, 4.8\n2, 4.5\n2.5, 4.3\n3, 4.0\n3.5, 3.8\n4, 3.5\n4.5, 3.3\n5, 3.0\n5.5, 2.8\n6, 2.5\n6.5, 2.3\n7, 2.0\n7.5, 1.8\n8, 1.5\n8.5, 1.3\n9, 1.0\n9.5, 0.8\n10, 0.5\n10.5, 0.3";

  dataInput.value = count === 5 ? v5 : count === 10 ? v10 : v20;
  processDataAndDraw();
}

window.onload = () => loadVariantData(5);

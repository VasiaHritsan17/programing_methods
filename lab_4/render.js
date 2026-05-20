function getAutoScales(points, width, height) {
  const xVals = points.map((p) => p.x);
  const yVals = points.map((p) => p.y);
  const minX = Math.min(...xVals),
    maxX = Math.max(...xVals);
  const minY = Math.min(...yVals),
    maxY = Math.max(...yVals);

  const padX = (maxX - minX) * 0.2 || 1;
  const padY = (maxY - minY) * 0.2 || 1;

  return {
    minX: minX - padX,
    maxX: maxX + padX,
    minY: minY - padY,
    maxY: maxY + padY,
    sx: width / (maxX + padX - (minX - padX)),
    sy: height / (maxY + padY - (minY - padY)),
  };
}

// Переведення координат
function toPx(x, y, s, height) {
  return { cx: (x - s.minX) * s.sx, cy: height - (y - s.minY) * s.sy };
}

// Малювання осей та сітки
function drawAxesAndGrid(ctx, s, width, height) {
  ctx.strokeStyle = "#e9ecef";
  ctx.fillStyle = "#495057";
  ctx.font = "12px Courier New";

  for (let i = 0; i <= 10; i++) {
    let x = s.minX + (i * (s.maxX - s.minX)) / 10;
    let pt = toPx(x, s.minY, s, height);
    ctx.beginPath();
    ctx.moveTo(pt.cx, 0);
    ctx.lineTo(pt.cx, height);
    ctx.stroke();
    ctx.fillText(x.toFixed(1), pt.cx + 4, height - 8);
  }

  for (let i = 0; i <= 10; i++) {
    let y = s.minY + (i * (s.maxY - s.minY)) / 10;
    let pt = toPx(s.minX, y, s, height);
    ctx.beginPath();
    ctx.moveTo(0, pt.cy);
    ctx.lineTo(width, pt.cy);
    ctx.stroke();
    ctx.fillText(y.toFixed(1), 6, pt.cy - 4);
  }

  let origin = toPx(0, 0, s, height);
  ctx.strokeStyle = "#212529";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, origin.cy);
  ctx.lineTo(width, origin.cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(origin.cx, 0);
  ctx.lineTo(origin.cx, height);
  ctx.stroke();
}

function drawNodes(ctx, points, s, height, activeIdx = -1) {
  points.forEach((p, idx) => {
    let pt = toPx(p.x, p.y, s, height);
    ctx.beginPath();
    ctx.arc(pt.cx, pt.cy, idx === activeIdx ? 7 : 5, 0, Math.PI * 2);
    ctx.fillStyle = idx === activeIdx ? "#ffe066" : "#fa5252";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#212529";
    ctx.stroke();
  });
}

// Плавне малювання кривої 
function drawFunctionCurve(ctx, func, s, width, height, color) {
    ctx.save(); 
    
    
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.clip(); 

    ctx.beginPath(); 
    ctx.strokeStyle = color; 
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    
    let started = false;
    for (let cx = 0; cx <= width; cx += 2) { 
        let mathX = (cx / s.sx) + s.minX;
        let mathY = func(mathX);
        let pt = toPx(mathX, mathY, s, height);
        
      
        if (!isFinite(pt.cy) || Math.abs(pt.cy) > 100000) {
            started = false;
            continue;
        }

        if (!started) { 
            ctx.moveTo(cx, pt.cy); 
            started = true; 
        } else { 
            ctx.lineTo(cx, pt.cy); 
        }
    }
    ctx.stroke();
    ctx.restore(); 
}

function drawResidualLines(
  ctx,
  points,
  coeffs,
  s,
  height,
  evalLSMFunc,
  progress = 1,
) {
  ctx.strokeStyle = "#be4bdb";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  points.forEach((p) => {
    let lsmY = evalLSMFunc(coeffs, p.x);
    let animatedY = lsmY + (p.y - lsmY) * progress;
    let ptBase = toPx(p.x, lsmY, s, height);
    let ptTarget = toPx(p.x, animatedY, s, height);

    ctx.beginPath();
    ctx.moveTo(ptBase.cx, ptBase.cy);
    ctx.lineTo(ptTarget.cx, ptTarget.cy);
    ctx.stroke();
  });
  ctx.setLineDash([]);
}

(function () {

  const starDefs = [
    { selector: '.star-r', baseSpeed: 12, dir:  1 },
    { selector: '.star-o', baseSpeed: 8,  dir: -1 },
    { selector: '.star-y', baseSpeed: 6,  dir:  1 },
  ];

  const stars = starDefs.map(def => ({
    el:           document.querySelector(def.selector),
    baseSpeed:    def.baseSpeed,
    dir:          def.dir,
    angle:        0,
    fling:        0,
    dragVelocity: 0,
    ctx:          null, // canvas context for pixel hit-test
  }));

  // Build a hidden canvas for each star so we can read pixel alpha
  stars.forEach(star => {
    const img = star.el;
    function buildCanvas() {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      star.ctx = ctx;
    }
    if (img.complete && img.naturalWidth) {
      buildCanvas();
    } else {
      img.addEventListener('load', buildCanvas);
    }
  });

  // --- Hit testing ---
  function hitTest(star, clientX, clientY) {
    if (!star.ctx) return true; // canvas not ready, allow hit

    const rect = star.el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    // Vector from image center to click
    const dx = clientX - cx;
    const dy = clientY - cy;

    // Unrotate by the star's current angle
    const rad = -star.angle * (Math.PI / 180);
    const ux  = dx * Math.cos(rad) - dy * Math.sin(rad);
    const uy  = dx * Math.sin(rad) + dy * Math.cos(rad);

    // Map to image-local pixel coordinates
    const imgX = ux + rect.width  / 2;
    const imgY = uy + rect.height / 2;

    if (imgX < 0 || imgY < 0 || imgX >= rect.width || imgY >= rect.height) return false;

    // Scale to the canvas/natural-image size
    const scaleX  = star.ctx.canvas.width  / rect.width;
    const scaleY  = star.ctx.canvas.height / rect.height;
    const pixelX  = Math.round(imgX * scaleX);
    const pixelY  = Math.round(imgY * scaleY);

    const alpha = star.ctx.getImageData(pixelX, pixelY, 1, 1).data[3];
    return alpha > 10;
  }

  // --- Drag state ---
  let dragging    = null; // the star being dragged
  let lastAngle   = 0;
  let lastTime    = 0;

  function getClientPos(e) {
    return e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX,            y: e.clientY            };
  }

  function angleFromCenter(star, clientX, clientY) {
    const rect = star.el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }

  function shortestDelta(a, b) {
    let d = a - b;
    while (d >  180) d -= 360;
    while (d < -180) d += 360;
    return d;
  }

  function onPointerDown(e) {
    const { x, y } = getClientPos(e);

    // Find the topmost star that is hit (last in DOM order = on top visually)
    for (let i = stars.length - 1; i >= 0; i--) {
      if (hitTest(stars[i], x, y)) {
        dragging  = stars[i];
        lastAngle = angleFromCenter(dragging, x, y);
        lastTime  = performance.now();
        dragging.dragVelocity = 0;
        dragging.el.style.cursor = 'grabbing';
        e.preventDefault();
        return;
      }
    }
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const { x, y } = getClientPos(e);
    const now     = performance.now();
    const dt      = (now - lastTime) / 1000;
    const current = angleFromCenter(dragging, x, y);
    const delta   = shortestDelta(current, lastAngle);

    dragging.angle += delta;
    if (dt > 0) dragging.dragVelocity = delta / dt;

    lastAngle = current;
    lastTime  = now;
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging.fling        = dragging.dragVelocity;
    dragging.dragVelocity = 0;
    dragging.el.style.cursor = 'grab';
    dragging = null;
  }

  // Mouse
  window.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup',   onPointerUp);

  // Touch
  window.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove',  onPointerMove, { passive: false });
  window.addEventListener('touchend',   onPointerUp);

  // --- Animation loop ---
  let lastFrame = performance.now();

  function animate(now) {
    const dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;

    stars.forEach(star => {
      if (star === dragging) return; // JS drag controls angle directly

      // Base rotation + fling
      star.angle += star.baseSpeed * star.dir * dt + star.fling * dt;

      // Decay fling
      star.fling *= Math.pow(0.90, dt * 60);
      if (Math.abs(star.fling) < 0.01) star.fling = 0;

      star.el.style.transform = `rotate(${star.angle}deg)`;
    });

    // Keep dragged star's transform in sync too
    if (dragging) {
      dragging.el.style.transform = `rotate(${dragging.angle}deg)`;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

// --- Red Bull Can tilt ---
(function () {
  const canEl   = document.querySelector('.redbull-can');
  const angles  = [-15, 15]; // tilt positions in degrees
  const interval = 1500;     // ms between auto-flips

  let state = 0; // 0 = left, 1 = right
  let timer = null;

  // Build hidden canvas for pixel-perfect hit test
  let ctx = null;
  function buildCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width  = canEl.naturalWidth;
    canvas.height = canEl.naturalHeight;
    const c = canvas.getContext('2d');
    c.drawImage(canEl, 0, 0);
    ctx = c;
  }
  if (canEl.complete && canEl.naturalWidth) buildCanvas();
  else canEl.addEventListener('load', buildCanvas);

  function setTilt(s) {
    state = s;
    canEl.style.transform = `translate(-50%, -50%) rotate(${angles[state]}deg)`;
  }

  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setTilt((state + 1) % 2);
      scheduleNext();
    }, interval);
  }

  function hitTest(clientX, clientY) {
    if (!ctx) return true;
    const rect = canEl.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = clientX - cx;
    const dy   = clientY - cy;
    const rad  = -angles[state] * (Math.PI / 180);
    const ux   = dx * Math.cos(rad) - dy * Math.sin(rad);
    const uy   = dx * Math.sin(rad) + dy * Math.cos(rad);
    const imgX = ux + rect.width  / 2;
    const imgY = uy + rect.height / 2;
    if (imgX < 0 || imgY < 0 || imgX >= rect.width || imgY >= rect.height) return false;
    const scaleX = ctx.canvas.width  / rect.width;
    const scaleY = ctx.canvas.height / rect.height;
    const alpha  = ctx.getImageData(Math.round(imgX * scaleX), Math.round(imgY * scaleY), 1, 1).data[3];
    return alpha > 10;
  }

  canEl.addEventListener('click', (e) => {
    if (!hitTest(e.clientX, e.clientY)) return;
    setTilt((state + 1) % 2); // jump to next position immediately
    scheduleNext();            // reset the auto-flip timer from here
  });

  // Start the cycle
  setTilt(0);
  scheduleNext();
})();

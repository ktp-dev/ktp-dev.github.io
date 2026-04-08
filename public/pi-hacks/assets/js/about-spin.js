(function () {

  const starDefs = [
    { selector: '.about-star-b',  baseSpeed: 10, dir:  1, angle:   0 },
    { selector: '.about-star-lb', baseSpeed: 10, dir:  1, angle:  19 },
    { selector: '.about-star-p',  baseSpeed:  7, dir: -1, angle: 120 },
    { selector: '.about-star-lp', baseSpeed:  7, dir: -1, angle: 139 },
    { selector: '.about-star-u',  baseSpeed: 13, dir:  1, angle: 240 },
    { selector: '.about-star-lu', baseSpeed: 13, dir:  1, angle: 259 },
  ];

  const stars = starDefs.map(def => ({
    el:           document.querySelector(def.selector),
    baseSpeed:    def.baseSpeed,
    dir:          def.dir,
    angle:        def.angle,
    fling:        0,
    dragVelocity: 0,
    ctx:          null,
  }));

  // Build hidden canvas for pixel hit-test per star
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
    if (!star.ctx) return true;

    const rect = star.el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;

    const rad = -star.angle * (Math.PI / 180);
    const ux  = dx * Math.cos(rad) - dy * Math.sin(rad);
    const uy  = dx * Math.sin(rad) + dy * Math.cos(rad);

    const imgX = ux + rect.width  / 2;
    const imgY = uy + rect.height / 2;

    if (imgX < 0 || imgY < 0 || imgX >= rect.width || imgY >= rect.height) return false;

    const scaleX = star.ctx.canvas.width  / rect.width;
    const scaleY = star.ctx.canvas.height / rect.height;
    const pixelX = Math.round(imgX * scaleX);
    const pixelY = Math.round(imgY * scaleY);

    const alpha = star.ctx.getImageData(pixelX, pixelY, 1, 1).data[3];
    return alpha > 10;
  }

  // --- Drag state ---
  let dragging  = null;
  let lastAngle = 0;
  let lastTime  = 0;

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

  window.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup',   onPointerUp);

  window.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove',  onPointerMove, { passive: false });
  window.addEventListener('touchend',   onPointerUp);

  // --- Anchor logos to star centers (translate(-50%,-50%) centering) ---
  const anchoredLogos = [
    { logo: document.querySelector('.about-can'),   star: document.querySelector('.about-star-b'), ox: 0, oy: 0 },
    { logo: document.querySelector('.about-figma'), star: document.querySelector('.about-star-p'), ox: 5, oy: 8 },
    { logo: document.querySelector('.about-esg'),   star: document.querySelector('.about-star-u'), ox: 0, oy: 0 },
  ];

  // --- Anchor L stars to base star centers (top-left corner centering) ---
  const anchoredStars = [
    { small: document.querySelector('.about-star-lb'), base: document.querySelector('.about-star-b') },
    { small: document.querySelector('.about-star-lp'), base: document.querySelector('.about-star-p') },
    { small: document.querySelector('.about-star-lu'), base: document.querySelector('.about-star-u') },
  ];

  function updateLogoPositions() {
    anchoredLogos.forEach(({ logo, star, ox, oy }) => {
      const r = star.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      logo.style.left = (cx + ox) + 'px';
      logo.style.top  = (cy + oy) + 'px';
    });

    anchoredStars.forEach(({ small, base }) => {
      const r  = base.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      // Use offsetWidth/offsetHeight (pre-transform layout size) so the
      // position doesn't drift as the star rotates
      small.style.left = (cx - small.offsetWidth  / 2) + 'px';
      small.style.top  = (cy - small.offsetHeight / 2) + 'px';
    });
  }

  // --- Animation loop ---
  let lastFrame = performance.now();

  function animate(now) {
    const dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;

    stars.forEach(star => {
      if (star === dragging) return;

      star.angle += star.baseSpeed * star.dir * dt + star.fling * dt;
      star.fling *= Math.pow(0.90, dt * 60);
      if (Math.abs(star.fling) < 0.01) star.fling = 0;

      star.el.style.transform = `rotate(${star.angle}deg)`;
    });

    if (dragging) {
      dragging.el.style.transform = `rotate(${dragging.angle}deg)`;
    }

    updateLogoPositions();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

// --- Red Bull Can tilt (about page) ---
(function () {
  const canEl   = document.querySelector('.about-can');
  const angles  = [-15, 15];
  const interval = 1500;

  let state = 0;
  let timer = null;

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
    setTilt((state + 1) % 2);
    scheduleNext();
  });

  setTilt(0);
  scheduleNext();
})();

// --- Figma tilt ---
(function () {
  const el      = document.querySelector('.about-figma');
  const angles  = [-15, 15];
  const interval = 1500;

  let state = 1; // start opposite to the can
  let timer = null;

  let ctx = null;
  function buildCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width  = el.naturalWidth;
    canvas.height = el.naturalHeight;
    const c = canvas.getContext('2d');
    c.drawImage(el, 0, 0);
    ctx = c;
  }
  if (el.complete && el.naturalWidth) buildCanvas();
  else el.addEventListener('load', buildCanvas);

  function setTilt(s) {
    state = s;
    el.style.transform = `translate(-50%, -50%) rotate(${angles[state]}deg)`;
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
    const rect = el.getBoundingClientRect();
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

  el.addEventListener('click', (e) => {
    if (!hitTest(e.clientX, e.clientY)) return;
    setTilt((state + 1) % 2);
    scheduleNext();
  });

  setTilt(1); // start opposite to the can
  scheduleNext();
})();
// --- ESG tilt ---
(function () {
  const el      = document.querySelector('.about-esg');
  const angles  = [-15, 15];
  const interval = 1500;

  let state = 0;
  let timer = null;

  let ctx = null;
  function buildCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width  = el.naturalWidth;
    canvas.height = el.naturalHeight;
    const c = canvas.getContext('2d');
    c.drawImage(el, 0, 0);
    ctx = c;
  }
  if (el.complete && el.naturalWidth) buildCanvas();
  else el.addEventListener('load', buildCanvas);

  function setTilt(s) {
    state = s;
    el.style.transform = `translate(-50%, -50%) rotate(${angles[state]}deg)`;
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
    const rect = el.getBoundingClientRect();
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

  el.addEventListener('click', (e) => {
    if (!hitTest(e.clientX, e.clientY)) return;
    setTilt((state + 1) % 2);
    scheduleNext();
  });

  setTilt(0);
  scheduleNext();
})();

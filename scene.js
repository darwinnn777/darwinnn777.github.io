/*
 * Escena persistente: un campo de partículas que cambia de forma con el scroll
 * (nube → terreno de datos → anillo → nube) mientras la cámara recorre la página.
 * Un único bucle rAF. Si no hay WebGL, la web se queda con el fondo CSS.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var canvas = document.getElementById("scene");

  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }

  if (!canvas || !window.THREE || !hasWebGL()) { root.classList.add("no-webgl"); return; }

  var THREE = window.THREE;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var isMobile = window.innerWidth < 720 || /Mobi|Android/i.test(navigator.userAgent);
  var dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  var COUNT = isMobile ? 5500 : 14000;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  } catch (e) { root.classList.add("no-webgl"); return; }
  renderer.setPixelRatio(dpr);              // primero el ratio, luego el tamaño
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 120);

  /* ---------- Geometría: tres formas objetivo por partícula ---------- */
  var posA = new Float32Array(COUNT * 3); // nube
  var posB = new Float32Array(COUNT * 3); // terreno
  var posC = new Float32Array(COUNT * 3); // anillo
  var rnd  = new Float32Array(COUNT * 4); // semilla, tamaño, tono, velocidad

  function terrain(x, z) {
    return Math.sin(x * 0.45) * Math.cos(z * 0.38) * 1.1 + Math.sin(x * 0.17 + z * 0.23) * 0.9;
  }

  var tilt = 0.9, ct = Math.cos(tilt), st = Math.sin(tilt);
  for (var i = 0; i < COUNT; i++) {
    var i3 = i * 3, i4 = i * 4;

    // A · nube esférica
    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    var r = 4 + 4.6 * Math.pow(Math.random(), 0.7);
    posA[i3]     = r * Math.sin(ph) * Math.cos(th);
    posA[i3 + 1] = r * Math.cos(ph) * 0.8;
    posA[i3 + 2] = r * Math.sin(ph) * Math.sin(th);

    // B · terreno ondulado
    var bx = (Math.random() - 0.5) * 32;
    var bz = (Math.random() - 0.5) * 24;
    posB[i3]     = bx;
    posB[i3 + 1] = terrain(bx, bz) - 2.6 + (Math.random() - 0.5) * 0.18;
    posB[i3 + 2] = bz;

    // C · anillo inclinado
    var ang = Math.random() * Math.PI * 2;
    var tube = Math.random() * Math.PI * 2;
    var rr = 0.25 + 1.8 * Math.sqrt(Math.random());
    var cx = (6.2 + rr * Math.cos(tube)) * Math.cos(ang);
    var cy = rr * Math.sin(tube) * 0.7;
    var cz = (6.2 + rr * Math.cos(tube)) * Math.sin(ang);
    posC[i3]     = cx;
    posC[i3 + 1] = cy * ct - cz * st;
    posC[i3 + 2] = cy * st + cz * ct;

    rnd[i4]     = Math.random();
    rnd[i4 + 1] = 0.55 + Math.pow(Math.random(), 3) * 2.4;
    rnd[i4 + 2] = Math.random();
    rnd[i4 + 3] = Math.random();
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(posA, 3));
  geo.setAttribute("aB", new THREE.BufferAttribute(posB, 3));
  geo.setAttribute("aC", new THREE.BufferAttribute(posC, 3));
  geo.setAttribute("aR", new THREE.BufferAttribute(rnd, 4));

  var uniforms = {
    uTime:    { value: 0 },
    uMorph:   { value: 0 },
    uPx:      { value: renderer.getPixelRatio() },
    uSize:    { value: 1.5 },
    uOpacity: { value: isMobile ? 0.8 : 0.72 },
    uC1:      { value: new THREE.Color("#a9c1ff") },
    uC2:      { value: new THREE.Color("#7a63ff") }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: [
      "uniform float uTime, uMorph, uPx, uSize;",
      "attribute vec3 aB;",
      "attribute vec3 aC;",
      "attribute vec4 aR;",
      "varying float vA;",
      "varying float vH;",
      "void main() {",
      "  float wB = clamp(1.0 - abs(uMorph - 1.0), 0.0, 1.0);",
      "  float wC = clamp(1.0 - abs(uMorph - 2.0), 0.0, 1.0);",
      "  float wA = clamp(1.0 - abs(uMorph), 0.0, 1.0) + clamp(1.0 - abs(uMorph - 3.0), 0.0, 1.0);",
      "  vec3 p = position * wA + aB * wB + aC * wC;",
      "  float t = uTime * (0.25 + aR.w * 0.5) + aR.x * 6.2831;",
      "  p += vec3(sin(t), cos(t * 1.3), sin(t * 0.7 + 1.7)) * 0.18;",
      "  p.y += sin(p.x * 0.45 + uTime * 0.6) * 0.35 * wB;",
      "  vec4 mv = modelViewMatrix * vec4(p, 1.0);",
      "  gl_Position = projectionMatrix * mv;",
      "  float dist = -mv.z;",
      "  gl_PointSize = aR.y * uSize * uPx * (28.0 / max(dist, 1.0));",
      "  vA = clamp(1.2 - dist / 48.0, 0.0, 1.0);",
      "  vH = aR.z;",
      "}"
    ].join("\n"),
    fragmentShader: [
      "precision mediump float;",
      "uniform vec3 uC1;",
      "uniform vec3 uC2;",
      "uniform float uOpacity;",
      "varying float vA;",
      "varying float vH;",
      "void main() {",
      "  float d = length(gl_PointCoord - 0.5);",
      "  if (d > 0.5) discard;",
      "  float a = smoothstep(0.5, 0.0, d);",
      "  a *= a;",
      "  gl_FragColor = vec4(mix(uC1, uC2, vH), a * vA * uOpacity);",
      "}"
    ].join("\n")
  });

  var points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  scene.add(points);

  /* ---------- Fotogramas clave por sección ---------- */
  var KF = [
    { id: "inicio",      m: 0, cam: [0, 0.5, 17],  look: [0, 0, 0],     fov: 52 },
    { id: "sobre-mi",    m: 0, cam: [-5, 1.5, 11], look: [1, 0, 0],     fov: 50 },
    { id: "trayectoria", m: 1, cam: [0, 6, 13],    look: [0, -1, 0],    fov: 55 },
    { id: "formacion",   m: 1, cam: [6, 2, 9],     look: [0, -0.5, 0],  fov: 48 },
    { id: "stack",       m: 2, cam: [0, 0, 14],    look: [0, 0, 0],     fov: 55 },
    { id: "proyectos",   m: 2, cam: [-6, -1, 10],  look: [0, 0, 0],     fov: 60 },
    { id: "contacto",    m: 3, cam: [0, 0, 22],    look: [0, 0, 0],     fov: 45 }
  ];

  var anchors = [];
  function measure() {
    anchors = KF.map(function (k) {
      var el = document.getElementById(k.id);
      if (!el) return null;
      var r = el.getBoundingClientRect();
      return r.top + window.scrollY + r.height / 2;
    });
    // Si falta alguna sección, descartamos medición para no romper el recorrido.
    if (anchors.some(function (a) { return a === null; })) anchors = [];
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerp3(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }

  function targetAt(scrollY) {
    if (!anchors.length) return KF[0];
    var y = scrollY + window.innerHeight * 0.5;
    var i = 0;
    while (i < anchors.length - 1 && y >= anchors[i + 1]) i++;
    if (i >= anchors.length - 1) return KF[KF.length - 1];
    var a = KF[i], b = KF[i + 1];
    var span = Math.max(anchors[i + 1] - anchors[i], 1);
    var t = Math.min(Math.max((y - anchors[i]) / span, 0), 1);
    t = t * t * (3 - 2 * t);
    return { m: lerp(a.m, b.m, t), cam: lerp3(a.cam, b.cam, t), look: lerp3(a.look, b.look, t), fov: lerp(a.fov, b.fov, t) };
  }

  var state = { m: 0, cam: KF[0].cam.slice(), look: KF[0].look.slice(), fov: KF[0].fov };
  var mouse = { x: 0, y: 0, sx: 0, sy: 0 };

  if (fineHover && !reduced) {
    window.addEventListener("mousemove", function (e) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* ---------- Tamaño ---------- */
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    uniforms.uPx.value = renderer.getPixelRatio();
    measure();
  }
  window.addEventListener("resize", resize);
  window.addEventListener("load", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);
  measure();

  /* ---------- Bucle único ---------- */
  var last = performance.now();
  var time = 0;
  var speed = reduced ? 0.25 : 1; // movimiento ambiental reducido, no eliminado

  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt * speed;

    var tg = targetAt(window.scrollY);
    var k = 1 - Math.exp(-dt * 3.4);
    state.m += (tg.m - state.m) * k;
    for (var n = 0; n < 3; n++) {
      state.cam[n]  += (tg.cam[n]  - state.cam[n])  * k;
      state.look[n] += (tg.look[n] - state.look[n]) * k;
    }
    state.fov += (tg.fov - state.fov) * k;

    var km = 1 - Math.exp(-dt * 2.2);
    mouse.sx += (mouse.x - mouse.sx) * km;
    mouse.sy += (mouse.y - mouse.sy) * km;

    var fit = camera.aspect < 1 ? 1.35 : 1; // en vertical, la cámara se aleja
    camera.position.set(
      state.cam[0] * fit + mouse.sx * 0.9,
      state.cam[1] * fit - mouse.sy * 0.6,
      state.cam[2] * fit
    );
    camera.lookAt(state.look[0], state.look[1], state.look[2]);
    if (Math.abs(camera.fov - state.fov) > 0.01) { camera.fov = state.fov; camera.updateProjectionMatrix(); }

    points.rotation.y = time * 0.03;
    uniforms.uTime.value = time;
    uniforms.uMorph.value = state.m;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.__SCENE__ = { measure: measure };
})();

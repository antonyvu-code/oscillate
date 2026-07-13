// OSCILLATE — console behaviour. Vanilla, no framework.
// The waveform reads --signal from CSS at draw time, so the hot/cold
// switch recolours canvas and DOM from a single source of truth.

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ---------- hot / cold signal switch ---------- */
const sysline = document.getElementById("sysline");
const HEX = { hot: "#FF4A1C", cold: "#2F6BFF" };
function setAccent(mode) {
  root.setAttribute("data-accent", mode);
  document.querySelectorAll(".accent-switch button").forEach((b) => {
    const on = b.dataset.set === mode;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", String(on));
  });
  if (sysline) sysline.textContent = "SINGLE-SIGNAL SYSTEM · " + HEX[mode].toUpperCase();
}
document.querySelectorAll(".accent-switch button").forEach((b) => {
  b.addEventListener("click", () => setAccent(b.dataset.set));
});

/* current signal colour, read live from CSS (survives the switch) */
function signalRGB() {
  const raw = getComputedStyle(root).getPropertyValue("--signal-rgb").trim();
  const p = raw.split(",").map((n) => parseInt(n, 10));
  return p.length === 3 && p.every((n) => !isNaN(n)) ? p : [255, 74, 28];
}

/* ---------- live clock ---------- */
const clk = document.getElementById("clock");
function tick() { clk.textContent = new Date().toTimeString().slice(0, 8); }
tick();
setInterval(tick, 1000);

/* ---------- elapsed counter ---------- */
const elapsedEl = document.getElementById("elapsed");
let sec = 41 * 60 + 22;
if (!reduce) {
  setInterval(() => {
    sec++;
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    elapsedEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.16 });
document.querySelectorAll(".reveal").forEach((n, i) => {
  n.style.transitionDelay = Math.min(i, 6) * 40 + "ms";
  io.observe(n);
});

/* ---------- subscribe (client-only, no network) ---------- */
const form = document.getElementById("subForm");
const toast = document.getElementById("toast");
const email = document.getElementById("email");
form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (!email.value || !email.validity.valid) {
    toast.textContent = "> Enter a valid frequency address.";
    toast.classList.add("show");
    return;
  }
  toast.textContent = "> You're on the signal. Confirmation sent to " + email.value;
  toast.classList.add("show");
  email.value = "";
});

/* ---------- waveform — the signal, drawn ---------- */
const cv = document.getElementById("wave");
const ctx = cv.getContext("2d");
let W, H, N, gap;
function size() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  N = Math.max(64, Math.floor(W / 14));
  gap = W / N;
}
size();
addEventListener("resize", size);

function draw(time) {
  const [r, g, b] = signalRGB();
  const sig = `rgb(${r},${g},${b})`;
  const mid = H / 2;
  ctx.clearRect(0, 0, W, H);

  // faint centre line
  ctx.strokeStyle = "rgba(237,233,227,.08)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();

  for (let i = 0; i < N; i++) {
    const x = i * gap + gap / 2;
    const env = Math.sin((i / N) * Math.PI); // fade at both edges
    const a = Math.sin(i * 0.5 + time * 2) * 0.5 + Math.sin(i * 0.17 - time * 1.3) * 0.5;
    const h = Math.abs(a) * env * (H * 0.42) + 2;
    const lead = i > N - 4; // playhead bars, full signal
    ctx.strokeStyle = lead ? sig : `rgba(${r},${g},${b},${0.32 + env * 0.5})`;
    ctx.lineWidth = Math.max(2, gap * 0.5);
    ctx.beginPath(); ctx.moveTo(x, mid - h); ctx.lineTo(x, mid + h); ctx.stroke();
  }

  // playhead
  ctx.strokeStyle = `rgba(${r},${g},${b},.9)`;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W - gap * 2, 0); ctx.lineTo(W - gap * 2, H); ctx.stroke();
}

if (reduce) {
  draw(0.6); // frozen frame
} else {
  let t = 0;
  (function loop() { t += 0.03; draw(t); requestAnimationFrame(loop); })();
}

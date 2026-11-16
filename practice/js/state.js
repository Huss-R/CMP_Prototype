"use strict";
/* STATE: settings, small helpers, and which tools have been tried (saved in the browser with localStorage). */
const STORE = "prototype-practice-lite.v1", SECONDS = 20;
const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const $ = id => document.getElementById(id);
const thread = $("thread"), dock = $("dock"), chips = $("chips");
const STOP = { stop: true };
let run = 0, fast = false, scene = SCENES[0], base = 0, wrote = "", clock = null, missed = false;
let tried = {};   // scene id -> list of tool keys tried

// Reads the saved "tools tried" list from the browser, ignoring anything that doesn't match a real tool.
function load(){
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null");
    if (s && s.tried && typeof s.tried === "object") {
      SCENES.forEach(sc => { const t = s.tried[sc.id]; if (Array.isArray(t)) tried[sc.id] = t.filter(k => sc.tools[k]); });
    }
  } catch (e) {}
}
// Saves the "tools tried" list in the browser so it survives a reload.
function save(){ try { localStorage.setItem(STORE, JSON.stringify({ tried })); } catch (e) {} }
const triedHere = k => (tried[scene.id] || []).includes(k);
const triedAnywhere = k => SCENES.some(sc => (tried[sc.id] || []).includes(k));

// Small builders: el() makes an element, btn() makes a button that runs fn when clicked.
function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function btn(cls, text, fn){ const b = el("button", cls, text); b.type = "button"; b.addEventListener("click", fn); return b; }
// sleep() pauses between messages. "Skip ahead" sets fast = true and calls wake() to end every pause at once.
// Each run of a scene has a number (run); if a newer one has started, the old one stops itself by throwing STOP.
const pending = new Set();
function sleep(ms, my){
  return new Promise(res => {
    if (fast || reduce || ms <= 0) { res(); return; }
    const e = { res, id: setTimeout(() => { pending.delete(e); res(); }, ms) }; pending.add(e);
  }).then(() => { if (my !== run) throw STOP; });
}
function wake(){ pending.forEach(e => { clearTimeout(e.id); e.res(); }); pending.clear(); }
function stopClock(){ if (clock) { clearInterval(clock); clock = null; } }
function show(node){ try { node.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); } catch (e) {} }

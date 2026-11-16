"use strict";
/* STATE: shared settings, small helpers, and what the player has guessed so far (saved in the browser with localStorage). */
const N = CARDS.length, TOL = 3, STORE = "prototype-resource-lite.v1";
const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const NS = "http://www.w3.org/2000/svg", XL = "http://www.w3.org/1999/xlink";
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
const fmt = v => String(Math.round(v * 10) / 10);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const byId = id => CARDS.find(c => c.id === id);

let answers = {}, drafts = {}, current = CARDS[0].id, timers = [];
const stage = $("stage"), chips = $("chips"), prog = $("prog");

function load(){
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null");
    if (!s || typeof s !== "object") return;
    if (s.answers && typeof s.answers === "object") {
      for (const c of CARDS) { const v = s.answers[c.id]; if (Number.isInteger(v) && v >= 0 && v <= 100) answers[c.id] = v; }
    }
    if (typeof s.current === "string" && byId(s.current)) current = s.current;
  } catch (e) {}
}
function save(){ try { localStorage.setItem(STORE, JSON.stringify({ answers, current })); } catch (e) {} }
function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
function clearTimers(){ timers.forEach(t => clearTimeout(t)); timers = []; }
function nextUnanswered(fromId){
  const i = CARDS.findIndex(c => c.id === fromId);
  for (let k = 1; k <= N; k++) { const c = CARDS[(i + k) % N]; if (answers[c.id] == null) return c; }
  return null;
}

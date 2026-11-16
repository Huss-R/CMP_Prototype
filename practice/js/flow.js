"use strict";
/* FLOW: what happens in order. Pick a situation, play the setup, choose a tool (with the timer and optional text box),
   play that tool out, show the coach note, then offer another tool or the next situation. */
// Draws the situation buttons, marking the open one and ticking any you have tried a tool in.
function renderChips(){
  chips.innerHTML = "";
  // With only one situation there is nothing to pick, so the buttons are hidden.
  if (SCENES.length < 2) { chips.hidden = true; $("deckLabel").textContent = "Options"; return; }
  SCENES.forEach(sc => {
    const b = btn("chip", "", () => startScene(sc.id, true));
    if (sc.id === scene.id) b.setAttribute("aria-current", "true");
    if ((tried[sc.id] || []).length) b.appendChild(el("span", "tick"));
    b.appendChild(document.createTextNode(sc.chip));
    chips.appendChild(b);
  });
}
// Opens a situation. wait = true shows a Start button first (used on page load); otherwise the setup plays straight away.
function startScene(id, scroll, wait){
  scene = SCENES.find(s => s.id === id) || SCENES[0];
  run++; const my = run; fast = false; wake(); stopClock(); wrote = ""; missed = false;
  $("where").textContent = scene.where;
  $("sceneTitle").textContent = scene.title;
  thread.innerHTML = "";
  renderChips();
  if (scroll) { try { $("stage").scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); } catch (e) {} }
  if (wait) {
    dock.innerHTML = "";
    dock.appendChild(el("p", "muted", "You will see the situation, then have a moment to choose what you do."));
    dock.appendChild(btn("btn", "Start", () => startScene(id, false)));
    return;
  }
  dockPlaying();
  play(scene.setup, my).then(() => { base = thread.children.length; fast = false; showPick(true); }).catch(e => { if (e !== STOP) console.error(e); });
}

// Your turn: shows the question, the timer (if timed and ticked), the text box (if ticked) and the tool buttons.
// Also used for "Try another tool", in which case it first removes everything after the setup from the thread.
function showPick(timed){
  stopClock();
  const my = run;
  while (thread.children.length > base) thread.removeChild(thread.lastChild);
  dock.innerHTML = "";
  dock.appendChild(el("p", "dock-label", timed ? scene.prompt : missed ? "The moment has passed, but it isn't too late. What do you do now?" : "Pick a tool to see how it could go."));

  // Optional: with "Write my own response" ticked, a text box appears above the tools.
  const ta = el("textarea"); ta.id = "reply"; ta.maxLength = 400; ta.placeholder = "Write what you would actually say or do.";
  const writing = $("writeOn").checked;
  ta.value = wrote; ta.hidden = !writing && !wrote;
  const clockBox = el("div", "clockbox");

  if (timed && $("timerOn").checked) {
    const bar = el("div", "clock"), fill = el("i"); bar.appendChild(fill);
    const text = el("p", "clock-text", SECONDS + " seconds left");
    clockBox.appendChild(bar); clockBox.appendChild(text);
    const end = Date.now() + SECONDS * 1000;
    clock = setInterval(() => {
      if (my !== run) { stopClock(); return; }
      const left = Math.max(0, end - Date.now());
      fill.style.width = (left / (SECONDS * 10)) + "%";
      text.textContent = Math.ceil(left / 1000) + " seconds left";
      if (left <= 0 && writing && ta.value.trim()) {
        stopClock(); ta.disabled = true;
        text.textContent = "Time's up. Pick the tool closest to what you wrote.";
      } else if (left <= 0) {
        stopClock(); missed = true;
        show(addStep(["n", "Nobody says anything, and the moment passes."]));
        base = thread.children.length;
        showPick(false);
      }
    }, 200);
  }
  dock.appendChild(clockBox);
  dock.appendChild(ta);
  if (!ta.hidden) dock.appendChild(el("p", "muted", "Then pick the tool closest to what you wrote."));

  const grid = el("div", "tools");
  TOOL_ORDER.filter(k => scene.tools[k]).forEach(k => {
    const b = btn("tool", "", () => { wrote = ta.value.replace(/\s+/g, " ").trim(); playTool(k); });
    const name = el("span", "tn"); if (triedHere(k)) name.appendChild(el("span", "tick")); name.appendChild(document.createTextNode(TOOLS[k].name));
    b.appendChild(name); b.appendChild(el("span", "tw", TOOLS[k].what)); b.appendChild(el("span", "te", scene.tools[k].example));
    grid.appendChild(b);
  });
  dock.appendChild(grid);
  show(dock);
}

// Plays out the chosen tool, records it as tried, then adds the coach note.
function playTool(k){
  run++; const my = run; fast = false; stopClock();
  const t = scene.tools[k];
  if (!triedHere(k)) { (tried[scene.id] = tried[scene.id] || []).push(k); save(); }
  renderChips(); renderKit();
  dockPlaying();
  play(t.steps, my).then(async () => {
    await sleep(500, my);
    const c = el("div", "coach");
    c.appendChild(el("h3", null, "Coach: " + TOOLS[k].name));
    const a = el("div"); a.appendChild(el("h4", null, "What it did")); a.appendChild(el("p", null, t.good)); c.appendChild(a);
    const g = el("div"); g.appendChild(el("h4", null, "What it left undone")); g.appendChild(el("p", null, t.gap)); c.appendChild(g);
    if (wrote) c.appendChild(el("p", "wrote", "You wrote: " + wrote));
    thread.appendChild(c); show(c);
    showEnd();
  }).catch(e => { if (e !== STOP) console.error(e); });
}

// After the coach note: offer another tool or the next situation.
function showEnd(){
  dock.innerHTML = "";
  const left = Object.keys(scene.tools).filter(k => !triedHere(k)).length;
  dock.appendChild(el("p", "dock-label", left ? left + (left === 1 ? " tool" : " tools") + " you haven't tried here" : "You've tried every tool for this situation"));
  const row = el("div", "row");
  row.appendChild(btn(left ? "btn" : "btn ghost", "Try another tool", () => showPick(false)));
  const i = SCENES.indexOf(scene), nx = SCENES[(i + 1) % SCENES.length];
  if (SCENES.length > 1) row.appendChild(btn(left ? "btn ghost" : "btn", "Next situation: " + nx.chip, () => startScene(nx.id, true)));
  else row.appendChild(btn(left ? "btn ghost" : "btn", "Start again", () => startScene(scene.id, true)));
  dock.appendChild(row);
  show(dock);
}

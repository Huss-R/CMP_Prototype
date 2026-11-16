"use strict";
/* STAGE: the question card. Draws the 100 figures, the highlighted word and its definition panel, handles the guess, and runs the reveal. */
function buildGrid(svg){
  for (let i = 0; i < 100; i++) {
    const u = document.createElementNS(NS, "use");
    u.setAttribute("href", "#fig");
    u.setAttributeNS(XL, "xlink:href", "#fig");
    u.setAttribute("x", (i % 10) * 26 + 1);
    u.setAttribute("y", Math.floor(i / 10) * 28 + 1);
    u.setAttribute("width", 24);
    u.setAttribute("height", 26);
    svg.appendChild(u);
  }
}
const setCls = (u, k) => u.setAttribute("class", k);

function renderStage(){
  clearTimers();
  const c = byId(current);
  const compareHtml = c.compare ? '<div class="compare" id="compare">' + c.compare.map(x =>
    '<div class="cmp' + (x.main ? " main" : "") + '"><span class="cl">' + esc(x.label) + '</span><span class="track"><span class="fill" data-w="' + x.value + '"></span></span><span class="cv">' + fmt(x.value) + "%</span></div>").join("") + "</div>" : "";
  // The highlighted word in the question opens a panel saying what it does and doesn't include.
  let qHtml = esc(c.q), defHtml = "";
  if (c.term && c.def) {
    const t = esc(c.term), list = a => "<ul>" + a.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>";
    qHtml = qHtml.replace(t, '<button class="term" type="button" id="term" aria-expanded="false" aria-controls="def">' + t + "</button>");
    defHtml = '<p class="termhint" id="termhint">Tap the highlighted words to see what they include.</p>' +
      '<div class="def" id="def" hidden><div class="defcols">' +
      '<div class="inc"><h3>This includes</h3>' + list(c.def.includes) + "</div>" +
      '<div class="exc"><h3>This doesn\'t include</h3>' + list(c.def.excludes) + "</div></div>" +
      (c.def.note ? '<p class="defnote">' + esc(c.def.note) + "</p>" : "") + "</div>";
  }
  stage.innerHTML =
    '<div class="stage-grid">' +
      '<div class="head"><span class="eyebrow">' + esc(c.theme) + '</span><h2 class="q">' + qHtml + "</h2>" + defHtml + "</div>" +
      '<div class="viz">' +
        '<p class="gridlabel">' + esc(c.grid) + "</p>" +
        '<svg class="people" id="people" viewBox="0 0 260 280" role="img" aria-labelledby="peopleDesc"><desc id="peopleDesc">100 figures.</desc></svg>' +
        '<div class="score">' +
          '<div class="sc you"><span class="sl">Your guess</span><span class="sv"><span id="gv">0</span><small>of 100</small></span></div>' +
          '<div class="sc real pending"><span class="sl">Real number</span><span class="sv"><span id="rv">?</span><small>of 100</small></span></div>' +
        "</div>" +
      "</div>" +
      '<div class="body">' +
        '<div class="guess" id="guessBox">' +
          '<label class="lbl" for="slider">Drag to guess</label>' +
          '<input type="range" id="slider" min="0" max="100" step="1" value="0" aria-describedby="hint">' +
          '<p class="hint" id="hint">Or tap the grid. Your guess fills in blue.</p>' +
          '<button class="btn" type="button" id="reveal" disabled>Reveal the real number</button>' +
        "</div>" +
        '<div class="after" id="after" hidden>' +
          '<p class="verdict" id="verdict" tabindex="-1"></p>' +
          '<div class="legend" id="legend"></div>' +
          compareHtml +
          '<div class="why"><h3>Why it matters</h3><p>' + esc(c.why) + "</p></div>" +
          '<div class="talk"><h3>Talk about it</h3><p>' + esc(c.talk) + "</p></div>" +
          '<p class="source">Source: <a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.source) + "</a></p>" +
          '<div class="navrow"><button class="btn" type="button" id="next">Next</button><button class="btn ghost" type="button" id="again">Guess again</button></div>' +
        "</div>" +
      "</div>" +
    "</div>";

  const termBtn = $("term");
  if (termBtn) termBtn.addEventListener("click", () => {
    const panel = $("def"), open = panel.hidden;
    panel.hidden = !open;
    $("termhint").hidden = open;
    termBtn.setAttribute("aria-expanded", String(open));
  });

  const svg = $("people");
  buildGrid(svg);
  const ctx = { c, svg, uses: Array.from(svg.querySelectorAll("use")), slider: $("slider"), gv: $("gv"), rv: $("rv"), revealBtn: $("reveal") };
  if (answers[c.id] != null) { showResult(ctx, answers[c.id], false); return; }

  const has = drafts[c.id] != null;
  setGuess(ctx, has ? drafts[c.id] : 0, has);
  ctx.slider.addEventListener("input", () => setGuess(ctx, +ctx.slider.value, true));
  svg.addEventListener("click", e => {
    if (answers[c.id] != null) return;
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const col = clamp(Math.floor((e.clientX - r.left) / r.width * 10), 0, 9);
    const row = clamp(Math.floor((e.clientY - r.top) / r.height * 10), 0, 9);
    setGuess(ctx, row * 10 + col + 1, true);
  });
  ctx.revealBtn.addEventListener("click", () => { if (!ctx.revealBtn.disabled) doReveal(ctx); });
}

function setGuess(ctx, g, touched){
  g = clamp(Math.round(g), 0, 100);
  ctx.slider.value = String(g);
  ctx.slider.style.setProperty("--p", g + "%");
  ctx.slider.setAttribute("aria-valuetext", g + " out of 100");
  ctx.gv.textContent = String(g);
  ctx.uses.forEach((u, i) => setCls(u, i < g ? "g" : ""));
  if (touched) drafts[ctx.c.id] = g;
  ctx.revealBtn.disabled = !touched;
  $("peopleDesc").textContent = "100 figures. Your guess fills " + g + ".";
}

function doReveal(ctx){
  const g = clamp(Math.round(+ctx.slider.value), 0, 100);
  answers[ctx.c.id] = g;
  delete drafts[ctx.c.id];
  save();
  renderChips(); renderResults();
  showResult(ctx, g, !reduce);
}

function verdictText(c, g){
  const r = c.answer, d = Math.abs(g - r);
  if (d === 0) return "Spot on. You guessed " + g + " and the real number is " + fmt(r) + ".";
  if (d <= TOL) return "Close. You guessed " + g + " and the real number is " + fmt(r) + ".";
  if (g < r) return "You guessed " + g + ". The real number is " + fmt(r) + ". " + (c.under ? c.under.replace("{d}", d) : "That's " + d + " " + c.unit + " you didn't count.");
  return "You guessed " + g + ". The real number is " + fmt(r) + ", " + d + " lower. " + c.over;
}

function renderLegend(g, r){
  const items = [];
  if (g === r) items.push(["g", "Your guess, spot on: " + r]);
  else if (g < r) { if (g > 0) items.push(["g", "Your guess: " + g]); items.push(["m", "Ones you didn't count: " + (r - g)]); }
  else { if (r > 0) items.push(["g", "The real number: " + r]); items.push(["o", "Extra in your guess: " + (g - r)]); }
  $("legend").innerHTML = items.map(([k, t]) =>
    '<span class="li"><svg class="sw" viewBox="0 0 24 26" aria-hidden="true"><use href="#fig" class="' + k + '"></use></svg>' + esc(t) + "</span>").join("");
}

function countUp(el, to, ms){
  const t0 = performance.now();
  const tick = t => {
    const p = Math.min(1, Math.max(0, (t - t0) / ms));
    el.textContent = p < 1 ? String(Math.round(to * (1 - Math.pow(1 - p, 3)))) : fmt(to);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function showResult(ctx, g, animate){
  const c = ctx.c, r = c.answer;
  $("guessBox").hidden = true;
  ctx.svg.classList.add("locked");
  ctx.gv.textContent = String(g);
  stage.querySelector(".sc.real").classList.remove("pending");
  const cls = i => i < Math.min(g, r) ? "g" : i < r ? "m" : i < g ? "o" : "";

  if (animate) {
    ctx.uses.forEach((u, i) => setCls(u, i < g ? "g" : ""));
    const changed = [];
    ctx.uses.forEach((u, i) => { const k = cls(i); if ((u.getAttribute("class") || "") !== k) changed.push([u, k]); });
    const step = Math.min(26, 850 / Math.max(1, changed.length));
    changed.forEach(([u, k], n) => {
      u.style.transitionDelay = (n * step) + "ms";
      u.style.animationDelay = (n * step) + "ms";
      setCls(u, k === "m" ? "m pop" : k);
    });
    later(() => changed.forEach(([u]) => { u.style.transitionDelay = ""; u.style.animationDelay = ""; }), 1700);
    countUp(ctx.rv, r, 900);
  } else {
    ctx.uses.forEach((u, i) => setCls(u, cls(i)));
    ctx.rv.textContent = fmt(r);
  }
  $("peopleDesc").textContent = "100 figures. Your guess was " + g + ". The real number is " + fmt(r) + ".";

  $("verdict").textContent = verdictText(c, g);
  renderLegend(g, r);

  const finish = () => {
    $("after").hidden = false;
    const cmp = $("compare");
    if (cmp) requestAnimationFrame(() => requestAnimationFrame(() => cmp.querySelectorAll(".fill").forEach(f => { f.style.width = f.dataset.w + "%"; })));
    const nx = nextUnanswered(c.id), nb = $("next");
    nb.textContent = nx ? "Next: " + nx.chip : "See your blind spots";
    nb.addEventListener("click", () => {
      if (nx) setCurrent(nx.id, true);
      else { try { $("results").scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); } catch (e) {} }
    });
    $("again").addEventListener("click", () => { delete answers[c.id]; save(); renderChips(); renderResults(); renderStage(); });
    if (animate) {
      const v = $("verdict");
      try { v.focus({ preventScroll: true }); } catch (e) {}
      const vr = v.getBoundingClientRect();
      if (vr.top > window.innerHeight * 0.72) { try { v.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) {} }
    }
  };
  if (animate) later(finish, 1050); else finish();
}

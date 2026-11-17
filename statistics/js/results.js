"use strict";
/* RESULTS: the "Your blind spots" summary and chart, and the Start over button. */
function renderResults(){
  const done = CARDS.filter(c => answers[c.id] != null);
  const n = done.length, sum = $("sum"), rows = $("rows");
  if (!n) {
    sum.innerHTML = '<p class="muted">Your guesses will show up here next to the real numbers.</p>';
  } else {
    const under = done.filter(c => answers[c.id] < c.answer - TOL).length;
    const over = done.filter(c => answers[c.id] > c.answer + TOL).length;
    const close = n - under - over;
    const big = done.reduce((a, c) => Math.abs(answers[c.id] - c.answer) > Math.abs(answers[a.id] - a.answer) ? c : a);
    const gap = Math.abs(answers[big.id] - big.answer);
    sum.innerHTML =
      '<div class="bigline"><span class="bignum">' + under + "<small> of " + n + '</small></span><span class="biglab">underestimated</span></div>' +
      '<p class="muted">' + over + " overestimated · " + close + " close</p>" +
      (gap > TOL ? "<p>Biggest gap: <strong>" + esc(big.chip) + "</strong>. You guessed " + answers[big.id] + " and the real number is " + fmt(big.answer) + ".</p>" : "");
  }
  rows.innerHTML = CARDS.map(c => {
    const g = answers[c.id];
    if (g == null) {
      return '<button class="drow pend" type="button" data-id="' + c.id + '"><span class="dtop"><span class="dlab">' + esc(c.chip) +
        '</span><span class="dval">Not guessed yet</span></span><span class="dtrack" aria-hidden="true"><span class="dbase"></span></span></button>';
    }
    const r = c.answer, lo = Math.min(g, r), w = Math.abs(g - r);
    return '<button class="drow" type="button" data-id="' + c.id + '" aria-label="' + esc(c.chip) + ": you guessed " + g + ", the real number is " + fmt(r) + '">' +
      '<span class="dtop"><span class="dlab">' + esc(c.chip) + '</span><span class="dval"><span class="tyou">You ' + g + '</span> · <span class="treal">Real ' + fmt(r) + "</span></span></span>" +
      '<span class="dtrack" aria-hidden="true"><span class="dbase"></span><span class="dseg ' + (g < r ? "under" : "over") + '" style="left:' + lo + "%;width:" + w + '%"></span>' +
      '<span class="ddot you" style="left:' + g + '%"></span><span class="ddot real" style="left:' + r + '%"></span></span></button>';
  }).join("");
  rows.querySelectorAll(".drow").forEach(b => b.addEventListener("click", () => setCurrent(b.dataset.id, true)));
  $("reset").hidden = !n;
}

let armed = null;
$("reset").addEventListener("click", () => {
  const b = $("reset");
  if (!armed) {
    b.textContent = "Tap again to clear all guesses";
    armed = setTimeout(() => { armed = null; b.textContent = "Start over"; }, 4000);
    return;
  }
  clearTimeout(armed); armed = null; b.textContent = "Start over";
  answers = {}; drafts = {}; current = CARDS[0].id; save();
  renderChips(); renderResults(); renderStage();
  try { stage.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); } catch (e) {}
});

"use strict";
/* CHIPS: the row of question buttons, the progress text in the header, and switching between questions. */
function renderChips(){
  chips.innerHTML = "";
  CARDS.forEach(c => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (answers[c.id] != null ? " done" : "");
    if (c.id === current) b.setAttribute("aria-current", "true");
    b.innerHTML = '<span class="ck" aria-hidden="true"></span>' + esc(c.chip) + (answers[c.id] != null ? '<span class="sr"> (answered)</span>' : "");
    b.addEventListener("click", () => setCurrent(c.id, true));
    chips.appendChild(b);
  });
  const cur = chips.querySelector('[aria-current="true"]');
  if (cur && chips.scrollWidth > chips.clientWidth) chips.scrollLeft = Math.max(0, cur.offsetLeft - chips.clientWidth / 2 + cur.offsetWidth / 2);
  const n = CARDS.filter(c => answers[c.id] != null).length;
  prog.textContent = "(" + (n === N ? "all " + N + " revealed" : n + " of " + N + " revealed") + ")";
}
function setCurrent(id, scroll){
  if (!byId(id)) return;
  current = id; save();
  renderChips(); renderStage();
  if (scroll) {
    const r = stage.getBoundingClientRect();
    if (r.top < 70 || r.top > window.innerHeight * 0.55) {
      try { stage.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); } catch (e) {}
    }
  }
}

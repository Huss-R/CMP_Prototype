"use strict";
/* TOOLKIT: the expandable list of the five tools at the bottom, with Tried / Not tried yet. */
// Redraws the list of tools, keeping any rows the reader had open.
function renderKit(){
  const list = $("kitlist"), open = Array.from(list.querySelectorAll("details")).map(d => d.open);
  list.innerHTML = "";
  TOOL_ORDER.filter(k => SCENES.some(sc => sc.tools[k])).forEach((k, i) => {   // only tools that a situation on this page uses
    const d = el("details"); d.open = !!open[i];
    const s = el("summary"); s.appendChild(document.createTextNode(TOOLS[k].name));
    s.appendChild(el("span", "st", triedAnywhere(k) ? "Tried" : "Not tried yet"));
    d.appendChild(s); d.appendChild(el("p", null, TOOLS[k].what + " " + TOOLS[k].more));
    list.appendChild(d);
  });
}

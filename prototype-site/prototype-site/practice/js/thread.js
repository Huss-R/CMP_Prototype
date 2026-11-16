"use strict";
/* THREAD: draws the messages and narration, one step at a time. */
// Adds one step to the thread: narration, your message, or someone else's message.
function addStep(step){
  let node;
  if (step[0] === "n") node = el("p", "narr", step[1]);
  else if (step[0] === "y") { node = el("div", "msg you"); node.appendChild(el("span", "from", "You")); node.appendChild(document.createTextNode(step[1])); }
  else { node = el("div", "msg"); node.appendChild(el("span", "from", step[1])); node.appendChild(document.createTextNode(step[2])); }
  thread.appendChild(node);
  return node;
}
// Plays a list of steps one after another, with a short pause before each.
async function play(steps, my){
  for (const s of steps) {
    await sleep(s[0] === "n" ? 700 : 900, my);
    show(addStep(s));
  }
}
// While a scene is playing, the dock only shows "Skip ahead".
function dockPlaying(){
  dock.innerHTML = "";
  dock.appendChild(btn("linkbtn", "Skip ahead", () => { fast = true; wake(); }));
}

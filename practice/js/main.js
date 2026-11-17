"use strict";
/* MAIN: starts the page. Runs last, after every other file has loaded. */
load();
renderKit();
startScene(SCENES[0].id, false, true);
$("writeOn").addEventListener("change", () => {
  if (dock.querySelector(".tools")) showPick(false);
});

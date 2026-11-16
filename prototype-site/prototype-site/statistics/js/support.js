"use strict";
/* SUPPORT: the support pop-up and the Copy buttons next to phone numbers. */
const sheet = $("sheet");
$("sos").addEventListener("click", () => { sheet.hidden = false; $("sheet-close").focus(); });
$("sheet-close").addEventListener("click", () => { sheet.hidden = true; $("sos").focus(); });
sheet.addEventListener("click", e => { if (e.target === sheet) sheet.hidden = true; });
document.addEventListener("keydown", e => { if (e.key === "Escape") sheet.hidden = true; });
document.querySelectorAll(".copy").forEach(b => b.addEventListener("click", () => {
  const sel = () => { const r = document.createRange(); r.selectNodeContents(b.parentElement.querySelector(".num")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Selected"; };
  try { navigator.clipboard.writeText(b.dataset.copy).then(() => { b.textContent = "Copied"; setTimeout(() => { b.textContent = "Copy"; }, 1500); }, sel); } catch (e) { sel(); }
}));

"use strict";
/* TOOLS: the five bystander tools (the 5Ds). name = label, what = one-line summary, more = extra detail shown in the toolkit list.
   TOOL_ORDER is the order they are listed in. */
const TOOLS = {
  distract: { name: "Distract", what: "Interrupt it without confronting anyone.",
    more: "Ignore the person doing it and start talking about something unrelated, or get in the way. Nobody has to know you are stepping in." },
  delegate: { name: "Delegate", what: "Get someone else to help.",
    more: "Ask the person next to you, or someone with authority such as staff, a manager or a teacher. Tell them what you saw and what you would like them to do. Outside an emergency, don't call police unless the person being harassed wants that." },
  document: { name: "Document", what: "Record it, but only if someone is already helping.",
    more: "Film it or take notes. Afterwards, ask the person what they want done with it. Never post it or share it without their permission." },
  delay: { name: "Delay", what: "Check in with her afterwards.",
    more: "If you couldn't act in the moment, ask if she's OK, tell her what you saw and offer support. What happens next is her call." },
  direct: { name: "Direct", what: "Say plainly that it's not OK.",
    more: "Keep it short, then turn your attention to the person affected. Don't get into a debate. With strangers, only do this if everyone is physically safe." }
};
const TOOL_ORDER = ["distract", "delegate", "document", "delay", "direct"];

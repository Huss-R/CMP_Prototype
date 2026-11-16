"use strict";
/* SITUATIONS: the content. Edit or add situations here.
   Each one needs: id (unique), chip (short label), where (who you are with), title, setup (what happens), prompt (the question),
   and tools: one entry per tool that fits, each with example (shown on the button), steps (how it plays out),
   good ("What it did") and gap ("What it left undone").
   Steps: ["n", text] is narration, ["s", who, text] is someone speaking, ["y", text] is you. */
const SCENES = [
  { id: "chat", chip: "Group chat", where: "With mates", title: "A mate asks the chat to rate a classmate",
    setup: [["n", "A group chat with three mates from your tutorial. Tuesday night."],
            ["s", "Sam", "has anyone started the assignment"],
            ["s", "Jordo", "found mia's insta. rate her out of 10"],
            ["s", "Sam", "LMAO. 7"],
            ["s", "Jordo", "you're in her assignment group right. what are you giving her"]],
    prompt: "Jordo has asked you directly. What do you say or do?",
    tools: {
      direct: { example: "“nah i'm not rating her. she's a person, not a score”",
        steps: [["y", "nah i'm not rating her. she's a person, not a score"], ["s", "Jordo", "its a joke bro"], ["s", "Sam", "ok HR"],
                ["n", "Nobody posts a number after that. Later, Dev messages you privately."], ["s", "Dev", "glad you said something"]],
        good: "Everyone in the chat now knows where you stand, and why. With mates you can afford to be direct, because the friendship can take it.",
        gap: "Jordo didn't agree, and he may never say he does. That isn't the measure. Keep it about what he did, not who he is, and stay out of a debate." },
      distract: { example: "“anyway has anyone actually opened the assignment”",
        steps: [["y", "anyway has anyone actually opened the assignment. it's due friday"], ["s", "Sam", "nope"], ["s", "Dev", "same lol"], ["s", "Jordo", "boring"],
                ["n", "The rating stops."]],
        good: "It took the air out of the moment without a confrontation. Useful when you can't find the words in time.",
        gap: "Nobody heard why it wasn't OK, so the group may think it was fine. Follow it up with a direct word to Jordo later." },
      delegate: { example: "Message Dev: “back me up if i say something?”",
        steps: [["n", "You message Dev privately."], ["y", "this is grim. back me up if i say something?"], ["s", "Dev", "yeah ok"],
                ["n", "Back in the group chat."], ["y", "can we not rate girls from class. she's a person"], ["s", "Dev", "yeah it's a bit much"], ["s", "Jordo", "you two are no fun"]],
        good: "Two voices are much harder to laugh off than one. Dev felt the same way and needed someone to ask.",
        gap: "It takes a minute to organise, and the chat keeps moving while you do. If nobody will back you, you still have the other tools." }
    } }
];

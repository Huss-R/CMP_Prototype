"use strict";
/* QUESTIONS: the content of the page. Edit text and numbers here.
   Each question needs: id (unique), chip (short label), theme, grid (label above the 100 figures), unit, q, answer (0-100),
   over (shown when the guess was too high), why, talk, source, url.
   term + def: term is the word in q that gets highlighted (it must appear in q exactly); def lists what it includes,
   what it excludes, and a note. Leave both out for no highlight.
   Optional: under (shown when the guess was too low; {d} becomes the gap) and compare (extra bars; main:true marks the headline one). */
const ABS_SV = "https://www.abs.gov.au/statistics/people/crime-and-justice/sexual-violence/2021-22";
const NCAS = "https://www.anrows.org.au/publication/attitudes-matter-the-2021-national-community-attitudes-towards-violence-against-women-survey-ncas-findings-for-australia/";
const CARDS = [
  { id: "harassed", chip: "Harassed", theme: "Harassment", grid: "100 women aged 18 to 24", unit: "women",
    q: "Out of 100 women aged 18 to 24, how many were sexually harassed in the past 12 months?",
    term: "sexually harassed",
    def: {"includes": ["Indecent phone calls, texts, emails or posts", "Indecent exposure", "Inappropriate comments about her body or sex life", "Unwanted touching, grabbing, kissing or fondling", "Sexual pictures or videos of her shared without consent", "Being shown sexual material she didn't want to see"], "excludes": ["Sexual assault, which the survey counts separately", "Calls or messages that were part of stalking, also counted separately", "Swearing or abuse that wasn't sexual", "Anything she didn't find improper, unwanted or offensive"], "note": "Adults aged 18 and over were asked about the past 12 months. The survey doesn't say whether an incident was a crime."},
    answer: 35, over: "That's still more than 1 in 3.",
    compare: [{ label: "Women 18 to 24", value: 35, main: true }, { label: "All women", value: 13 }, { label: "All men", value: 4.5 }],
    why: "The survey counts things like comments about her body or sex life, unwanted touching, indecent messages and indecent exposure.",
    talk: "A discussion question for the group would go here.",
    source: "ABS Personal Safety Survey 2021–22, reported by AIHW",
    url: "https://aihw.gov.au/family-domestic-and-sexual-violence/population-groups/young-women" },

  { id: "knew", chip: "Knew him", theme: "Violence", grid: "100 women sexually assaulted by a man", unit: "women",
    q: "Think of 100 women sexually assaulted by a man in the past 10 years. The most recent time, how many knew him?",
    term: "knew him",
    def: {"includes": ["A partner she lived with", "A boyfriend or date", "A friend or housemate", "An acquaintance or neighbour", "A co-worker"], "excludes": ["A stranger"], "note": "Family members aren't listed because the survey's estimate was too uncertain to publish."},
    answer: 85, under: "That's {d} more women who knew him than you guessed.", over: "Still, the large majority knew him.",
    why: "Most sexual assault is by men women know, not by strangers.",
    talk: "A discussion question for the group would go here.",
    source: "ABS Personal Safety Survey 2021–22, Sexual violence", url: ABS_SV },

  { id: "manbox", chip: "Man Box", theme: "Attitudes", grid: "100 Australian men aged 18 to 45", unit: "men",
    q: "Out of 100 Australian men aged 18 to 45, how many personally agree with the Man Box rules: be tough, don't show emotion, be the breadwinner, stay in control, use violence to get respect?",
    term: "personally agree",
    def: {"includes": ["His own view of each rule", "An average across all the rules asked about"], "excludes": ["Feeling social pressure to follow the rules, which 37% reported"], "note": "More than 3,500 men aged 18 to 45 were surveyed."},
    answer: 25, under: "That's {d} more men than you guessed.",
    over: "Most men don't agree with these rules. More feel pressure to go along than actually believe them.",
    compare: [{ label: "Personally agree", value: 25, main: true }, { label: "Feel pressure to follow them", value: 37 }],
    why: "More men feel pressure to follow these rules than actually agree with them.",
    talk: "A discussion question for the group would go here.",
    source: "The Men's Project, The Man Box 2024 (Jesuit Social Services)",
    url: "https://www.jss.org.au/news-and-media/media-releases/rigid-ideals-related-to-masculinity-drive-violence-hostility-towards-women-sexual-harassment-and-mens-own-poor-mental-health-new-research-reveals/" }
];

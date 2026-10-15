// Validates the question banks: node tools/check.js
global.window = {};
const fs = require("fs");
const read = (f) => fs.readFileSync(__dirname + "/../" + f, "utf8");
const files = ["js/data.js", "js/textbook.js", "js/book/ch01-05.js"];
for (let n = 1; n <= 33; n++) files.push(`js/book/ch${String(n).padStart(2, "0")}.js`);
eval(files.map(read).join("\n") + "\n;global.TEXTBOOK = TEXTBOOK; global.QUESTIONS = QUESTIONS;");
let problems = 0, total = 0, vocab = 0;
const seen = new Map();
const fail = (msg) => { problems++; console.log("PROBLEM:", msg); };
TEXTBOOK.chapters.forEach((ch) => {
  let n = 0;
  ch.sets.forEach((set, si) => {
    if (!set.source.table && (!set.source.text || set.source.text.length < 40)) fail(`ch${ch.num} set ${si}: short source`);
    set.questions.forEach((q) => {
      n++;
      if (q.options.length !== 4 || q.options.some((o) => !o || typeof o !== "string")) fail(`ch${ch.num}: bad options: ${q.q}`);
      if (new Set(q.options).size !== 4) fail(`ch${ch.num}: duplicate option: ${q.q}`);
      if (!q.why) fail(`ch${ch.num}: missing explanation: ${q.q}`);
      const key = q.q + "|" + q.options[0];
      if (seen.has(key)) fail(`duplicate question in ch${ch.num} and ch${seen.get(key)}: ${q.q}`);
      seen.set(key, ch.num);
    });
  });
  (ch.vocab || []).forEach((v) => { if (!v.term || !v.def) fail(`ch${ch.num}: bad vocab card`); });
  vocab += (ch.vocab || []).length;
  total += n;
  console.log(`Ch ${String(ch.num).padStart(2)}  ${String(n).padStart(4)} questions  ${String((ch.vocab || []).length).padStart(3)} cards  ${ch.title}`);
});
console.log(`\nTextbook: ${total}   Unit bank: ${QUESTIONS.length}   Total: ${total + QUESTIONS.length}   Chapter cards: ${vocab}   Problems: ${problems}`);
process.exit(problems ? 1 : 0);

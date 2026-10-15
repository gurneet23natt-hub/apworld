(function () {
  "use strict";

  const app = document.getElementById("app");
  const LETTERS = "ABCD";

  // ---------- Storage (fails safely in private mode) ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem("apw:" + key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem("apw:" + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
  };

  // ---------- Helpers ----------
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const unitById = (id) => UNITS.find((u) => u.id === id);
  const questionsFor = (unitIds) =>
    QUESTIONS.map((q, i) => ({ ...q, idx: i })).filter((q) => unitIds.includes(q.unit));

  // answered: { [questionIndex]: true|false } — latest result per question
  function getAnswered() { return store.get("answered", {}); }

  function unitMastery(unitId) {
    const answered = getAnswered();
    const qs = questionsFor([unitId]);
    const correct = qs.filter((q) => answered[q.idx] === true).length;
    return { correct, total: qs.length, pct: qs.length ? Math.round((correct / qs.length) * 100) : 0 };
  }

  let cleanup = null; // timers / listeners owned by the current view
  function setCleanup(fn) { cleanup = fn; }

  // ---------- Theme ----------
  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = store.get("theme", null);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  themeBtn.addEventListener("click", () => {
    const current =
      document.documentElement.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("theme", next);
  });

  // ---------- Router ----------
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [path, query] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query || "");
    return { parts, params };
  }

  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    const { parts, params } = parseHash();
    const top = parts[0] || "";
    document.querySelectorAll("nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === top));

    if (top === "units" && parts[1]) renderUnit(Number(parts[1]));
    else if (top === "units") renderUnits();
    else if (top === "practice") renderPracticeSetup(params);
    else if (top === "flashcards") renderFlashcards(params);
    else if (top === "writing") renderWriting();
    else if (top === "progress") renderProgress();
    else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  // ---------- Views ----------
  function unitCard(u) {
    const m = unitMastery(u.id);
    return `
      <a class="card unit-card" href="#/units/${u.id}">
        <div class="unit-num">Unit ${u.id}</div>
        <h3>${esc(u.title)}</h3>
        <div class="meta"><span>${esc(u.dates)}</span><span>·</span><span>${esc(u.weight)} of exam</span></div>
        <div class="progress" aria-label="${m.pct}% mastered"><div style="width:${m.pct}%"></div></div>
        <div class="small muted">${m.correct} / ${m.total} questions mastered</div>
      </a>`;
  }

  function renderHome() {
    const answered = getAnswered();
    const total = QUESTIONS.length;
    const done = Object.keys(answered).length;
    app.innerHTML = `
      <section class="hero">
        <div class="eyebrow">AP World History: Modern</div>
        <h1>Practice for the exam, one unit at a time.</h1>
        <p class="lead">Multiple-choice drills with explanations, key-term flashcards, and timed essay practice across all nine units, c. 1200 to the present.</p>
        <div class="row">
          <a class="btn primary" href="#/practice">Start practicing</a>
          <a class="btn" href="#/flashcards">Review flashcards</a>
        </div>
      </section>

      <section class="section grid-4">
        <div class="card stat"><div class="num">${UNITS.length}</div><div class="label">Units</div></div>
        <div class="card stat"><div class="num">${total}</div><div class="label">Practice questions</div></div>
        <div class="card stat"><div class="num">${FLASHCARDS.length}</div><div class="label">Flashcards</div></div>
        <div class="card stat"><div class="num">${done}</div><div class="label">Questions attempted</div></div>
      </section>

      <section class="section">
        <div class="row"><h2>Units</h2><span class="spacer"></span><a class="small muted" href="#/units">See all →</a></div>
        <div class="grid">${UNITS.map(unitCard).join("")}</div>
      </section>`;
  }

  function renderUnits() {
    app.innerHTML = `
      <div class="eyebrow">Course outline</div>
      <h1>Units</h1>
      <p class="lead">Exam weighting is shown for each unit. Units 3–6 carry the most weight.</p>
      <div class="grid section" style="margin-top:24px">${UNITS.map(unitCard).join("")}</div>`;
  }

  function renderUnit(id) {
    const u = unitById(id);
    if (!u) return renderUnits();
    const m = unitMastery(id);
    const prev = unitById(id - 1), next = unitById(id + 1);
    app.innerHTML = `
      <a class="small muted" href="#/units">← All units</a>
      <div class="eyebrow" style="margin-top:20px">Unit ${u.id} · ${esc(u.dates)} · ${esc(u.weight)}</div>
      <h1>${esc(u.title)}</h1>
      <p class="lead">${esc(u.summary)}</p>
      <div class="row" style="margin-top:20px">
        <a class="btn primary" href="#/practice?unit=${u.id}&start=1">Practice Unit ${u.id}</a>
        <a class="btn" href="#/flashcards?unit=${u.id}">Flashcards</a>
        <span class="muted small">${m.correct} / ${m.total} mastered</span>
      </div>
      <section class="section">
        <h2>Key concepts</h2>
        <ul class="concepts">${u.concepts.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
      </section>
      <div class="row section">
        ${prev ? `<a class="btn" href="#/units/${prev.id}">← Unit ${prev.id}</a>` : ""}
        <span class="spacer"></span>
        ${next ? `<a class="btn" href="#/units/${next.id}">Unit ${next.id} →</a>` : ""}
      </div>`;
  }

  // ---------- Practice ----------
  function renderPracticeSetup(params) {
    const preset = params.get("unit");
    let selected = preset ? [Number(preset)] : UNITS.map((u) => u.id);
    let count = 10;

    if (preset && params.get("start")) return startQuiz(selected, 999);

    function draw() {
      const available = questionsFor(selected).length;
      app.innerHTML = `
        <div class="eyebrow">Multiple choice</div>
        <h1>Practice</h1>
        <p class="lead">Pick units and a length. You'll get instant feedback and an explanation after every question.</p>
        <div class="card setup section" style="margin-top:24px">
          <label>Units</label>
          <div class="chips" id="unitChips">
            <button class="chip" data-all aria-pressed="${selected.length === UNITS.length}">All units</button>
            ${UNITS.map((u) => `<button class="chip" data-unit="${u.id}" aria-pressed="${selected.includes(u.id)}">${u.id}. ${esc(u.title)}</button>`).join("")}
          </div>
          <label style="margin-top:20px">Number of questions</label>
          <div class="chips" id="countChips">
            ${[5, 10, 20, 999].map((n) => `<button class="chip" data-count="${n}" aria-pressed="${count === n}">${n === 999 ? "All" : n}</button>`).join("")}
          </div>
          <div class="row" style="margin-top:24px">
            <button class="btn primary" id="startBtn" ${available ? "" : "disabled"}>Start · ${Math.min(count, available)} questions</button>
            <button class="btn" id="missedBtn">Retry missed questions</button>
          </div>
        </div>`;

      app.querySelector("#unitChips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        if (b.hasAttribute("data-all")) {
          selected = selected.length === UNITS.length ? [] : UNITS.map((u) => u.id);
        } else {
          const id = Number(b.dataset.unit);
          selected = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id].sort((a, b2) => a - b2);
        }
        draw();
      });
      app.querySelector("#countChips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        count = Number(b.dataset.count);
        draw();
      });
      app.querySelector("#startBtn").addEventListener("click", () => startQuiz(selected, count));
      app.querySelector("#missedBtn").addEventListener("click", () => {
        const answered = getAnswered();
        const missed = QUESTIONS.map((q, i) => ({ ...q, idx: i })).filter((q) => answered[q.idx] === false);
        if (!missed.length) {
          alert("No missed questions yet — nice work, or try a practice set first.");
          return;
        }
        runQuiz(shuffle(missed), "Missed questions");
      });
    }
    draw();
  }

  function startQuiz(unitIds, count) {
    const pool = shuffle(questionsFor(unitIds)).slice(0, count);
    const label = unitIds.length === 1 ? `Unit ${unitIds[0]}: ${unitById(unitIds[0]).title}` : unitIds.length === UNITS.length ? "All units" : `Units ${unitIds.join(", ")}`;
    runQuiz(pool, label, unitIds);
  }

  function runQuiz(pool, label, unitIds) {
    const items = pool.map((q) => ({ q, order: shuffle([0, 1, 2, 3]), choice: null }));
    let i = 0;

    function onKey(e) {
      if (e.target.tagName === "TEXTAREA") return;
      const item = items[i];
      if (!item) return;
      const k = e.key.toUpperCase();
      if (item.choice === null && LETTERS.includes(k) && k.length === 1) {
        const btn = app.querySelectorAll(".option")[LETTERS.indexOf(k)];
        if (btn) btn.click();
      } else if (item.choice !== null && e.key === "Enter") {
        const nb = app.querySelector("#nextBtn");
        if (nb) nb.click();
      }
    }
    document.addEventListener("keydown", onKey);
    setCleanup(() => document.removeEventListener("keydown", onKey));

    function draw() {
      const item = items[i];
      const { q } = item;
      const answered = item.choice !== null;
      app.innerHTML = `
        <div class="quiz">
          <div class="quiz-top"><span>${esc(label)}</span><span>${i + 1} / ${items.length}</span></div>
          <div class="progress" style="margin-bottom:28px"><div style="width:${(i / items.length) * 100}%"></div></div>
          <div class="eyebrow">Unit ${q.unit} · ${esc(unitById(q.unit).title)}</div>
          <div class="question">${esc(q.q)}</div>
          <div class="options">
            ${item.order.map((optIdx, pos) => {
              let cls = "";
              if (answered) {
                if (optIdx === 0) cls = "correct";
                else if (optIdx === item.choice) cls = "wrong";
              }
              return `<button class="option ${cls}" data-opt="${optIdx}" ${answered ? "disabled" : ""}>
                <span class="letter">${LETTERS[pos]}</span><span>${esc(q.options[optIdx])}</span></button>`;
            }).join("")}
          </div>
          ${answered ? `
            <div class="explain"><strong>${item.choice === 0 ? "Correct." : "Not quite."}</strong> ${esc(q.why)}</div>
            <div class="quiz-nav"><button class="btn primary" id="nextBtn">${i + 1 < items.length ? "Next question" : "See results"} →</button></div>` : `
            <p class="small muted" style="margin-top:16px">Tip: press A–D to answer, Enter to continue.</p>`}
        </div>`;

      if (!answered) {
        app.querySelectorAll(".option").forEach((b) =>
          b.addEventListener("click", () => {
            item.choice = Number(b.dataset.opt);
            const ans = getAnswered();
            ans[q.idx] = item.choice === 0;
            store.set("answered", ans);
            draw();
          })
        );
      } else {
        app.querySelector("#nextBtn").addEventListener("click", () => {
          i++;
          if (i < items.length) draw();
          else results();
        });
      }
    }

    function results() {
      const score = items.filter((it) => it.choice === 0).length;
      const pct = Math.round((score / items.length) * 100);
      const history = store.get("history", []);
      history.unshift({ date: new Date().toISOString(), label, score, total: items.length });
      store.set("history", history.slice(0, 50));

      app.innerHTML = `
        <div class="quiz">
          <div class="eyebrow">${esc(label)}</div>
          <h1>Results</h1>
          <div class="score-big">${score} / ${items.length}</div>
          <p class="muted">${pct}% correct${pct >= 80 ? " — strong work." : pct >= 60 ? " — solid, review the misses below." : " — review the explanations and try again."}</p>
          <div class="row" style="margin:20px 0 32px">
            <button class="btn primary" id="againBtn">Try another set</button>
            <a class="btn" href="#/practice">Change units</a>
          </div>
          <div class="card">
            <h3>Review</h3>
            ${items.map((it) => `
              <div class="review-item">
                <div class="small ${it.choice === 0 ? "tag-right" : "tag-wrong"}">${it.choice === 0 ? "✓ Correct" : "✗ Incorrect"} · Unit ${it.q.unit}</div>
                <div style="margin:4px 0">${esc(it.q.q)}</div>
                ${it.choice !== 0 ? `<div class="small muted">Your answer: ${esc(it.q.options[it.choice])}</div>` : ""}
                <div class="small"><strong>Answer:</strong> ${esc(it.q.options[0])}</div>
                <div class="small muted">${esc(it.q.why)}</div>
              </div>`).join("")}
          </div>
        </div>`;
      app.querySelector("#againBtn").addEventListener("click", () => {
        if (unitIds) startQuiz(unitIds, items.length);
        else runQuiz(shuffle(pool), label);
      });
      window.scrollTo(0, 0);
    }

    if (!items.length) {
      app.innerHTML = `<p>No questions available. <a href="#/practice">Back</a></p>`;
      return;
    }
    draw();
  }

  // ---------- Flashcards ----------
  function renderFlashcards(params) {
    const preset = params.get("unit");
    let unit = preset ? Number(preset) : 0; // 0 = all
    let deck = [];
    let i = 0;

    function build() {
      deck = unit ? FLASHCARDS.filter((c) => c.unit === unit) : FLASHCARDS.slice();
      i = 0;
    }

    function onKey(e) {
      if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === " ") { e.preventDefault(); flip(); }
    }
    document.addEventListener("keydown", onKey);
    setCleanup(() => document.removeEventListener("keydown", onKey));

    function flip() {
      const fc = app.querySelector(".flashcard");
      if (fc) fc.classList.toggle("flipped");
    }
    function move(d) {
      i = (i + d + deck.length) % deck.length;
      draw();
    }

    function draw() {
      const c = deck[i];
      app.innerHTML = `
        <div class="eyebrow">Key terms</div>
        <h1>Flashcards</h1>
        <div class="chips" id="fcChips" style="margin-top:16px">
          <button class="chip" data-unit="0" aria-pressed="${unit === 0}">All</button>
          ${UNITS.map((u) => `<button class="chip" data-unit="${u.id}" aria-pressed="${unit === u.id}">Unit ${u.id}</button>`).join("")}
        </div>
        <div class="flash-wrap">
          <div class="flashcard" tabindex="0" role="button" aria-label="Flip card">
            <div class="flash-inner">
              <div class="flash-face"><div class="eyebrow">Unit ${c.unit}</div><div class="flash-term">${esc(c.term)}</div><div class="flash-hint">Click or press space to flip</div></div>
              <div class="flash-face back"><div class="flash-def">${esc(c.def)}</div></div>
            </div>
          </div>
          <div class="flash-controls">
            <button class="btn" id="prevBtn">←</button>
            <span class="muted small">${i + 1} / ${deck.length} · <button class="chip" id="shuffleBtn" style="padding:2px 10px">Shuffle</button></span>
            <button class="btn" id="nextBtn">→</button>
          </div>
        </div>`;
      app.querySelector(".flashcard").addEventListener("click", flip);
      app.querySelector("#prevBtn").addEventListener("click", () => move(-1));
      app.querySelector("#nextBtn").addEventListener("click", () => move(1));
      app.querySelector("#shuffleBtn").addEventListener("click", () => { deck = shuffle(deck); i = 0; draw(); });
      app.querySelector("#fcChips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        unit = Number(b.dataset.unit);
        build();
        draw();
      });
    }
    build();
    draw();
  }

  // ---------- Writing ----------
  function renderWriting() {
    let tab = 0;
    let promptIdx = null;
    let timerId = null;
    let remaining = 0;

    setCleanup(() => clearInterval(timerId));

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    function draw() {
      const r = WRITING.rubrics[tab];
      const p = promptIdx !== null ? WRITING.prompts[promptIdx] : null;
      const draft = p ? store.get("draft:" + promptIdx, "") : "";
      app.innerHTML = `
        <div class="eyebrow">Free response</div>
        <h1>Writing</h1>
        <p class="lead">Know how each section is scored, then practice under time.</p>

        <section class="section grid-4">
          ${WRITING.exam.map((s) => `
            <div class="card stat">
              <div class="small muted">${esc(s.part)}</div>
              <div style="font-weight:600;margin:2px 0">${esc(s.name)}</div>
              <div class="small muted">${esc(s.detail)}</div>
              <div class="num" style="margin-top:8px">${esc(s.weight)}</div>
            </div>`).join("")}
        </section>

        <section class="section card">
          <div class="tabs" role="tablist">
            ${WRITING.rubrics.map((x, k) => `<button class="tab" role="tab" data-tab="${k}" aria-selected="${k === tab}">${x.name} · ${x.points} pts</button>`).join("")}
          </div>
          <table>
            <thead><tr><th>Category</th><th>Points</th><th>What earns it</th></tr></thead>
            <tbody>${r.rows.map((row) => `<tr><td><strong>${esc(row[0])}</strong></td><td>${esc(row[1])}</td><td>${esc(row[2])}</td></tr>`).join("")}</tbody>
          </table>
          <ul class="tips">${r.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </section>

        <section class="section">
          <div class="row"><h2>Timed practice</h2><span class="spacer"></span>
            <button class="btn" id="leqBtn">Random LEQ</button>
            <button class="btn" id="saqBtn">Random SAQ</button>
          </div>
          ${p ? `
            <div class="card" style="margin-top:16px">
              <div class="row"><span class="pill">${esc(p.type)}</span><span class="pill">${esc(p.skill)}</span><span class="spacer"></span>
                <span class="timer" id="timer">${fmt(remaining)}</span>
                <button class="btn" id="timerBtn">${timerId ? "Pause" : "Start timer"}</button>
              </div>
              <div class="prompt-box">${esc(p.text)}</div>
              <textarea id="draft" placeholder="Write your response here. Your draft saves automatically in this browser.">${esc(draft)}</textarea>
              <p class="small muted" style="margin-top:8px"><span id="wc">0</span> words</p>
            </div>` : `<p class="muted" style="margin-top:12px">Pick a random prompt to start. LEQs get a 40-minute timer; SAQs get 13 minutes.</p>`}
        </section>`;

      app.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => { tab = Number(b.dataset.tab); draw(); }));
      app.querySelector("#leqBtn").addEventListener("click", () => pick("LEQ"));
      app.querySelector("#saqBtn").addEventListener("click", () => pick("SAQ"));

      if (p) {
        const ta = app.querySelector("#draft");
        const wc = app.querySelector("#wc");
        const count = () => { wc.textContent = (ta.value.trim().match(/\S+/g) || []).length; };
        count();
        ta.addEventListener("input", () => { store.set("draft:" + promptIdx, ta.value); count(); });
        app.querySelector("#timerBtn").addEventListener("click", toggleTimer);
      }
    }

    function pick(type) {
      const options = WRITING.prompts.map((p, k) => ({ p, k })).filter((x) => x.p.type === type && x.k !== promptIdx);
      promptIdx = options[Math.floor(Math.random() * options.length)].k;
      clearInterval(timerId);
      timerId = null;
      remaining = type === "LEQ" ? 40 * 60 : 13 * 60;
      draw();
    }

    function toggleTimer() {
      const btn = app.querySelector("#timerBtn");
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
        btn.textContent = "Resume";
        return;
      }
      btn.textContent = "Pause";
      timerId = setInterval(() => {
        remaining = Math.max(0, remaining - 1);
        const t = document.getElementById("timer");
        if (t) t.textContent = fmt(remaining);
        if (remaining === 0) {
          clearInterval(timerId);
          timerId = null;
          if (t) t.textContent = "Time's up";
          const b = document.getElementById("timerBtn");
          if (b) b.disabled = true;
        }
      }, 1000);
    }

    draw();
  }

  // ---------- Progress ----------
  function renderProgress() {
    const answered = getAnswered();
    const attempted = Object.keys(answered).length;
    const correct = Object.values(answered).filter(Boolean).length;
    const history = store.get("history", []);
    app.innerHTML = `
      <div class="eyebrow">Your stats</div>
      <h1>Progress</h1>
      <p class="lead">Saved in this browser only. A question counts as mastered when your latest answer was correct.</p>

      <section class="section grid-4">
        <div class="card stat"><div class="num">${attempted}</div><div class="label">Attempted of ${QUESTIONS.length}</div></div>
        <div class="card stat"><div class="num">${correct}</div><div class="label">Mastered</div></div>
        <div class="card stat"><div class="num">${attempted ? Math.round((correct / attempted) * 100) : 0}%</div><div class="label">Accuracy</div></div>
        <div class="card stat"><div class="num">${history.length}</div><div class="label">Sets completed</div></div>
      </section>

      <section class="section card">
        <h3>By unit</h3>
        <table>
          <thead><tr><th>Unit</th><th>Mastered</th><th style="width:40%">Progress</th></tr></thead>
          <tbody>${UNITS.map((u) => {
            const m = unitMastery(u.id);
            return `<tr><td><a href="#/units/${u.id}">${u.id}. ${esc(u.title)}</a></td><td>${m.correct} / ${m.total}</td><td><div class="progress" style="margin-top:8px"><div style="width:${m.pct}%"></div></div></td></tr>`;
          }).join("")}</tbody>
        </table>
      </section>

      <section class="section card">
        <h3>Recent sets</h3>
        ${history.length ? `<table><thead><tr><th>Set</th><th>Score</th><th>Date</th></tr></thead><tbody>
          ${history.slice(0, 10).map((h) => `<tr><td>${esc(h.label)}</td><td>${h.score} / ${h.total}</td><td class="muted">${new Date(h.date).toLocaleDateString()}</td></tr>`).join("")}
        </tbody></table>` : `<p class="muted">No sets completed yet. <a href="#/practice">Start one</a>.</p>`}
      </section>

      <div class="section"><button class="btn" id="resetBtn">Reset progress</button></div>`;

    app.querySelector("#resetBtn").addEventListener("click", () => {
      if (!confirm("Clear all saved progress and history?")) return;
      store.set("answered", {});
      store.set("history", []);
      renderProgress();
    });
  }

  route();
})();

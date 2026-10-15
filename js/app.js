(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const app = $("#app");
  const LETTERS = "ABCD";
  const MASTER_PCT = 80; // a unit or chapter counts as mastered at 80%+ of its questions answered correctly

  // =====================================================================
  // Browser storage (falls back to memory in private mode)
  // =====================================================================
  const mem = {};
  const ls = {
    get(k) { try { const v = localStorage.getItem(k); return v === null ? (mem[k] ?? null) : v; } catch (e) { return mem[k] ?? null; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    del(k) { delete mem[k]; try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
    json(k, fallback) { try { return JSON.parse(ls.get(k)) || fallback; } catch (e) { return fallback; } },
  };

  // =====================================================================
  // Helpers
  // =====================================================================
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

  const LOCK_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const UNLOCK_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5 7V5a3 3 0 0 1 5.8-1" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

  // =====================================================================
  // Question bank: unit questions + textbook chapter sets, each with a stable key
  // =====================================================================
  const unitById = (id) => UNITS.find((u) => u.id === id);
  const chapterByNum = (n) => TEXTBOOK.chapters.find((c) => c.num === n);

  const UNIT_QS = QUESTIONS.map((q, i) => ({ ...q, key: "u" + i }));
  const BOOK_QS = [];
  TEXTBOOK.chapters.forEach((ch) =>
    ch.sets.forEach((set, si) =>
      set.questions.forEach((q, qi) =>
        BOOK_QS.push({ ...q, key: `c${ch.num}.${si}.${qi}`, unit: ch.unit, chapter: ch.num, set: si, source: set.source })
      )
    )
  );
  const ALL_QS = UNIT_QS.concat(BOOK_QS);
  const byKey = Object.fromEntries(ALL_QS.map((q) => [q.key, q]));

  // =====================================================================
  // Accounts
  // Cloud mode (firebase-config.js filled in): Firebase Auth + Firestore, so progress follows the account.
  // Local mode: accounts live in this browser, with passwords stored only as salted PBKDF2 hashes.
  // =====================================================================
  const USERS_KEY = "apw:accounts", SESSION_KEY = "apw:session";
  const normEmail = (e) => e.trim().toLowerCase();
  const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  const newSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)));
  async function hashPassword(password, saltHex) {
    if (!(window.crypto && crypto.subtle)) throw new Error("no-crypto");
    const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    return toHex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" }, key, 256));
  }
  const localUsers = () => ls.json(USERS_KEY, {});

  const FB_VERSION = "10.12.2";
  let cloud = null, progressRef = null, signingUp = false;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  async function initCloud() {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.apiKey || !cfg.projectId) return null;
    const base = `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
    const load = (async () => {
      await loadScript(base + "firebase-app-compat.js");
      await Promise.all([loadScript(base + "firebase-auth-compat.js"), loadScript(base + "firebase-firestore-compat.js")]);
      const fb = firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
      return { auth: fb.auth(), db: fb.firestore() };
    })();
    const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 10000));
    try { return await Promise.race([load, timeout]); } catch (e) { return null; }
  }

  const BAD_LOGIN = "That email and password don't match an account. Check them and try again.";
  const FB_ERRORS = {
    "auth/email-already-in-use": "An account with this email already exists. Log in instead.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Choose a stronger password with at least 8 characters.",
    "auth/invalid-credential": BAD_LOGIN, "auth/invalid-login-credentials": BAD_LOGIN,
    "auth/wrong-password": BAD_LOGIN, "auth/user-not-found": BAD_LOGIN,
    "auth/missing-password": "Enter your password.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
    "auth/network-request-failed": "Can't reach the server. Check your connection and try again.",
    "auth/operation-not-allowed": "Email sign-in isn't enabled yet. The site owner needs to turn it on in Firebase.",
    "permission-denied": "Signed in, but the progress database refused access. The site owner needs to publish the Firestore rules.",
  };
  const fbMessage = (e) => FB_ERRORS[e && e.code] || "Something went wrong. Try again in a moment.";

  function setBusy(form, busy) {
    const b = form.querySelector("button[type=submit]");
    if (busy) { b.dataset.label = b.textContent; b.textContent = "Please wait…"; b.disabled = true; }
    else { b.textContent = b.dataset.label || b.textContent; b.disabled = false; }
  }

  function showAuth(mode) {
    $("#booting").hidden = true;
    $("#auth").hidden = false;
    $("#app").hidden = $("#siteHeader").hidden = $("#siteFooter").hidden = true;
    const signup = mode !== "login";
    $("#signupForm").hidden = !signup;
    $("#loginForm").hidden = signup;
    $("#tabSignup").setAttribute("aria-selected", signup);
    $("#tabLogin").setAttribute("aria-selected", !signup);
    $("#forgotBtn").hidden = $("#forgotSep").hidden = !cloud;
    $("#authMode").textContent = cloud
      ? "Your account and progress work on any device."
      : "Accounts are saved in this browser on this device.";
    authMsg("");
    (signup ? $("#suFirst") : $("#liEmail")).focus();
  }
  function authMsg(text, good) {
    const el = $("#authMsg");
    el.textContent = text;
    el.className = "auth-msg" + (text ? (good ? " good" : " bad") : "");
  }

  $("#tabSignup").addEventListener("click", () => showAuth("signup"));
  $("#tabLogin").addEventListener("click", () => showAuth("login"));
  $("#toLogin").addEventListener("click", () => showAuth("login"));
  $("#toSignup").addEventListener("click", () => showAuth("signup"));

  $("#signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const first = $("#suFirst").value.trim(), last = $("#suLast").value.trim();
    const email = normEmail($("#suEmail").value), pw = $("#suPass").value;
    if (!first || !last) return authMsg("Enter your first and last name.");
    if (!validEmail(email)) return authMsg("Enter a valid email address.");
    if (pw.length < 8) return authMsg("Use a password with at least 8 characters.");

    if (cloud) {
      setBusy(form, true); signingUp = true;
      try {
        const cred = await cloud.auth.createUserWithEmailAndPassword(email, pw);
        await cred.user.updateProfile({ displayName: `${first} ${last}` });
        const profile = { first, last, email, created: Date.now() };
        await cloud.db.collection("users").doc(cred.user.uid).set(profile);
        await enterCloud(cred.user, profile);
      } catch (err) { authMsg(fbMessage(err)); }
      signingUp = false; setBusy(form, false);
      return;
    }

    const users = localUsers();
    if (users[email]) return authMsg("An account with this email already exists on this device. Log in instead.");
    try {
      const salt = newSalt();
      users[email] = { first, last, salt, hash: await hashPassword(pw, salt), created: Date.now() };
    } catch (err) {
      return authMsg("This browser can't create secure accounts. Open the site over https in an up-to-date browser.");
    }
    ls.set(USERS_KEY, JSON.stringify(users));
    ls.set(SESSION_KEY, email);
    startApp(email, users[email]);
  });

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = normEmail($("#liEmail").value), pw = $("#liPass").value;
    if (cloud) {
      setBusy(form, true);
      try { await cloud.auth.signInWithEmailAndPassword(email, pw); } // onAuthStateChanged continues from here
      catch (err) { authMsg(fbMessage(err)); }
      setBusy(form, false);
      return;
    }
    const u = localUsers()[email];
    if (!u) return authMsg("No account with that email on this device. Check the spelling or sign up.");
    let ok = false;
    try { ok = (await hashPassword(pw, u.salt)) === u.hash; }
    catch (err) { return authMsg("This browser can't check passwords. Open the site over https in an up-to-date browser."); }
    if (!ok) return authMsg("That password doesn't match. Try again.");
    ls.set(SESSION_KEY, email);
    startApp(email, u);
  });

  $("#forgotBtn").addEventListener("click", async () => {
    const email = normEmail($("#liEmail").value);
    if (!validEmail(email)) return authMsg("Type your email above, then choose “Forgot password?” again.");
    try {
      await cloud.auth.sendPasswordResetEmail(email);
      authMsg("If there's an account for that email, a reset link is on its way. Check your spam folder too.", true);
    } catch (err) {
      if (err && err.code === "auth/user-not-found") authMsg("If there's an account for that email, a reset link is on its way.", true);
      else authMsg(fbMessage(err));
    }
  });

  async function enterCloud(user, profile) {
    try {
      const userRef = cloud.db.collection("users").doc(user.uid);
      progressRef = cloud.db.collection("progress").doc(user.uid);
      let prof = profile;
      if (!prof) { const snap = await userRef.get(); prof = snap.exists ? snap.data() : null; }
      if (!prof) {
        const [first, ...rest] = (user.displayName || "Student").split(" ");
        prof = { first, last: rest.join(" "), email: user.email };
      }
      const snap = await progressRef.get();
      // First cloud login: bring over progress from a browser-only account with the same email.
      const data = snap.exists ? snap.data() : ls.json("apw:progress:" + normEmail(user.email), null);
      startApp(normEmail(user.email), prof, data);
      if (!snap.exists) save();
    } catch (err) {
      progressRef = null;
      showAuth("login");
      authMsg(fbMessage(err));
      try { await cloud.auth.signOut(); } catch (e2) { /* ignore */ }
    }
  }

  async function logOut() {
    await flushCloud();
    ls.del(SESSION_KEY);
    if (cloud) { try { await cloud.auth.signOut(); } catch (e) { /* ignore */ } }
    location.hash = "";
    location.reload();
  }
  $("#logoutBtn").addEventListener("click", logOut);

  // =====================================================================
  // Progress store (per account). Cached in this browser; synced to Firestore in cloud mode.
  // q: { [questionKey]: { a: attempts, c: correct, last: bool } }
  // =====================================================================
  let store = null, storeKey = null, account = null, syncTimer = null;

  function normalizeStore(d) {
    d = d || {};
    return {
      q: d.q || {},
      history: Array.isArray(d.history) ? d.history : [],
      unlocked: Array.isArray(d.unlocked) ? d.unlocked : [TEXTBOOK.chapters[0].num],
      drafts: d.drafts || {},
      prefs: d.prefs || {},
    };
  }
  function save() {
    ls.set(storeKey, JSON.stringify(store));
    if (progressRef) { clearTimeout(syncTimer); syncTimer = setTimeout(flushCloud, 1500); }
  }
  async function flushCloud() {
    clearTimeout(syncTimer); syncTimer = null;
    if (!progressRef || !store) return;
    try { await progressRef.set({ ...store, updatedAt: Date.now() }); } catch (e) { /* retried on next save */ }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && syncTimer) flushCloud();
  });

  function record(key, correct) {
    const r = store.q[key] || { a: 0, c: 0, last: false };
    r.a += 1;
    if (correct) r.c += 1;
    r.last = correct;
    store.q[key] = r;
    save();
  }

  // Stats for any list of questions.
  function statsFor(list) {
    let attempted = 0, mastered = 0, a = 0, c = 0;
    list.forEach((q) => {
      const r = store.q[q.key];
      if (!r) return;
      attempted++; a += r.a; c += r.c;
      if (r.last) mastered++;
    });
    const total = list.length;
    return {
      total, attempted, mastered, a, c,
      masteryPct: total ? Math.round((mastered / total) * 100) : 0,
      accPct: a ? Math.round((c / a) * 100) : null,
    };
  }
  const unitStats = (id) => statsFor(ALL_QS.filter((q) => q.unit === id));
  const chapterStats = (n) => statsFor(BOOK_QS.filter((q) => q.chapter === n));
  const isUnlocked = (n) => store.unlocked.includes(n);

  function startApp(email, profile, data) {
    account = { email, first: profile.first || "Student", last: profile.last || "" };
    storeKey = "apw:progress:" + email;
    store = normalizeStore(data || ls.json(storeKey, null));
    ls.set(storeKey, JSON.stringify(store));
    $("#acctName").textContent = account.first;
    $("#booting").hidden = $("#auth").hidden = true;
    $("#app").hidden = $("#siteHeader").hidden = $("#siteFooter").hidden = false;
    route();
  }

  // =====================================================================
  // Theme
  // =====================================================================
  const savedTheme = ls.get("apw:theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  $("#themeToggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    ls.set("apw:theme", next);
  });

  // =====================================================================
  // Router
  // =====================================================================
  let cleanup = null;
  const setCleanup = (fn) => { cleanup = fn; };

  function route() {
    if (!store) return;
    if (cleanup) { cleanup(); cleanup = null; }
    const raw = location.hash.replace(/^#\/?/, "");
    const [path, query] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query || "");
    const top = parts[0] || "";
    document.querySelectorAll("nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === top));

    if (top === "units" && parts[1]) renderUnit(Number(parts[1]));
    else if (top === "units") renderUnits();
    else if (top === "practice") renderPracticeSetup(params);
    else if (top === "textbook") renderTextbook(Number(parts[1]) || null);
    else if (top === "flashcards") renderFlashcards(params);
    else if (top === "writing") renderWriting();
    else if (top === "progress") renderProgress();
    else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  // =====================================================================
  // Home & units
  // =====================================================================
  function unitCard(u) {
    const s = unitStats(u.id);
    return `
      <a class="card unit-card" href="#/units/${u.id}">
        <div class="unit-num">Unit ${u.id}</div>
        <h3>${esc(u.title)}</h3>
        <div class="meta"><span>${esc(u.dates)}</span><span>·</span><span>${esc(u.weight)} of exam</span></div>
        <div class="progress" aria-label="${s.masteryPct}% mastered"><div style="width:${s.masteryPct}%"></div></div>
        <div class="small muted">${s.mastered} / ${s.total} mastered${s.accPct !== null ? ` · ${s.accPct}% accuracy` : ""}</div>
      </a>`;
  }

  function renderHome() {
    const s = statsFor(ALL_QS);
    app.innerHTML = `
      <section class="hero">
        <div class="eyebrow">Welcome back, ${esc(account.first)}</div>
        <h1>Practice for the exam, one unit at a time.</h1>
        <p class="lead">College Board–style multiple choice with explanations, chapter sets that follow <em>The Earth and Its Peoples</em>, key-term flashcards, and timed essay practice.</p>
        <div class="row">
          <a class="btn primary" href="#/practice">Start practicing</a>
          <a class="btn" href="#/textbook">Textbook chapters</a>
        </div>
      </section>

      <section class="section grid-4">
        <div class="card stat"><div class="num">${ALL_QS.length}</div><div class="label">Practice questions</div></div>
        <div class="card stat"><div class="num">${s.attempted}</div><div class="label">Attempted</div></div>
        <div class="card stat"><div class="num">${s.masteryPct}%</div><div class="label">Mastery</div></div>
        <div class="card stat"><div class="num">${s.accPct === null ? "—" : s.accPct + "%"}</div><div class="label">Accuracy</div></div>
      </section>

      <section class="section">
        <div class="row"><h2>Units</h2><span class="spacer"></span><a class="small muted" href="#/progress">View progress →</a></div>
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
    const s = unitStats(id);
    const chapters = TEXTBOOK.chapters.filter((c) => c.unit === id);
    const prev = unitById(id - 1), next = unitById(id + 1);
    app.innerHTML = `
      <a class="small muted" href="#/units">← All units</a>
      <div class="eyebrow" style="margin-top:20px">Unit ${u.id} · ${esc(u.dates)} · ${esc(u.weight)}</div>
      <h1>${esc(u.title)}</h1>
      <p class="lead">${esc(u.summary)}</p>
      <div class="row" style="margin-top:20px">
        <a class="btn primary" href="#/practice?unit=${u.id}&start=1">Practice Unit ${u.id}</a>
        <a class="btn" href="#/flashcards?unit=${u.id}">Flashcards</a>
        <span class="muted small">${s.mastered} / ${s.total} mastered</span>
      </div>
      <section class="section">
        <h2>Key concepts</h2>
        <ul class="concepts">${u.concepts.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
      </section>
      ${chapters.length ? `
      <section class="section">
        <h2>Textbook chapters</h2>
        <div class="chips">${chapters.map((c) => `<a class="chip" href="#/textbook/${c.num}">Ch. ${c.num} · ${esc(c.title)}</a>`).join("")}</div>
      </section>` : ""}
      <div class="row section">
        ${prev ? `<a class="btn" href="#/units/${prev.id}">← Unit ${prev.id}</a>` : ""}
        <span class="spacer"></span>
        ${next ? `<a class="btn" href="#/units/${next.id}">Unit ${next.id} →</a>` : ""}
      </div>`;
  }

  // =====================================================================
  // Practice by unit
  // =====================================================================
  function renderPracticeSetup(params) {
    const preset = params.get("unit");
    let selected = preset ? [Number(preset)] : UNITS.map((u) => u.id);
    let count = 10;
    if (preset && params.get("start")) return startUnitQuiz(selected, 999);

    function draw() {
      const available = ALL_QS.filter((q) => selected.includes(q.unit)).length;
      app.innerHTML = `
        <div class="eyebrow">Multiple choice</div>
        <h1>Practice by unit</h1>
        <p class="lead">Questions come from both the unit bank and the textbook chapter sets. Each one shows its source, the way the AP exam does.</p>
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
          <p class="small muted" id="setupMsg" style="margin:12px 0 0"></p>
        </div>`;

      $("#unitChips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        if (b.hasAttribute("data-all")) selected = selected.length === UNITS.length ? [] : UNITS.map((u) => u.id);
        else {
          const id = Number(b.dataset.unit);
          selected = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id].sort((x, y) => x - y);
        }
        draw();
      });
      $("#countChips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        count = Number(b.dataset.count);
        draw();
      });
      $("#startBtn").addEventListener("click", () => startUnitQuiz(selected, count));
      $("#missedBtn").addEventListener("click", () => {
        const missed = ALL_QS.filter((q) => store.q[q.key] && !store.q[q.key].last);
        if (!missed.length) { $("#setupMsg").textContent = "No missed questions right now. Finish a set first, or keep it up!"; return; }
        runQuiz(shuffle(missed), "Missed questions", () => runQuiz(shuffle(missed), "Missed questions"));
      });
    }
    draw();
  }

  function startUnitQuiz(unitIds, count) {
    const pool = shuffle(ALL_QS.filter((q) => unitIds.includes(q.unit))).slice(0, count);
    const label = unitIds.length === 1 ? `Unit ${unitIds[0]}: ${unitById(unitIds[0]).title}`
      : unitIds.length === UNITS.length ? "All units" : `Units ${unitIds.join(", ")}`;
    runQuiz(pool, label, () => startUnitQuiz(unitIds, count));
  }

  // =====================================================================
  // Quiz runner (shared by unit practice and textbook chapters)
  // =====================================================================
  function sourceBlock(src) {
    if (!src) return "";
    const body = src.table
      ? `<table class="data-table"><caption>${esc(src.table.caption)}</caption>
          <thead><tr>${src.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
          <tbody>${src.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
      : `<p class="source-text">${esc(src.text)}</p>`;
    return `<figure class="source"><div class="source-kind">${esc(src.kind)}</div>${body}<figcaption>${esc(src.cite)}</figcaption></figure>`;
  }

  function runQuiz(pool, label, again, onFinish) {
    if (!pool.length) { app.innerHTML = `<p>No questions available. <a href="#/practice">Back</a></p>`; return; }
    const items = pool.map((q) => ({ q, order: shuffle([0, 1, 2, 3]), choice: null }));
    let i = 0;

    function onKey(e) {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      const item = items[i];
      if (!item) return;
      const k = e.key.toUpperCase();
      if (item.choice === null && k.length === 1 && LETTERS.includes(k)) {
        const btn = app.querySelectorAll(".option")[LETTERS.indexOf(k)];
        if (btn) btn.click();
      } else if (item.choice !== null && e.key === "Enter") {
        const nb = $("#nextBtn");
        if (nb) nb.click();
      }
    }
    document.addEventListener("keydown", onKey);
    setCleanup(() => document.removeEventListener("keydown", onKey));

    function tagFor(q) {
      return q.chapter ? `Ch. ${q.chapter} · ${chapterByNum(q.chapter).title}` : `Unit ${q.unit} · ${unitById(q.unit).title}`;
    }

    function draw() {
      const item = items[i];
      const { q } = item;
      const answered = item.choice !== null;
      // Tell the student when consecutive questions share a source.
      let setNote = "";
      if (q.source) {
        let start = i, end = i;
        while (start > 0 && items[start - 1].q.source === q.source) start--;
        while (end < items.length - 1 && items[end + 1].q.source === q.source) end++;
        if (end > start) setNote = `Questions ${start + 1}–${end + 1} refer to the source below.`;
      }
      app.innerHTML = `
        <div class="quiz">
          <div class="quiz-top"><span>${esc(label)}</span><span>${i + 1} / ${items.length}</span></div>
          <div class="progress" style="margin-bottom:28px"><div style="width:${(i / items.length) * 100}%"></div></div>
          <div class="eyebrow">${esc(tagFor(q))}</div>
          ${setNote ? `<p class="small muted" style="margin:0 0 8px">${setNote}</p>` : ""}
          ${sourceBlock(q.source)}
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
            record(q.key, item.choice === 0);
            draw();
          })
        );
      } else {
        $("#nextBtn").addEventListener("click", () => {
          i++;
          if (i < items.length) { draw(); window.scrollTo(0, 0); }
          else results();
        });
      }
    }

    function results() {
      const score = items.filter((it) => it.choice === 0).length;
      const pct = Math.round((score / items.length) * 100);
      store.history.unshift({ date: new Date().toISOString(), label, score, total: items.length });
      store.history = store.history.slice(0, 50);
      const note = onFinish ? onFinish(pct) : "";
      save();

      app.innerHTML = `
        <div class="quiz">
          <div class="eyebrow">${esc(label)}</div>
          <h1>Results</h1>
          <div class="score-big">${score} / ${items.length}</div>
          <p class="muted">${pct}% correct${pct >= 80 ? ". Strong work." : pct >= 60 ? ". Solid. Review the misses below." : ". Review the explanations and try again."}</p>
          ${note ? `<div class="notice">${note}</div>` : ""}
          <div class="row" style="margin:20px 0 32px">
            <button class="btn primary" id="againBtn">Try another set</button>
            <a class="btn" href="#/progress">View progress</a>
          </div>
          <div class="card">
            <h3>Review</h3>
            ${items.map((it) => `
              <div class="review-item">
                <div class="small ${it.choice === 0 ? "tag-right" : "tag-wrong"}">${it.choice === 0 ? "✓ Correct" : "✗ Incorrect"} · ${esc(tagFor(it.q))}</div>
                <div style="margin:4px 0">${esc(it.q.q)}</div>
                ${it.choice !== 0 ? `<div class="small muted">Your answer: ${esc(it.q.options[it.choice])}</div>` : ""}
                <div class="small"><strong>Answer:</strong> ${esc(it.q.options[0])}</div>
                <div class="small muted">${esc(it.q.why)}</div>
              </div>`).join("")}
          </div>
        </div>`;
      $("#againBtn").addEventListener("click", again);
      window.scrollTo(0, 0);
    }

    draw();
  }

  // =====================================================================
  // Textbook chapters: tabs, focus, lock/unlock
  // =====================================================================
  function chapterQuizPool(nums, limit) {
    // Keep College Board–style sets together; shuffle the order of sets.
    const sets = [];
    nums.forEach((n) => chapterByNum(n).sets.forEach((_, si) => sets.push(BOOK_QS.filter((q) => q.chapter === n && q.set === si))));
    const out = [];
    for (const set of shuffle(sets)) {
      if (out.length >= limit) break;
      out.push(...set);
    }
    return out;
  }

  function startChapterQuiz(nums) {
    const single = nums.length === 1 ? chapterByNum(nums[0]) : null;
    const label = single ? `Ch. ${single.num}: ${single.title}` : `${nums.length} unlocked chapters`;
    const limit = single ? 999 : 20;
    runQuiz(chapterQuizPool(nums, limit), label, () => startChapterQuiz(nums), (pct) => {
      if (!single || pct < MASTER_PCT) return "";
      const idx = TEXTBOOK.chapters.indexOf(single);
      const next = TEXTBOOK.chapters[idx + 1];
      if (next && !isUnlocked(next.num)) {
        store.unlocked.push(next.num);
        return `You scored ${MASTER_PCT}% or higher, so <strong>Chapter ${next.num}: ${esc(next.title)}</strong> is now unlocked.`;
      }
      return "";
    });
  }

  function renderTextbook(selectedNum) {
    const chapters = TEXTBOOK.chapters;
    let current = chapterByNum(selectedNum) || chapterByNum(store.prefs.lastChapter) || chapters[0];

    function draw() {
      store.prefs.lastChapter = current.num;
      const unlocked = chapters.filter((c) => isUnlocked(c.num));
      const s = chapterStats(current.num);
      const locked = !isUnlocked(current.num);
      const qCount = BOOK_QS.filter((q) => q.chapter === current.num).length;
      const unit = unitById(current.unit);

      app.innerHTML = `
        <div class="eyebrow">${esc(TEXTBOOK.title)} · ${esc(TEXTBOOK.edition)}</div>
        <h1>Textbook chapters</h1>
        <p class="lead">College Board–style sets for each chapter from c. 1200 to the present. Pick a chapter tab to focus on it, or lock chapters you haven't read yet so they stay out of mixed practice.</p>
        <div class="row" style="margin-top:20px">
          <button class="btn primary" id="mixBtn" ${unlocked.length ? "" : "disabled"}>Practice all unlocked (${unlocked.length})</button>
          <button class="btn" id="unlockAll">Unlock all</button>
          <button class="btn" id="lockAll">Lock all</button>
        </div>
        <p class="small muted" style="margin-top:10px">Score ${MASTER_PCT}%+ on a chapter to unlock the next one automatically. Chapter numbers follow the 6th edition; if your copy is numbered differently, go by the titles.</p>

        <div class="book section">
          <div class="chapter-tabs" role="tablist" aria-label="Chapters">
            ${chapters.map((c) => {
              const st = chapterStats(c.num);
              const lk = !isUnlocked(c.num);
              return `<button class="chapter-tab ${lk ? "is-locked" : ""}" role="tab" data-ch="${c.num}" aria-selected="${c === current}">
                <span class="ct-num">${c.num}</span>
                <span class="ct-title">${esc(c.title)}</span>
                <span class="ct-meta">${lk ? LOCK_ICON : st.attempted ? st.masteryPct + "%" : ""}</span>
              </button>`;
            }).join("")}
          </div>

          <div class="card chapter-panel">
            <div class="row">
              <div class="eyebrow" style="margin:0">Chapter ${current.num} · ${esc(current.dates)}</div>
              <span class="spacer"></span>
              <button class="btn btn-sm" id="lockBtn">${locked ? UNLOCK_ICON + " Unlock" : LOCK_ICON + " Lock"}</button>
            </div>
            <h2 style="margin-top:8px">${esc(current.title)}</h2>
            <p class="muted">Aligned to <a href="#/units/${unit.id}">Unit ${unit.id}: ${esc(unit.title)}</a> · ${qCount} questions in ${current.sets.length} sets</p>
            ${locked ? `
              <div class="locked-box">${LOCK_ICON} <div><strong>This chapter is locked.</strong><br><span class="muted small">Unlock it when you've read it, or finish the previous chapter with ${MASTER_PCT}%+.</span></div></div>` : `
              <div class="grid-3" style="margin:20px 0">
                <div class="stat"><div class="num">${s.masteryPct}%</div><div class="label">Mastery</div></div>
                <div class="stat"><div class="num">${s.accPct === null ? "—" : s.accPct + "%"}</div><div class="label">Accuracy</div></div>
                <div class="stat"><div class="num">${s.attempted}/${s.total}</div><div class="label">Attempted</div></div>
              </div>
              <div class="row">
                <button class="btn primary" id="focusBtn">Focus: practice Chapter ${current.num}</button>
              </div>
              <h3 style="margin-top:28px">Sources in this chapter</h3>
              <ul class="concepts">${current.sets.map((set) => `<li><span class="pill">${esc(set.source.kind)}</span> <span class="small">${esc(set.source.cite)}</span></li>`).join("")}</ul>`}
          </div>
        </div>`;

      const sel = app.querySelector('.chapter-tab[aria-selected="true"]');
      if (sel) sel.scrollIntoView({ block: "nearest", inline: "center" });
      app.querySelectorAll(".chapter-tab").forEach((b) =>
        b.addEventListener("click", () => {
          current = chapterByNum(Number(b.dataset.ch));
          history.replaceState(null, "", "#/textbook/" + current.num);
          draw();
        })
      );
      $("#lockBtn").addEventListener("click", () => {
        if (locked) store.unlocked.push(current.num);
        else store.unlocked = store.unlocked.filter((n) => n !== current.num);
        save();
        draw();
      });
      $("#unlockAll").addEventListener("click", () => { store.unlocked = chapters.map((c) => c.num); save(); draw(); });
      $("#lockAll").addEventListener("click", () => { store.unlocked = []; save(); draw(); });
      $("#mixBtn").addEventListener("click", () => startChapterQuiz(unlocked.map((c) => c.num)));
      const fb = $("#focusBtn");
      if (fb) fb.addEventListener("click", () => startChapterQuiz([current.num]));
    }
    draw();
  }

  // =====================================================================
  // Flashcards
  // =====================================================================
  function renderFlashcards(params) {
    let unit = params.get("unit") ? Number(params.get("unit")) : 0;
    let deck = [], i = 0;
    const build = () => { deck = unit ? FLASHCARDS.filter((c) => c.unit === unit) : FLASHCARDS.slice(); i = 0; };

    function onKey(e) {
      if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === " ") { e.preventDefault(); flip(); }
    }
    document.addEventListener("keydown", onKey);
    setCleanup(() => document.removeEventListener("keydown", onKey));

    const flip = () => { const fc = app.querySelector(".flashcard"); if (fc) fc.classList.toggle("flipped"); };
    const move = (d) => { i = (i + d + deck.length) % deck.length; draw(); };

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
            <button class="btn" id="prevBtn" aria-label="Previous card">←</button>
            <span class="muted small">${i + 1} / ${deck.length} · <button class="chip chip-sm" id="shuffleBtn">Shuffle</button></span>
            <button class="btn" id="nextCard" aria-label="Next card">→</button>
          </div>
        </div>`;
      app.querySelector(".flashcard").addEventListener("click", flip);
      $("#prevBtn").addEventListener("click", () => move(-1));
      $("#nextCard").addEventListener("click", () => move(1));
      $("#shuffleBtn").addEventListener("click", () => { deck = shuffle(deck); i = 0; draw(); });
      $("#fcChips").addEventListener("click", (e) => {
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

  // =====================================================================
  // Writing
  // =====================================================================
  function renderWriting() {
    let tab = 0, promptIdx = null, timerId = null, remaining = 0;
    setCleanup(() => clearInterval(timerId));
    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    function draw() {
      const r = WRITING.rubrics[tab];
      const p = promptIdx !== null ? WRITING.prompts[promptIdx] : null;
      const draft = p ? store.drafts[promptIdx] || "" : "";
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
              <textarea id="draft" placeholder="Write your response here. Your draft saves to your account automatically.">${esc(draft)}</textarea>
              <p class="small muted" style="margin-top:8px"><span id="wc">0</span> words</p>
            </div>` : `<p class="muted" style="margin-top:12px">Pick a random prompt to start. LEQs get a 40-minute timer; SAQs get 13 minutes.</p>`}
        </section>`;

      app.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => { tab = Number(b.dataset.tab); draw(); }));
      $("#leqBtn").addEventListener("click", () => pick("LEQ"));
      $("#saqBtn").addEventListener("click", () => pick("SAQ"));

      if (p) {
        const ta = $("#draft"), wc = $("#wc");
        const count = () => { wc.textContent = (ta.value.trim().match(/\S+/g) || []).length; };
        count();
        ta.addEventListener("input", () => { store.drafts[promptIdx] = ta.value; save(); count(); });
        $("#timerBtn").addEventListener("click", toggleTimer);
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
      const btn = $("#timerBtn");
      if (timerId) { clearInterval(timerId); timerId = null; btn.textContent = "Resume"; return; }
      btn.textContent = "Pause";
      timerId = setInterval(() => {
        remaining = Math.max(0, remaining - 1);
        const t = $("#timer");
        if (t) t.textContent = fmt(remaining);
        if (remaining === 0) {
          clearInterval(timerId); timerId = null;
          if (t) t.textContent = "Time's up";
          const b = $("#timerBtn");
          if (b) b.disabled = true;
        }
      }, 1000);
    }
    draw();
  }

  // =====================================================================
  // Progress: Mastery / Accuracy views and a shareable .txt report
  // =====================================================================
  function buildReport() {
    const pad = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n));
    const line = (label, st) =>
      `  ${pad(label, 72)} mastery ${String(st.masteryPct).padStart(3)}%  (${st.mastered}/${st.total})   accuracy ${st.accPct === null ? "  —" : String(st.accPct).padStart(3) + "%"}  (${st.c}/${st.a})`;
    const all = statsFor(ALL_QS);
    const out = [
      "AP World History: Modern — Progress Report",
      "==========================================",
      `Student:   ${account.first} ${account.last}`.trimEnd(),
      `Email:     ${account.email}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "OVERALL",
      `  Questions attempted: ${all.attempted} of ${all.total}`,
      `  Mastery:  ${all.masteryPct}% (${all.mastered} questions whose latest answer was correct)`,
      `  Accuracy: ${all.accPct === null ? "—" : all.accPct + "%"} (${all.c} correct of ${all.a} answers)`,
      `  Practice sets completed: ${store.history.length}`,
      "",
      "BY UNIT",
      ...UNITS.map((u) => line(`Unit ${u.id}: ${u.title}`, unitStats(u.id))),
      "",
      `BY CHAPTER (${TEXTBOOK.title}, ${TEXTBOOK.edition})`,
      ...TEXTBOOK.chapters.map((c) => line(`Ch. ${c.num}: ${c.title}${isUnlocked(c.num) ? "" : " [locked]"}`, chapterStats(c.num))),
      "",
      "RECENT SETS",
      ...(store.history.length
        ? store.history.slice(0, 10).map((h) => `  ${new Date(h.date).toLocaleDateString()}  ${pad(h.label, 50)} ${h.score}/${h.total}`)
        : ["  None yet."]),
      "",
      `Mastery = share of questions whose most recent answer was correct. Accuracy = correct answers ÷ all answers.`,
    ];
    return out.join("\n");
  }

  function downloadText(filename, text) {
    try {
      const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch (e) { return false; }
  }

  function renderProgress() {
    let view = store.prefs.view === "accuracy" ? "accuracy" : "mastery";

    function meterRow(label, href, st, extra) {
      const mastery = view === "mastery";
      const pct = mastery ? st.masteryPct : st.accPct || 0;
      const right = mastery ? `${st.masteryPct}%` : st.accPct === null ? "Not started" : `${st.accPct}%`;
      const sub = mastery ? `${st.mastered} of ${st.total} questions mastered` : st.a ? `${st.c} correct of ${st.a} answers` : "No answers yet";
      const done = mastery && st.masteryPct >= MASTER_PCT;
      return `<div class="meter-row">
        <div class="meter-label"><a href="${href}">${esc(label)}</a>${extra || ""}${done ? ' <span class="pill pill-good">Mastered</span>' : ""}<div class="small muted">${sub}</div></div>
        <div class="meter ${mastery ? "" : "acc"}"><span style="width:${pct}%"></span></div>
        <div class="meter-val">${right}</div>
      </div>`;
    }

    function draw() {
      const all = statsFor(ALL_QS);
      app.innerHTML = `
        <div class="eyebrow">${esc(account.first)} ${esc(account.last)}</div>
        <h1>Progress</h1>
        <p class="lead">${cloud ? "Saved to your account, so it follows you to any device." : "Saved to your account in this browser."}</p>

        <section class="section grid-4">
          <div class="card stat"><div class="num">${all.attempted}<span class="muted small"> / ${all.total}</span></div><div class="label">Questions attempted</div></div>
          <div class="card stat"><div class="num">${all.masteryPct}%</div><div class="label">Mastery</div></div>
          <div class="card stat"><div class="num">${all.accPct === null ? "—" : all.accPct + "%"}</div><div class="label">Accuracy</div></div>
          <div class="card stat"><div class="num">${store.history.length}</div><div class="label">Sets completed</div></div>
        </section>

        <section class="section card">
          <div class="row">
            <div class="seg seg-inline" role="tablist" aria-label="Progress view">
              <button role="tab" data-view="mastery" aria-selected="${view === "mastery"}">Mastery</button>
              <button role="tab" data-view="accuracy" aria-selected="${view === "accuracy"}">Accuracy</button>
            </div>
            <span class="spacer"></span>
          </div>
          <p class="small muted" style="margin:12px 0 4px">${view === "mastery"
            ? `Mastery is the share of questions whose most recent answer was correct. ${MASTER_PCT}%+ earns a Mastered badge.`
            : "Accuracy is every correct answer divided by every answer, including retries."}</p>
          <h3 style="margin-top:20px">By unit</h3>
          ${UNITS.map((u) => meterRow(`Unit ${u.id}: ${u.title}`, `#/units/${u.id}`, unitStats(u.id))).join("")}
          <h3 style="margin-top:28px">By textbook chapter</h3>
          ${TEXTBOOK.chapters.map((c) => meterRow(`Ch. ${c.num}: ${c.title}`, `#/textbook/${c.num}`, chapterStats(c.num),
            isUnlocked(c.num) ? "" : ` <span class="lock-inline" title="Locked">${LOCK_ICON}</span>`)).join("")}
        </section>

        <section class="section card">
          <h3>Share your progress</h3>
          <p class="small muted">Download a plain-text report to email to a teacher or upload to your class page.</p>
          <div class="row">
            <button class="btn primary" id="dlBtn">Download report (.txt)</button>
            <button class="btn" id="copyBtn">Copy report text</button>
            <button class="btn" id="showBtn">Show report</button>
          </div>
          <p class="small muted" id="shareMsg" role="status" style="margin:10px 0 0"></p>
          <pre class="report" id="reportBox" hidden></pre>
        </section>

        <section class="section card">
          <h3>Recent sets</h3>
          ${store.history.length ? `<table><thead><tr><th>Set</th><th>Score</th><th>Date</th></tr></thead><tbody>
            ${store.history.slice(0, 10).map((h) => `<tr><td>${esc(h.label)}</td><td>${h.score} / ${h.total}</td><td class="muted">${new Date(h.date).toLocaleDateString()}</td></tr>`).join("")}
          </tbody></table>` : `<p class="muted">No sets completed yet. <a href="#/practice">Start one</a>.</p>`}
        </section>

        <div class="section"><button class="btn" id="resetBtn">Reset progress</button></div>`;

      app.querySelectorAll("[data-view]").forEach((b) =>
        b.addEventListener("click", () => { view = b.dataset.view; store.prefs.view = view; save(); draw(); })
      );
      const msg = $("#shareMsg");
      $("#dlBtn").addEventListener("click", () => {
        const slug = `${account.first}-${account.last}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "student";
        msg.textContent = downloadText(`apworld-progress-${slug}.txt`, buildReport())
          ? "Report downloaded. Attach the .txt file to an email or upload it to your class page."
          : "The download didn't start. Use “Show report” and copy the text instead.";
      });
      $("#copyBtn").addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(buildReport()); msg.textContent = "Report copied to your clipboard."; }
        catch (e) { msg.textContent = "Couldn't copy automatically. Use “Show report” and copy the text."; }
      });
      $("#showBtn").addEventListener("click", () => {
        const box = $("#reportBox");
        box.textContent = buildReport();
        box.hidden = !box.hidden;
      });
      $("#resetBtn").addEventListener("click", () => {
        if (!confirm("Clear all saved answers and history for this account? Chapter locks and drafts stay.")) return;
        store.q = {};
        store.history = [];
        save();
        draw();
      });
    }
    draw();
  }

  // =====================================================================
  // Boot: Firebase when configured and reachable, otherwise browser-only accounts.
  // =====================================================================
  (async function boot() {
    cloud = await initCloud();
    if (cloud) {
      let started = false;
      cloud.auth.onAuthStateChanged((user) => {
        if (started || signingUp) return;
        if (user) { started = true; enterCloud(user); }
        else showAuth("login");
      });
      return;
    }
    const session = ls.get(SESSION_KEY);
    const u = session && localUsers()[session];
    if (u) startApp(session, u);
    else showAuth(Object.keys(localUsers()).length ? "login" : "signup");
  })();
})();

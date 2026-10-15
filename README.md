# AP World History: Modern — Practice

A neutral-themed study site for AP World History: Modern. Open `index.html` in a browser; there is no build step.

- **Units**: summaries, key concepts, and exam weighting for all 9 units
- **Practice**: multiple-choice questions with explanations, filtered by unit, plus "retry missed"
- **Textbook**: College Board–style question sets for all 33 chapters of *The Earth and Its Peoples* (AP 6th
  edition); chapters 1–10 are tagged Foundations (before c. 1200). Each set shares a source (a primary-source
  excerpt, a historian's argument, or a practice passage), like the AP exam. Chapter tabs let you focus on one
  chapter, and chapters can be locked or unlocked; scoring 80%+ on a chapter unlocks the next one.
- **Flashcards**: unit key terms plus vocabulary for each chapter, with a deck picker by unit or chapter
- **Writing**: SAQ / DBQ / LEQ practice using official College Board released free-response exams (linked on
  AP Central), with the rubric, an exam-length timer, a draft box that saves to your account, and self-scoring
- **Accounts**: sign-up / log-in page (first name, last name, email, password)
- **Progress**: Mastery / Accuracy toggle by unit and by chapter, and a downloadable `.txt` progress report

The site intentionally does not display how many questions are in the bank.

All questions and practice passages are original. Quoted primary sources are short excerpts. No textbook text is
reproduced; chapter titles are used only to line questions up with the book.

## Files

- `index.html`: page layout, sign-up / log-in screen
- `css/style.css`: styles (light and dark themes)
- `js/data.js`: units, unit questions, flashcards, writing rubrics, practice prompts, and official exam links
- `js/textbook.js`: chapter list, a few original sets for chapters 11–33, and the `TEXTBOOK.add` / `TEXTBOOK.vocab`
  helpers. In every question the **first** option is correct; options are shuffled when shown.
- `js/book/chNN.js`: question sets and flashcards for each chapter (format documented in `js/textbook.js`)
- `tools/check.js`: run `node tools/check.js` to validate every question and card (counts, duplicates, format)
- `js/app.js`: routing, quizzes, chapter locks, accounts, progress, and the report
- `firebase-config.js`: Firebase settings (`null` = accounts saved in the browser only)
- `firestore.rules`: database rules that keep each student's data private

## Accounts on any device (Firebase)

Until Firebase is set up, accounts and progress are saved in the browser on one device (passwords are stored only
as salted PBKDF2 hashes). To make accounts work on any device:

1. Go to https://console.firebase.google.com and click **Create a project** (Google Analytics is optional).
2. **Build → Authentication → Get started → Sign-in method**: enable **Email/Password**.
3. **Build → Firestore Database → Create database**: pick a location and start in **production mode**.
   Open the **Rules** tab, replace everything with the contents of `firestore.rules`, and click **Publish**.
4. **Project settings** (gear icon) **→ Your apps → Web (`</>`)**: register an app (no hosting needed) and copy
   the `firebaseConfig` object it shows.
5. In `firebase-config.js`, replace `null` with that object and commit.
6. **Authentication → Settings → Authorized domains**: add your custom domain and `gurneet23natt-hub.github.io`.

Students who made a browser-only account before Firebase was connected should sign up again with the same email.
Their progress on that device carries over the first time they log in.

## Hosting with a custom domain (GitHub Pages)

1. On GitHub: **Settings → Pages**, set Source to "Deploy from a branch", then pick your branch and `/ (root)`.
2. On the same page, enter your domain under **Custom domain** (GitHub adds a `CNAME` file).
3. At your domain registrar, add DNS records:
   - for a subdomain such as `practice.example.com`: a `CNAME` record pointing to `gurneet23natt-hub.github.io`
   - for an apex domain such as `example.com`: `A` records to `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, and `185.199.111.153`
4. Once DNS has updated, tick **Enforce HTTPS**.

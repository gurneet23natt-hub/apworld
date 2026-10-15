# AP World History: Modern — Practice

A neutral-themed study site for AP World History: Modern. Open `index.html` in a browser; there is no build step.

- **Units**: summaries, key concepts, and exam weighting for all 9 units
- **Practice**: 150 multiple-choice questions with explanations, filtered by unit, plus "retry missed"
- **Textbook**: College Board–style question sets for chapters 11–33 of *The Earth and Its Peoples* (AP 6th edition).
  Each set shares a source (a primary-source excerpt, a data table, or a practice passage), like the AP exam.
  Chapter tabs let you focus on one chapter, and chapters can be locked or unlocked. Scoring 80%+ on a chapter
  unlocks the next one.
- **Flashcards**: 54 key terms, filterable by unit
- **Writing**: SAQ / DBQ / LEQ rubrics, plus timed prompts with a draft box that saves to your account
- **Accounts**: sign-up / log-in page (first name, last name, email, password)
- **Progress**: Mastery / Accuracy toggle by unit and by chapter, and a downloadable `.txt` progress report

All questions and practice passages are original. Quoted primary sources are short excerpts. No textbook text is
reproduced; chapter titles are used only to line questions up with the book.

## Files

- `index.html`: page layout, sign-up / log-in screen
- `css/style.css`: styles (light and dark themes)
- `js/data.js`: units, unit questions, flashcards, writing rubrics and prompts
- `js/textbook.js`: chapter list and chapter question sets. In every question the **first** option is correct;
  options are shuffled when shown.
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

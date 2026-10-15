# AP World History: Modern — Practice

A neutral-themed static study site for AP World History: Modern.

- **Units:** summaries, key concepts, and exam weighting for all 9 units
- **Practice:** 63 multiple-choice questions with explanations, unit filters, and "retry missed"
- **Flashcards:** 54 key terms, filterable by unit
- **Writing:** SAQ / DBQ / LEQ rubrics, plus timed prompts with an auto-saving draft box
- **Progress:** per-unit mastery and recent scores, saved in your browser

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server
```

It also works as-is on GitHub Pages (Settings → Pages → deploy from the default branch).

## Adding content

All content is in `js/data.js`. For each question, the **first** option is the correct answer; the app shuffles options when it displays them.

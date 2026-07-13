# סקירה, חוות דעת ותוכנית שיפור — Workshop Design System

**ריפו:** `noamh98/workshop-design-system` · ענף `main`
**תאריך סקירה:** 2026-07-11 · **סוקר:** סוכן הנדסת תוכנה (עבור נועם חנימוב)
**היקף:** כלל "הכלים העיצוביים" ליצירת מצגות/דשבורדים ב-HTML (מערכת עיצוב, מנועי JS, תבניות, סוכני AI, ותוצרי decks).

---

## 1. תקציר מנהלים

`Workshop Design System` היא מערכת עיצוב **ללא תלויות** (HTML/CSS/vanilla-JS) לבניית מצגות אסטרטגיות למנהלים, בשפה ויזואלית של "מחברת יועץ בכיר באמצע וורקשופ": מרקמי נייר, שכבת סקיצה בכתב-יד, ו**קונבנציית שש-דיו סמנטית קבועה** (שחור=מבנה, כחול=עתיד, אדום=בעיות, ירוק=פתרונות, כתום=סיכונים, סגול=AI). המערכת דו-לשונית (עברית RTL + אנגלית), עם מצב כהה/בהיר ותמיכת הדפסה.

**חוות דעת כללית:** הליבה העיצובית **בשלה, מוקפדת ומרשימה** — טוקנים נקיים, הפרדת אחריות טובה בין קבצי CSS, מנוע סקיצה מבוסס-seed חכם, ותיעוד עיצובי יוצא-דופן באיכותו. **החולשה המרכזית אינה בעיצוב אלא בהיגיינת המאגר ובממשל:** עשרות קבצי HTML עצמאיים במשקל ~2MB כל אחד (סה"כ ~26MB) שמשכפלים את כל המערכת inline, ריבוי מסמכי-הוראות חופפים, היעדר CI/בדיקות אוטומטיות, ותהליך שבו סוכני AI מבצעים commit ישירות ל-`main`.

**ציון כולל: 7.5/10** — ליבה מצוינת, אריזה ותחזוקתיות שדורשות עבודה.

---

## 2. מפת "הכלים" (אינוונטר)

| # | כלי / רכיב | מיקום | תפקיד | הערכה |
|---|-----------|-------|-------|-------|
| 1 | **טוקנים** | `project/css/tokens.css` | מקור אמת יחיד: צבע (בהיר+כהה), טיפוגרפיה, ריווח, radius, צל, motion, מערכת דיו | ★★★★★ |
| 2 | **מערכת דיו** | `project/css/ink-system.css` | `data-ink` → `--_ink/--_ink-soft` סמנטי | ★★★★★ |
| 3 | **בסיס / RTL / הדפסה** | `base.css`, `rtl.css`, `print.css` | reset, קנבס `.slide` 1920×1080, מראה RTL, עמוד-לדף | ★★★★☆ |
| 4 | **מרקמי נייר** | `paper-textures.css` | dot-grid / notebook / whiteboard / kraft / blueprint (CSS טהור) | ★★★★★ |
| 5 | **רכיבים** | `css/components/*` | annotations, cards, matrix, canvas, flow, architecture, tables-charts, meeting | ★★★★☆ |
| 6 | **מנוע סקיצה** | `js/sketch.js` | קווי-יד SVG עם jitter מבוסס-seed (יציב בין רינדורים) | ★★★★★ |
| 7 | **גרפים** | `js/charts.js` | donut/bar/line ב-SVG ללא ספרייה | ★★★☆☆ |
| 8 | **תמה/שפה/reveal/scale** | `theme.js`, `reveal.js`, `scale.js` | toggle כהה/בהיר+He/En, scroll-reveal, סקיילינג kiosk | ★★★★☆ |
| 9 | **אייקונים** | `icons/sprite.svg` + `js/icons.js` | 40 אייקוני stroke 24×24, + וריאנט hatch | ★★★★☆ |
| 10 | **פונטים** | `fonts/` | Excalifont + Playpen Sans Hebrew (self-hosted, OFL) | ★★★★☆ |
| 11 | **תבניות** | `project/templates/*` (17 תיקיות) | שקפים מוכנים להעתקה | ★★★★☆ |
| 12 | **Guidelines** | `project/guidelines/*.card.html` | כרטיסי specimen למערכת | ★★★★☆ |
| 13 | **סוכני AI** | `copilot-agent/`, `SKILL.md`, `CLAUDE.md`, `decks/*-instructions.md` | הוראות לבניית decks אוטומטית | ★★★☆☆ |
| 14 | **תוצרי decks** | `project/*.html`, `decks/*.html` | מצגות מיוצאות עצמאיות (~2MB כ"א) | ★★☆☆☆ |
| 15 | **קונפיג adherence** | `project/_adherence.oxlintrc.json`, `_ds_manifest.json`, `_ds_bundle.js` | תשתית linter/manifest למערכת העיצוב | ★★★☆☆ (לא ברור אם מחווט) |

---

## 3. חוזקות (מה עובד מצוין)

1. **ארכיטקטורת טוקנים ממושמעת.** `tokens.css` הוא מקור אמת יחיד; הערות מפורשות אוסרות hardcode של ערכים ברכיבים. מעבר תמה לא דורש נגיעה ב-markup.
2. **קונבנציית הדיו הסמנטית** היא הרעיון המנצח — קבועה, מתועדת, ונאכפת דרך `data-ink`. זו החתימה של המוצר.
3. **ללא תלויות + עובד על `file://`.** אין build step, אין שרת. אייקונים inline לעקיפת חסימת `<use>` חוצה-קבצים ב-Chrome — פתרון פרקטי.
4. **RTL כאזרח מדרגה ראשונה.** שימוש עקבי ב-CSS לוגי, עטיפת מונחים לועזיים/מספרים ב-`<bdi>`, היפוך חצים אוטומטי ב-`sketch.js`, ופתרון fallback לכתב-יד עברי (במקום "קומיק סאנס").
5. **תיעוד עיצובי חריג באיכותו.** `project/docs/README.md` (19KB) מסביר לא רק "מה" אלא "למה" (למשל באגי contrast של corkboard, מלכודות `<pattern>` תחת `display:none`).
6. **מודעות לנגישות.** מטריצת WCAG מול משטחי הנייר, `:focus-visible`, כיבוד `prefers-reduced-motion`.
7. **jitter מבוסס-seed** ב-`sketch.js` — הקווים "רוטטים" זהה בכל טעינה, אורגני ולא מהבהב.

---

## 4. חולשות, סיכונים ובעיות

### 4.1 היגיינת מאגר — הבעיה מספר 1 (חומרה: גבוהה)
- **~18 קבצי HTML במשקל ~2MB** תחת `project/` (`staff-assembly.html`, `training-and-onboarding.html`, `org-structure-transport-admin.html` וכו', שמם קוצר מעברית לטיני — ראו גל 0 למטה) — כל אחד **משכפל inline את כל מערכת העיצוב**. סה"כ ~26MB תוכן משוכפל בהיסטוריית git.
- קובץ `decks/municipa1l-ai-briefing_2.he.html` — **571KB**, עם **שגיאת כתיב בשם** (`municipa1l`) וסיומת `_2`.
- ~~**שמות קבצים בעברית עם רווחים** → בעיות URL-encoding, קישורי `htmlpreview`, ותאימות חוצת-מערכות.~~ תוקן — ראו גל 0 למטה.
- אין `.gitignore`, אין הפרדה בין "מקור" ל"תוצר בנוי".

### 4.2 פיצול תיעוד והוראות (חומרה: בינונית)
- לפחות **חמישה** מקורות-הוראות חופפים: `README.md` (root), `project/readme.md`, `project/docs/README.md`, `project/SKILL.md`, `project/CLAUDE.md`, `copilot-agent/INSTRUCTIONS.md`, `decks/presentation-agent-instructions.md`. חלקם עברית, חלקם אנגלית, עם חפיפה גדולה → **סיכון drift** (כללים שמתעדכנים במקום אחד ולא באחר).
- אי-עקביות casing: `README.md` מול `readme.md`.

### 4.3 היעדר אוטומציה ובקרת איכות (חומרה: בינונית-גבוהה)
- קיים `_adherence.oxlintrc.json` ו-`check_design_system` מוזכר ב-`CLAUDE.md`, אך **אין `package.json` מחווט, אין CI, אין GitHub Actions**. ה-validators המתוארים ב-`presentation-agent-instructions.md` (שלבים 5–6: render→screenshot→validate) הם **שאיפתיים ולא ממומשים**.
- אין בדיקות (tests), אין link-check, אין HTML validation אוטומטית.

### 4.4 ממשל ואבטחת שרשרת-אספקה (חומרה: גבוהה מבחינה ארגונית)
- הוראות הסוכן מנחות לבצע **`create_or_update_file` ישירות ל-`main`** תחת `decks/`, **ללא PR וללא code review**. בסביבה ארגונית (ובוודאי IAI/air-gapped) זהו וקטור סיכון: תוכן שנוצר ע"י AI נכנס לענף הראשי ללא שער בקרה.
- אין branch protection נרמז, אין CODEOWNERS.

### 4.5 offline / air-gap חלקי (חומרה: בינונית — קריטי ל-IAI)
- רק **מצב ה-sketchbook** מארח פונטים מקומית. הסגנון ה**דיפולטי** טוען Fraunces/Inter/Heebo/Frank Ruhl/Caveat מ-**Google Fonts בזמן ריצה**. עבור סביבות מנותקות-רשת (IAI) זהו כשל שקט — הטיפוגרפיה תיפול ל-fallback.

### 4.6 חוב טכני נקודתי (חומרה: נמוכה-בינונית)
- **גרפים מוגבלים** ל-donut/bar/line, בעוד `CLAUDE.md` מבקש bar-h RTL, stacked, scatter, gantt, waterfall — **backlog לא ממומש**.
- **שכפול SVG**: כל עמוד מ-inline מחדש את ה-symbols שהוא צריך (בגלל מגבלת `file://`) → אין single source, תחזוקת אייקון = עריכה ב-N מקומות.
- נגישות: כתום ו-`--color-ink-muted` **לא עוברים 4.5:1** (מתועד, אך לא נאכף אוטומטית).
- `_ds_bundle.js` (49KB) — לא ברור מתי מיוצר/מסונכרן מול המקור.

---

## 5. תוכנית שיפור מסודרת (לפי גלים ועדיפות)

> עיקרון מנחה: **לא לגעת בליבה העיצובית שעובדת.** רוב העבודה היא אריזה, אוטומציה וממשל.

### גל 0 — ניצחונות מהירים (יום–יומיים)
- [x] `municipa1l-ai-briefing_2.he.html` (38 הפרות validator: gradients, data-ink/data-sketch/data-chart לא תקינים) הוסר — deck חדש ונקי לאותו נושא כבר קיים כ-`decks/municipal-ai-briefing_120726.he.html`.
- [x] המרת שמות קבצים בעברית עם רווחים ל-`kebab-case` לטיני (עם מיפוי כותרות פנימי) — `npm run normalize:apply`, ראו `scripts/filename-map.json`.
- [ ] אחידות casing: קובץ README אחד קנוני לכל תיקייה.
- [ ] הוספת `.gitignore` ו-`CONTRIBUTING.md` קצר.

### גל 1 — היגיינת מאגר ומקור-אמת (שבוע)
- [ ] **הוצאת תוצרי ה-HTML הכבדים (~26MB) מ-`main`.** אפשרויות: GitHub Releases כ-artifacts, ענף `builds` נפרד, או Git LFS. `main` יכיל **מקור בלבד**.
- [ ] הגדרת "מקור" מול "בנוי": ה-decks צריכים להיות **קומפוזיציה** מעל המערכת, לא export מונוליטי משוכפל.
- [ ] (אופציונלי) `git filter-repo` לצמצום היסטוריה — בזהירות, בתיאום מלא.

### גל 2 — איחוד תיעוד והוראות סוכן (שבוע)
- [ ] **מקור-הוראות קנוני יחיד** (למשל `docs/AGENT.md`), וכל השאר (`SKILL.md`, `INSTRUCTIONS.md`, `CLAUDE.md`) הופכים ל-stubs שמפנים אליו או נוצרים ממנו.
- [ ] מטריצת "מקור → יעד" למניעת drift; הוספת בדיקת CI שמוודאת סנכרון.

### גל 3 — CI ובקרת איכות אוטומטית (1–2 שבועות)
- [ ] `package.json` עם scripts: `lint` (חיווט `_adherence.oxlintrc.json`), `validate`, `screenshot`.
- [ ] **GitHub Actions**: הרצת oxlint, HTML validation, link-check, ומימוש בפועל של שער ה-render→screenshot (Playwright headless) שמתואר בהוראות.
- [ ] מימוש `check_design_system` כסקריפט שבודק: כל `data-ink` חוקי (אחד מ-6), אין אימוג'י, אין gradients, `<bdi>` סביב מספרים/לטינית, `dir="rtl"` על כל `.slide`.

### גל 4 — pipeline בנייה (אופציונלי, 1–2 שבועות)
- [ ] סקריפט בנייה שמייצר `styles.css` ממוזער אחד ומבצע **inline של אייקונים אוטומטית** בזמן build — כדי שמחברי עמודים לא ישכפלו SVG ידנית.
- [ ] המערכת נשארת "ללא תלויות בזמן ריצה"; הבנייה היא רק כלי-מחבר.

### גל 5 — הקשחת נגישות (שבוע)
- [ ] אכיפת contrast: הרצת `axe`/`pa11y` ב-CI; חסימת merge על רגרסיה.
- [ ] סימון מפורש של כתום/muted כ"large/decorative only" ברמת lint.

### גל 6 — מצב offline / air-gap (קריטי ל-IAI) (שבוע)
- [ ] **self-host לכל הפונטים** גם בסגנון הדיפולטי (לא רק sketchbook), עם `@font-face` מקומי ו-fallback דטרמיניסטי.
- [ ] דגל `offline` שמסיר כל `<link>` ל-CDN — auditable ודטרמיניסטי, מתאים לסביבה מנותקת.

### גל 7 — הרחבת יכולות (backlog קיים)
- [ ] מימוש סוגי הגרפים החסרים ב-`charts.js`: `bar-h` RTL, stacked, scatter, gantt, waterfall + מצב `rough` לכולם.
- [ ] הרחבת strokes ב-`sketch.js`: bracket, underline-double/wavy, scribble, star, arrow-curve.
- [ ] ~20 אייקונים חדשים באותו סטנדרט (24×24, stroke 1.75, currentColor) + עדכון כרטיסי ה-guidelines.

### ממשל (רוחבי, במקביל)
- [ ] **Branch protection על `main`** + חובת PR ל-decks שנוצרו ע"י סוכן (לא commit ישיר).
- [ ] `CODEOWNERS` + תבנית PR עם צ'קליסט הצ'ק-ליסט של ה-validators.
- [ ] תיוג רגישות/סיווג לתוצרים ארגוניים (רלוונטי ל-IAI).

---

## 6. סטטוס ביצוע (ענף `chore/design-system-hardening`)

הגלים הבאים **בוצעו בפועל** בענף זה (תוספות בלבד — ללא נגיעה בליבה העיצובית):

| פריט | גל | קובץ שנוסף | סטטוס |
|------|----|-----------|-------|
| `.gitignore` | 0 | `.gitignore` | ✅ בוצע |
| מדריך תרומה | 0 | `CONTRIBUTING.md` | ✅ בוצע |
| איחוד תיעוד — אינדקס קנוני | 2 | `docs/AGENT.md` | ✅ בוצע |
| מימוש `check_design_system` | 3 | `scripts/check-design-system.mjs` | ✅ בוצע (dependency-free, נבדק) |
| חיווט scripts | 3 | `package.json` | ✅ בוצע |
| CI (מצב warn — rollout מדורג) | 3 | `.github/workflows/ci.yml` | ✅ בוצע |
| בעלות קוד | ממשל | `.github/CODEOWNERS` | ✅ בוצע |
| תבנית PR עם צ'קליסט validators | ממשל | `.github/pull_request_template.md` | ✅ בוצע |
| בדיקת קישורים/נכסים מקומיים | 3/5 | `scripts/check-links.mjs` | ✅ בוצע (warn, נבדק מול fixtures) |
| bundler CSS מגרף ה-`@import` | 4 | `scripts/build-styles.mjs` | ✅ בוצע (נבדק — hoist external, cascade order) |
| טרנספורם offline/air-gap | 6 | `scripts/make-offline.mjs` | ✅ בוצע (אידמפוטנטי, נבדק) |
| שינוי-שם קבצים כבדים (git mv) | 0/1 | `scripts/normalize-filenames.mjs` + `scripts/filename-map.json` | ✅ כלי נמסר (dry-run כברירת מחדל; נבדק מקומית) |

**נמסר ככלי מורץ ולא כביצוע עיוור:** שינוי-השם הפיזי של קבצי ה-HTML הכבדים (571KB / ~2MB × 17) מסופק כסקריפט `git mv` דאטה-מונחה (`normalize-filenames.mjs`, `--apply` להרצה) במקום שכתוב inline דרך ה-API — שהיה מסכן שחיתות תוכן ומנפח את ה-context. הסקריפט אידמפוטנטי (מדלג על מקור חסר / יעד קיים) ומיפוי כל 17 הקבצים אומת מול המאגר בפועל.

**נותר כ-follow-up מפורש** (דורש clone מלא / render חי לאימות ויזואלי, ולכן לא בוצע עיוור): **גל 7** (הרחבת ליבת הרינדור — charts/sketch/icons), הוצאת ~26MB מהיסטוריית git (ניתוח היסטוריה), ו-self-host לפונטים בסגנון הדיפולטי (נכסים בינאריים). לאחר הרצת `normalize-filenames.mjs --apply` יש לעדכן הפניות ב-`_ds_manifest.json` בהתאם.

---

## 7. סיכום מסירה

| סעיף | תוכן |
|------|------|
| **מה נעשה** | סקירת קוד מקיפה + ביצוע גלים 0/2/3/4/5/6 (תשתית + כלים) והממשל בענף feature: אינדקס תיעוד קנוני, validator עובד, package.json, CI (warn), CODEOWNERS, תבנית PR, .gitignore, CONTRIBUTING, וארבעה כלי אוטומציה dependency-free (check-links, build-styles, make-offline, normalize-filenames). |
| **קבצים שנבחנו** | `README.md`, `project/{readme,docs/README,SKILL,CLAUDE,styles}.*`, `project/css/{tokens,ink-system,...}`, `project/js/*`, `project/components/`, `project/templates/`, `project/guidelines/`, `copilot-agent/*`, `decks/*`. |
| **איך נבדק** | קריאה ישירה של המקור דרך GitHub API (שכפול מקומי ו-curl חסומים); כל הסקריפטים נבדקו מקומית מול fixtures ומאגר git סינתטי (validator: good עובר/bad תופס 8 הפרות; build-styles: גרף `@import`; check-links: refs שבורים; make-offline: אידמפוטנטיות; normalize: dry-run + ענפי idempotency). **לא בוצע רינדור חי**. |
| **סיכונים** | היגיינת מאגר (~26MB תוצרים משוכפלים), drift בתיעוד, commit ישיר ל-`main` ע"י סוכן, offline חלקי בסגנון הדיפולטי. |
| **תוכנית גיבוי (rollback)** | כל השינויים בענף `chore/design-system-hardening` — תוספות בלבד. ניתן למחוק את הענף/לבצע `git revert` ללא השפעה על הליבה. |
| **כותרת PR מוצעת** | `chore: design-system review, validator & governance scaffolding` |

---

*מסמך זה מלווה ביצוע בפועל בענף `chore/design-system-hardening`. השלבים שדורשים clone מלא או תיאום בעלים סומנו כ"נותר כ-follow-up".*

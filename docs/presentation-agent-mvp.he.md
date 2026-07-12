# תוכנית MVP — סוכן בניית מצגות בסגנון Workshop Design System

מסמך תכנון מפורט לבניית סוכן שמייצר מצגות מנהלים כקובץ HTML יחיד,
**בדיוק** בסגנון המערכת: "מחברת של יועץ בכיר באמצע וורקשופ" — נייר, קווי יד,
שש דיו סמנטיות, עברית RTL עם מונחים לועזיים.

---

## 1. תמצית

| | |
|---|---|
| **מטרה** | משתמש נותן נושא / מסמך גולמי → הסוכן מחזיר מצגת HTML עצמאית (standalone) תקנית במערכת העיצוב, אחרי אישור outline, עם בקרת איכות אוטומטית |
| **תוצר** | קובץ `decks/<kebab-case>.he.html` יחיד, ללא תלויות, מוכן להקרנה/הדפסה/שיתוף |
| **פלטפורמת MVP** | סוכן מבוסס Claude (Claude Code / Agent SDK) שרץ מול הריפו הזה, עם שני כלי עזר חדשים: validator ו-render-check |
| **מחוץ ל-MVP** | מסלול open-slide (React), ייבוא CSV/Excel, ייצוא PPTX, ממשק Web ייעודי |

---

## 2. מה כבר קיים בריפו (נכסים לשימוש חוזר)

| נכס | מיקום | תפקיד ב-MVP |
|---|---|---|
| מערכת העיצוב המלאה | `project/` — `styles.css`, `css/tokens.css`, `css/style-sketchbook.css`, `js/sketch.js`, `js/charts.js`, `js/icons.js`, `icons/sprite.svg`, `fonts/` | מקור האמת לסגנון; ממנה נגזר ה-starter |
| 17 תבניות מוכנות | `project/templates/*` (executive-summary, quarterly-review, roadmap, incident-postmortem…) | בנק דוגמאות "זהב" — הסוכן לומד מהן פריסות לפי סוג שקף |
| שלד מצגת | `copilot-agent/starter/deck-starter.he.html` | נקודת ההתחלה המחייבת של כל מצגת (אין כתיבה מאפס) |
| מתכוני שקפים | `copilot-agent/knowledge/slide-recipes.txt`, `workshop-design-guide.txt` | בלוקים להעתקה: KPI, בעיה↔פתרון, flow, טבלה, תרשים |
| הוראות תפעול v2 | `decks/presentation-agent-instructions.md` | הפרסונה וה-pipeline של הסוכן — הבסיס ל-SKILL של ה-MVP |
| סקיל קיים | `.claude/skills/workshop-design/SKILL.md` | מזהה בקשות "בסגנון המערכת" ומפנה לנכסים |
| חוקי adherence | `project/_adherence.oxlintrc.json`, `project/_ds_manifest.json` | נקודת פתיחה לחוקי ה-validator |

**הפערים שה-MVP סוגר** (סעיף 9 בהוראות v2): כלי render+screenshot,
validator כסקריפט אכיף, בנק תבניות מובנה לפי תפקיד-שקף, ומדריך אנטי-דפוסים.

---

## 3. היקף

### בתוך ה-MVP
1. מסלול אחד: **Workshop Sketchbook — HTML יחיד** (סגנון A בהוראות v2).
2. עברית RTL כברירת מחדל; אנגלית LTR נתמכת באותו שלד.
3. קלט: נושא חופשי, או מסמך/הערות גולמיות שמהם הסוכן מחלץ סיפור
   (מצב נוכחי=אדום, בעיות=אדום, פתרון=ירוק/כחול, סיכונים=כתום, AI=סגול).
4. תרשימים: donut / bar / bar-h / stacked-bar / line / scatter / gantt / waterfall דרך `data-chart` + `data-chart-config` בלבד.
5. שער אישור: outline שקף-אחר-שקף לפני בנייה; אין commit בלי אישור מפורש.
6. בקרת איכות אוטומטית: validator סטטי + render-check ויזואלי (Playwright).
7. מסירה: commit ל-`decks/` + קישור צפייה (htmlpreview) + קישור raw.

### מחוץ ל-MVP (שלב 2+)
- מסלול open-slide (React 1920×1080) — נשאר מתועד בהוראות v2, לא ממומש.
- קלט נתונים מובנה (CSV/Excel → הזרקה ל-`data-chart-config`).
- ייצוא PPTX/PDF אוטומטי (PDF ידני דרך הדפסת דפדפן כבר עובד).
- עריכה חיה/אינספקטור, ממשק משתמש גרפי, ריבוי ערכות נושא.

---

## 4. ארכיטקטורה

```
משתמש (צ'אט)
   │ נושא / מסמך / נתונים
   ▼
סוכן Claude  ── SKILL: presentation-agent (איחוד הוראות v2 + מתכונים)
   │
   ├─ קריאת נכסים:  starter/deck-starter.he.html · templates/ · slide-recipes
   ├─ כלי 1: scripts/validate-deck.mjs   (בדיקות סטטיות, exit code)
   ├─ כלי 2: scripts/render-check.mjs    (Playwright: צילום כל .slide + זיהוי גלישה)
   └─ כלי 3: git commit+push ל-decks/    (רק אחרי אישור)
   ▼
decks/<name>.he.html  →  קישור צפייה למשתמש
```

צינור העבודה (pipeline) בכל משימה:

```
UNDERSTAND → OUTLINE (אישור משתמש) → BUILD → VALIDATE → RENDER-CHECK → FIX-LOOP → COMMIT → DELIVER
```

---

## 5. חבילות עבודה (Work Packages)

### WP1 — אריזת נכסים לסוכן (בסיס)
- **W1.1** שדרוג `copilot-agent/starter/deck-starter.he.html`: לוודא שהוא
  standalone מלא (CSS/JS/פונטים/סְפרייט אייקונים מוטמעים inline או מ-CDN קבוע),
  כולל placeholder לשקף שער + legend של שש הדיו.
- **W1.2** המרת `slide-recipes.txt` ל-`copilot-agent/knowledge/recipes/` —
  קובץ Markdown לכל תפקיד-שקף: Cover · Agenda · Section divider · Content ·
  KPI row · בעיה↔פתרון · Flow/Roadmap · טבלה · תרשים · סיכונים · Next steps.
  כל מתכון: מתי משתמשים, בלוק HTML להעתקה, דיו מותרות, תקציב תוכן.
- **W1.3** מדריך אנטי-דפוסים קצר (`copilot-agent/knowledge/anti-patterns.md`):
  דוגמת "חלש מול טוב" לכל טעות נפוצה (עומס, אימוג'י, גרדיאנט, מיפוי דיו שגוי,
  מספר לא עטוף `<bdi>`, שקף בלי שאלה אחת ברורה).

### WP2 — Validator סטטי (`scripts/validate-deck.mjs`)
סקריפט Node ללא תלויות כבדות (parse עם regex/DOM קל), רץ על קובץ deck ומחזיר
רשימת הפרות + exit code. חוקים (ממומש מסעיף 6 בהוראות v2):

| # | חוק | חומרה |
|---|---|---|
| V1 | `dir="rtl"` + `lang="he"` על `<html>` ועל כל `.slide` (בגרסה עברית) | שגיאה |
| V2 | כל `data-ink` מתוך `black\|blue\|red\|green\|orange\|purple` בלבד | שגיאה |
| V3 | אפס אימוג'י בכל המסמך | שגיאה |
| V4 | אפס `gradient(` ב-CSS מוטמע | שגיאה |
| V5 | אין `<img>` חיצוני / `<script src>` / `<link>` שלא ברשימת ה-CDN של ה-starter | שגיאה |
| V6 | קווי יד רק דרך `data-sketch` מהרשימה; תרשימים רק `data-chart="donut\|bar\|bar-h\|stacked-bar\|line\|scatter\|gantt\|waterfall"` + `data-chart-config` JSON תקין | שגיאה |
| V7 | מספרים ומונחים לטיניים בתוך טקסט עברי עטופים `<bdi>` (היוריסטיקה: רצף `[A-Za-z0-9]` בתוך אלמנט עברי ללא אב `<bdi>`) | אזהרה |
| V8 | legend של הדיו קיים בשקף הראשון כשיש 3+ שקפים | אזהרה |
| V9 | תקציב תוכן: רשימות 3–6 פריטים, ≤ ~8 בלוקים לשקף | אזהרה |
| V10 | אייקונים רק `<use href="#icon-*">` שמצביע על `<symbol>` באותו מסמך | שגיאה |

### WP3 — Render-Check ויזואלי (`scripts/render-check.mjs`)
- פותח את קובץ ה-HTML ב-Chromium headless (Playwright), viewport ‎1920×1080.
- לכל `<section class="slide">`: צילום PNG ל-`/tmp` + בדיקות DOM:
  - גלישה: `scrollWidth/scrollHeight` של השקף גדולים מ-1920/1080.
  - חפיפת אלמנטים בולטים (bounding boxes של `.sketch-card`).
  - שגיאות console / משאבים שנכשלו בטעינה.
- פלט: JSON תמציתי + נתיבי צילומים. הסוכן מסתכל על הצילומים (vision)
  ומתקן: גלישת עברית, צפיפות, היררכיה חלשה — עד 2 סבבי תיקון.

### WP4 — הסוכן עצמו (SKILL + פרומפט)
- **W4.1** יצירת `.claude/skills/presentation-agent/SKILL.md` שמאחד את
  `decks/presentation-agent-instructions.md` (סגנון A בלבד) עם הפניות לנכסים
  ולשני הסקריפטים. עקרונות מחייבים בפרומפט:
  1. לעולם לא כותבים HTML מאפס — תמיד מה-starter.
  2. שש דיו לפי משמעות, זהות בכל השקפים; אסור להמציא צבעים.
  3. שקף אחד = שאלה אחת; רשימות 3–6; טון ניהולי תמציתי, בלי סימני קריאה.
  4. אין commit לפני אישור outline מפורש; אין עריכה מחוץ ל-`decks/`.
  5. חובה להריץ validator + render-check לפני commit; מתקנים עד ירוק.
- **W4.2** תרחישי דוגמה (few-shot) בתוך הסקיל: נושא בלבד → outline;
  מסמך גולמי → חילוץ סיפור; בקשת עדכון deck קיים.

### WP5 — מסירה
- Commit: `deck: <name> (presentation agent)` לענף העבודה שסוכם.
- תשובה למשתמש: קישור `htmlpreview.github.io` + קישור raw + משפט אחד על
  מה נבנה + רשימת אזהרות validator שנשארו (אם יש).

### WP6 — QA וקבלה
- **3 מצגות זהב (golden decks)** כמבחני קבלה:
  1. נושא בלבד ("פיילוט AI לשירות לקוחות", 6 שקפים) — בודק יצירתיות מובנית.
  2. מסמך גולמי (סיכום פגישה) → חילוץ סיפור לפי צבעי דיו.
  3. עדכון מצגת קיימת מ-`decks/` — בודק שמירת סגנון ועקביות דיו.
- הרצת ה-validator על כל 17 התבניות הקיימות לכיול רמת false-positives.
- צ'קליסט קבלה ידני: הדפסה (עמוד לשקף), מצב כהה/בהיר, פתיחה כ-`file://`.

---

## 6. זרימת הסוכן — צעד אחר צעד

1. **UNDERSTAND** — שואל רק מה שחסר: נושא, קהל, מספר שקפים, KPI/נתונים,
   שם קובץ, רמת אנימציה (static/subtle/rich). ממסמך — מחלץ סיפור בעצמו.
2. **OUTLINE** — מציג רשימת שקפים: תפקיד + כותרת + תוכן מתוכנן + דיו עיקרית
   לכל שקף. ממתין לאישור; מתקן ומציג שוב עד אישור.
3. **BUILD** — טוען את ה-starter, משכפל `<section class="slide style-sketchbook">`
   לכל שקף, ממלא מתוך המתכונים (WP1), בוחר אייקונים מהסְפרייט, בונה
   `data-chart-config` לנתונים.
4. **VALIDATE** — מריץ `validate-deck.mjs`; מתקן כל שגיאה, שוקל אזהרות.
5. **RENDER-CHECK** — מריץ `render-check.mjs`, בוחן צילומים, מתקן גלישות
   ועומס (עד 2 סבבים; אם לא מתכנס — מדווח למשתמש עם הצילום הבעייתי).
6. **COMMIT + DELIVER** — שומר ל-`decks/`, מחזיר קישורים וסיכום.

---

## 7. אבני דרך ולו"ז מוערך

| שלב | תכולה | מאמץ |
|---|---|---|
| **M1 — נכסים** | WP1 (starter מוקשח, מתכונים, אנטי-דפוסים) | 1–2 ימים |
| **M2 — כלים** | WP2 validator + WP3 render-check, כיול על 17 התבניות | 2–3 ימים |
| **M3 — סוכן** | WP4 SKILL + חיבור הכלים ל-pipeline | 1–2 ימים |
| **M4 — קבלה** | WP6: שלוש מצגות זהב, תיקוני כיול, תיעוד הפעלה קצר | 1–2 ימים |

סה"כ: **כשבוע–שבוע וחצי** עבודת פיתוח נטו ל-MVP שלם.

---

## 8. קריטריוני הצלחה (Definition of Done)

1. מ"נושא בלבד" למצגת 6 שקפים תקנית ב-**סבב שיחה אחד** אחרי אישור ה-outline.
2. `validate-deck.mjs` עובר נקי (אפס שגיאות) על כל תוצר לפני commit,
   ורץ נקי גם על התבניות הקיימות (או עם רשימת חריגים מתועדת).
3. `render-check.mjs` לא מזהה גלישה/חפיפה באף שקף בתוצר הסופי.
4. התוצר נפתח כ-`file://` ללא רשת (למעט פונטים מ-CDN המאושר) ונדפס עמוד-לשקף.
5. בדיקה עיוורת: אדם שמכיר את המערכת לא מבחין בין deck של הסוכן לתבנית ידנית.
6. הסוכן מסרב בעדינות לחריגות סגנון ("תוסיף אימוג'י", "תעשה גרדיאנט") ומציע
   חלופה תקנית במקום.

---

## 9. סיכונים ומענים

| סיכון | מענה |
|---|---|
| חוק ה-`<bdi>` (V7) מייצר false-positives | חומרת "אזהרה" בלבד + כיול על התבניות הקיימות לפני אכיפה |
| ה-render-check איטי או שביר ב-CI | Chromium מותקן מראש בסביבה; timeout לשקף; fallback לבדיקות DOM בלי צילום |
| גלישת עברית בפונט היד (Playpen Sans רחב מ-Inter) | תקציב תווים לכותרות במתכונים + בדיקת overflow ממוקדת ב-render-check |
| הסוכן "מתקן" את עצמו לסגנון גנרי (SaaS) | אנטי-דפוסים מפורשים בסקיל + מצגות זהב כעוגן השוואה |
| קובץ HTML גדול (פונטים/סְפרייט מוטמעים) | פונטים נשארים ב-CDN המאושר; מוטמע רק סְפרייט האייקונים שבשימוש |

---

## 10. הרחבות אחרי ה-MVP (Backlog)

1. מסלול B — open-slide (React) לפי סעיף 3 בהוראות v2.
2. ייבוא נתונים מובנה: CSV/Excel/JSON → `data-chart-config` אוטומטי.
3. ייצוא PDF אוטומטי (Playwright print-to-PDF) ו-PPTX.
4. חשיפת סוגי התרשימים המורחבים (bar-h RTL, stacked-bar, gantt, waterfall, scatter —
   כבר ממומשים ב-charts.js) בכל המתכונים והתבניות.
5. GitHub Action שמריץ את ה-validator על כל PR שנוגע ב-`decks/`.

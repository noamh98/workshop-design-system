# Workshop Design System — מדריך הסוכן הקנוני

> **מקור-אמת יחיד** להוראות הסוכן. בכל סתירה בין קבצי הוראות — **הקובץ הזה גובר.**
> Single source of truth for agent instructions. On any conflict, THIS file wins.
>
> נוצר כחלק מ"גל 2 — איחוד תיעוד" של תוכנית השיפור (ראו `docs/design-system-review.md`).

---

## 1. מפת מקורות ההוראות (מניעת drift)

במאגר קיימים כמה קבצי הוראות חופפים. כדי למנוע סחיפה (drift), זהו האינדקס הקנוני:

| קובץ | תפקיד | סטטוס |
|------|-------|-------|
| **`docs/AGENT.md`** (קובץ זה) | הוראות סוכן קנוניות + חוקים קשיחים + ממשל | ✅ **קנוני** |
| `decks/presentation-agent-instructions.md` | פירוט תהליכי מלא (שני סגנונות, render-check, validators) | 🔎 עזר מפורט |
| `project/CLAUDE.md` | backlog משימות (אייקונים/גרפים/strokes) | 🗂️ backlog בלבד |
| `project/SKILL.md`, `copilot-agent/INSTRUCTIONS.md` | וריאנטים ישנים | ♻️ למזג לתוך קובץ זה בהמשך |
| `README.md`, `project/readme.md`, `project/docs/README.md` | תיעוד עיצוב/handoff | 📖 תיעוד, לא הוראות סוכן |

**כלל:** שינוי בחוקי העיצוב מתועד **כאן קודם**, ורק אז מתגלגל לשאר.

---

## 2. חוקי עיצוב קשיחים (נאכפים ב-CI)

נאכפים אוטומטית ע"י `scripts/check-design-system.mjs` (ראו §4):

1. **שש דיו סמנטיות** דרך `data-ink` — זהות בכל השקפים, לעולם לא ממופות מחדש:
   - `black` → כותרות/מבנה/ניטרלי
   - `blue` → רעיונות/עתיד/"הצעד הבא"
   - `red` → בעיות/כאב במצב הנוכחי/חסמים
   - `green` → פתרונות/מאומת/הושלם
   - `orange` → סיכונים/דגשים/בתהליך
   - `purple` → AI/אוטומציה/אינטליגנציה
2. `dir="rtl"` על `<html>` ועל **כל** `.slide`; `lang="he"` על `<html>`.
3. כל מספר/מונח לועזי עטוף ב-`<bdi>` (או `<bdi class="tabular">`).
4. **בלי אימוג'י. בלי CSS gradients.** אייקונים רק כ-SVG inline (`<symbol>` + `<use>`).
5. קווי-יד רק דרך `data-sketch` (`box|circle|underline|highlight|arrow-h|arrow-v|cross`).
6. גרפים רק דרך `data-chart` (`donut|bar|line`) עם `data-chart-config` בצבעי `var(--ink-*)`.
7. בלי ספריות/פונטים/טרקרים חיצוניים שלא אושרו; שמור על כתובות ה-CDN מהשלד כמות שהן.
8. `<section class="slide">` אחד = שקף אחד = עמוד מודפס אחד; legend של הדיו בשקף ראשון כשיש 3+ שקפים.

---

## 3. זרימת עבודה וממשל (עודכן)

> **שינוי מדיניות מול ההוראות הישנות:** בעבר ההנחיה הייתה `create_or_update_file` **ישירות ל-`main`**.
> **מעתה: decks ושינויים נכנסים דרך ענף feature ו-PR — לא commit ישיר ל-`main`.**

1. התחל מהשלד `copilot-agent/starter/deck-starter.he.html`. לעולם אל תכתוב דף HTML מאפס.
2. עבוד בענף: `deck/<kebab-name>` (או `chore/…`, `docs/…`).
3. אל תשמור/תבצע commit לפני אישור מפורש של ה-outline מהמשתמש.
4. הרץ `npm run check` (או `npm run check:warn`) לפני פתיחת PR.
5. פתח PR ל-`main`, מלא את תבנית ה-PR, קבל review (CODEOWNERS).
6. Workshop: אל תערוך מחוץ ל-`decks/`. open-slide: אל תערוך מחוץ ל-`slides/<id>/`.
7. ענה למשתמש בשפה שבה כתב (ברירת מחדל: עברית).

---

## 4. Validators אוטומטיים

```bash
npm run check         # strict — נכשל (exit 1) על כל הפרה
npm run check:warn    # warn  — מדפיס הפרות אך יוצא 0 (rollout מדורג)
npm run check:all     # סורק גם decks/ וגם project/
```

הסקריפט `scripts/check-design-system.mjs` הוא **ללא תלויות** (Node טהור) ונאכף ב-`.github/workflows/ci.yml`.
כרגע ה-CI רץ ב-**warn mode** עד שכל ה-decks הקיימים ייבדקו; לאחר מכן יש להעביר את ה-workflow ל-`npm run check` (strict) כדי לחסום merge על הפרות.

---

## 5. סקריפטים לתחזוקה ואריזה (dependency-free)

כל הסקריפטים הם Node טהור, ללא `npm install`, וניתנים להרצה דרך `package.json`:

| סקריפט | פקודה | גל | תפקיד |
|--------|-------|----|-------|
| `check-design-system.mjs` | `npm run check` / `check:warn` / `check:all` | 3 | אכיפת חוקי §2 (דיו/RTL/bdi/אייקונים). |
| `check-links.mjs` | `npm run check:links` | 3/5 | איתור הפניות `href/src/url()` מקומיות שבורות (warn). |
| `build-styles.mjs` | `npm run build` | 4 | bundler שמרחיב את גרף ה-`@import` של `project/styles.css` ל-`dist/styles.bundle.css` (external מורם לראש). |
| `make-offline.mjs` | `npm run offline -- <file...>` | 6 | מנטרל תגי CDN (Google Fonts/jsdelivr/…) לסביבה מנותקת-רשת; `--apply` לכתיבה במקום. אידמפוטנטי. |
| `normalize-filenames.mjs` | `npm run normalize` / `normalize:apply` | 0/1 | `git mv` דאטה-מונחה (`scripts/filename-map.json`) לשמות kebab-case לטיניים. dry-run כברירת מחדל. הרץ מ-root של clone. |

> `normalize-filenames.mjs` ו-`build-styles.mjs`/`make-offline.mjs` נועדו להרצה בתוך clone מקומי (לא דרך ה-API), שכן הם נוגעים בקבצים כבדים / מייצרים תוצרים. הרץ בענף feature ופתח PR.

---

_קובץ זה מאחד את ההוראות בהתאם לגל 2 בתוכנית השיפור. השלבים שנדחו (הוצאת ~26MB מ-main, self-host לפונטים בסגנון הדיפולטי, הרחבת ליבת הרינדור) מתועדים ב-`docs/design-system-review.md`._

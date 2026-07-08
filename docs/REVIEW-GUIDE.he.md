# מדריך בדיקה ואימות ויזואלי

איך להריץ את הענף הזה (`claude/workshop-design-system-review-wokpr5`) ולוודא
שהכול נראה תקין. העבודה בענף מומשה ואומתה **סטטית** (חישובי ניגודיות WCAG,
`node --check`, בדיקת cascade וקוד) אבל **לא עברה rendering בדפדפן** — בסביבת
הפיתוח לא היה דפדפן זמין. המדריך הזה הוא ה-checklist לסגירת הפער הוויזואלי.

שום דבר כאן לא דורש build step או תלויות. כל המערכת רצה מקבצים רגילים.

> גרסה אנגלית מקבילה: [`REVIEW-GUIDE.md`](REVIEW-GUIDE.md).

---

## 0. הורדת הענף

```bash
git fetch origin
git checkout claude/workshop-design-system-review-wokpr5
```

---

## 1. המבט המהיר — פשוט פותחים קובץ

דאבל-קליק על כל קובץ `.html`, או גרירה לחלון הדפדפן. הכול עובד מעל `file://`
(האייקונים מוטמעים inline בכל עמוד בדיוק בשביל זה).

- **מתחילים מ-[`index.html`](../index.html)** בשורש הריפו — ה-showcase החי עם
  כל component וכרטיס לכל template.
- אחר כך פותחים templates בודדים מתוך [`templates/`](../templates/).

## 2. מומלץ — server מקומי קטן

`file://` חוסם לפעמים טעינת Google Fonts (תקבלו fallback לפונטי מערכת, זה תקין
אבל לא המראה המיועד). server סטטי פותר:

```bash
# מתוך שורש הריפו
python3 -m http.server 8000
#   או:  npx serve .
```

פותחים <http://localhost:8000/index.html>. אם הפונטים עדיין נופלים ל-fallback
(offline / proxy) — זה צפוי; שפטו לפי ה-layout, לא לפי ה-rendering של הגליפים.

## 3. החלפת theme, שפה וכיוון

בכל עמוד עם ה-toolbar יש כפתורים מחווטים דרך `data-theme-toggle` ו-
`data-lang-toggle` (ראו `js/theme.js`). לחיצה מחליפה:

- **Theme:** בהיר ⇄ כהה (`data-theme` על `<html>`, נשמר ל-`localStorage`)
- **שפה/כיוון:** English/LTR ⇄ עברית/RTL (`lang` + `dir`)

קבצי ה-`.he.html` כבר מקובעים ל-`lang="he" dir="rtl"`, כך שהם נפתחים מימין
לשמאל בלי שום לחיצה.

---

## 4. מה לבדוק, template אחרי template

פותחים כל אחד ובוחנים מול ההערות. ✅ = אמור להיראות תקין; 🔍 = הדבר הספציפי
שצריך לבדוק בקפדנות (שם באגים מתחבאים).

### 4.1 ה-templates החדשים (scope item 2)

| קובץ | 🔍 מה לבדוק |
|---|---|
| `templates/customer-journey.html` | עקומת הרגש נטענת (path כחול + fill רך); שורת ה-pain באדום, opportunities בכחול; ה-stages מיושרים תחת העקומה; margin-note אחד ל-"moment of truth" |
| `templates/value-stream.html` | צעדי process ירוקים מתחלפים עם בלוקי wait כתומים; strip סיכום lead-time; margin-note אדום על ה-wait הגרוע; אין חיתוך בין צעדים |
| `templates/swimlanes.html` | 3–4 lanes עם labels; פריטים עם `data-ink` מגוון (לא הכול שחור); חצי sketch בין פריטים **נראים** |
| `templates/priority-matrix.html` | 2×2 impact/effort; רבעים ירוק/כחול/כתום/שחור; העדיפות העליונה מעוגלת ביד; labels לצירים |

### 4.2 סגנון ה-sketchbook מול הרפרנס (הבדיקה הגדולה)

פותחים **זה לצד זה**:
- `templates/sketch-dashboard.html`
- `docs/reference/sketch-dashboard-reference.png`

🔍 הם צריכים **להתאים**, לא רק "בהשראת". השוו:
- כל השקופית ב-**hand-print** נקי (כותרות, body, ערכי KPI) — לא cursive, לא
  ילדותי. זו החריגה המכוונת היחידה מהכלל "כתב יד לא ל-body copy" (ראו README).
- Layout: כותרת דו-שורתית + subtitle כחול עם underline (למעלה-שמאל); שני chart
  cards עם sketch border + AI chip (למעלה-ימין); קופסה אדומה **CURRENT
  SITUATION** ← חמישה אייקוני process מעוגלים ביד ומחוברים בחצים freehand ←
  checklist כחול **FUTURE SOLUTION** (רצועה אמצעית); ארבעה KPI cards
  אדום/כחול/ירוק/כתום (תחתית); doodles עדינים בפינות.
- **סטייה מכוונת ידועה:** ה-donut בסיכון ברפרנס משתמש בצהוב; צהוב מחוץ לפלטת
  ששת הדיו, לכן מופה High=אדום / Medium=כתום / Low=ירוק. ודאו שזה מה שאתם רואים.

### 4.3 עברית / מעורב he-en (scope item 3)

פותחים `sketch-dashboard.he.html`, `executive-summary.he.html`,
`meeting-actions.he.html`, `priority-matrix.he.html`.

🔍 תקינות bidi — כאן באגי RTL מתגלים:
- מיושר לימין; layout ממוראה (כותרת למעלה-ימין, חצים מצביעים ימין-לשמאל).
- אנגלית/מספרים מוטמעים נשארים **LTR בתוך העברית** — למשל צריך לראות
  `דיווח ב-Real-time` ו-`עלייה של 28%` נקי, **ולא** `28% של עלייה` מבולגן או
  `Excel files ב-בעיה` שבור.
- טקסט עברי **לא** מרונדר ב-cursive לטיני (Caveat) — הוא משתמש ב-fallback
  העברי (hand/italic).
- קו השוליים של המחברת מתהפך לימין; נייר הדבקה (tape) ממוראה.

### 4.4 ה-templates הקיימים (בדיקת רגרסיה)

פותחים `title-slide`, `executive-summary`, `meeting-actions`, `swot-risk`,
`workshop-canvas`, `process-flow-roadmap`, `ai-architecture`.

🔍 במיוחד ה-timeline ב-`process-flow-roadmap.html`: תנו ל-milestones ערכי
`data-ink` שונים (או פשוט ודאו את המשלוחים הקיימים) — כל dot/date צריך לשמור
על **הצבע שלו**, לא לקפוץ כולם לכחול. זה היה באג ה-cascade המרכזי שתוקן בענף
(`css/components/flow.css:57`).

---

## 5. Theme כהה + נגישות (scope item 6)

עוברים ל-theme כהה ופותחים מחדש לפחות עמוד אחד שמשתמש בכל משטח נייר.
🔍 תיקוני הניגודיות לאימות:

- **Corkboard** (`.paper-corkboard`) ו-**kraft** (`.paper-kraft`): הטקסט נשאר
  קריא ב-**שני** ה-themes. Corkboard בעבר ירש דיו בהיר על משטח ה-tan שלו במצב
  כהה (2.81:1, נכשל) — עכשיו מקובע.
- **Blueprint** (`.paper-blueprint`): טקסט בהיר על navy עמוק בשני ה-themes
  (לא כמעט-בלתי-נראה במצב כהה).
- דיו צבעוני ישירות על kraft/corkboard הוא שילוב **דקורטיבי מתועד** (תוכן אמיתי
  רוכב על פתקים עם מילוי משלהם), אז אל תסמנו את אלה ככשלים.

בדיקות a11y נוספות:
- **טבעת focus:** Tab דרך כפתורי ה-toolbar — טבעת focus נראית בשני ה-themes
  (`:focus-visible`, `css/base.css`).
- **Reduced motion:** הפעילו "reduce motion" ב-OS, רעננו — התוכן חייב להופיע
  **גלוי לחלוטין** (שום דבר לא תקוע שקוף), רק בלי אנימציית הכניסה.

---

## 6. Print / PDF (scope item 4)

בכל template וב-`index.html`: **Ctrl/Cmd + P → Save as PDF**.

🔍 מצופה:
- שקופית `.slide` אחת לעמוד בפרופורציית 1920×1080.
- Toolbars / nav / אנימציות מוסרים.
- **צבעי הדיו נשמרים** (הם נושאי משמעות — `print-color-adjust: exact`).
- שום דבר לא תקוע ב-opacity 0; משיכות sketch נוכחות.
- אין כרטיס שנחתך על פני מעבר עמוד.

חלופה headless (אם יש Chrome/Chromium):

```bash
chrome --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=out.pdf \
  "file://$PWD/templates/sketch-dashboard.html"
```

---

## 7. Kiosk / scaling למקרן (scope item 5)

פותחים `templates/kiosk-scaled.html` ו**משנים גודל חלון**.

🔍 השקופית צריכה לגדול **פרופורציונלית** (letterbox-fit), לעולם לא להיחתך. זה
ה-`js/scale.js` בהצטרפות (`data-scale-to-fit`). כל עמוד אחר הוא **fluid**
במכוון וצריך פשוט לזרום מחדש — זה by design, לא באג.

---

## 8. בדיקת Console

פותחים DevTools (F12) → Console בכמה עמודים, כולל אחד `.he.html`.
🔍 מצופה **אפס שגיאות**. (בקשת Google-Fonts חסומה מעל `file://` היא warning,
לא שגיאת קוד — התעלמו.)

---

## 9. לרשומות — צילומי מסך headless

אם יש Chrome/Chromium ורוצים את ראיית ה-screenshot שה-plan המקורי דרש:

```bash
SHOT() { # usage: SHOT file.html out.png
  chrome --headless=new --disable-gpu --hide-scrollbars \
    --force-prefers-reduced-motion --virtual-time-budget=4000 \
    --window-size=1920,1250 --screenshot="$2" "file://$PWD/$1"
}

SHOT templates/sketch-dashboard.html    sketch-dashboard.png
SHOT templates/sketch-dashboard.he.html sketch-dashboard-he.png
SHOT templates/customer-journey.html    customer-journey.png
SHOT templates/value-stream.html        value-stream.png
SHOT templates/swimlanes.html           swimlanes.png
SHOT templates/priority-matrix.html     priority-matrix.png
```

ל-**theme כהה** headless, מעתיקים את הקובץ ומזריקים `data-theme="dark"` על
`<html>` תחילה (localStorage לא פרקטי headless):

```bash
sed 's/<html /<html data-theme="dark" /' templates/sketch-dashboard.html \
  > /tmp/dark.html
```

אחר כך מניחים את `sketch-dashboard.png` ליד
`docs/reference/sketch-dashboard-reference.png` ומשווים אחד-לאחד (§4.2).
שמרו screenshots מחוץ לריפו — הם לא artifacts שמתחייבים.

---

## 10. סיכום pass/fail מהיר למילוי

- [ ] כל ה-templates נפתחים מעל `file://` עם **אפס שגיאות console**
- [ ] milestones ב-timeline שומרים על צבעי `data-ink` נפרדים (תיקון cascade)
- [ ] ה-templates החדשים (journey / value-stream / swimlanes / priority-matrix) נראים תקין, בהיר + כהה
- [ ] `sketch-dashboard.html` באמת **תואם** את תמונת הרפרנס
- [ ] וריאנטי `.he.html`: bidi נקי, ממוראה, עברית לא ב-cursive לטיני
- [ ] טקסט corkboard / blueprint קריא ב-theme **כהה**
- [ ] טבעת focus נראית; reduced-motion מציג תוכן (לא ריק)
- [ ] Print → PDF: שקופית אחת/עמוד, צבעי דיו נשמרים
- [ ] `kiosk-scaled.html` מתמרד פרופורציונלית ב-resize
- [ ] אין frameworks / servers / cross-file `<use>` / דיו שביעי חדשים

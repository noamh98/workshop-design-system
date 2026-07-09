# מדריך הקמה — סוכן "Workshop Deck Builder" ב-Copilot Studio

סוכן שמקבל נושא/חומר גלם, מעצב מצגת HTML בסגנון Workshop Design System
(סקיצה בכתב-יד, עברית RTL, שש דיות), ומעלה קובץ standalone ל-GitHub.

הריפו: `https://github.com/noamh98/workshop-design-system`
כל הקבצים שצריך נמצאים בתיקיית `copilot-agent/` בריפו (וב-ZIP הזה).

---

## 1. Model (מודל)

בחר **Claude Opus 4.8** (כבר בחרת — מצוין). זה המוח שמעצב את המצגת.
אם Opus לא זמין בסביבה מסוימת — Claude Sonnet הוא הגיבוי.

## 2. Instructions (הוראות)

הדבק את כל התוכן של `INSTRUCTIONS.md` (בלי הכותרת הראשונה).
שים לב:

- אחרי שתחבר את כלי ה-GitHub (שלב 4), ערוך את ההוראות והקלד `/` במקומות
  שבהם כתוב "use the GitHub tool" — ובחר את הכלי האמיתי מהתפריט
  (`get_file_contents`, `create_or_update_file`). קישור עם `/` משפר מאוד את
  הדיוק של ה-orchestrator.
- אל תוסיף להוראות שום דבר על "citations" — זה שובר את פורמט התשובות של
  Copilot Studio (מגבלה מתועדת של מיקרוסופט).

## 3. Knowledge (ידע)

העלה כקבצים (File upload):

| קובץ | תפקיד |
|---|---|
| `knowledge/workshop-design-guide.txt` | חוקי העיצוב — שש דיות, RTL, טיפוגרפיה, נגישות |
| `knowledge/slide-recipes.txt` | בלוקים מוכנים — כרטיסים, KPI, זרימות, גרפים, מקרא |

הערות:

- אם ההעלאה דוחה סיומת, שנה ל-`.docx` (התוכן טקסט פשוט).
- אפשר להוסיף גם את הריפו כ-Knowledge מסוג "Public website"
  (`https://github.com/noamh98/workshop-design-system`) — תוספת נחמדה אבל
  לא חובה; ה-RAG של אתרים ציבוריים פחות אמין מקבצים.
- **כבה** "Allow the AI to use its own general knowledge" אם אתה רוצה שהסוכן
  יתבסס רק על הידע שהעלית (מומלץ להשאיר דלוק — הוא צריך ידע כללי כדי להמציא
  תוכן למצגות).

## 4. Tools (כלים) — החלק הקריטי

הסוכן צריך לקרוא קבצים מהריפו ולכתוב אליו. שתי דרכים, לפי סדר עדיפות:

### אפשרות א' (מומלצת): GitHub MCP Server

Copilot Studio תומך בחיבור שרתי MCP ככלים.

1. Tools → **Add a tool** → **Model Context Protocol**.
2. חפש **GitHub** בקטלוג (יש GitHub MCP מובנה בקטלוג של מיקרוסופט).
   אם אין בקטלוג שלך — צור חיבור MCP מותאם עם ה-URL הרשמי:
   `https://api.githubcopilot.com/mcp/` (אימות OAuth או PAT עם הרשאות
   `repo` — Contents: Read and write).
3. אשר את החיבור (Connection) עם חשבון ה-GitHub שלך (`noamh98`).
4. ודא שהכלים האלה זמינים ומופעלים לסוכן:
   - `get_file_contents` — קריאת ה-starter וקבצי העיצוב
   - `create_or_update_file` — העלאת ה-HTML המוגמר
   - (אופציונלי) `create_branch`, `create_pull_request` — אם תרצה זרימת PR
5. בטל כלים מיותרים (issues, actions וכו') — פחות כלים = orchestration מדויק יותר.

### אפשרות ב' (גיבוי): Agent Flow + מחבר מותאם

אם MCP חסום בסביבה שלך: צור שני Agent Flows (Power Automate):

- **GetRepoFile**: קלט path → HTTP GET ל-
  `https://raw.githubusercontent.com/noamh98/workshop-design-system/main/{path}`
  → מחזיר טקסט. (ריפו ציבורי — לא צריך אימות.)
- **CommitDeckFile**: קלט filename + htmlContent → HTTP PUT ל-
  `https://api.github.com/repos/noamh98/workshop-design-system/contents/decks/{filename}`
  עם body: `{"message":"deck: ...","content": base64(htmlContent)}` וכותרת
  `Authorization: Bearer <PAT>`. את ה-PAT שמור ב-environment variable /
  connection — לא בטקסט ה-Flow.

תן לכל Flow תיאור ברור באנגלית — ה-orchestrator בוחר כלים לפי התיאור.

## 5. Topics (נושאים)

לא חובה לסוכן הזה — ה-generative orchestration מכסה הכל. אפשרות עתידית:
Topic ל"מחיקת מצגת" או "רשימת מצגות קיימות" אם תרצה שליטה דטרמיניסטית.

## 6. Skills / Agents / Triggers

- **Connected agents**: לא נדרש. אם בעתיד תרצה סוכן נפרד ל"איסוף דאטה"
  (חיפוש בארגון) שמזין את בונה המצגות — זה המקום.
- **Triggers**: לא נדרש (הסוכן תגובתי — עובד בשיחה).
- **Suggested prompts** (במסך ה-Overview): הוסף את הפרומפט לדוגמה שבסוף
  המדריך — עוזר למשתמשים חדשים.

## 7. הגדרות נוספות

- **Web search**: אפשר להשאיר כבוי; המצגות נבנות מהידע + מהחומר שהמשתמש נותן.
- **Authentication** (Settings → Security): השאר על אימות ארגוני; הסוכן כותב
  לריפו שלך — אל תפרסם אותו פתוח לכולם.
- **Publish**: אחרי בדיקה ב-Test pane — Publish, וחבר ל-Teams/M365 Copilot.

## 8. בדיקת קבלה (עשה את זה לפני שימוש אמיתי)

1. בקש: "צור מצגת של שקף אחד על פיילוט AI לשירות לקוחות".
2. ודא שהסוכן: שלף את ה-starter מהריפו → הציג מתווה → ביקש אישור.
3. אשר, וודא שנוצר קובץ ב-`decks/` בריפו.
4. פתח את הקובץ דרך הקישור — בדוק: כתב-יד נטען, גרפים מצוירים, עברית RTL
   תקינה, מספרים לא מתהפכים.

---

## פרומפט לדוגמה (לשלוח לסוכן)

```
אני צריך מצגת בסגנון סקיצה (Workshop) בעברית.

נושא: הטמעת מערכת AI לניהול פניות לקוחות ברשות מקומית.
קהל: הנהלה בכירה, ישיבת החלטה.
היקף: 4 שקפים.

חומר גלם:
- היום: 12,000 פניות בשנה, מטופלות ידנית באקסל ובמייל, זמן מענה ממוצע 9 ימים.
- בעיות: אין מעקב, פניות הולכות לאיבוד, אין דוחות להנהלה.
- הפתרון המוצע: פלטפורמה מרכזית עם סיווג AI אוטומטי, ניתוב חכם, ודשבורד בזמן אמת.
- יעד: זמן מענה מתחת ל-3 ימים תוך חצי שנה.
- סיכונים: התנגדות עובדים, איכות דאטה היסטורית, תקציב.

תציע לי מתווה שקף-שקף, תוסיף רעיונות משלך ל-KPI ולגרפים, ואחרי שאאשר —
העלה את הקובץ לגיטהאב בשם municipal-ai-briefing.
```

---

## איך זה עובד מקצה לקצה

```
משתמש נותן נושא/חומר
        │
Opus מנתח ובונה סיפור (אדום=בעיות, כחול/ירוק=פתרון, כתום=סיכונים, סגול=AI)
        │
get_file_contents ← copilot-agent/starter/deck-starter.he.html
        │
Opus ממלא תוכן בתוך ה-starter (שקף לכל section)
        │
מציג מתווה → המשתמש מאשר
        │
create_or_update_file → decks/<שם>.he.html בענף main
        │
קישור צפייה נשלח למשתמש (htmlpreview / raw)
```

ה-HTML הוא קובץ יחיד; העיצוב, הפונטים וה-JS נטענים מהריפו הציבורי דרך
jsDelivr CDN — לכן הקובץ עובד מכל מקום עם אינטרנט, בלי build ובלי תלות
בקבצים נוספים. (standalone מלא-אופליין עם פונטים מוטמעים אפשרי בעתיד עם
Flow שמרכיב את הקובץ — לא נדרש לשלב ראשון.)

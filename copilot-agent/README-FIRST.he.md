# ערכת הקמה — סוכן מצגות Workshop ב-Microsoft Copilot Studio

סוכן שמקבל נושא או חומר גלם ומחזיר מצגת מנהלים כקובץ HTML יחיד בסגנון
Workshop Design System: מחברת יועץ בכתב-יד, עברית RTL, שש דיו סמנטיות.
המוח: **Claude Opus 4.8** (נבחר במסך המודלים של Copilot Studio).

## מה בערכה

| קובץ / תיקייה | מה עושים איתו |
|---|---|
| `SETUP-GUIDE.he.md` | **התחל כאן** — מדריך הקמה צעד-צעד (מודל, הוראות, ידע, כלים, פרסום) |
| `INSTRUCTIONS.md` | מודבק כלשונו בשדה Instructions של הסוכן |
| `knowledge/workshop-design-guide.txt` | העלאה ל-Knowledge — חוקי העיצוב |
| `knowledge/slide-recipes.txt` | העלאה ל-Knowledge — בלוקים מוכנים לכל סוג שקף |
| `knowledge/anti-patterns.md` | העלאה ל-Knowledge — מה לא לעשות, "חלש מול טוב" |
| `starter/deck-starter.he.html` | השלד המחייב; הסוכן שולף אותו מהריפו דרך כלי GitHub |
| `tools/` | בקרת איכות מקומית: `validate-deck.mjs` (חוקי סגנון) + `render-check.mjs` (צילום ובדיקת כל שקף). דורש Node 20+ |
| `examples/municipal-ai-briefing.he.html` | מצגת דוגמה מוגמרת — פתח בדפדפן כדי לראות את היעד |
| `docs/` | תוכנית ה-MVP והוראות התפעול המלאות (v2) — רקע למי שמתחזק את הסוכן |

## מסלול מהיר (10 דקות)

1. Copilot Studio → New agent → Settings → Generative AI → Model:
   **Claude Opus 4.8**.
2. הדבק את `INSTRUCTIONS.md` בשדה Instructions.
3. העלה את שלושת קבצי `knowledge/` כ-File knowledge.
4. חבר כלי GitHub (MCP או Flows — סעיף 4 במדריך) עם הרשאת כתיבה
   ל-`decks/` בריפו `noamh98/workshop-design-system`.
5. בדוק בפרומפט הדוגמה שבסוף `SETUP-GUIDE.he.md` → Publish.

הריפו המלא: https://github.com/noamh98/workshop-design-system

# Workshop Deck Builder — איך מעלים אותו לקופיילוט 365 (מדריך מלא, שלב אחר שלב)

מדריך זה מניח שאתה לא מכיר את המושגים MCP / OAuth / Provision. כל שלב כתוב
בפירוט — מה בדיוק ללחוץ, איפה, ומה אמור לקרות.

## לפני שמתחילים — מה יש לך כבר, ומה עוד צריך

יש לך כבר (בנוי מראש בתיקייה הזאת):
- קובצי ההגדרה של הסוכן (השם, ההוראות, האייקונים).
- קובץ שמצביע על "איפה נמצא כלי ה-GitHub" (`.vscode/mcp.json`).

מה שעוד חסר, ורק אתה יכול להשלים (כי זה דורש את חשבון ה-GitHub וה-Microsoft
365 **שלך**, לא שלי):
- לחבר את הסוכן בפועל לחשבון ה-GitHub שלך, כדי שיוכל לקרוא ולכתוב קבצים
  ברפו שלך.
- להעלות (provision) את הסוכן לחשבון ה-Microsoft 365 שלך.

זה בערך 15–20 דקות, כולן בתוך VS Code + הדפדפן.

---

## שלב 0: לוודא שהתוסף מותקן

1. פתח VS Code.
2. בצד שמאל (ה-Activity Bar — הפס האנכי הצר עם האייקונים) חפש אייקון של
   **Microsoft 365 Agents Toolkit** (עיגול עם M קטנה או דומה). אם אתה לא
   רואה אותו — לחץ Ctrl+Shift+X (Extensions), חפש "Microsoft 365 Agents
   Toolkit", ווודא שהוא מותקן ומופעל.

## שלב 1: לפתוח את התיקייה של הסוכן

1. ב-VS Code: **File → Open Folder**.
2. נווט אל:
   `C:\PROJECTS\Workshop Design System-handoff\project\Agents\workshop-deck-builder`
3. פתח אותה. **חשוב**: תפתח בדיוק את התיקייה הזאת (לא את כל הריפו הגדול,
   ולא את `m365-insider`) — כדי שה-Toolkit יזהה אותה כפרויקט סוכן.

## שלב 2: להתחבר לחשבון Microsoft 365 שלך

1. לחץ על אייקון ה-**Agents Toolkit** בצד שמאל. ייפתח פאנל.
2. בפאנל תמצא קטע בשם **Accounts**.
3. לחץ **Sign in to Microsoft 365** (או "Sign in" ליד הסמל של Microsoft 365).
4. יפתח חלון דפדפן — התחבר עם חשבון ה-Microsoft 365/Copilot שלך (העבודה).
5. אחרי ההתחברות, בפאנל תראה ליד החשבון שלך שני תגים:
   - **Custom App Upload: Enabled**
   - **Copilot Access: Enabled**

   אם אחד מהם **לא** מופיע כ-Enabled — הסוכן לא יוכל לעלות. במקרה כזה
   צריך לפנות לאדמין IT של הארגון ולבקש להפעיל את שתי ההרשאות האלה
   (Custom App Upload + Copilot Extensibility) לחשבון שלך ב-Microsoft 365
   admin center. בלי זה, אין טעם להמשיך לשלבים הבאים.

## שלב 3: להפעיל את שרת ה-GitHub (MCP)

"MCP server" = פשוט "כלי חיצוני שהסוכן יכול להשתמש בו". במקרה שלנו — כלי
שיודע לקרוא ולכתוב קבצים ב-GitHub.

1. ב-VS Code, בעץ הקבצים (Explorer, בצד שמאל), פתח את התיקייה `.vscode`
   ואז את הקובץ `mcp.json`.
2. הקובץ יראה כך:
   ```json
   {
       "servers": {
           "github": { "url": "https://api.githubcopilot.com/mcp/" }
       }
   }
   ```
3. מעל השורה `"github": {` אמור להופיע קישור קטן (CodeLens) שכתוב עליו
   **Start**. לחץ עליו.
4. VS Code ינסה להתחבר לשרת. אם יופיע חלון שמבקש אימות/הרשאה — לחץ
   **Allow** / **Authorize**.
5. אם ההתחברות הצליחה — ליד "github" יופיע סטטוס ירוק/"Running".

## שלב 4: לבחור אילו פעולות GitHub הסוכן יקבל

1. עדיין בקובץ `mcp.json` (או בפאנל שנפתח לצידו), חפש כפתור/פקודה בשם
   **ATK: Fetch action from MCP** (ATK = Agents Toolkit).
2. לחץ עליו. הוא יבקש שם קובץ יעד — תבחר/כתוב `ai-plugin.json`
   (ייווצר בתיקיית `appPackage`).
3. ייפתח רשימת פעולות (functions) שהשרת של GitHub תומך בהן — עשרות. בחר
   **רק** את אלה (סמן ב-checkbox):
   - `get_file_contents` — הסוכן קורא איתו את קובץ ה-starter מהריפו.
   - `create_or_update_file` — הסוכן כותב איתו את המצגת החדשה לריפו.

   אל תסמן פעולות נוספות (issues, actions, pull_requests וכו') — פחות
   כלים = הסוכן פחות מתבלבל.
4. אשר/Confirm. ה-Toolkit ייצור `appPackage/ai-plugin.json` ויחבר אותו
   אוטומטית ל-`declarativeAgent.json`.

## שלב 5: לבחור איך הסוכן יתחבר ל-GitHub (סוג האימות)

1. יופיע מסך "Choose authentication type" (או דומה).
2. בחר **OAuth (with static registration)**.

   (למה לא "None"? כי GitHub לא נותן גישה לקבצים פרטיים/כתיבה בלי
   שמישהו — אתה — מאשר את זה מפורשות. "Static registration" = אתה
   רושם אפליקציה קטנה משלך ב-GitHub שמייצגת את הסוכן.)

## שלב 6: לרשום "GitHub OAuth App" — האפליקציה שמייצגת את הסוכן שלך מול GitHub

זה לא הסוכן עצמו — זו רק "כרטיס ביקור" קטן שאומר ל-GitHub "האפליקציה
הזאת מורשית לבקש הרשאות מהמשתמש שמאשר אותה".

1. פתח בדפדפן: https://github.com/settings/developers
2. לחץ על טאב **OAuth Apps** (לא GitHub Apps).
3. לחץ **New OAuth App**.
4. מלא:
   - **Application name**: כל שם, למשל `Workshop Deck Builder Agent`.
   - **Homepage URL**: `https://github.com/noamh98/workshop-design-system`
     (או כל URL תקין — לא קריטי).
   - **Authorization callback URL** (חשוב מאוד, חייב להיות מדויק):
     `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`
5. לחץ **Register application**.
6. בעמוד שנפתח תראה **Client ID** — העתק ושמור אותו זמנית (Notepad).
7. לחץ **Generate a new client secret** → אשר סיסמה/2FA אם מתבקש → יופיע
   **Client Secret** (מחרוזת ארוכה). העתק ושמור אותו **עכשיו** — GitHub
   מציג אותו פעם אחת בלבד, אחר כך הוא מוסתר לצמיתות (תצטרך ליצור חדש אם
   תאבד אותו).

   ⚠️ אל תשלח לי את ה-Client Secret ואל תדביק אותו בצ'אט של Claude —
   הוא שווה ערך לסיסמה. משתמשים בו רק בשלב 8 למטה, ישירות בתוך VS Code.

## שלב 7: לחזור ל-VS Code ולסיים את הגדרת ה-MCP

אם ה-Toolkit עדיין מציג את מסך רישום ה-OAuth (משלב 5) — יכול לבקש שוב את
ה-Client ID/Secret כאן. אם לא, זה יקרה בשלב 8 (Provision).

## שלב 8: Provision — "הרמת" הסוכן לחשבון ה-Microsoft 365 שלך

זה השלב שבו הסוכן בפועל *נוצר* בענן שלך (עדיין לא זמין לכולם — רק לך,
כי ה-scope הוא "personal").

1. בפאנל ה-Agents Toolkit, מצא קטע **Lifecycle**.
2. לחץ **Provision**.
3. יופיעו כמה שאלות בשורת החיפוש העליונה של VS Code (Command Palette
   style), אחת אחרי השנייה:
   - **"Enter client id for OAuth registration..."** → הדבק את ה-Client
     ID משלב 6.
   - **"Enter client secret for OAuth registration..."** → הדבק את
     ה-Client Secret משלב 6.
   - **scopes** → השאר ריק, פשוט לחץ Enter.
4. תופיע הודעת אישור סופית (מסבירה מה הולך לקרות) → לחץ **Confirm**.
5. חכה (יכול לקחת דקה-שתיים) עד שתראה הודעה שה-provision הצליח.

## שלב 9: לבדוק שזה עובד

1. פתח בדפדפן: https://m365.cloud.microsoft/chat
2. בסיידבר השמאלי חפש קטע **Agents**.
3. אמור להופיע סוכן בשם **Workshop Deck Builder (dev)** — לחץ עליו.
4. שלח לו את ההודעה הזאת:

   > אני צריך מצגת בסגנון סקיצה (Workshop) בעברית על פיילוט AI לשירות
   > לקוחות ברשות מקומית, 4 שקפים.

5. בפעם הראשונה שהוא ינסה לגשת ל-GitHub, יופיע חלון קופץ **"Sign in to
   Workshop Deck Builder"** — התחבר עם חשבון ה-GitHub שלך ואשר הרשאות.
6. אם הכל תקין: הסוכן יציג מתווה שקפים ויבקש את אישורך לפני שהוא כותב
   את הקובץ ל-GitHub.

---

## אם משהו נתקע

- **אין כפתור Start ליד mcp.json** → ודא שגרסת ה-Agents Toolkit היא 6.3
  ומעלה (יש לך 6.10.2 — תקין).
- **Custom App Upload / Copilot Access לא Enabled** → זה נחסם ברמת
  הארגון, לא בקוד. פנה לאדמין IT.
- **שגיאת אימות ב-GitHub** → בדוק שה-Callback URL בשלב 6 מדויק אות-אות:
  `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`
- **איבדת את ה-Client Secret** → בחזרה ל-
  https://github.com/settings/developers → האפליקציה שיצרת →
  **Generate a new client secret** מחדש.

תקוע בשלב ספציפי? תגיד לי באיזה שלב ומה בדיוק קורה על המסך (טקסט
השגיאה, אם יש) — אני אדריך אותך משם.

---

## הערה טכנית: מה כבר בנוי כאן מראש

| קובץ | תוכן |
|---|---|
| `appPackage/manifest.json` | מניפסט Teams/M365, שם "Workshop Deck Builder" |
| `appPackage/declarativeAgent.json` | הגדרת הסוכן (v1.6), conversation starters |
| `appPackage/instruction.txt` | ההוראות המלאות (מבוסס על `copilot-agent/INSTRUCTIONS.md`) |
| `appPackage/color.png` / `outline.png` | אייקונים placeholder — אפשר להחליף בלוגו אמיתי מאוחר יותר דרך Developer Portal |
| `.vscode/mcp.json` | מצביע ל-GitHub MCP הרשמי |
| `m365agents.yml`, `env/.env.dev` | זרימת provision/publish של ה-Toolkit |

### שינויים עתידיים

אם תרצה שהסוכן ידע גם את `knowledge/slide-recipes.txt` ו-`anti-patterns.md`
(כמו בגרסת Copilot Studio ב-`copilot-agent/`) — אפשר למזג אותם לתוך
`instruction.txt`, או לחבר Knowledge מסוג SharePoint אם תעלה אותם לשם. כרגע
כל החוקים כבר מקופלים בתוך `instruction.txt`.

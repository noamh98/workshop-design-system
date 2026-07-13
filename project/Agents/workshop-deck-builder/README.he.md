# Workshop Deck Builder — סוכן דקלרטיבי ל-Microsoft 365 Copilot

תיקייה זו בנויה באותה תצורה כמו `project/Agents/m365-insider` (Agents Toolkit
declarative agent, schema v1.6): מחזיר מצגת HTML בסגנון Workshop Design
System ומעלה אותה ל-GitHub שלך (`noamh98/workshop-design-system`, תיקיית
`decks/`).

## מה כבר מוכן כאן

| קובץ | תוכן |
|---|---|
| `appPackage/manifest.json` | מניפסט Teams/M365, שם "Workshop Deck Builder" |
| `appPackage/declarativeAgent.json` | הגדרת הסוכן (v1.6), conversation starters |
| `appPackage/instruction.txt` | ההוראות המלאות (מבוסס על `copilot-agent/INSTRUCTIONS.md`) |
| `appPackage/color.png` / `outline.png` | אייקונים placeholder — החלף בלוגו אמיתי דרך Developer Portal אם תרצה |
| `.vscode/mcp.json` | מצביע ל-GitHub MCP הרשמי (`https://api.githubcopilot.com/mcp/`) |
| `m365agents.yml`, `env/.env.dev` | זרימת provision/publish של ה-Toolkit |

## מה נשאר לך לעשות (דורש VS Code + חשבון GitHub שלך — לא ניתן לאוטומציה)

חיבור ה-GitHub MCP דורש אשף אינטראקטיבי + רישום OAuth App בחשבונך, לכן זה
חלק שאתה מריץ בעצמך:

1. פתח את התיקייה הזאת ב-VS Code (עם תוסף **Microsoft 365 Agents Toolkit**
   v6.10.2 שכבר מותקן).
2. פתח `.vscode/mcp.json` → לחץ **Start** ליד שרת ה-`github`. אם מתבקש
   אימות — אשר (Allow).
3. באותו קובץ יופיע כפתור **ATK: Fetch action from MCP** → בחר
   `ai-plugin.json` (ה-Toolkit ייצור אותו).
4. בחר את הכלים שהסוכן יחשוף: לפחות `get_file_contents` (קריאת ה-starter)
   ו-`create_or_update_file` (כתיבת דקים חדשים). אופציונלי:
   `create_branch`, `create_pull_request` אם תרצה זרימת PR במקום commit
   ישיר ל-`main`.
5. כשתתבקש לבחור סוג אימות — **OAuth (with static registration)**.
6. הרשם GitHub OAuth App: https://github.com/settings/developers →
   **New OAuth App**. Authorization callback URL:
   `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`.
   שמור את ה-**Client ID** ואת ה-**Client Secret** (Generate a new client
   secret).
7. בפאנל ה-Agents Toolkit (Activity Bar) → **Accounts** → Sign in to
   Microsoft 365 → ודא ש-**Custom App Upload** ו-**Copilot Access** מופיעים
   כ-Enabled (אחרת פנה לאדמין הארגון).
8. **Lifecycle** → **Provision**. כשתתבקש: הזן את ה-Client ID, אחר כך את
   ה-Client Secret, ו-Enter לשדה ה-scopes (השאר ריק). אשר את ההודעה הסופית.
9. אחרי שה-provision מסתיים: היכנס ל-https://m365.cloud.microsoft/chat →
   Agents בסיידבר → **Workshop Deck Builder (dev)** → נסה את הפרומפט:

   > אני צריך מצגת בסגנון סקיצה (Workshop) בעברית על פיילוט AI לשירות
   > לקוחות ברשות מקומית, 4 שקפים.

   בפעם הראשונה תתבקש להתחבר ל-GitHub דרך חלון קופץ — אשר.

## שינויים עתידיים

- אם תרצה שהסוכן ידע גם את `knowledge/slide-recipes.txt` ו-`anti-patterns.md`
  (כמו בגרסת Copilot Studio ב-`copilot-agent/`) — ניתן לקצר ולמזג אותם
  לתוך `instruction.txt`, או לחבר Knowledge מסוג SharePoint site אם תעלה
  אותם לשם. כרגע כל החוקים כבר מקופלים בתוך `instruction.txt` כדי לשמור על
  התצורה קלה (ללא תלות בהעלאת קבצים לענן).

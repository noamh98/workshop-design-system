# Deck QA tools

כלי בקרת האיכות של סוכן המצגות (ראה `docs/presentation-agent-mvp.he.md`).

## validate-deck.mjs — בדיקות סטטיות

```bash
node scripts/validate-deck.mjs decks/my-deck.he.html [--json]
```

ללא תלויות. בודק את חוקי V1–V10: RTL על `<html>` וכל `.slide`, שש דיו
בלבד, בלי אימוג'י, בלי gradients בתוכן שקפים, משאבים חיצוניים רק מה-CDN
המאושר, `data-sketch`/`data-chart` מהרשימה, `<bdi>` סביב מספרים ולועזית
(אזהרה), מקרא דיו בשקף ראשון (אזהרה), תקציב תוכן (אזהרה), אייקונים עם
`<symbol>` תואם. exit code ‏1 כשיש שגיאות.

## render-check.mjs — בדיקה ויזואלית

```bash
cd scripts && npm install          # חד-פעמי (playwright-core)
node render-check.mjs ../decks/my-deck.he.html --out /tmp/rc [--json]
```

פותח את ה-deck ב-Chromium headless, מפעיל שקף-שקף (תומך גם במצגות
מסך-מלא שמציגות שקף אחד בכל רגע), מצלם כל שקף ומדווח: גלישת תוכן,
אלמנטים שנשפכים מהשקף, חפיפות כרטיסים, שגיאות console ומשאבים שנכשלו.
כתובות jsDelivr של הריפו מוגשות מהעותק המקומי (דטרמיניסטי, עובד offline);
כשל בטעינת פונטים של Google נחשב אזהרה בלבד.

מיקום Chromium: אוטומטי מ-`PLAYWRIGHT_BROWSERS_PATH` / `/opt/pw-browsers` /
chromium מערכתי, או ידני עם `CHROMIUM_PATH=/path/to/chrome`.

## build-copilot-kit.sh — ערכת Copilot Studio

```bash
bash scripts/build-copilot-kit.sh /path/to/output.zip
```

אורז את כל מה שצריך להקמת הסוכן ב-Microsoft Copilot Studio (הוראות,
מדריך הקמה, ידע, starter, כלי QA, דוגמה) לקובץ ZIP אחד.

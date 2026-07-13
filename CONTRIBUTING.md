# Contributing — Workshop Design System

מדריך קצר לתרומה. לפרטים המלאים על הסוכן והחוקים ראו **[`docs/AGENT.md`](docs/AGENT.md)** (מקור-אמת יחיד).

## עקרונות

1. **אל תיגע בליבה העיצובית שעובדת.** הטוקנים (`project/css/tokens.css`) ומערכת הדיו (`project/css/ink-system.css`) הם מקור-אמת יחיד — שינוי בהם דורש אישור CODEOWNERS.
2. **מקור מול תוצר.** `decks/` ו-`project/*.html` הם תוצרים כבדים ומיוצאים. עדיף להוסיף/לעדכן דרך PR ולא לשכפל את כל המערכת ידנית.
3. **ללא תלויות בזמן ריצה.** אין build הכרחי; הכלים (validator) רצים על Node נקי ללא `npm install`.

## זרימת עבודה

```bash
# 1. ענף feature — לעולם לא commit ישיר ל-main
git checkout -b deck/<kebab-name>      # או chore/... , docs/...

# 2. הרצת ה-validator לפני PR
npm run check          # strict (יוצא עם קוד שגיאה על הפרות)
npm run check:warn     # warn בלבד (תמיד יוצא 0)

# 3. פתיחת PR ל-main (ולא push ישיר). מלאו את תבנית ה-PR.
```

## חוקי עיצוב קשיחים (six-ink + RTL)

- **שש דיו סמנטיות** דרך `data-ink`: `black`=מבנה · `blue`=עתיד · `red`=בעיות · `green`=פתרונות · `orange`=סיכונים · `purple`=AI. לעולם לא ממפים מחדש ולא ממציאים צבעים.
- `dir="rtl"` על `<html>` ועל כל `.slide`; מספרים/לטינית בתוך `<bdi>`.
- בלי אימוג'י, בלי CSS gradients, בלי ספריות/פונטים חיצוניים שלא אושרו.
- קווי-יד רק דרך `data-sketch`; גרפים רק דרך `data-chart` (donut/bar/bar-h/stacked-bar/line/scatter/gantt/waterfall).

כל אלה נאכפים אוטומטית ע"י `scripts/check-design-system.mjs`.

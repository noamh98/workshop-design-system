## מה השתנה / What changed

<!-- תיאור קצר וממוקד של השינוי -->

## סוג השינוי / Type

- [ ] Deck חדש או עדכון deck (`decks/`)
- [ ] ליבת מערכת העיצוב (`project/css`, `project/js`) — דורש אישור CODEOWNERS
- [ ] תיעוד / הוראות סוכן (`docs/`, `*.md`)
- [ ] תשתית / CI / כלים (`scripts/`, `.github/`)

## צ'קליסט Validators (חובה ל-decks)

מבוסס על `decks/presentation-agent-instructions.md` §6 ועל `scripts/check-design-system.mjs`:

- [ ] `dir="rtl"` על `<html>` ועל כל `.slide`; `lang="he"` על `<html>`
- [ ] כל `data-ink` הוא אחד מ-6 (black/blue/red/green/orange/purple) — ללא מיפוי מחדש
- [ ] בלי אימוג'י, בלי CSS gradients, בלי ספריות/פונטים חיצוניים שלא אושרו
- [ ] מספרים ומונחים לועזיים עטופים ב-`<bdi>`
- [ ] קווי-יד רק דרך `data-sketch`; גרפים רק דרך `data-chart` (donut/bar/line)
- [ ] הרצתי `npm run check` מקומית והוא עובר
- [ ] לא נגעתי בקבצים מחוץ להיקף השינוי

## איך נבדק / How tested

<!-- render ידני, npm run check, צילומי מסך... -->

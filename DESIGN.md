---
name: Printing Parts 3D
description: מערכת עיצוב בהירה וסמכותית לבית ייצור דיגיטלי עם הנדסה במרכז.
colors:
  action-orange: "#ff7100"
  action-orange-deep: "#cf3b00"
  clean-paper: "#ffffff"
  soft-paper: "#f5f5f3"
  engineering-ink: "#252833"
  production-night: "#252833"
  quiet-text: "#555763"
  hero-support: "#42434e"
  dark-section-copy: "#d5d6d9"
  footer-copy: "#a9abb3"
  divider: "#dedfdf"
typography:
  display:
    fontFamily: "Assistant, Arial, sans-serif"
    fontSize: "clamp(52px, 5vw, 78px)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0"
  headline:
    fontFamily: "Assistant, Arial, sans-serif"
    fontSize: "clamp(44px, 5vw, 76px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0"
  body:
    fontFamily: "Assistant, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.65
  body-small:
    fontFamily: "Assistant, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  body-large:
    fontFamily: "Assistant, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.65
  title:
    fontFamily: "Assistant, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 900
    lineHeight: 1.25
  label:
    fontFamily: "Assistant, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    lineHeight: 1.4
rounded:
  mark: "3px"
  compact-control: "7px"
  control: "8px"
  media: "10px"
  contour: "14px"
spacing:
  control-x: "30px"
  section-min: "84px"
  engineering-grid: "48px"
  desktop-gutter: "clamp(22px, 4vw, 72px)"
components:
  button-primary:
    backgroundColor: "{colors.action-orange}"
    textColor: "{colors.clean-paper}"
    rounded: "{rounded.control}"
    padding: "0 30px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.action-orange-deep}"
    textColor: "{colors.clean-paper}"
---

# Design System: Printing Parts 3D

## Overview

**Creative North Star: "The Engineering Document"**

המערכת מציגה את האתר כמסמך הנדסי חי: משטחים לבנים רחבים, גריד שרטוט עדין, טיפוגרפיה כהה ובטוחה, כתום מדוד ומקטע כהה יחיד שמבסס סמכות. כל צילום מקבל יחס קבוע, caption וקו טכני כך שהתוכן נראה מתוכנן ולא מקושט.

**Key Characteristics:**
- רוב המסך בהיר ונקי, עם אזור כהה ממוקד אחד בכל רצף מרכזי.
- כתום משמש לפעולה, למסגור ולהכוונה בלבד.
- צילום ייצור אמיתי ממלא מסגרות רחבות ומדויקות.
- כותרות עבריות כבדות מנסחות עמדה קצרה וישירה.
- מספור דו-ספרתי, קווים דקים ונקודת סיום כתומה חוזרים בכל סקשן.

## Colors

הפלטה בנויה מנייר לבן, דיו כמעט שחור וכתום ייצור חד; אין גווני ביניים צבעוניים מתחרים.

**The Controlled Orange Rule.** כתום מציין פעולה או מסגרת חשובה, ולעולם אינו משמש לצביעת פסקאות ארוכות.

## Typography

**Display Font:** Assistant (with Arial fallback)
**Body Font:** Assistant (with Arial fallback)

הטיפוגרפיה ישירה ובעלת משקל גבוה בכותרות, מול טקסט גוף רגוע וקריא. אין letter-spacing שלילי; הצפיפות נוצרת מהמשקל ומה-line-height.

- **Display** (400, `clamp(52px, 7vw, 112px)`, 0.92): משפט המותג בהירו בלבד.
- **Headline** (600, `clamp(44px, 5vw, 76px)`, 1): כותרות הסקשנים הראשיים.
- **Title** (600, 21-22px): שמות שלבים ויכולות.
- **Body** (400-500, 15-19px, 1.65): הסבר קצר וממוקד.
- **Label** (800-900, 14-18px): פעולות ומספרי תהליך.

## Layout

התוכן יושב במעטפת מרבית של `1480px` עם שוליים רספונסיביים. קומפוזיציות דסקטופ נגזרות מגריד של 12 עמודות ומופיעות בפועל כחלוקות 5/7 או 4/8. ההירו בנוי מווידאו מלא עם תוכן לבן מעליו ופאנל פעולה מדורג בתחתית; מתחת ל־`760px` כל המבנים עוברים לטור יחיד ללא גלילה אופקית.

וריאציית `hero-fullwidth.html` משתמשת בבמה כמעט edge-to-edge: ניווט מעל המדיה, תוכן ראשי בצד ימין ומידע משני בתחתית. ב-RTL מוקד המסר מתחיל מימין והפרטים המשלימים מאזנים אותו משמאל.

סקשן הטכנולוגיות נשאר על משטח לבן, אך המדיה בו immersive: שלושה panels בגובה אחיד מתרחבים מעט ב-hover/focus, עוברים משחור-לבן לצבע ומציגים פס מידע לבן קבוע. המספור והקו הכתום מספקים את הקצב הטכני.

## Elevation & Depth

המערכת שטוחה במכוון ואינה משתמשת בצללים דקורטיביים. עומק נוצר מחפיפה בין פאנל לבן לצילום, מניגוד טונאלי וממסגור כתום עבה.

## Shapes

המערכת משתמשת בפינות ישרות. מוטיב החתימה המדורג חוזר בחיבור בין צילום לשטח השרטוט בסקשנים המרכזיים; בשאר האתר הצורות הן קווים ישרים, מסגרות דקות וסימוני מידה.

## Reference-Derived Primitives

### Section Index
כל סקשן מתחיל ב־`01–08`, קו אופקי ושם התחום. המספר כתום, הקו והטקסט מקבלים את צבע המשטח. הרכיב תמיד מופיע לפני הכותרת.

### Accent Dot
סימן הפיסוק האחרון בכותרת נצבע בכתום. אין לצבוע מילים שלמות בכותרת ואין להשתמש בכתום בגוף הטקסט.

### Technical Caption
צילום מקבל caption קצר מתחתיו: קו של `38px` וטקסט תיאורי. ניתן להוסיף קוד טכני קטן באנגלית רק כאשר הוא מספק הקשר אמיתי למדיה.

### Engineering Grid
גריד `48px` בקו בעוצמה של 5–7%. הוא מותר על סקשן תהליך, על אזור כהה ועל CTA מסכם. אין להציב אותו מאחורי טקסט גוף ארוך בעוצמה גבוהה.

הגריד שייך למשטח הסקשן בלבד ואינו מונח כשכבת CSS על צילום. כאשר צילום עובר לשרטוט CAD, המעבר משולב בנכס המדיה עצמו כדי לשמור על חיבור רציף ולא על מלבן טכני מלאכותי.

### Indexed Rows
תהליך וחומרים מוצגים כרשומות מופרדות בקו, לא ככרטיסים. כל רשומה מקבלת מספר או נקודה כתומה אחת.

## Motion

- פתיחת Hero: המסגרת נחשפת מימין לשמאל באמצעות `clip-path` במשך `1250ms` עם `power4.inOut`.
- לאחר פתיחת המדיה הכותרת נכנסת ב-fade קצר; ה-eyebrow והטקסט התומך עולים אחריה בהפרש של `100ms`.
- פאנל בדיקת הפרויקט נכנס משמאל ב-slide של `46px`, ורק אחריו מופיעים בקרי המדיה.
- כניסת סקשן: תנועה אנכית של `42px`, טשטוש עדין ומשך `850ms` עם `power3.out`.
- מדיה: תנועת parallax מצומצמת של `2%` ו-scale התחלתי של `1.055`; לעולם אין להזיז תמונה באופן שפוגע בקריאת האובייקט.
- כניסת תמונה: הצילום מורכב זמנית מאריחים מרובעים מימין לשמאל בכניסה הראשונה שלו ל־viewport, ואז מתחלף לתמונה הרציפה. האפקט מופעל פעם אחת בלבד ואינו משאיר גריד קבוע על המדיה.
- כפתור ראשי: עליה של `3px` ו-scale של `1.015` ב-hover, לחיצה ל-`0.98` וחזרה מהירה.
- קווים טכניים: נפתחים מימין לשמאל במשך `700ms` עם כניסת הסקשן.
- כל האנימציות מושבתות כאשר `prefers-reduced-motion: reduce` פעיל. תוכן חייב להישאר נגיש גם אם GSAP אינו נטען.

## Components

### Internal Pages
- חמשת עמודי התוכן משתמשים במעטפת משותפת מתוך `inner.css` ו־`inner.js`.
- לכל עמוד Hero טכני, `H1` יחיד, תמונה רלוונטית ופריט ניווט פעיל.
- אזור הפעולה האחרון בדף הבית יושב כשכבה כהה ושקופה על גבי תמונת הפרויקט, ללא סקשן לבן נפרד.

### Buttons
- **Shape:** מלבן קומפקטי עם פינות ישרות, לא גלולה.
- **Primary:** כתום עם טקסט לבן ומשקל 800.
- **Hover / Focus:** מעבר לכתום עמוק, תזוזה של 2px וטבעת פוקוס כתומה ברורה.

### Cards / Containers
- יכולות אינן כרטיסים צפים; הן עמודות רציפות המופרדות בקו דק.
- תמונות משתמשות ב־`object-fit: cover` וביחס תמונה יציב.
- צבע בצילום נשמר רק בנקודת הפעולה או באובייקט המרכזי; הרקע נשאר מרוסן ומופחת רוויה.
- לוגואים מוצגים בפס הוכחה כהה, בתאים שווי גובה עם הפרדות דקות וללא גריד רקע.

## Do's and Don'ts

### Do:
- השתמשו בלבן כשטח העבודה הראשי ובכהה כרגע מרוכז של סמכות טכנולוגית.
- שמרו כותרות קצרות ואת טקסט הגוף תכליתי.
- השתמשו בגריד ההנדסי כרקע חלש ובמספור כדי לבנות קצב לאורך הדף.
- תנו לתמונה ולכותרת להוביל; annotations חייבים להישאר משניים.

### Don't:
- אל תשתמשו בגרדיאנטים, זוהר או רשת טכנולוגית דקורטיבית שאינה מיושרת לגריד.
- אל תבנו עמודים מאוסף כרטיסים זהים.
- אל תציגו טענות מספריות או הוכחות שאינן מאומתות.
- אל תשתמשו ביותר מנקודת כתום אחת בתוך כותרת או ביותר מ־CTA ראשי אחד בסקשן.

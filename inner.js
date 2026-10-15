const menuToggle = document.querySelector('.menu-toggle');
const menuLinks = document.querySelectorAll('.page-links a');

function closeMenu() {
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'פתיחת תפריט');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'סגירת תפריט' : 'פתיחת תפריט');
});

menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

const languageSelect = document.querySelector('.language-select');
const headerNavLinks = document.querySelectorAll('.topbar > nav a');
const headerLabels = {
  he: {'about.html':'אודות', 'services.html':'השירותים שלנו', 'technologies.html':'טכנולוגיות', 'materials.html':'יכולות וחומרים', 'contact.html':'צור קשר'},
  en: {'about.html':'About', 'services.html':'Our services', 'technologies.html':'Technologies', 'materials.html':'Capabilities & Materials', 'contact.html':'Contact'},
};

const englishCopy = {
  'אודות':'About','יכולות':'Capabilities','יכולות וחומרים':'Capabilities & Materials','יישומים':'Applications','צור קשר':'Contact',
  'דף הבית':'Home','יצירת קשר':'Contact','בדיקת פרויקט':'Project review','לכל הטכנולוגיות':'All technologies',
  'ניסיון הנדסי':'Engineering experience','שמלווה את הפרויקט':'that supports the project','עד לחלק המוגמר.':'through to the finished part.',
  'Printing Parts 3D מחברת בין שירותי הנדסה לבין ייצור בתלת־ממד. אנחנו מסייעים ללקוחות להפוך צורך לתכנון, לבחור דרך ייצור מתאימה ולהתקדם עד לחלק המוגמר, תוך התייחסות לתפקוד, לזמן ולתקציב.':'Printing Parts 3D connects engineering services with additive manufacturing. We help clients turn a need into a design, select the right production route, and progress to a finished part while accounting for function, schedule, and budget.',
  'הניסיון שלנו':'Our experience','יותר מ־20 שנות ניסיון':'More than 20 years of experience','בפרויקטים הנדסיים מורכבים.':'in complex engineering projects.','בפרויקטים הנדסיים מורכבים':'in complex engineering projects',
  'הניסיון שלנו מאפשר להסתכל על החלק בתוך ההקשר שלו: מה הוא צריך לעשות, לאילו רכיבים הוא מתחבר ובאילו תנאים הוא יעבוד. כך מקבלים החלטות מדויקות יותר בתכנון ובייצור.':'Our experience lets us evaluate each part in context: what it must do, what it connects to, and the conditions in which it will operate. This leads to better-informed design and production decisions.',
  'הליווי ההנדסי':'Engineering support','מגדירים את הדרך':'Defining the route','לפני שמתחילים לייצר.':'before production begins.','לפני שמתחילים לייצר':'before production begins',
  'אפשר לפנות אלינו עם קובץ מוכן, מודל שדורש התאמה או צורך שעדיין צריך לתכנן. נבחן את המידע, נגדיר את הדרישות ונבנה את הדרך הנכונה עד לחלק המוגמר.':'Come to us with a production-ready file, a model that needs refinement, or a requirement that still needs to be designed. We review the information, define the requirements, and build the right route to the finished part.',
  'השירותים שלנו':'Our services',
  'שירותי הנדסה וייצור':'Engineering and production services',
  'לכל שלב':'for every stage',
  'בפרויקט.':'of the project.',
  'מהגדרת הצורך ועד לחלק המוגמר. אפשר להיעזר בנו בשלב אחד או לאורך כל הדרך — בתכנון, בבחירת חומר ותהליך, באב טיפוס ובייצור.':'From defining the need to the finished part. Work with us on a single stage or all the way through — design, material and process selection, prototyping and production.',
  'שירותי הנדסה ותכנון':'Engineering & design services',
  'הדפסת תלת־ממד לתעשייה':'Industrial 3D printing',
  'פיתוח וייצור אבות טיפוס':'Prototype development & production',
  'ייצור סדרות קטנות':'Small-batch production',
  'הפיכת דרישות לתכנון שניתן לייצר, או התאמת מודל קיים להמשך הפרויקט.':'Turning requirements into a manufacturable design, or adapting an existing model for the next stage of the project.',
  'אפשר להתחיל מרעיון, משרטוט, מחלק קיים או ממודל שדורש שינוי. נגדיר יחד מה החלק צריך לעשות ובאילו תנאים הוא יעבוד, ונבנה תכנון שמתאים לתהליך הייצור.':'You can start from an idea, a drawing, an existing part or a model that needs changes. Together we define what the part must do and the conditions it will work in, and build a design that suits the manufacturing process.',
  'הגדרת דרישות ותנאי עבודה':'Defining requirements and operating conditions',
  'תכנון ומידול לייצור':'Design and modeling for production',
  'התאמת מודל קיים לתהליך הנבחר':'Adapting an existing model to the chosen process',
  'ייצור חלקים לפי דרישות הפרויקט, עם הכוונה לבחירת חומר ותהליך.':'Producing parts to the project requirements, with guidance on choosing the material and process.',
  'נבחן יחד את הטכנולוגיה והחומר שמתאימים לתפקוד החלק, לסביבת העבודה ולגימור הנדרש — הדפסת FDM, הדפסת MSLA או חיתוך בלייזר.':'Together we review the technology and material that suit the part’s function, working environment and required finish — FDM printing, MSLA printing or laser cutting.',
  'הכוונה לבחירת חומר ותהליך':'Guidance on material and process',
  'הדפסת FDM ו־MSLA':'FDM and MSLA printing',
  'גימור לפי דרישות הפרויקט':'Finishing to project requirements',
  'מודלים לבחינת התכנון, ההתאמה או התפקוד, כדי לקבל החלטות לקראת השלב הבא.':'Models for testing the design, fit or function, so you can make decisions ahead of the next stage.',
  'לפני שמייצרים, נגדיר מה רוצים לבדוק באמצעות אב הטיפוס. כך כל סבב מקדם החלטה ברורה ולא רק עוד גרסה.':'Before producing, we define what the prototype needs to test. That way every round moves a clear decision forward, not just another version.',
  'בחינת צורה והתאמה':'Form and fit review',
  'בדיקת תפקוד':'Functional testing',
  'שיפור בין סבבים':'Refinement between rounds',
  'בחינת מסלול ייצור לכמות הנדרשת, עם הגדרת דרישות לחלקים ולהזמנות חוזרות.':'Reviewing a production route for the required quantity, with defined requirements for parts and repeat orders.',
  'מחלק בודד ועד סדרה קצרה. נגדיר את הדרישות לחלק ולתהליך כך שאפשר יהיה לחזור על אותה תוצאה גם בהזמנה הבאה.':'From a single part to a short run. We define the part and process requirements so the same result can be repeated in the next order.',
  'בחינת מסלול ייצור לכמות':'Production route for the quantity',
  'הגדרת דרישות לחלקים':'Defined part requirements',
  'הזמנות חוזרות':'Repeat orders',
  'שלחו פרויקט לבדיקה':'Send a project for review',
  'יש לכם חלק':'Have a part','שצריך':'that needs','לקרות?':'happen?','לייצר?':'making?','מתחילים מכאן':'Start here',
  'שלחו קובץ, שרטוט, תמונה או תיאור קצר. נבדוק את הנתונים ונחזור עם הצעד הבא.':'Send a file, drawing, photo, or short description. We will review the information and get back to you with the next step.',

  'כל היכולות.':'Every capability.','לחלק שעובד.':'For a part that works.',
  'מסריקה ותכנון, דרך בחירת חומר וטכנולוגיה, ועד אב־טיפוס וחלק מוגמר שמוכן לעבודה.':'From scanning and design through material and technology selection to a prototype and a finished, working part.',
  'בדיקת התאמה לפרויקט':'Check project fit','לא בוחרים חומר':'Material is not selected','לפי השם שלו.':'by its name.',
  'מגדירים קודם מה החלק צריך לעשות ובאילו תנאים הוא יעבוד. משם בוחנים את החומר ואת טכנולוגיית הייצור יחד.':'First, we define what the part must do and the conditions in which it will work. Then we evaluate the material and manufacturing technology together.',
  'תפקוד מכני':'Mechanical function','עומס, חיבורים, שחיקה ושימוש חוזר.':'Loads, connections, wear, and repeated use.',
  'סביבת עבודה':'Operating environment','חום, חוץ, לחות וחשיפה לחומרים.':'Heat, outdoor use, humidity, and chemical exposure.',
  'קשיחות וגמישות':'Stiffness and flexibility','שמירת צורה, ספיגת אנרגיה או תנועה.':'Shape retention, energy absorption, or movement.',
  'דיוק וגימור':'Accuracy and finish','מידות קריטיות, פרטים קטנים ומראה סופי.':'Critical dimensions, small details, and final appearance.',
  'כל החומרים.':'Every material.','במקום אחד.':'In one place.',
  'הקטלוג מחולק לפי טכנולוגיית הייצור ואופי השימוש. הזמינות והדרגה המדויקת נבדקות מול דרישות כל פרויקט.':'The catalog is organized by manufacturing technology and application. Availability and exact grades are verified against each project’s requirements.',
  '01 / הדפסת חוט / FDM':'01 / FILAMENT / FDM','02 / סטריאוליטוגרפיה / MSLA':'02 / STEREOLITHOGRAPHY / MSLA','03 / חיתוך / חריטה בלייזר':'03 / LASER CUTTING / ENGRAVING',
  'תרמופלסטים':'Engineering','הנדסיים.':'thermoplastics.','שרפים':'Printing','להדפסה.':'resins.','חומרים לחיתוך':'Cutting and','וחריטה.':'engraving materials.',
  'פוליקרבונט':'Polycarbonate','פוליאתילן':'Polyethylene','אקריליק':'Acrylic','PMMA — אקריליק':'PMMA — Acrylic','פוליפרופילן':'Polypropylene',
  'שרף שקוף':'Clear resin','שרף לשימוש בטמפרטורה גבוהה':'High-temperature resin','שרף קשיח':'Rigid resin','שרף בתכונות ABS':'ABS-like resin','שרף קשיח־גמיש':'Tough flexible resin','שרף המתאים ליציקה':'Castable resin','שרף ידידותי לסביבה על בסיס צמחי':'Plant-based eco resin','שרף לעיצוב':'Design resin','שרף הנדסי ברזולוציה גבוהה':'High-resolution engineering resin',
  'עץ':'Wood','גומי':'Rubber','זכוכית':'Glass','נחושת':'Copper','קלקר וספוג דחוס — FOAM / EPO':'Foam board and dense foam — FOAM / EPO','חומרים מרוכבים':'Composite materials',
  'חומר וטכנולוגיה.':'Material and technology.','החלטה אחת.':'One decision.','אותה גאומטריה יכולה לדרוש תהליך אחר לגמרי. ההחלטה מתקבלת לפי תפקיד החלק, הגימור, הכמות והדיוק.':'The same geometry can require a completely different process. The decision depends on the part’s function, finish, quantity, and accuracy.',
  'תרמופלסט.':'Thermoplastic.','שכבות נראות.':'Visible layers.','חלקים חזקים ושימושיים, עם חופש רחב בבחירת חומר ובמידות הייצור.':'Strong, practical parts with broad freedom in material choice and production dimensions.',
  'שרף נוזלי.':'Liquid resin.','פרטים חדים.':'Sharp details.','פני שטח חלקים ורזולוציה גבוהה לחלקים שבהם המראה והדיוק מובילים.':'Smooth surfaces and high resolution for parts where appearance and precision lead.',
  'מתאים ל־':'Best for','היתרון':'Advantage','התחושה':'Character','חלקים פונקציונליים, מתקנים, אבות־טיפוס ומארזים':'Functional parts, fixtures, prototypes, and enclosures','חוזק, מגוון חומרים ועלות יעילה':'Strength, material variety, and cost efficiency','טכנית, שכבתית וישירה':'Technical, layered, and direct','מוצרים מוגמרים, מודלים, פרטים קטנים וגאומטריה מורכבת':'Finished products, models, small details, and complex geometry','דיוק, גימור ופרטים עדינים':'Accuracy, finish, and fine detail','נקייה, חלקה ומדויקת':'Clean, smooth, and precise',
  'מה אנחנו יכולים':'What we can','לעשות בשבילכם.':'do for you.','מעבר לבחירת חומר וטכנולוגיה, אנחנו מלווים את החלק מהמציאות הפיזית או מהרעיון — ועד לקובץ ולייצור.':'Beyond selecting material and technology, we support the part from a physical object or an idea through to the file and production.',
  'סריקה':'3D','תלת־ממדית.':'scanning.','המרת חלק קיים למודל דיגיטלי לצורך שחזור, התאמה, מדידה או המשך פיתוח.':'Converting an existing part into a digital model for reconstruction, adaptation, measurement, or continued development.',
  'הדפסה':'On-demand','לפי דרישה.':'printing.','מחלק בודד ועד סדרה קצרה, בטכנולוגיה ובחומר שמתאימים לתפקיד האמיתי שלו.':'From a single part to a short run, using the technology and material that fit its real function.',
  'פיתוח':'Prototype','אב־טיפוס.':'development.','מעבר מהרעיון למודל, בדיקה פיזית ושיפור איטרטיבי עד שמגיעים לחלק שעובד.':'Moving from idea to model, physical testing, and iterative refinement until the part works.',

  'ספרו לנו':'Tell us','מה צריך':'what you need','לייצר לכם.':'us to produce.','אפשר לפנות גם בלי קובץ תלת־ממד. שלחו תיאור קצר, שרטוט או כל חומר שכבר קיים — ונעזור לדייק את הדרך לחלק שעובד.':'You can contact us without a 3D file. Send a short description, drawing, or any material you already have, and we will help define the route to a working part.',
  'קובץ מוכן, רעיון ראשוני או צורך הנדסי — מתחילים ממה שיש.':'A ready file, an initial idea, or an engineering need — we start with what you have.',
  'שם מלא':'Full name','חברה (אופציונלי)':'Company (optional)','אימייל':'Email','טלפון':'Phone','מה תרצו לספר לנו?':'What would you like to tell us?','צרפו קובץ':'Attach a file','שלחו את הפרויקט':'Send the project',
  'הודעת אישור':'Confirmation','הפנייה התקבלה':'Request received','תודה! נבחן את פרטי הפרויקט וניצור קשר להמשך.':'Thank you. We will review the project details and contact you about the next step.',

  'תהליך עבודה':'Workflow','מהצורך שלכם':'From your requirement','לחלק המוגמר.':'to the finished part.','תהליך ברור מתחיל בהבנת הפרויקט. בין שיש לכם קובץ מוכן ובין שאתם זקוקים לתכנון, נגדיר יחד מה צריך להשיג, מה כוללת העבודה ואיך מתקדמים לשלב הבא.':'A clear process begins with understanding the project. Whether you have a ready file or need design support, we define the goal, scope, and the next step together.',
  'שולחים קובץ או מתארים את הצורך':'Send a file or describe the need','בוחנים את הדרישות ומגדירים את העבודה':'Review the requirements and define the work','מתכננים ומתאימים לייצור':'Design and prepare for production','מייצרים ומשלימים את החלק':'Produce and complete the part','מוסרים את התוצר ומגדירים את ההמשך':'Deliver the result and define what comes next','שלחו פרויקט לבדיקה':'Send a project for review',
  'שתפו אותנו במה שאתם רוצים לייצר: מה החלק צריך לעשות, כמה יחידות נדרשות והאם יש מועד יעד. אפשר לצרף מודל, שרטוט או צילום. גם ללא קובץ מוכן אפשר להתחיל בשיחה על הפרויקט.':'Tell us what you want to produce: what the part must do, how many units are needed, and whether there is a target date. You can attach a model, drawing, or photo. Even without a ready file, we can begin with a conversation about the project.',
  'נבחן את המידע, נשלים פרטים ונבדוק אילו החלטות נדרשות לפני הייצור. בהתאם לצורך, נתייחס לתכנון, לחומר, לתהליך הייצור, לממשקים ולדרישות הגימור.':'We review the information, complete the missing details, and identify the decisions required before production. As needed, we address design, material, manufacturing process, interfaces, and finish requirements.',
  'בהצעה נפרט את היקף העבודה, התוצרים, המחיר ולוח הזמנים. עבודת תכנון או בדיקות נוספות יוגדרו במפורש כאשר הן נדרשות.':'The proposal sets out the scope, deliverables, price, and schedule. Design work or additional testing is defined explicitly when required.',
  'כאשר הפרויקט כולל עבודת הנדסה, נפתח או נתאים את התכנון לפי הדרישות שסוכמו. אם נדרש אב טיפוס, נגדיר מה רוצים לבדוק באמצעותו ומה יהיה הבסיס להתקדמות.':'When a project includes engineering work, we develop or adapt the design to the agreed requirements. If a prototype is needed, we define what it must validate and the basis for moving forward.',
  'בפרויקט שמגיע עם מודל מוכן, נברר אם נדרשות התאמות לפני תחילת הייצור.':'For a project supplied with a ready model, we determine whether any changes are needed before production begins.',
  'לאחר אישור ההצעה והדרישות, נתקדם לייצור בתהליך שנבחר. גימור, הרכבה ובדיקות יבוצעו בהתאם למה שנכלל בפרויקט.':'Once the proposal and requirements are approved, we proceed with the selected production process. Finishing, assembly, and testing are carried out as defined in the project.',
  'בסיום נמסור את התוצרים שסוכמו. אם נדרש סבב נוסף, שינוי בתכנון או ייצור כמות נוספת, נבחן יחד את הדרישות ואת הצעד הבא.':'At completion, we deliver the agreed outputs. If another iteration, a design change, or an additional production run is needed, we review the requirements and next step together.',

  'טכנולוגיות ייצור':'Manufacturing technologies','הטכנולוגיה הנכונה מתחילה בדרישות':'The right technology starts with the requirements of the','החלק.':'part.','אפשרויות ייצור':'Production options','שלוש טכנולוגיות.':'Three technologies.','דרך אחת מדויקת יותר.':'One more precise route.','בחירת התהליך':'Process selection','יש לכם חלק לייצר?':'Have a part to produce?','שליחת פרויקט לבדיקה':'Send a project for review',
  'לכל פרויקט יש שילוב אחר של תפקוד, צורה, כמות וגימור. אנחנו בוחנים את הצורך ואת המודל כדי להתאים תהליך ייצור שמשרת את התוצאה, ולא רק את הקובץ.':'Every project has a different combination of function, form, quantity, and finish. We assess the need and the model to choose a manufacturing process that serves the result, not just the file.',
  'דרישות שימוש':'Application requirements','חומר וסביבה':'Material and environment','כמות וגימור':'Quantity and finish',
  'הבחירה נעשית לפי דרישות החלק והפרויקט. כל טכנולוגיה נותנת יתרון אחר בדיוק, בחומר, בגודל ובכמות.':'The choice is based on the requirements of the part and the project. Each technology offers different advantages in accuracy, material, size, and quantity.',
  'חלקים פונקציונליים וסדרות קצרות':'Functional parts and short runs','ייצור בשכבות של חומר תרמופלסטי. מתאים למגוון רחב של גדלים, חומרים ושימושים הנדסיים.':'Layer-by-layer production in thermoplastic material, suitable for a wide range of sizes, materials, and engineering applications.',
  'פרטים עדינים וגימור מדויק':'Fine details and precise finish','ייצור משכבות שרף המתקשה באור. מתאים לגאומטריה מפורטת ולחלקים שבהם איכות פני השטח חשובה.':'Production from light-cured resin layers, suited to detailed geometry and parts where surface quality matters.',
  'חיתוך וחריטה של חומרי לוח':'Cutting and engraving sheet materials','חיתוך או חריטה לפי קובץ, חומר ועובי. אפשר לשלב את התהליך כחלק ממכלול או כפתרון עצמאי.':'Cutting or engraving according to file, material, and thickness. The process can be integrated into an assembly or used as a standalone solution.','בדיקת התאמה':'Check fit',
  'לא בוחרים טכנולוגיה לפני שמבינים מה החלק צריך לעשות.':'We do not choose a technology before understanding what the part must do.','אנחנו מתחילים מהיישום: מה העומס, באיזו סביבה החלק יעבוד, מהן המידות החשובות וכמה יחידות נדרשות. משם אפשר לבחון את הפשרות בין עלות, דיוק, מראה וזמן ייצור.':'We start with the application: the load, operating environment, critical dimensions, and required quantity. From there, we can evaluate the trade-offs between cost, accuracy, appearance, and production time.',
  'מגדירים שימוש וסביבה':'Define use and environment','תפקוד, עומס, טמפרטורה, חשיפה וכמות.':'Function, load, temperature, exposure, and quantity.','בודקים את המודל':'Review the model','גאומטריה, עוביים, כיווני הדפסה ודרישות התאמה.':'Geometry, wall thicknesses, print orientation, and fit requirements.','מתאימים חומר ותהליך':'Match material and process','בחירה שקופה לפי היתרונות והמגבלות של כל אפשרות.':'A transparent choice based on the strengths and limitations of each option.',
  '04 / מתחילים מכאן':'04 / START HERE','שלחו קובץ, שרטוט או תיאור קצר של הצורך. נבחן את המידע ונעזור לזהות את תהליך הייצור המתאים.':'Send a file, drawing, or short description of the need. We will review the information and help identify the right manufacturing process.','←':'→','↙':'↘'
};

const originalTitle = document.title;
const englishTitles = {
  'אודות | Printing Parts 3D':'About | Printing Parts 3D',
  'יכולות | Printing Parts 3D':'Capabilities | Printing Parts 3D',
  'יצירת קשר ובדיקת פרויקט | Printing Parts 3D':'Contact & Project Review | Printing Parts 3D',
  'תהליך עבודה | Printing Parts 3D':'Workflow | Printing Parts 3D',
  'השירותים שלנו | Printing Parts 3D':'Our Services | Printing Parts 3D',
  'טכנולוגיות ייצור | Printing Parts 3D':'Manufacturing Technologies | Printing Parts 3D',
};

const originalTextNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode(node) {
    return node.parentElement?.closest('script,style') || !node.nodeValue.trim()
      ? NodeFilter.FILTER_REJECT
      : NodeFilter.FILTER_ACCEPT;
  },
});
while (walker.nextNode()) originalTextNodes.push([walker.currentNode, walker.currentNode.nodeValue]);

const translatedAttributes = [...document.querySelectorAll('[placeholder], [title]')].map((element) => ({
  element,
  placeholder: element.getAttribute('placeholder'),
  title: element.getAttribute('title'),
}));

function translateInnerPage(language) {
  const isEnglish = language === 'en';
  document.documentElement.lang = isEnglish ? 'en' : 'he';
  document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
  document.body.classList.toggle('lang-en', isEnglish);
  document.title = isEnglish ? (englishTitles[originalTitle] || originalTitle) : originalTitle;
  originalTextNodes.forEach(([node, original]) => {
    const trimmed = original.trim();
    const translated = isEnglish ? englishCopy[trimmed] : null;
    node.nodeValue = translated
      ? original.replace(trimmed, translated)
      : original;
  });
  translatedAttributes.forEach(({ element, placeholder, title }) => {
    if (placeholder !== null) element.setAttribute('placeholder', isEnglish ? (englishCopy[placeholder] || placeholder) : placeholder);
    if (title !== null) element.setAttribute('title', isEnglish ? (englishCopy[title] || title) : title);
  });
}

function setHeaderLanguage(language) {
  const nextLanguage = language === 'en' ? 'en' : 'he';
  translateInnerPage(nextLanguage);
  headerNavLinks.forEach((link, index) => {
    const page = new URL(link.href, location.href).pathname.split('/').pop();
    if (headerLabels[nextLanguage][page]) link.textContent = headerLabels[nextLanguage][page];
  });
  if (languageSelect) {
    languageSelect.value = nextLanguage;
    languageSelect.setAttribute('aria-label', nextLanguage === 'he' ? 'בחירת שפה' : 'Choose language');
  }
  localStorage.setItem('pp3d-language', nextLanguage);
}

languageSelect?.addEventListener('change', (event) => setHeaderLanguage(event.target.value));
setHeaderLanguage(localStorage.getItem('pp3d-language') || 'he');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  reveals.forEach((element) => observer.observe(element));
}

const contactForm = document.querySelector('[data-contact-form]');
const loadedAtInput = contactForm?.querySelector('[name="loadedAt"]');
const fileInput = contactForm?.querySelector('input[type="file"]');
const fileLabel = contactForm?.querySelector('[data-file-label]');
if (loadedAtInput) loadedAtInput.value = String(Date.now());

fileInput?.addEventListener('change', () => {
  if (!fileLabel) return;
  fileLabel.textContent = fileInput.files?.[0]?.name || (document.documentElement.lang === 'en' ? 'Attach a file' : 'צרפו קובץ');
});

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = contactForm.querySelector('.form-status');
  const confirmation = document.querySelector('[data-confirmation]');
  const submitButton = contactForm.querySelector('[type="submit"]');
  const originalLabel = submitButton?.innerHTML;

  status.className = 'form-status';
  const isEnglish = document.documentElement.lang === 'en';
  status.textContent = isEnglish ? 'Sending project details...' : 'שולחים את פרטי הפרויקט...';
  submitButton?.setAttribute('disabled', '');
  if (submitButton) submitButton.textContent = isEnglish ? 'Sending...' : 'שולחים...';

  try {
    const response = await fetch('/api/submit-project', {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.message || 'אירעה שגיאה בשליחת הפנייה. נסו שוב.');

    status.classList.add('is-success');
    status.textContent = isEnglish ? 'Your request was sent successfully.' : 'הפנייה נשלחה בהצלחה.';
    contactForm.reset();
    if (loadedAtInput) loadedAtInput.value = String(Date.now());
    if (confirmation) {
      confirmation.hidden = false;
      confirmation.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    }
  } catch (error) {
    status.classList.add('is-error');
    status.textContent = error.message || (isEnglish ? 'There was an error sending your request. Please try again.' : 'אירעה שגיאה בשליחת הפנייה. נסו שוב.');
  } finally {
    submitButton?.removeAttribute('disabled');
    if (submitButton && originalLabel) submitButton.innerHTML = originalLabel;
  }
});

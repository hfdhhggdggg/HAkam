# وثائق الموقع الكاملة — Mosaic React Dashboard

> قالب لوحة تحكم (Admin Dashboard) مبني على React + Vite + Tailwind CSS v4 + Chart.js.
> يحتوي على صفحة واحدة فعلية (Dashboard) مع شريط جانبي، رأس صفحة، و13 بطاقة معلومات/رسم بياني.

---

## جدول المحتويات

1. [نظرة عامة على الهيكل](#نظرة-عامة-على-الهيكل)
2. [نقطة الدخول (main.jsx)](#نقطة-الدخول-mainjsx)
3. [التطبيق الرئيسي (App.jsx)](#التطبيق-الرئيسي-appjsx)
4. [الصفحات (Pages)](#الصفحات-pages)
   - [صفحة Dashboard](#صفحة-dashboard)
5. [الأجزاء الثابتة (Partials)](#الأجزاء-الثابتة-partials)
   - [Sidebar](#sidebar)
   - [Header](#header)
   - [Banner](#banner)
   - [SidebarLinkGroup](#sidebarlinkgroup)
6. [المكونات (Components)](#المكونات-components)
   - [ThemeToggle](#themetoggle)
   - [ModalSearch](#modalsearch)
   - [DropdownNotifications](#dropdownnotifications)
   - [DropdownHelp](#dropdownhelp)
   - [DropdownProfile](#dropdownprofile)
   - [DropdownEditMenu](#dropdowneditmenu)
   - [DropdownFilter](#dropdownfilter)
   - [Datepicker](#datepicker)
   - [DateSelect](#dateselect)
   - [Tooltip](#tooltip)
7. [بطاقات لوحة التحكم (Dashboard Cards)](#بطاقات-لوحة-التحكم-dashboard-cards)
   - Card 01 → Card 13
8. [الرسوم البيانية (Charts)](#الرسوم-البيانية-charts)
9. [الأدوات المساعدة (Utils)](#الأدوات-المساعدة-utils)
10. [نظام الألوان والثيم](#نظام-الألوان-والثيم)

---

## نظرة عامة على الهيكل

```
src/
├── main.jsx              ← نقطة الدخول (React root + Router + ThemeProvider)
├── App.jsx               ← التوجيه (Routes) وتحميل CSS وإعدادات Chart.js
├── pages/
│   └── Dashboard.jsx     ← الصفحة الوحيدة الفعلية
├── partials/
│   ├── Sidebar.jsx       ← القائمة الجانبية
│   ├── Header.jsx        ← الرأس العلوي
│   ├── Banner.jsx        ← بانر سفلي ثابت
│   ├── SidebarLinkGroup.jsx ← مجموعة روابط قابلة للطي
│   └── dashboard/
│       └── DashboardCard01..13.jsx  ← 13 بطاقة
├── components/           ← مكونات قابلة لإعادة الاستخدام
│   ├── ThemeToggle.jsx
│   ├── ModalSearch.jsx
│   ├── DropdownNotifications.jsx
│   ├── DropdownHelp.jsx
│   ├── DropdownProfile.jsx
│   ├── DropdownEditMenu.jsx
│   ├── DropdownFilter.jsx
│   ├── Datepicker.jsx
│   ├── DateSelect.jsx
│   └── Tooltip.jsx
├── charts/               ← إعدادات ومكونات Chart.js
│   ├── ChartjsConfig.jsx
│   ├── LineChart01.jsx
│   ├── LineChart02.jsx
│   ├── BarChart01.jsx
│   ├── BarChart02.jsx
│   ├── BarChart03.jsx
│   ├── DoughnutChart.jsx
│   └── RealtimeChart.jsx
├── utils/                ← أدوات مساعدة
│   ├── ThemeContext.jsx
│   ├── Transition.jsx
│   ├── Info.jsx
│   └── Utils.js
└── css/
    └── style.css         ← أنماط Tailwind + أنماط مخصصة
```

---

## نقطة الدخول (main.jsx)

يُنشئ جذر التطبيق ويُغلّفه بـ:
- `React.StrictMode` لاكتشاف المشاكل في وضع التطوير.
- `BrowserRouter` (من react-router-dom) لدعم التنقل بين المسارات.
- `ThemeProvider` لتوفير سياق الثيم (فاتح/داكن) لكل المكونات.

ثم يُعرض المكوّن `App`.

---

## التطبيق الرئيسي (App.jsx)

- يُحمّل ملف الأنماط `css/style.css`.
- يُحمّل ويُطبّق إعدادات Chart.js عبر `charts/ChartjsConfig`.
- يحتوي على `Routes` بمسار واحد فقط: `/` → صفحة `Dashboard`.
- عند تغيّر المسار، يُعاد التمرير لأعلى الصفحة.

---

## الصفحات (Pages)

### صفحة Dashboard

الصفحة الرئيسية والوحيدة في التطبيق. تتكوّن من:

#### التخطيط العام
- حاوية `flex` تشغل كامل ارتفاع الشاشة.
- **الشريط الجانبي** (Sidebar) على اليسار.
- منطقة محتوى على اليمين تحتوي على:
  - **الرأس** (Header) في الأعلى.
  - **المحتوى الرئيسي** (`<main>`).
  - **البانر** (Banner) في الأسفل.

#### منطقة العنوان والأدوات (أعلى المحتوى)
- **عنوان الصفحة**: "Dashboard" بخط كبير عريض.
- **زر الفلترة** (FilterButton): قائمة منسدلة لفلترة البيانات (انظر DropdownFilter).
- **منتقي التاريخ** (Datepicker): لاختيار نطاق زمني (انظر Datepicker).
- **زر "Add New Order"**: زر أساسي بإضافة طلب جديد (رابط لـ `#0`).

#### شبكة البطاقات
شبكة من 12 عمود (`grid-cols-12`) تعرض 13 بطاقة بالترتيب التالي:

| الترتيب | المكوّن | العنوان | النوع |
|--------|---------|---------|------|
| 01 | DashboardCard01 | Acme Plus | خط بياني (Line) + قيمة مبيعات |
| 02 | DashboardCard02 | Acme Advanced | خط بياني (Line) + قيمة مبيعات |
| 03 | DashboardCard03 | Acme Professional | خط بياني (Line) + قيمة مبيعات |
| 04 | DashboardCard04 | Direct VS Indirect | أعمدة (Bar) |
| 05 | DashboardCard05 | Real Time Value | خط بياني مباشر (Realtime) |
| 06 | DashboardCard06 | Top Countries | دائري (Doughnut) |
| 07 | DashboardCard07 | Top Channels | قائمة قنوات مع نسب مئوية |
| 08 | DashboardCard08 | Sales Over Time (all stores) | خط بياني (Line) |
| 09 | DashboardCard09 | Sales VS Refunds | أعمدة (Bar) |
| 10 | DashboardCard10 | Customers | جدول عملاء |
| 11 | DashboardCard11 | Reason for Refunds | أعمدة (Bar) |
| 12 | DashboardCard12 | Recent Activity | قائمة نشاطات |
| 13 | DashboardCard13 | Income/Expenses | خط بياني (Line) |

---

## الأجزاء الثابتة (Partials)

### Sidebar

شريط جانبي قابل للطيّ على الجوال (يظهر/يختفي بزر الهامبرغر)، وثابت على الشاشات الكبيرة (lg+). يتكوّن من:

#### رأس الشريط
- **زر الإغلاق** (للجوال فقط): يُغلق الشريط.
- **الشعار (Logo)**: رابط إلى `/` بشكل دائري بنفسجي.

#### مجموعة الروابط — قسم "Pages"
كل مجموعة قابلة للطيّ (SidebarLinkGroup):

| المجموعة | الروابط الفرعية |
|----------|-----------------|
| **Dashboard** | Main, Analytics, Fintech |
| **E-Commerce** | Customers, Orders, Invoices, Shop, Shop 2, Single Product, Cart, Cart 2, Cart 3, Pay |
| **Community** | Users - Tabs, Users - Tiles, Profile, Feed, Forum, Forum - Post, Meetups, Meetups - Post |
| **Finance** | Cards, Transactions, Transaction Details |
| **Job Board** | Listing, Job Post, Company Profile |
| **Tasks** | Kanban, List |
| **Messages** | رابط مباشر (مع شارة "4") |
| **Inbox** | رابط مباشر |
| **Calendar** | رابط مباشر |
| **Campaigns** | رابط مباشر |

#### مجموعة الروابط — قسم "More"

| المجموعة | الروابط الفرعية |
|----------|-----------------|
| **Authentication** | Sign in, Sign up, Reset Password |
| **Onboarding** | Step 1, Step 2, Step 3, Step 4 |
| **Components** | Button, Input Form, Dropdown, Alert & Banner, Modal, Pagination, Tabs, Breadcrumb, Badge, Avatar, Tooltip, Accordion, Icons |

> ملاحظة: معظم الروابط تشير إلى `https://cruip.com/mosaic/` (روابط خارجية تجريبية) ما عدا "Main" التي تشير إلى `/`.

#### زر توسيع/طيّ الشريط
في أسفل الشريط (للشاشات الكبيرة فقط)، يُبدّل بين وضع الشريط الضيق (أيقونات فقط) والوضع الموسّع (أيقونات + نصوص).

---

### Header

رأس علوي ثابت (sticky) مع تأثير ضبابي (backdrop-blur). يحتوي على:

#### الجانب الأيسر
- **زر الهامبرغر** (للجوال فقط): يفتح/يغلق الشريط الجانبي.

#### الجانب الأيمن (مجموعة أدوات)
- **زر البحث**: يفتح نافذة بحث منبثقة (ModalSearch).
- **الإشعارات** (Notifications): قائمة منسدلة بالإشعارات.
- **المساعدة** (Help): قائمة منسدلة بالروابط (Documentation, Support Site, Contact us).
- **مبدّل الثيم** (ThemeToggle): زر تبديل فاتح/داكن.
- **فاصل عمودي**.
- **قائمة المستخدم** (UserMenu): صورة + اسم "Acme Inc." مع قائمة منسدلة (Settings, Sign Out).

---

### Banner

بانر ثابت في أسفل يمين الشاشة يظهر عند التحميل:
- رابط "Download on GitHub" (للنسخة المجانية).
- رابط "Check Premium Version" (لنسخة Cruip المدفوعة).
- **زر إغلاق** (X) لإخفاء البانر.

يتغيّر رابط GitHub حسب معامل `template` في الرابط (Laravel أو افتراضي).

---

### SidebarLinkGroup

مكوّن مساعد يُنشئ عنصر قائمة (`<li>`) قابل للطيّ:
- يقبل `activecondition` لتحديد ما إذا كان العنصر نشطاً (يُسلّط خلفية بنفسجية).
- يُمرّر دالتين للأبناء: `handleClick` (لفتح/إغلاق المجموعة) و`open` (الحالة الحالية).
- يُسلّم خلفية متدرجة عند النشاط.

---

## المكونات (Components)

### ThemeToggle

زر تبديل بين الوضع الفاتح والداكن:
- مربع اختيار مخفي (`checkbox`) مع تسمية مرئية.
- يعرض أيقونة شمس في الوضع الفاتح وأيقونة قمر في الوضع الداكن.
- يستخدم `useThemeProvider` من `ThemeContext` لقراءة/تغيير الثيم الحالي.

---

### ModalSearch

نافذة بحث منبثقة (Modal) تُفتح من زر البحث في الرأس:
- **خلفية معتمة** عند الفتح.
- **حقل بحث** مع أيقونة بحث وplaceholder "Search Anything…".
- **قسم "Recent searches"**: قائمة بـ 6 نتائج تجريبية (Form Builder, Access Mosaic on mobile, Product Update Q4 2024, Master Digital Marketing, Dedicated forms, Product Update Q4 2024).
- **قسم "Recent pages"**: رابطان لصفحات رسائل (Mike Mills, Eva Patrick).
- يُغلق بالنقر خارج النافذة أو زر Escape.

---

### DropdownNotifications

قائمة منسدلة للإشعارات (من زر الجرس في الرأس):
- نقطة حمراء صغيرة على الأيقونة تشير لوجود إشعارات غير مقروءة.
- تحتوي على 3 إشعارات تجريبية مع تواريخ (Feb 12, Feb 9, Jan 24 2024).
- يُغلق بالنقر خارج القائمة أو Escape.

---

### DropdownHelp

قائمة منسدلة للمساعدة (من زر علامة الاستفهام في الرأس):
- 3 روابط: Documentation, Support Site, Contact us.
- يُغلق بالنقر خارج القائمة أو Escape.

---

### DropdownProfile

قائمة منسدلة لملف المستخدم (من صورة المستخدم في الرأس):
- يعرض صورة المستخدم + اسم "Acme Inc." + سهم.
- عند الفتح: اسم الشركة + دور "Administrator"، ثم روابط:
  - **Settings** (→ `/settings`)
  - **Sign Out** (→ `/signin`)
- يُغلق بالنقر خارج القائمة أو Escape.

---

### DropdownEditMenu

قائمة منسدلة عامة (زر ثلاث نقاط) تُستخدم في بطاقات لوحة التحكم:
- يقبل `children` (عناصر القائمة) و`align` (يمين/يسار).
- مثال استخدام: في DashboardCard01-03 يحتوي على "Option 1", "Option 2", "Remove".
- يُغلق بالنقر خارج القائمة أو Escape.

---

### DropdownFilter

قائمة منسدلة للفلترة (من زر الفلترة في صفحة Dashboard):
- 6 مربعات اختيار (checkboxes):
  - Direct VS Indirect
  - Real Time Value
  - Top Channels
  - Sales VS Refunds
  - Last Order
  - Total Spent
- زر **Clear**: يُلغي جميع الفلاتر.
- زر **Apply**: يُطبّق الفلاتر ويُغلق القائمة.
- يُغلق بالنقر خارج القائمة أو Escape.

---

### Datepicker

منتقي نطاق تاريخ مبني على React Day Picker + Radix Popover:
- زر يعرض النطاق الحالي (مثال: "Jan 20, 2022 - Feb 09, 2022").
- عند النقر يفتح تقويماً لاختيار تاريخ "from" و"to".
- إن لم يُختر تاريخ يعرض "Pick a date".

---

### DateSelect

قائمة منسدلة لاختيار فترة زمنية محددة سابقاً:
- 5 خيارات: Today, Last 7 Days, Last Month (المختار افتراضياً), Last 12 Months, All Time.
- يعرض الخيار المختار مع أيقونة تقويم وسهم.
- يُغلق بالنقر خارج القائمة أو Escape.

---

### Tooltip

نصيحة منبثقة (Tooltip) تظهر عند تمرير/تركيز المؤشر:
- يقبل `children` (محتوى النصيحة)، `position` (top/right/bottom/left)، `size` (sm/md/lg)، `bg` (light/dark).
- أيقونة معلومات (i) تُشغّل النصيحة.

---

## بطاقات لوحة التحكم (Dashboard Cards)

### DashboardCard01 — "Acme Plus"
- **العنوان**: Acme Plus
- **القيمة**: $24,780
- **النسبة**: +49% (أخضر — ارتفاع)
- **الرسم**: خط بياني (LineChart) بخطين (بنفسجي + رمادي) يُظهر المبيعات من 12-2022 إلى 01-2025.
- **قائمة تحرير**: Option 1, Option 2, Remove.

### DashboardCard02 — "Acme Advanced"
- **العنوان**: Acme Advanced
- **القيمة**: $17,489
- **النسبة**: -14% (أحمر — انخفاض)
- **الرسم**: خط بياني مشابه.
- **قائمة تحرير**: Option 1, Option 2, Remove.

### DashboardCard03 — "Acme Professional"
- **العنوان**: Acme Professional
- **القيمة**: $9,962
- **النسبة**: +49% (أخضر)
- **الرسم**: خط بياني مشابه.
- **قائمة تحرير**: Option 1, Option 2, Remove.

### DashboardCard04 — "Direct VS Indirect"
- **الرسم**: أعمدة (BarChart) بمجموعتين:
  - Direct (أزرق سماوي)
  - Indirect (بنفسجي)
- **البيانات**: 6 فترات من 12-2022 إلى 05-2023.

### DashboardCard05 — "Real Time Value"
- **الرسم**: خط بياني مباشر (RealtimeChart) يُحدّث كل ثانيتين تلقائياً.
- يضيف نقطة بيانات جديدة كل 2 ثانية.
- يحتوي على إشارة "Built with Chart.js".

### DashboardCard06 — "Top Countries"
- **الرسم**: دائري (DoughnutChart) يُظهر توزيع الدول.
- بيانات تجريبية للدول الأكثر نشاطاً.

### DashboardCard07 — "Top Channels"
- **قائمة قنوات** مع نسب مئوية وشريط تقدّم لكل قناة:
  - Facebook
  - Google (organic)
  - قنوات إضافية (مثل Twitter/X، إلخ).
- كل قناة لها أيقونة مخصّصة ولون.

### DashboardCard08 — "Sales Over Time (all stores)"
- **الرسم**: خط بياني (LineChart02) يُظهر المبيعات عبر كل المتاجر مع تدرّج لوني.
- يحتوي على منتقي فترة (DateSelect) في الرأس.

### DashboardCard09 — "Sales VS Refunds"
- **الرسم**: أعمدة (BarChart02) يقارن المبيعات بالاستردادات عبر فترات.

### DashboardCard10 — "Customers"
- **جدول عملاء** يحتوي على أعمدة:
  - العميل (صورة + اسم + بريد)
  - المبلغ الإجمالي (Total Spent)
  - آخر طلب (Last Order)
  - الحالة (Status: New/Returning)
  - زر تحرير (DropdownEditMenu)
- بيانات تجريبية لعدة عملاء.

### DashboardCard11 — "Reason for Refunds"
- **الرسم**: أعمدة (BarChart03) يُظهر أسباب الاسترداد مع نسبها.

### DashboardCard12 — "Recent Activity"
- **قائمة نشاطات** حديثة مع:
  - أيقونة لكل نشاط
  - نص وصف النشاط
  - الوقت المنقضي (مثل "2h", "1d").
- زر "View all" في الأسفل.

### DashboardCard13 — "Income/Expenses"
- **الرسم**: خط بياني (LineChart02) يقارن الدخل بالمصروفات.
- يحتوي على منتقي فترة (DateSelect) وأزرار تبديل (Income/Expenses/Net).

---

## الرسوم البيانية (Charts)

كل الرسوم مبنية على Chart.js v4 مع `chartjs-adapter-moment` لتنسيق التواريخ.

| المكوّن | النوع | الاستخدام |
|--------|------|-----------|
| `LineChart01.jsx` | خط بياني (Line) | DashboardCard01, 02, 03 |
| `LineChart02.jsx` | خط بياني مع تدرّج | DashboardCard08, 13 |
| `BarChart01.jsx` | أعمدة (Bar) | DashboardCard04 |
| `BarChart02.jsx` | أعمدة (Bar) | DashboardCard09 |
| `BarChart03.jsx` | أعمدة (Bar) | DashboardCard11 |
| `DoughnutChart.jsx` | دائري (Doughnut) | DashboardCard06 |
| `RealtimeChart.jsx` | خط مباشر (Realtime) | DashboardCard05 |

### ChartjsConfig.jsx
ملف إعدادات مركزي لـ Chart.js:
- يُسجّل إضافة `Tooltip`.
- يضبط الخط الافتراضي على "Inter".
- يُعرّف دالة `chartAreaGradient` لتوليد تدرّجات لونية لرسوم الخطوط.
- يُعرّف كائن `chartColors` بألوان النصوص/الشبكة/الخلفية/التلميحات لكل من الوضع الفاتح والداكن.

---

## الأدوات المساعدة (Utils)

### ThemeContext.jsx
- يُوفّر سياق الثيم (`currentTheme` + `changeCurrentTheme`).
- يحفظ الثيم في `localStorage` تحت مفتاح `theme`.
- يضيف/يحذف صنف `dark` على عنصر `<html>` لتطبيق Tailwind Dark Mode.
- يُعطّل الانتقالات (transitions) مؤقتاً عند تبديل الثيم لمنع وميض الألوان.

### Transition.jsx
مكوّن انتقال (Transition) مبني على `react-transition-group`:
- يُدير أصناف CSS للدخول/الخروج (enter/leave) مع تأثيرات حركية.
- يدعم الوضع المتداخل (parent/child transitions).
- يُستخدم في كل القوائم المنسدلة والنوافذ المنبثقة والنصائح.

### Info.jsx
مكوّن نصيحة (Info) مشابه لـ Tooltip:
- يعرض أيقونة معلومات (i).
- يُظهر محتوى منبثق عند التمرير/التركيز.

### Utils.js
دوال مساعدة للألوان:
- `getCssVariable(variable)`: يقرأ قيمة متغيّر CSS من الجذر (آمن عند عدم توفر `document`).
- `adjustColorOpacity(color, opacity)`: يضبط شفافية اللون (يدعم hex/hsl/oklch/rgb مع fallback آمن).
- دوال داخلية: `adjustHexOpacity`, `adjustHSLOpacity`, `adjustOKLCHOpacity`.

---

## نظام الألوان والثيم

- **الإطار**: Tailwind CSS v4 (مع `@tailwindcss/forms`).
- **الوضع الداكن**: عبر صنف `dark` على `<html>` (مدعوم من Tailwind).
- **اللون الأساسي (Primary)**: بنفسجي (violet) — يُستخدم للروابط النشطة والأيقونات المميّزة.
- **الألوان الدلالية**:
  - أخضر (green): قيم إيجابية (+%).
  - أحمر (red): قيم سلبية (-%) وإجراءات حذف.
  - رمادي (gray): نصوص ثانوية وحدود.
  - أزرق سماوي (sky): بيانات "Direct" في الرسوم.
- **الخط**: "Inter" كخط افتراضي للنصوص والرسوم.
- **الحاويات**: خلفية بيضاء (`bg-white`) في الوضع الفاتح ورمادية داكنة (`bg-gray-800`) في الوضع الداكن، مع زوايا مستديرة (`rounded-xl`) وظل خفيف (`shadow-xs`).
- **التباعد**: نظام 8px (Tailwind spacing scale).
- **الاستجابة**: نقاط توقف Tailwind (sm, md, lg, xl, 2xl) — الشريط الجانبي يصبح ثابتاً عند `lg+`، والشبكة تُعيد ترتيب البطاقات حسب عرض الشاشة.

---

*تم إنشاء هذه الوثائق تلقائياً من فحص كود المشروع.*

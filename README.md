![HOSSEIN HAFS Hero](https://raw.githubusercontent.com/HosseinYazdanpanah/project-ui-ai-temp/main/assets/HOSSEIN-HAFS-hero-overlay-1280x720.jpg)

<div align="center">

# HAFS — Hossein AI Freelance System

### AI-Assisted Freelance Project Operating System for Web Projects

**از اولین پیام کارفرما تا نیازسنجی، سناریو، معماری، توسعه، QA، امنیت، انتشار و تحویل نهایی — همه در یک Workflow مرحله‌به‌مرحله و قابل کنترل.**

![Status](https://img.shields.io/badge/status-active%20development-1677ff)
![Architecture](https://img.shields.io/badge/architecture-single--file%20web%20app-111827)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%2B%20CSS%20%2B%20JavaScript-f59e0b)
![Storage](https://img.shields.io/badge/storage-LocalStorage%20%2B%20JSON-22c55e)
![Direction](https://img.shields.io/badge/direction-RTL%20%2F%20Persian-06b6d4)

</div>

---

## درباره HAFS

**HAFS** مخفف **Hossein AI Freelance System** است؛ یک سیستم مدیریت فرایند فریلنسری برای پروژه‌های وب که با هدف تبدیل یک روند پراکنده و وابسته به حافظه به یک **فرایند ساختاریافته، قابل پیگیری، قابل بازبینی و قابل توسعه** ساخته شده است.

این پروژه فقط یک فرم ثبت اطلاعات یا Todo List نیست. HAFS تلاش می‌کند تمام تصمیم‌های مهم یک پروژه را از لحظه ورود مشتری تا تحویل نهایی در یک مسیر مشخص نگه دارد؛ به‌طوری‌که نیازهای مشتری، پیشنهادهای حرفه‌ای، تصمیم‌های معماری، Promptهای توسعه، کنترل کیفیت و مراحل انتشار از یکدیگر جدا و قابل مدیریت باشند.

هسته اصلی سیستم بر سه اصل بنا شده است:

- **Plan before Code** — قبل از Coding، Scope و معماری باید روشن باشند.
- **Human Approval** — تصمیم‌های مهم بدون تأیید Project Owner نهایی نمی‌شوند.
- **Business before Features** — هر Feature باید یک نیاز واقعی کسب‌وکار یا کاربر را حل کند.

---

# چرا HAFS ساخته شد؟

در پروژه‌های فریلنسری وب، بخش بزرگی از خطاها الزاماً از Coding ضعیف ایجاد نمی‌شوند؛ بلکه معمولاً از مواردی مثل نیازسنجی ناقص، Scope مبهم، تصمیم‌های ثبت‌نشده، اضافه شدن Featureهای غیرضروری، نبود QA، ضعف در تحویل و تغییرات بدون کنترل ناشی می‌شوند.

HAFS برای کاهش همین مشکلات طراحی شده است.

هدف این است که پاسخ سؤال‌های مهم پروژه همیشه مشخص باشد:

- کارفرما دقیقاً چه چیزی خواسته است؟
- چه چیزهایی فقط پیشنهاد حرفه‌ای ما هستند؟
- چه چیزهایی هنوز فرض محسوب می‌شوند؟
- چه تصمیم‌هایی نیازمند تأیید کارفرما هستند؟
- MVP پروژه چیست؟
- چه Featureهایی Optional یا Future هستند؟
- معماری قبل از Coding چگونه تعریف شده است؟
- Codex در هر مرحله دقیقاً چه کاری باید انجام دهد؟
- چه تست‌هایی قبل و بعد از Deployment انجام شده‌اند؟
- چه مواردی در زمان Handover باید تحویل داده شوند؟

---

# Workflow اصلی

HAFS پروژه را به یک Workflow مشخص تقسیم می‌کند:

```text
PROJECT FOUND
      ↓
PROJECT INTAKE
      ↓
CLIENT INTERVIEW
      ↓
REQUIREMENT INTELLIGENCE
      ↓
SITE CLASSIFICATION
      ↓
SITE DNA
      ↓
SCENARIO & ARCHITECTURE
      ↓
CODEX PROMPT PACK
      ↓
BUILD
      ↓
QA #1 — PRE-DEPLOYMENT
      ↓
SECURITY GATE #1
      ↓
PREVIEW / DEPLOYMENT
      ↓
QA #2 — PRODUCTION
      ↓
SECURITY GATE #2
      ↓
SEO / AEO / GEO
      ↓
PERFORMANCE & MONITORING
      ↓
CLIENT HANDOVER
      ↓
MAINTENANCE / FUTURE DEVELOPMENT
```

هر مرحله باید قبل از عبور به مرحله بعد بررسی و تأیید شود.

---

# مراحل اصلی Wizard

رابط فعلی HAFS شامل 10 مرحله اصلی است:

```text
01 — Project Intake
02 — Client Interview
03 — Classification & Site DNA
04 — Scenario & Architecture
05 — Codex Prompts
06 — Build
07 — QA #1 + Security #1
08 — Preview & Deployment
09 — QA #2 + Security #2 + SEO / Performance
10 — Client Handover
```

Dashboard همیشه نقطه شروع و مرکز کنترل پروژه است.

---

# 1. Project Intake

این بخش برای ثبت اطلاعات اولیه و خام پروژه استفاده می‌شود.

اطلاعات به چهار دسته اصلی تقسیم می‌شوند:

### ✅ Client Requirement
مواردی که کارفرما صریحاً درخواست کرده است.

### 💡 Professional Recommendation
مواردی که براساس تجربه، تحلیل کسب‌وکار، UX، امنیت یا معماری پیشنهاد می‌شوند.

### ⚠️ Temporary Assumption
فرض‌هایی که برای ادامه تحلیل موقتاً در نظر گرفته شده‌اند اما هنوز تأیید نشده‌اند.

### ❓ Client Decision Required
مواردی که بدون تصمیم مستقیم کارفرما نمی‌توان نهایی کرد.

این جداسازی کمک می‌کند پیشنهاد حرفه‌ای تیم با درخواست واقعی مشتری اشتباه نشود.

---

# 2. Client Interview

HAFS مصاحبه مشتری را از یک فرم ثابت و طولانی جدا می‌کند.

سؤال‌ها براساس پروژه طراحی می‌شوند و می‌توانند در چهار گروه قرار بگیرند:

### Critical Questions
سؤال‌هایی که بدون پاسخ آن‌ها Scope پروژه قابل نهایی شدن نیست.

### Important Questions
اطلاعاتی که کیفیت طراحی، UX، معماری و تصمیم‌گیری را افزایش می‌دهند.

### Optional Questions
سؤال‌هایی که برای امکانات پیشرفته، توسعه آینده یا جزئیات تکمیلی مطرح می‌شوند.

### Technical Decisions
تصمیم‌هایی که بهتر است توسط تیم فنی گرفته شوند و نیازی نیست کارفرما با جزئیات غیرضروری فنی درگیر شود.

---

# Business, Sales & Marketing Discovery

در HAFS نیازسنجی فقط به سؤال‌هایی مثل «چه صفحاتی می‌خواهید؟» یا «چه رنگی دوست دارید؟» محدود نمی‌شود.

فرایند مصاحبه می‌تواند اطلاعات زیر را استخراج کند:

- Business Model
- Revenue Model
- Target Audience
- Customer Persona
- Sales Funnel
- Conversion Path
- Customer Objections
- Competitive Advantage
- Acquisition Channels
- Existing Marketing Channels
- Lead Generation
- Conversion Goals
- Retention Strategy
- Upsell / Cross-sell Opportunities
- Future Growth

### نمونه سؤال بهتر

به‌جای:

```text
چه سایتی می‌خواهید؟
```

پرسیده می‌شود:

```text
اگر خیلی ساده توضیح بدهید، انتظار دارید این سایت چه تغییری در کسب‌وکارتان ایجاد کند؟
```

و به‌جای:

```text
CRM می‌خواهید؟
```

سؤال کسب‌وکاری مطرح می‌شود:

```text
آیا لازم دارید اطلاعات مشتری، سفارش‌ها، تماس‌ها و پیگیری‌ها در یک محل ثبت و مدیریت شوند؟
```

هدف این است که **Feature از روی نیاز کشف شود، نه اینکه ابتدا Feature پیشنهاد شود و بعد برای آن دلیل پیدا کنیم.**

---

# 3. Website Classification & Site DNA

هر پروژه می‌تواند براساس ماهیت واقعی خود دسته‌بندی شود.

یک نمونه Site DNA:

```text
BASE
E-Commerce

BUSINESS
B2C

SYSTEM
Website + Internal Business Management System

COMMERCE
Products
Categories
Search
Cart
Checkout
Orders
Payments

MANAGEMENT
Admin Dashboard
Inventory
Customers
CRM-lite
Reports

CONTENT
CMS
Blog

GROWTH
SEO
Analytics
Coupons

AUTOMATION
SMS
Email
n8n

DEPLOYMENT
Preview
Production
```

Site DNA یک نمای سریع از ماهیت پروژه می‌دهد و برای تصمیم‌گیری درباره Scope، معماری و اولویت Featureها استفاده می‌شود.

---

# Project Types

HAFS یک پروژه را الزاماً «سایت ساده» یا «فروشگاه» فرض نمی‌کند.

پروژه می‌تواند یکی از این مدل‌ها باشد:

1. **Website**
2. **Web Application**
3. **Website + Internal Business Management System**
4. **Platform**

ساخت SaaS، Multi-Tenant Platform یا Site Builder فقط زمانی منطقی است که واقعاً جزو نیاز پروژه باشد.

---

# 4. Project Scenario

قبل از شروع Coding، پروژه به چند سناریوی قابل بررسی تقسیم می‌شود.

## Business Scenario

- Business Goal
- Business Model
- Audience
- Value Proposition
- Success Metrics
- Revenue Logic

## User Scenario

- User Roles
- Permissions
- User Journey
- Customer Journey
- Staff Journey
- Admin Journey

## Pages Scenario

نمونه:

```text
Public
├── Home
├── About
├── Services
├── Shop
├── FAQ
└── Contact

Authentication
├── Login
├── Register
└── Password Recovery

Customer
├── Dashboard
├── Profile
└── Orders

Admin
├── Dashboard
├── Products
├── Orders
├── Customers
└── Reports
```

## Feature Scenario

Featureها براساس اولویت دسته‌بندی می‌شوند:

- **Required** — ضروری برای عملکرد اصلی پروژه
- **Recommended** — پیشنهاد حرفه‌ای برای کیفیت بهتر
- **Optional** — مفید اما غیرضروری برای Launch
- **Future** — مناسب فازهای بعدی

این مدل برای کنترل Feature Creep بسیار مهم است.

---

# 5. Architecture Planning

قبل از Coding، Architecture Blueprint پروژه مشخص می‌شود.

موارد قابل تعریف:

- Frontend
- Backend
- Database
- Authentication
- Authorization
- API
- Storage
- Search
- Payments
- Notifications
- Integrations
- Automation
- Deployment
- Monitoring
- Logging
- Backup
- Security Model

اصل مهم:

> **Hosting نباید معماری پروژه را تعیین کند؛ Hosting باید براساس معماری انتخاب شود.**

---

# 6. UI / UX Planning

HAFS برای تصمیم‌های طراحی نیز فضای مشخص دارد.

موارد قابل ثبت:

- Visual Direction
- Brand Personality
- Design System
- Typography
- Spacing
- Components
- Responsive Rules
- Mobile-first Decisions
- RTL Support
- Accessibility
- Loading States
- Empty States
- Error States
- Success States
- Micro-interactions

هدف این است که Design فقط مجموعه‌ای از صفحات زیبا نباشد، بلکه یک سیستم منسجم و قابل توسعه باشد.

---

# 7. Codex Prompt Pack

به‌جای ارسال یک Prompt مبهم مثل:

```text
Build the entire project.
```

HAFS پروژه را به Promptهای مرحله‌ای تقسیم می‌کند.

نمونه ساختار:

```text
00 — Project Context
01 — Architecture
02 — Initialization
03 — Design System
04 — Layout
05 — Database
06 — Authentication
07 — Core Features
08 — Admin Panel
09 — Business Management
10 — Integrations
11 — Payments
12 — Automation
13 — SEO / AEO / GEO
14 — Security
15 — Performance
16 — Testing
17 — Bug Fixing
18 — Deployment
19 — Documentation
```

هر Prompt می‌تواند شامل موارد زیر باشد:

- Context
- Objective
- Scope
- Constraints
- Existing Architecture
- Files Allowed To Change
- Acceptance Criteria
- Tests
- Definition of Done
- Do-Not-Break Rules

این ساختار باعث می‌شود توسعه قابل کنترل‌تر و قابل بازبینی‌تر باشد.

---

# 8. Build Management

Build Checklist برای پیگیری مراحل توسعه استفاده می‌شود.

Checklistها **اجباری نیستند**؛ فقط موارد مرتبط با پروژه انتخاب می‌شوند.

یک پروژه کوچک ممکن است چند مورد محدود داشته باشد، در حالی که یک Web Application پیچیده می‌تواند ده‌ها مرحله Build داشته باشد.

هدف Checklist، ایجاد محدودیت مصنوعی نیست؛ هدف این است که وضعیت پروژه فراموش نشود.

---

# 9. QA #1 — Pre-Deployment Testing

قبل از انتشار، پروژه از چند زاویه بررسی می‌شود.

## Functional QA

- Navigation
- Forms
- Authentication
- Authorization
- Database Operations
- APIs
- Payments
- Search
- Filters
- Uploads
- Notifications
- Business Logic

## UX QA

- Desktop
- Tablet
- Mobile
- Responsive Behavior
- Accessibility
- Loading States
- Empty States
- Error States

## Code QA

- Production Build
- TypeScript
- Lint
- Console Errors
- Broken Imports
- Routes
- Dependencies
- Broken Links

## Edge Cases

- Network Failure
- Duplicate Submission
- Expired Session
- Invalid Input
- Out-of-Stock State
- API Failure
- Database Failure

---

# Security Gate #1

قبل از Production، موارد امنیتی مرتبط با پروژه بررسی می‌شوند.

نمونه موارد:

- Authentication
- Authorization
- Session Security
- IDOR / Broken Access Control
- Input Validation
- XSS
- CSRF
- SSRF
- Injection
- API Security
- Webhook Verification
- File Upload Security
- Secret Leakage
- Dependency Vulnerabilities
- CORS
- CSP
- Security Headers
- Rate Limiting
- Secure Cookies

> تست امنیتی و Penetration Testing فقط روی سیستم‌هایی انجام می‌شود که مالک آن هستیم یا برای تست آن‌ها مجوز صریح داریم.

---

# 10. Preview & Deployment

HAFS بین Preview و Production تفاوت قائل می‌شود.

## Preview

برای:

- Internal QA
- Client Review
- Testing
- Debugging
- Approval

## Production

برای نسخه نهایی قابل استفاده کاربران.

پلتفرم Deployment می‌تواند براساس پروژه متفاوت باشد، برای مثال:

- Vercel
- Netlify
- DashPloy
- Railway
- Render
- Cloudflare
- VPS

---

# QA #2 — Post-Deployment Testing

بعد از انتشار، تست‌ها در محیط واقعی دوباره بررسی می‌شوند.

موارد رایج:

- Domain
- DNS
- HTTPS / SSL
- Redirects
- Environment Variables
- Production Database
- Storage
- Authentication
- OAuth
- API
- Uploads
- Payments
- Callbacks
- Webhooks
- Email
- SMS
- Admin Panel
- Browser Compatibility
- Mobile Devices

---

# Security Gate #2

در Production بررسی‌های غیرمخرب انجام می‌شوند.

نمونه:

- TLS / Certificate
- HSTS
- CSP
- CORS
- Security Headers
- Debug Endpoint Exposure
- Admin Exposure
- Storage Exposure
- Backup Exposure
- Source Map Policy
- Sessions
- API Authorization
- Rate Limiting
- Sensitive Error Messages

تست‌های مخرب، High-volume یا Stress Testing باید روی Staging انجام شوند.

---

# SEO / AEO / GEO

HAFS سه حوزه را جدا در نظر می‌گیرد.

## SEO — Search Engine Optimization

- robots.txt
- sitemap.xml
- Canonical URLs
- Metadata
- Titles / Descriptions
- Open Graph
- Structured Data
- Schema.org
- Internal Linking
- Redirects
- HTTP Status Codes
- Indexability
- Custom 404

## AEO — Answer Engine Optimization

- FAQ Structure
- Clear Questions & Answers
- Semantic Content
- Direct Answers
- Structured Information

## GEO — Generative Engine Optimization

- Entity-rich Content
- Structured Facts
- Clear Brand Information
- Product / Service Information
- Reliable Page Structure
- Concise Summaries

---

# Performance

موارد قابل بررسی:

- Core Web Vitals
- LCP
- CLS
- INP
- Image Optimization
- Font Optimization
- Lazy Loading
- Code Splitting
- Caching
- CDN
- API Performance
- Database Performance

---

# Monitoring

بعد از Launch می‌توان موارد زیر را پایش کرد:

- Uptime
- Errors
- Performance
- Traffic
- Conversions
- Broken Links
- Security Events
- Database Health
- Search Indexing

---

# Client Handover

Handover حرفه‌ای می‌تواند شامل موارد زیر باشد:

- Production URL
- Admin URL
- Repository
- Secure Credential Transfer
- Admin Guide
- Architecture Summary
- Environment Variable Guide
- Deployment Guide
- Backup Guide
- Maintenance Guide
- Database Information
- Third-party Services
- Domain Information
- Known Limitations
- Future Roadmap

Secretها نباید داخل Documentation عمومی یا Repository ذخیره شوند.

---

# Maintenance & Recurring Services

HAFS پروژه را با Handover تمام‌شده فرض نمی‌کند.

خدمات بعد از تحویل می‌توانند شامل موارد زیر باشند:

- Website Maintenance
- Security Updates
- Backups
- Monitoring
- Performance Optimization
- SEO
- Content
- Analytics
- Digital Marketing
- Automation
- AI Integration
- Feature Development

این بخش می‌تواند پروژه یک‌باره را به یک رابطه بلندمدت با مشتری تبدیل کند.

---

# Fullscreen Editor

Textareaهای مهم دارای Fullscreen Editor هستند تا نوشتن و بررسی متن‌های طولانی راحت‌تر باشد.

امکانات:

- Fullscreen Editing
- Copy
- Character Counter
- Word Counter
- Save & Close
- Keyboard Shortcuts

مناسب برای:

- Client Requirements
- Scenario
- Site DNA
- Architecture
- Codex Prompts
- Deployment Notes

---

# Sample Templates

بخش‌های مهم دارای متن یا Template نمونه هستند تا کاربر از یک صفحه کاملاً خالی شروع نکند.

نمونه‌ها فقط راهنما هستند و می‌توان آن‌ها را متناسب با پروژه واقعی جایگزین کرد.

Checklistها و Module Selection نیز Presetهای نمونه دارند.

---

# Optional Checklists

Checkboxها برای نمایش «موارد مرتبط با پروژه» هستند و اجبار Workflow ایجاد نمی‌کنند.

یک Checkbox خالی می‌تواند به این معنا باشد:

- Not Required
- Not Selected
- Not Applicable
- Review Later

بنابراین برای رفتن به مرحله بعد لازم نیست همه گزینه‌ها انتخاب شوند.

---

# Auto Save

نسخه فعلی اطلاعات پروژه را در Browser ذخیره می‌کند.

```text
LocalStorage
```

این روش برای نسخه Single-User فعلی سبک و بدون Backend مناسب است.

> LocalStorage جایگزین Database، Cloud Backup یا Collaboration Backend نیست.

---

# Full Project Import / Export

HAFS از Backup کامل پروژه با JSON پشتیبانی می‌کند.

Export شامل موارد زیر است:

- تمام Inputها
- تمام Textareaها
- تمام Selectها
- Module Selections
- Checklists
- Approval States
- Approval Timestamps
- Current Wizard Step
- Workflow State
- Generated Codex Output
- Handover Output

فرمت فعلی Backup:

```text
HAFS_FULL_PROJECT
```

Workflow نمونه:

```text
Export
   ↓
Backup
   ↓
Reset
   ↓
Import
   ↓
Full Project Restore
```

قبل از Import، وضعیت فعلی پروژه نیز به‌صورت Local Backup نگهداری می‌شود تا احتمال از دست رفتن داده کاهش پیدا کند.

---

# Approval System

اصل مهم سیستم:

```text
Complete
   ↓
Review
   ↓
Approve
   ↓
Continue
```

Approval برای جلوگیری از عبور ناخواسته از تصمیم‌های مهم طراحی شده است.

---

# Focus Mode

برای کار روی متن‌ها و سناریوهای طولانی، Focus Mode می‌تواند Sidebar را کنار بگذارد و محیط کاری بزرگ‌تری ایجاد کند.

---

# فناوری‌های نسخه فعلی

```text
HTML5
CSS3
Vanilla JavaScript
LocalStorage
JSON
```

نسخه فعلی بدون Framework و Dependency خارجی اجرا می‌شود.

مزیت این معماری برای Prototype فعلی:

- اجرای مستقیم
- Deploy ساده
- عدم نیاز به Build
- Portability بالا
- Debugging آسان‌تر

---

# Project Structure

```text
project-ui-ai-temp/
│
├── index.html
├── README.md
├── vercel.json
│
├── assets/
│   ├── HOSSEIN-HAFS-hero-overlay-1280x720.jpg
│   └── ...
│
├── api/
│   └── ...
│
└── .github/
    └── ...
```

هسته رابط فعلی در `index.html` قرار دارد.

---

# اجرای Local

برای نسخه فعلی Build ضروری نیست.

روش ساده:

```bash
git clone https://github.com/HosseinYazdanpanah/project-ui-ai-temp.git
cd project-ui-ai-temp
```

سپس `index.html` را با Browser باز کنید.

برای Development بهتر می‌توان از یک Static Server محلی استفاده کرد.

نمونه:

```bash
npx serve .
```

---

# Deployment

به دلیل Static بودن هسته فعلی، پروژه را می‌توان روی سرویس‌های مختلف Deploy کرد.

نمونه:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- DashPloy
- Static Hosting

Deployment نهایی باید با نیازهای نسخه آینده پروژه هماهنگ شود.

---

# Data & Privacy

نسخه فعلی برای پروژه‌های واقعی می‌تواند شامل اطلاعات تجاری مشتری باشد؛ بنابراین رعایت اصول Privacy مهم است.

نباید Secretهای زیر داخل HTML، README یا Repository عمومی قرار داده شوند:

- Passwords
- API Keys
- Access Tokens
- Database Credentials
- Payment Secrets
- Private Client Credentials

اگر اطلاعات واقعی مشتری داخل HAFS ثبت می‌شود، نسخه Online بهتر است Private یا Protected باشد.

---

# Design Principles

### Plan Before Code
قبل از توسعه، نیاز و معماری مشخص شوند.

### Business Before Features
هر Feature باید دلیل روشن داشته باشد.

### Human Approval
AI یا Automation نباید تصمیم‌های اصلی را بدون تأیید انسان نهایی کند.

### No Feature Bloat
تعداد بیشتر قابلیت‌ها الزاماً محصول بهتری ایجاد نمی‌کند.

### Security by Design
امنیت باید از ابتدا جزئی از معماری باشد.

### QA Before Release
Release بدون Testing مناسب نباید انجام شود.

### Maintainability
خروجی باید قابل نگهداری و توسعه باشد.

### Client Ownership
مالکیت Domain، Repository، Accounts و سرویس‌های اصلی باید شفاف باشد.

---

# Roadmap

برخی قابلیت‌هایی که برای نسخه‌های آینده قابل بررسی هستند:

- AI Client Interview Assistant
- Sales Conversation Assistant
- Dynamic Question Generator
- Requirement Intelligence Engine
- Automatic Site Classification
- Site DNA Generator
- AI Scenario Generator
- Architecture Assistant
- Advanced Codex Prompt Generation
- Multi-Project Workspace
- Version History
- Draft / Review / Approved States
- Project Timeline
- Cost Estimation
- Proposal Generator
- Contract Generator
- Invoice Generator
- Client Portal
- Collaboration
- Cloud Persistence
- GitHub Integration
- Vercel Integration
- Netlify Integration
- DashPloy Integration
- Automated QA
- Security Scanner
- SEO Audit
- Lighthouse Integration
- CRM
- Follow-up System
- Analytics Dashboard

Roadmap بیانگر جهت توسعه است و الزاماً نشان‌دهنده قابلیت موجود در نسخه فعلی نیست.

---

# Vision

چشم‌انداز HAFS تبدیل شدن به یک **AI-assisted Freelance Operating System** است که بتواند یک پروژه را از ورودی خام مشتری تا تحویل نهایی، با نظارت و تأیید انسان مدیریت کند.

```text
Client Message
      ↓
Requirement Analysis
      ↓
Client Interview
      ↓
Business Analysis
      ↓
Site Classification
      ↓
Site DNA
      ↓
Scenario
      ↓
Architecture
      ↓
Codex Prompt Pack
      ↓
Development
      ↓
QA
      ↓
Security
      ↓
Deployment
      ↓
SEO / Performance
      ↓
Monitoring
      ↓
Handover
```

هدف نهایی حذف نقش انسان نیست؛ هدف این است که AI کارهای تحلیلی، تکراری و ساختاری را تسهیل کند و تصمیم‌های اصلی همچنان تحت کنترل Project Owner باقی بمانند.

---

# Project Owner

**Hossein Yazdanpanah**

```text
Project Owner
Client Lead
Final Decision Maker
```

برند:

**HOSSEIN — AI • WEB • AUTOMATION**

---

# Current Status

```text
Project: HAFS
Full Name: Hossein AI Freelance System
Status: Active Development
Current Architecture: Single-File Web Application
Primary Language: Persian / RTL
Secondary Language: English Technical Terms
Primary Use: Freelance Web Project Workflow Management
Persistence: Browser LocalStorage + JSON Backup
Repository: project-ui-ai-temp
```

---

<div align="center">

## HAFS

### From the first client message to final delivery.

**Think • Analyze • Plan • Approve • Build • Test • Secure • Deploy • Grow**

<br>

**HOSSEIN — AI • WEB • AUTOMATION**

</div>

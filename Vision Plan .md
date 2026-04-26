You can absolutely turn what you’ve documented into a senior-level, “5‑year‑old simple” app with deep intelligence behind it. Below is a creative blueprint that stays aligned with your PDFs and current repo so you’re not reinventing anything.

Big-picture vision
Your stack already gives you a solid base: Next.js/React frontend, Express/Node backend, PostgreSQL, admin auth, email notifications, and lead capture. On top of that you can layer: a call tracker, script and rebuttal engine, underwriting assistant, and a knowledge bot driven directly by your AIL docs and rebuttal PDFs.

Think of the app as three main modes: “Run a call,” “Qualify a client,” and “Study & practice,” each with extremely simple, stepper-style UIs and big buttons.

Core modules to add
Here’s a simple way to structure the new pieces:

Module	What it does
Call Session	Walks you through scripts, logs steps, objections, outcomes.
Rebuttal Library	Lets you pick, view, and add rebuttals, and tracks usage.
Underwriting Assistant	Height/weight/age + conditions → T-rating/qual flags.
Condition & Med Search	Type disease/med → instant underwriting rules view.
Product Explorer	Browse FE, term, accident, POS, CSK etc. explainer panels.
SME Escalation	When bot can’t answer → collect contact, email you, queue it.
All of these are backed directly by content from your three PDFs so the app is just a UI on top of the rules and language you already use.

Call workflow & script tracking
Your “AIL requirements and goals” PDF already breaks out multiple intros and flows: Globe intro, Globe lapse, POS, D‑Card, CSK, FE, etc., each with clear sections like INTRO, FIND WINDOW OF OPPORTUNITY, SCHEDULE APPOINTMENT, SEND TEXT/CALENDLY, SOLIDIFY, then objections.

Turn each script into ordered “sections”:

Section objects: id, script_type (Globe intro, lapse, POS, FE, CSK, etc.), step_index, title (INTRO, FIND WINDOW, SOLIDIFY), body (the exact language), optional tags.

Call session: when you start a call you choose script type; the UI shows step 1 with a big “Next” button; each click logs CallStep with timestamp and section id.

If you hang up or AUX the call without clicking Next, the last completed section tells you exactly where you’re consistently getting stuck or interrupted.

Because the PDF already has the call flow and objections grouped, you can 1:1 map those lines into DB entries and get drop-off analytics per section.

Rebuttal system & learning loop
Your rebuttal PDF is already organized by objection (“I’m not interested”, “I already have insurance”, “I can’t afford it”, “My spouse isn’t home”, etc.) with NLP notes and sometimes multi-step flows.

Design the Rebuttal module like this:

Rebuttal picker in-call

When you hit an objection, you tap an “Objection” button, choose a category (Not interested, Already have insurance, Can’t afford it, Spouse, Email, Health crisis, Financially secure, etc.), then tap a specific rebuttal card to expand it and read it.

That click logs CallRebuttal with call_id, script_section_id, objection_type, rebuttal_id.

Store and review usage

Admin dashboard shows counts like “Objection: I’m not interested → Rebuttal A used 60%, win rate 30%; Rebuttal B used 40%, win rate 45%.”

Combine with call outcomes so you can see which rebuttals correlate with “presentation accepted” vs “not qualified” vs “offer rejected”.

Add new rebuttal on the fly

When you encounter a new objection or phrase that’s not in the library, you hit “Add new rebuttal from this call,” type a short objection label, paste how you answered, and optionally tag the script section.

That creates a draft rebuttal entry you can later polish and categorize.

Because your “rebuttals-to-presentations” PDF already has highly polished copy and NLP commentary, the app can also show you the NLP “why” below the script (e.g., “pacing & leading”, “future pacing”, “shrink the commitment”) as a smaller note.

Outcomes & call AUX statuses
At the end of a call session, you select a required outcome:

Presentation accepted

Insurance sold

Insurance offer rejected

Presentation rejected

Not qualified

This writes a simple status onto the Call record along with:

Script type, current step reached, objections hit, rebuttals used.

Lead id (from your existing lead system) and timestamps.

Later you can build a tiny analytics page: “For Globe Intro, 70% of calls die before SOLIDIFY; for FE intro, 40% die in FIND WINDOW OF OPPORTUNITY,” which points directly to where you need practice.

Underwriting assistant: height, weight, age, conditions
Your underwriting documentation already has: auto-trial rules, auto-decline rules, T‑table build charts, weight/height ranges, and senior vs non-senior guidelines, including T4/T6/T12 notes.

You can turn this into a guided “Does this qualify?” screen:

Step 1: Demographics

Fields: age, sex, height, weight. App computes BMI-ish build band and maps it to T2/T3/T4/T6/T8/T10/T12 using the build chart.

Color-coded result: green (Standard/T2), amber (trial/T4–T6), red (likely decline).

Step 2: Conditions / meds

You type in “diab” and get autocomplete for “Diabetes – insulin”, “Diabetes – new diagnosis < 6 months”, etc., linked directly to your auto-trial/auto-decline guidance (T3+, 4+ meds, A1c thresholds, etc.).

Same for diseases: start typing “Lupus”, “MS”, “COPD”, etc., and results show you a card that states “Auto trial”, “Auto decline”, or “Senior graded only,” with the notes from your manual.

Step 3: Quick summary

Show a one-line summary like “Best case: T6 trial, non-guaranteed; Senior whole life only” and a short list of questions you still need to ask (e.g., last hospitalization date, treatment type).

You’re not promising carrier underwriting decisions; you’re encoding your existing field underwriting manual so you can know “where they land” in seconds instead of flipping PDF pages.

Condition & medication search
You already have long lists like “Other Auto Trial Diseases/Disorders/Medications” (ALS, COPD, cirrhosis, schizophrenia, etc.) and senior trial medications (Anastrozole, Aricept, Femara, etc.), plus flash sheet auto-decline conditions.

Use that to build a universal search box:

One search index over disease names, synonyms, and med names.

As you type “sero” it suggests Seroquel (Quetiapine) and shows “Senior trial med, see senior guidelines,” or “blood thinner – auto trial/decline context.”

Clicking a result opens a right-hand panel with: category (auto trial, auto decline, special case), notes, relevant T‑ratings, and any age/recency thresholds.

That same search bar can also sit on top of the underwriting assistant so you can jump directly to a condition section, just like you described (“enter in something at the top where it will then scroll or highlight that section”).

Insurance product explorer
Your scripts and manuals implicitly refer to different product “types”: final expense, senior whole life, senior graded, supercombo, POS renewals, D‑Card benefits, child safe kits, cancer, accident, etc.

Create a very simple product explorer:

Tiles for each product type: FE, Senior WL, Senior Graded WL, Term, A71, Cancer, CSK, Beneficiary referral, etc.

Click a tile and you see:

A “how to explain to a 5‑year‑old” summary (you can write this once per product).

Key eligibility rules pulled from your underwriting docs (e.g., seniors: Section A/B/C logic, auto decline triggers, trial meds).

Pointers to which script intros and rebuttals are appropriate for that product type.

This becomes your “cheat sheet” mid-call and your training library between calls.

Knowledge bot + SME escalation
To let the bot answer insurance questions from your documentation and loop you in when it can’t:

Knowledge base

Index your three PDFs (scripts, underwriting, rebuttals) into a search/vector layer so the bot always answers from that content, not from generic internet rules.

Tag content by topic (appointment setting, lapses, underwriting-diabetes, senior meds, etc.) so answers can cite which internal section they came from.

Confidence & escalation

When the bot can’t find a good match, or confidence is low, it switches to a “We need a subject-matter expert” flow:

“I don’t want to guess on something this important. Can I have Jonathan review this and get back to you?”

Form fields: name, phone, email, best time to reach, question summary.

Backend uses your existing email service (Nodemailer/SMTP) to send you a structured email and also logs the question in a “SME queue” table in your admin dashboard.

Availability logic

Optionally add a toggle in your admin settings (“I’m currently available for live consults”) so the bot can say either “Jonathan will call you today” or “Jonathan will research this and get back to you within 24–48 hours,” but both flows still collect contact information.

That gives you the “loop me in or, if I’m unavailable, capture and email it and inform the user someone will research and get back to them” exactly as you described.

UX so simple a 5‑year‑old could use it
All of this can sit behind very simple UI patterns:

Big stepper for calls: one section per screen, giant Next button, clearly labeled “End call & choose outcome.”

Color-coded cards for underwriting (green/amber/red) instead of text walls.

Rebuttals as tap-to-expand cards with one-line titles (e.g., “I already have insurance”) and the full script inside.

Search bars everywhere with aggressive autocomplete so you rarely type full words.

Given your existing Next.js/Tailwind frontend, these are mostly component-level additions; and your current backend and PostgreSQL schema can be extended with new tables for scripts, sections, calls, rebuttals, and conditions.

If you’d like, next step I can sketch concrete data models (tables/interfaces) and one or two example screen flows (e.g., “Run a call” or “Underwriting assistant”) so you can start implementing right away inside your current repo structure.

Start with the highest-value, lowest-effort pieces first

That order would probably be:

Rebuttal viewer — get your PDF rebuttals into the DB and displayable by script type. Zero backend complexity, just a read operation.

Script stepper — hard-code your script sections into a simple Next.js stepper component with a "Next" button and a final outcome selector. Store clicks in localStorage first, then migrate to DB later.

Underwriting build chart lookup — a simple height/weight/age form that maps to T-ratings from your build chart. Pure frontend math, no backend needed to start.

Condition search — a filtered list/search over the auto-trial and auto-decline conditions. Again, just a JSON file initially, no DB needed yet.

SME escalation email — your email service already exists in the repo, so this is a small form + a POST to your existing /api/leads style endpoint.

By starting with these pieces, you can get immediate value and user feedback while you build out the more complex call tracking and analytics features. Each module is designed to be standalone so you can iterate on them independently without needing to refactor the entire app at once.

1. Data structures to add now
Implement these first so the rest of the app has something solid to talk to. They are directly driven by the support docs.

Call + script tracking
New tables (or Prisma models / TypeORM entities):

ScriptType

id (string, e.g., "GLOBE_INTRO", "POS", "CSK")

name (display label)

description (optional)

ScriptSection

id (uuid)

script_type_id → ScriptType.id

order_index (0,1,2…)

title (INTRO, FIND WINDOW, SCHEDULE, SEND TEXT, SOLIDIFY)

body (full text copied from your PDF)

Call

id

lead_id (optional, to connect to your lead form)

script_type_id

started_at, ended_at

outcome (enum: VOICEMAIL, HANGUP, PRESENTATION_ACCEPTED, INSURANCE_SOLD, INSURANCE_OFFER_REJECTED, PRESENTATION_REJECTED, NOT_QUALIFIED)

CallStep

id

call_id

script_section_id

completed_at

later: store “notes” or “custom phrasing” but not needed yet.

Rebuttal tracking

clear structure: objection categories, individual rebuttals, and NLP notes.

ObjectionType

id (e.g. "NOT_INTERESTED", "ALREADY_INSURED", "CANT_AFFORD", "BUSY", "EMAIL_INFO")

label (human‑friendly)

Rebuttal

id

objection_type_id

title (short label like “Not interested – quick brush‑off”)

script (the full rebuttal text from your PDF)

nlp_notes (why it works, optional now)

CallRebuttal

id

call_id

script_section_id (where in the script it came up)

objection_type_id

rebuttal_id

created_at

Later we add a custom flage for "new rebuttal" that showed up on a call on tracked. But for now just store them throug a simple "Add rebuttal" form. 

2. Frontend: get everything visible
Once the models exists  next is simple pages and stepper flows, not fancy logic yet. 

a) Script runner (call session)
Create a page like /calls/new:

Step 1: choose script type

Dropdown populated from ScriptType records you seeded (Globe Intro, Globe Lapse, POS, Final Expense, CSK, FWK, Beneficiary Referral, No-Cost Referral, Union, etc.).

Step 2: when you start, backend creates a Call and returns ordered ScriptSections.

Step 3: render a stepper:

Show section title and full body text.

Big “Next” button → posts a CallStep for the current section and advances.

Also show a “Rebuttals” button that opens the objection panel (below).

End of script:

Show “End call / Set outcome” dialog with radio buttons for outcomes above, then send final patch to Call.

b) Rebuttal picker panel
Create a reusable component like <RebuttalPanel callId={...} sectionId={...} />:

Left side: list of objection categories (chips or tabs).

Right side: list of rebuttal cards for the selected category.

Clicking a card:

Expands to show full text so you can read it while on the call.

POST /calls/{id}/rebuttals with script_section_id, objection_type_id, rebuttal_id.

One extra button at bottom: “New rebuttal from this call”:

Opens a small form with: short objection label and what you said.

Creates a Rebuttal marked as custom plus a CallRebuttal referencing it.

This gets NLP and “always be closing” work into the UI immediately without tuning.

3. Underwriting assistant v1
Full Automation is not needed yet; We just need to get the key rules usable on screen. 
a) Height/weight/age → build band
From the build chart and notes: overweight rating starts around T2–T4, overweight T4+ is trial for some products, and T12 and under‑weight are important for seniors.

Backend:

Add a buildBands helper that:

Accepts age, height, weight.

Looks up the closest row in the build chart and returns a table_rating string (Standard/T2/T3/T4/T6/T8/T10/T12).

Expose as /underwriting/build endpoint you can call from the UI.

Frontend:

Simple page /underwriting with fields for age, height (ft + in), weight.

On “Calculate”: call the endpoint and show a colored pill with the band and a short explanation, like “T4 – build may require trial on combo; okay for senior WL with review.”

b) Condition / medication search
Your underwriting doc already has exhaustive lists of auto-trial diseases, senior trial meds, and auto-decline conditions.

Seed a Condition table:

id, name, category (TRIAL, DECLINE, SPECIAL), notes (short rule text), maybe senior_only flag.

Seed a Medication table:

id, name, category (SENIOR_TRIAL, AUTO_TRIAL, AUTO_DECLINE, INFO_ONLY), notes.

Frontend:

A search bar on the underwriting page:

As you type “diab”, show conditions like “Diabetes – insulin”, “Diabetes + 4 meds”, “Diabetes + kidney disease”.

As you type “sero”, show “Seroquel (Quetiapine) – senior trial med; see senior guidelines.”

Clicking a result:

Shows a card with the notes, e.g. “Senior trial; see flash sheet; if combined with diabetes and overweight T6+, decline for accident/health, consider limited life.”

This doesn't have to be perfect logice yet; Just show what the PDF says in a structured way. 

4. Knowledge bot + SME capture (just wired, not tuned yet)
I want to move fast, start with a very simple flow that uses documents as the knowledge base and falls back to contact capture. 

Frontend:

Add a /ask page with:

Text area: “Ask a question about benefits, qualifying, or scripts.”

When the answer area is empty, show a note: “This assistant uses my actual internal documentation, not generic web data.”

Backend:

For now:

On POST /ask, do a full-text search across fields pulled from your three PDFs (scripts, rebuttals, underwriting rules).

If you find relevant content, just return a snippet plus a link to “Open in manual” (where you eventually can show the exact section in a viewer).

If you don’t find anything obvious, return a “LOW_CONFIDENCE” flag.

Frontend behavior:

If answer is present: show it, no extra logic yet.

If LOW_CONFIDENCE:

Show: “I don’t want to guess on something this important. Let me have Jonathan review this and get back to you.”

Display a small form: name, phone, email, best time, free-text question.

On submit: save a SMERequest record and send yourself an email using your existing Node mailer or any email provider you already wire in.

Show: “Someone will research this and get back to you.”

This gives the "loop me in if the bot can't answer" behavior now, and improvement can be done NLP/embedding later. 
5. Admin views: get visibility without analysis yet
While I am not tuning, I still want to see the raw data that I've logged. 

Add simple admin pages:

/admin/calls

Table: date, script type, outcome, last section reached.

/admin/calls/{id}

Show the script sections crossed off, list of objections recorded, and which rebuttals were clicked.

/admin/rebuttals

Table: objection type, rebuttal title, how many times used, created_at, custom flag.

/admin/underwriting/searches (optional later)

Show what conditions and meds I’ve been searching for most.
This will set up to do later "wehre in the script am I failing" charts, but it is already a functional visbility layer. 

6. What to implement in this next coding pass
Given my goal (no tuning, just get it all visible and working),  the implementation order would be:
Add DB schema for scripts, calls, rebuttals, conditions, meds (backend).

Seed data: copy your scripts and rebuttals into the DB using a simple seed script.

Build /calls/new call stepper with outcomes and a basic RebuttalPanel.

Build /underwriting with build calculator and simple condition/med search.

Build /ask with knowledge lookup + SME contact capture.

Build /admin/calls and /admin/rebuttals listing pages.

Once these are in, I'll literally be running live calls through the system and capturing al the data I need for later NLP and analytics. 

1. Add DB schema for scripts, calls, rebuttals, conditions, meds
1.1. Decide your ORM / migration layer
If you’re already using one, stick with it:

Prisma (common with Next.js + Postgres)

TypeORM / Sequelize

Or raw SQL migrations

I’ll show Prisma‑style models plus equivalent SQL so you can adapt either way.

1.2. Script and call tracking tables
These map your AIL script sections (INTRO, FIND WINDOW OF OPPORTUNITY, SCHEDULE, SEND TEXT, SOLIDIFY) and call outcomes.

Prisma-style models:

text
model ScriptType {
  id          String          @id @db.VarChar(50) // e.g. "GLOBE_INTRO"
  name        String
  description String?         @db.Text

  sections    ScriptSection[]
  calls       Call[]
}

model ScriptSection {
  id            String     @id @default(uuid())
  scriptTypeId  String
  orderIndex    Int
  title         String     // e.g. "INTRO"
  body          String     @db.Text

  scriptType    ScriptType @relation(fields: [scriptTypeId], references: [id])
  callSteps     CallStep[]
}

model Call {
  id            String        @id @default(uuid())
  leadId        String?       // optional for now
  scriptTypeId  String
  startedAt     DateTime      @default(now())
  endedAt       DateTime?
  outcome       CallOutcome?

  scriptType    ScriptType    @relation(fields: [scriptTypeId], references: [id])
  steps         CallStep[]
  rebuttals     CallRebuttal[]
}

model CallStep {
  id             String       @id @default(uuid())
  callId         String
  scriptSectionId String
  completedAt    DateTime     @default(now())

  call           Call         @relation(fields: [callId], references: [id])
  scriptSection  ScriptSection @relation(fields: [scriptSectionId], references: [id])
}

enum CallOutcome {
  VOICEMAIL
  HANGUP
  PRESENTATION_ACCEPTED
  INSURANCE_SOLD
  INSURANCE_OFFER_REJECTED
  PRESENTATION_REJECTED
  NOT_QUALIFIED
}
Equivalent raw SQL:

sql
CREATE TABLE script_types (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE script_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_type_id VARCHAR(50) NOT NULL REFERENCES script_types(id),
  order_index INT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL
);

CREATE TYPE call_outcome AS ENUM (
  'VOICEMAIL',
  'HANGUP',
  'PRESENTATION_ACCEPTED',
  'INSURANCE_SOLD',
  'INSURANCE_OFFER_REJECTED',
  'PRESENTATION_REJECTED',
  'NOT_QUALIFIED'
);

CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id TEXT,
  script_type_id VARCHAR(50) NOT NULL REFERENCES script_types(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  outcome call_outcome
);

CREATE TABLE call_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id),
  script_section_id UUID NOT NULL REFERENCES script_sections(id),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
This structure lets you log exactly which script sections you reach on each call.

1.3. Rebuttal structures
Matches your objection types (“I’m not interested”, “Already have insurance”, “I can’t afford it”, etc.) and scripts from the rebuttal PDF.

Prisma-style:

text
model ObjectionType {
  id         String      @id @db.VarChar(50) // e.g. "NOT_INTERESTED"
  label      String
  description String?    @db.Text

  rebuttals  Rebuttal[]
}

model Rebuttal {
  id              String         @id @default(uuid())
  objectionTypeId String
  title           String         // e.g. "Early brush-off – not interested"
  script          String         @db.Text
  nlpNotes        String?        @db.Text
  isCustom        Boolean        @default(false)

  objectionType   ObjectionType  @relation(fields: [objectionTypeId], references: [id])
  callRebuttals   CallRebuttal[]
}

model CallRebuttal {
  id              String       @id @default(uuid())
  callId          String
  scriptSectionId String?
  objectionTypeId String
  rebuttalId      String
  createdAt       DateTime     @default(now())

  call            Call         @relation(fields: [callId], references: [id])
  scriptSection   ScriptSection? @relation(fields: [scriptSectionId], references: [id])
  objectionType   ObjectionType @relation(fields: [objectionTypeId], references: [id])
  rebuttal        Rebuttal     @relation(fields: [rebuttalId], references: [id])
}
SQL:

sql
CREATE TABLE objection_types (
  id VARCHAR(50) PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT
);

CREATE TABLE rebuttals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objection_type_id VARCHAR(50) NOT NULL REFERENCES objection_types(id),
  title TEXT NOT NULL,
  script TEXT NOT NULL,
  nlp_notes TEXT,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE call_rebuttals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id),
  script_section_id UUID REFERENCES script_sections(id),
  objection_type_id VARCHAR(50) NOT NULL REFERENCES objection_types(id),
  rebuttal_id UUID NOT NULL REFERENCES rebuttals(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
This lets you click a rebuttal in the UI and store exactly which one you used and where.

1.4. Medical conditions and meds
These are driven from your underwriting flash sheet, build charts, auto‑trial list, and senior trial meds.

Prisma-style:

text
enum UnderwritingCategory {
  AUTO_TRIAL
  AUTO_DECLINE
  SENIOR_TRIAL
  INFO_ONLY
}

model Condition {
  id          String               @id @default(uuid())
  name        String
  slug        String               @unique
  category    UnderwritingCategory
  notes       String?              @db.Text
  isSeniorOnly Boolean             @default(false)
}

model Medication {
  id          String               @id @default(uuid())
  name        String
  slug        String               @unique
  category    UnderwritingCategory
  notes       String?              @db.Text
  isSeniorOnly Boolean             @default(false)
}
SQL:

sql
CREATE TYPE underwriting_category AS ENUM (
  'AUTO_TRIAL',
  'AUTO_DECLINE',
  'SENIOR_TRIAL',
  'INFO_ONLY'
);

CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category underwriting_category NOT NULL,
  notes TEXT,
  is_senior_only BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category underwriting_category NOT NULL,
  notes TEXT,
  is_senior_only BOOLEAN NOT NULL DEFAULT FALSE
);
Later, your underwriting UI will just query these tables with LIKE searches or full‑text search to autocomplete diseases and meds.

1.5. Optional: SME requests (for the /ask flow)
You’ll need somewhere to store “bot couldn’t answer, capture contact and question” records.

Prisma-style:

text
model SMERequest {
  id          String   @id @default(uuid())
  name        String
  email       String?
  phone       String?
  bestTime    String?
  question    String   @db.Text
  createdAt   DateTime @default(now())
  status      SMEStatus @default(PENDING)
}

enum SMEStatus {
  PENDING
  IN_PROGRESS
  DONE
}
SQL:

sql
CREATE TYPE sme_status AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE');

CREATE TABLE sme_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  best_time TEXT,
  question TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status sme_status NOT NULL DEFAULT 'PENDING'
);
1.6. Concrete “do this now” checklist for Step 1
Open your backend project (Express / Node).

Add the schema above to your migration system (Prisma schema, TypeORM entities, or raw SQL migration).

Run the migration so Postgres has:

script_types, script_sections, calls, call_steps

objection_types, rebuttals, call_rebuttals

conditions, medications

sme_requests

Confirm in psql or your DB GUI that tables exist and enums are created.
AIL Documentation sectioned off for app development.pdf
AIL requirements and goals as an agent and scripts.pdf
rebuttals to presentations.pdf

2. Seed data from your PDFs
2.1. Decide the first slice of content
To keep this shippable, seed in this order:

Script types and sections (from AIL scripts PDF).

Objection types and rebuttals (from rebuttals PDF).

Conditions, meds, and build chart ranges (from underwriting docs).

You do not need perfect coverage day one; you just need enough to make the UI usable and prove the pipeline.

2.2. Create a simple “seed” script
Pick your language:

If backend is Node: scripts/seed.ts using your ORM (Prisma, etc.).

Or a standalone Python script that connects to Postgres and does INSERTs.

Structure it roughly like:

ts
// scripts/seed.ts
import { db } from '../path/to/db';

async function main() {
  await seedScriptTypesAndSections();
  await seedObjectionsAndRebuttals();
  await seedConditionsAndMeds();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
That gives you a repeatable way to re‑load content as you refine it.

2.3. Seed script types and sections
Use the “requirements and goals” PDF as your source of truth for script flows like GLOBE INTRO, GLOBE LAPSE, D‑CARD, POS, FINAL EXPENSE, CSK, FWK, UNION, etc.

For each script:

Create a ScriptType row:

id: GLOBE_INTRO, GLOBE_LAPSE, D_CARD, POS, FINAL_EXPENSE, CSK, FWK, UNION, etc.

name: human label (“Globe Intro”, “Globe Lapse”, “D‑Card”, “POS”, etc.).

description: short text from the PDF if helpful.

Create ScriptSection rows, preserving order:

Titles like INTRO, FIND_WINDOW_OF_OPPORTUNITY, SCHEDULE_APPOINTMENT, SEND_TEXT_CALENDLY, SOLIDIFY, plus any “Objections Q&A” blocks you want to track as a “step” or just as linked to rebuttals.

orderIndex: 1, 2, 3, … in the order they appear in the script.

body: the exact script text for that section from the PDF.

Implementation idea:

Start manual: hard‑code seed data as JS objects in the script so you control exactly what goes in.

Later you can build a small internal UI to edit/add script sections instead of touching code.

Example pseudo‑data for Globe Intro:

ts
const globeIntroSections = [
  {
    id: 'GLOBE_INTRO_INTRO',
    scriptTypeId: 'GLOBE_INTRO',
    orderIndex: 1,
    title: 'INTRO',
    body: 'Hi! This is agent name. Im with Globe Life...',
  },
  {
    id: 'GLOBE_INTRO_WINDOW',
    scriptTypeId: 'GLOBE_INTRO',
    orderIndex: 2,
    title: 'FIND WINDOW OF OPPORTUNITY',
    body: 'Great. So, the fastest and easiest way to get this done...',
  },
  // etc.
];
Then loop and insert.

2.4. Seed objection types and rebuttals
Use your “rebuttals‑to‑presentations” PDF as the canonical source of objections and their flows.

From that file you already have clusters like:

“I’m not interested” early brush‑off.

“I already have insurance.”

“I can’t afford it.”

“My spouse isn’t home / need to talk to spouse.”

“Can’t you just email me?”

“I need to think about it.”

“Is this a sales call?”

“Health crisis / stroke / in hospital.”

“I didn’t fill anything out.”

“I’m financially secure / don’t need it.”

“I already have a policy” branches.

Lapse‑specific objections (“It was too expensive,” “I don’t know why it lapsed,” “I don’t need it anymore,” etc.).

D‑Card, POS, FE, Will kit, beneficiary, no‑cost, etc.

For each:

Seed an ObjectionType:

code: NOT_INTERESTED, ALREADY_INSURED, CANT_AFFORD, SPOUSE_NOT_HOME, etc.

label: the raw phrase you usually hear.

description: optional NLP notes like “pacing and leading, future pacing,” from the PDF.

Seed one or more Rebuttal rows:

objectionTypeId: link to that objection.

title: short label, e.g. “Early brush‑off”, “Work coverage variant”, “Financially secure – asset angle”.

body: the full talk‑track from the PDF.

scriptTypeId (optional): if some rebuttals are very specific to POS, D‑Card, etc., you can attach them.

You can start by manually extracting the text from a handful of key objections, and seed those first. The rest can be done in later passes; nothing breaks if you only have “core 10” objections day one.

2.5. Seed conditions and meds
From the AIL underwriting doc:

Automatic trial list (ADD/ADHD, Addison’s, asthma, cancer, diabetes, etc.).

Auto decline flash sheet (cancers, HIV/AIDS, severe lung diseases, etc.).

Build charts with height/weight and T‑ratings (T2–T12).

Senior trial meds (Aricept, Anastrozole, etc.) and “other auto‑trial diseases/meds” lists.

Seed three key tables:

Condition

name: “Diabetes – insulin”, “COPD on oxygen”, “Breast cancer”, etc.

category: TRIAL, DECLINE, HINT, SENIOR_TRIAL, etc.

notes: the rule text (“New diagnosis < 6 months, T3 weight, 4 meds → trial”).

appliesTo: NON_SENIOR, SENIOR, or BOTH.

Medication

name: “Anastrozole (Arimidex)”, “Truvada”, “Seroquel (Quetiapine)”, etc.

category: SENIOR_TRIAL, BLOOD_THINNER, ORGAN_REJECTION, etc.

notes: short underwriting handling from the doc.

BuildRange

For a first pass, just map height bands to T‑ratings:

heightInInches, minWeight, maxWeight, tRating (T2, T3, T4, T6, T8, T10, T12).

You can derive these rows directly from the build chart tables.

Again, start small:

Seed only the most common conditions you see now (diabetes, HBP, COPD, cancer, stroke, MS, lupus, kidney failure, senior trial meds).

Add the rest over time as you need them.

2.6. Keep everything agent‑editable later
When seeding, think ahead to admin editing:

Avoid hard‑coding everything forever; after seeding, build admin pages that CRUD ScriptSection, ObjectionType, Rebuttal, Condition, Medication.

That way when a new oddball objection shows up, you can add it via UI instead of touching code, but seeding gives you the initial library.


Step 3 is where this becomes "real" One screen to run a call, advance the script fire rebuttals, and log the outcome. 

3. /calls/new – overall flow
High-level behavior:

You choose the script type (Globe Intro, Lapse, POS, FE, CSK, FWK, etc.).

The app loads that script’s sections in order.

You see the current section text, and click Next as you move.

At any point you can open a Rebuttals panel, pick an objection, click a rebuttal to view it, and that usage is stored.

When done (or the call dies), you hit End call, choose an outcome (sold, rejected, not qualified, etc.), and the call is saved.

Think: left-side script stepper, right-side rebuttal drawer, footer with outcomes.

3.1. API contracts
Assuming the DB shapes we discussed in steps 1–2, here are minimal REST endpoints.

3.1.1. Get script types
GET /api/script-types

Response:

json
[
  { "id": "GLOBE_INTRO", "name": "Globe Intro" },
  { "id": "GLOBE_LAPSE", "name": "Globe Lapse" },
  { "id": "POS", "name": "POS Renewal" },
  { "id": "FINAL_EXPENSE", "name": "Final Expense" },
  { "id": "CSK", "name": "Child Safe Kit" },
  { "id": "FWK", "name": "Will Kit" }
]
These ids map directly to the flows in your scripts PDF.

3.1.2. Get sections for a script
GET /api/script-types/:scriptTypeId/sections

Response:

json
{
  "scriptTypeId": "GLOBE_INTRO",
  "sections": [
    {
      "id": "GLOBE_INTRO_INTRO",
      "orderIndex": 1,
      "title": "INTRO",
      "body": "Hi! This is agent name. Im with Globe Life..."
    },
    {
      "id": "GLOBE_INTRO_WINDOW",
      "orderIndex": 2,
      "title": "FIND WINDOW OF OPPORTUNITY",
      "body": "Great. So, the fastest and easiest way to get this done..."
    }
    // …
  ]
}
Straight mapping from the structure you already have in the PDF.

3.1.3. Start a call
POST /api/calls

Body:

json
{
  "scriptTypeId": "GLOBE_INTRO",
  "leadId": "optional-lead-id"
}
Response:

json
{
  "id": "CALL_UUID",
  "scriptTypeId": "GLOBE_INTRO",
  "startedAt": "2026-04-25T19:45:00Z"
}
3.1.4. Record a step completion
When you click Next, you log that you reached and completed that section.

POST /api/calls/:callId/steps

Body:

json
{
  "scriptSectionId": "GLOBE_INTRO_INTRO"
}
Response:

json
{
  "id": "CALL_STEP_UUID",
  "callId": "CALL_UUID",
  "scriptSectionId": "GLOBE_INTRO_INTRO",
  "completedAt": "2026-04-25T19:47:00Z"
}
If you never hit Next for a section, the analytics later will show that you usually die right before/inside that step.

3.1.5. Get objection types + rebuttals
GET /api/objections

Response:

json
[
  {
    "id": "NOT_INTERESTED",
    "label": "I'm not interested",
    "rebuttals": [
      {
        "id": "NOT_INT_EARLY_BRUSH_OFF",
        "title": "Early brush-off",
        "body": "I completely get that you’re probably getting a ton of calls..."
      }
    ]
  },
  {
    "id": "ALREADY_INSURED",
    "label": "I already have insurance",
    "rebuttals": [ /* … */ ]
  }
]
These are populated from your rebuttal PDF.

3.1.6. Log a rebuttal usage
When you click on a specific rebuttal during a call:

POST /api/calls/:callId/rebuttals

Body:

json
{
  "rebuttalId": "NOT_INT_EARLY_BRUSH_OFF",
  "objectionTypeId": "NOT_INTERESTED",
  "scriptSectionId": "GLOBE_INTRO_WINDOW"
}
That ties together: which stage of the script, what objection, which rebuttal you used.

3.1.7. End a call and set outcome
POST /api/calls/:callId/end

Body:

json
{
  "outcome": "INSURANCE_SOLD", 
  "notes": "Hesitated at price, closed after FE explanation"
}
Allowed outcomes:

PRESENTATION_ACCEPTED

INSURANCE_SOLD

INSURANCE_OFFER_REJECTED

PRESENTATION_REJECTED

NOT_QUALIFIED

You can mirror the wording you used earlier.

3.2. React / Next.js UI structure
For /calls/new you can use a layout like:

Top: select script type and optionally lead.

Left main pane: current script section and Next button.

Right pane / drawer: objections + rebuttals.

Bottom bar: “End call & set outcome”.

3.2.1. Component tree
Rough sketch:

pages/calls/new.tsx

CallSessionPage

ScriptSelector (dropdown of script types)

CallScriptStepper

shows current section title and body, Next button

RebuttalPanel

toggle button “Rebuttals”

list of objection categories → list of rebuttal cards

CallOutcomeBar

“End call” button → modal with outcome options

Once a script is chosen and you hit “Start call,” you create the call via the API and load the sections.

3.2.2. CallScriptStepper behavior
State:

scriptTypeId

sections (array from /api/script-types/:id/sections)

currentIndex

callId

Actions:

On Start call:

POST /api/calls → callId.

Set currentIndex = 0.

On Next:

Read current section = sections[currentIndex].

POST /api/calls/:callId/steps with that scriptSectionId.

Increment currentIndex if not at end.

Rendering:

Show sections[currentIndex].title as heading and body in a readable block.

Optionally show a mini progress indicator (“Step 2 of 5”).

If the user never clicks Next past a section, analytics will show that as a consistent drop point.

3.2.3. RebuttalPanel behavior
State:

objections from /api/objections.

selectedObjectionId

callId

currentSectionId from the stepper.

UI:

Left inside panel: list of objections (buttons).

Right inside panel: when an objection is selected, show its rebuttals as cards:

Each card shows title and expands to show full body.

On card click:

Expand to show the script so you can read it.

POST /api/calls/:callId/rebuttals with rebuttalId, objectionTypeId, currentSectionId.

That’s how we “store the rebuttal” each time you use it.

3.3. New rebuttal creation from the call
You also wanted to capture brand new objections you haven’t scripted yet.

In the Rebuttal panel, add a button like “Add new rebuttal from this call.”

Action:

Opens a small form:

“Objection phrase” (free text).

“Script type / section (optional)” – prefilled with current.

“Your response (what you said).”

On submit:

POST /api/rebuttals with a status: "DRAFT" and a new ObjectionType if needed.

Also log a CallRebuttal row tied to this draft so your stats for this call still show that you used “something” at that point.

Later in /admin/rebuttals you can clean this up, polish, and categorize it.

3.4. Outcomes and ending the call
The bottom bar should always be visible and simple:

Button “End call”.

On click: modal with:

Radio buttons or big tiles:

Presentation accepted

Insurance sold

Insurance offer rejected

Presentation rejected

Not qualified

Optional notes box.

On save:

POST /api/calls/:callId/end.

Redirect to a simple “Call summary” screen (later we’ll make this richer).

Because you’ve logged steps + rebuttals, that summary can already show:

How far into the script you got (max orderIndex).

Which objections came up and which rebuttals you used.

Step 4 is the underwriting assistant: one screen where you enter age, height, weight, plus diseases/meds, and the app tells you "roughtly T-rating + trail/decline hints" using the field manual. 

4. /underwriting – overall behavior
Take age, sex, height, weight → compute build T‑rating band using your build charts.

Let you add conditions and medications via autocomplete, using the auto‑trial list, flash sheet, and senior guidelines.

Summarize: likely build rating (T2/T4/T6/T12) and whether overall this looks like: OK, trial, or likely decline, plus key follow‑up questions.

Think of it as three panels:

Demographics & build

Conditions & meds

Summary & notes

4.1. Inputs and layout
On /underwriting:

Left column:

Age (number)

Sex (M/F/Other)

Height (feet + inches)

Weight (pounds)

“Senior?” toggle (auto‑on when age ≥ 60/65 – you can set exact cutoff) linked to your “Senior applications AIL only” guidelines.

Middle column:

Conditions search (type “diab…”, “COPD…”, “stroke…”, etc.)

Medication search (type “Truv…”, “Seroquel…”, “Plavix…”, etc.)

Each selection appears as a chip/tag with category (Trial, Decline, Senior trial med, etc.).

Right column:

Build result: “Build: T4 (adult), T12 (senior), or Over build chart (likely decline)” using your chart.

Overall status: “Standard-ish”, “Trial strongly recommended”, or “Likely decline”, plus bullets of reasons.

Optional notes box.

Everything should be read‑only logic driven by your seeded data; you’re not making underwriting decisions, you’re surfacing your own rules faster.

4.2. Build calculation logic
From your build chart for males/females age 16+ you’ve got height in inches and weight bands mapping to T‑2, T‑3, T‑4, T‑5, T‑6, T‑8, T‑10, T‑12.

Implementation:

Convert height to inches: e.g., 5'8" → 68.

Look up that height in your BuildRange table: rows like

heightInInches = 68

minWeight = 172, maxWeight = 179, tRating = "T2"

minWeight = 180, maxWeight = 186, tRating = "T3"

… through T12.

Find the row where weight is between minWeight and maxWeight:

If none found but weight less than lowest band: “Under minimum weight – underweight trial/decline depending on chart.”

If greater than highest band: “Exceeds build chart – overweight beyond chart, likely decline.”

Display result:

“Build rating: T4 (adult build chart).”

For seniors: if build is T12 or under min weight and “Senior applications AIL only” says trial, show “Senior: auto trial due to build T12 or underweight.”

You can keep the math extremely simple: a single DB lookup; the intelligence is already in your chart.

4.3. Conditions and disease search
Use the lists in:

Automatic trial list (page 1–3): ADD/ADHD, Addison’s, asthma, cancer, diabetes, chronic pain, etc.

“Other Auto Trial Diseases/Disorders etc. Medications” (ALS, COPD, cirrhosis, lupus, MS, etc.).

Flash sheet auto‑declines (cancers, serious heart disease, COPD on oxygen, dialysis, HIV, etc.).

Detailed impairment sections (Diabetes, Crohn’s, lupus, etc.) for hints.

Backend:

GET /api/conditions?query=cop

Returns matches from your Condition table: name, category (AUTO_TRIAL, AUTO_DECLINE, HINT), notes.

Frontend:

In the “Conditions” input, as you type, show a dropdown:

“COPD (chronic obstructive pulmonary disease) – Auto trial list”

“COPD on oxygen – Flash sheet auto decline”

When you select one, add a chip:

Chip label: COPD – Auto trial.

Tooltip or expandable row: the notes from your doc (e.g., “COPD using home oxygen with cardiac failure – auto decline”).

Internally:

Add that condition id into selectedConditions[].

The overall status aggregator (section 4.5) checks categories to decide if this client is clearly trial/decline.

4.4. Medication search
Use:

Senior trial meds list (Anastrozole, Aricept, Exelon, Femara, Suboxone, etc.).

Auto trial/decline meds like blood thinners (Coumadin, Eliquis, Xarelto, Plavix), organ rejection meds (Azathioprine, Tacrolimus, Mycophenolate, etc.).

Frequent decline med lists in “Underwriting Hints for Senior Life applications.”

Backend:

GET /api/medications?query=sero

Returns rows from Medication with name, category, notes.

Frontend:

“Medications” input with autocomplete; selecting a med adds a chip:

Seroquel (Quetiapine) – Senior trial med

Truvada – HIV/PReP – auto trial or decline context

Logic:

For seniors: any medication in your Senior Trial Medications list should flag hasSeniorTrialMed = true.

For all ages: blood thinners and transplant meds may push them to auto trial or decline depending on your seeded rules.

4.5. Status computation rules (first pass)
Once you have:

buildTRating (may be null or “Out of chart”).

selectedConditions with categories.

selectedMeds with categories.

isSenior (from age).

Compute:

Hard auto‑decline flags (if any condition is AUTO_DECLINE from flash sheet, or combination like insulin diabetes + T6 overweight, etc.).

Trial flags (if any condition is AUTO_TRIAL or build is T4+ with certain combos).

Senior‑specific rules (any senior trial med, any yes answers in Section A/B/C once you later add app questions).

Then map to three simple labels:

Likely decline

Any AUTO_DECLINE condition, or overweight exceeding build chart, or dialysis, or current chemo, or HIV/AIDS, etc., as per your flash sheet.

Strongly trial

No clear decline but presence of any AUTO_TRIAL condition or senior trial med, or build T12 for seniors.

Standardish / maybe T‑2 to T‑4

None of the above; build within chart; conditions only in low‑risk categories.

On the UI, show:

Status: “Strongly trial” in bold color.

Bullets:

“Build: T6, adult chart.”

“Condition: Diabetes with insulin – Auto trial list.”

“Medication: Plavix (blood thinner) – automatic trial per guidelines.”

This is exactly what you do mentally from the PDF; we’re just letting the app do it.

4.6. Condition detail side panel
When you click a condition chip, show a right‑side panel with more detail sourced from your impairment sections: definition, required questionnaires, and any special handling.

Example for Diabetes:

Text summarizing that IDDM is generally uninsurable, NIDDM over age 40 with good control may be standard or rated T2–T8, and that diabetes + overweight T6+ can be uninsurable.

Remind you to ask last A1c, recent doctor visits, etc., matching your doc.

Same for COPD, cirrhosis, stroke/TIA, heart valve replacement, etc.

4.7. UX flow for you
Typical use:

Open /underwriting before or during the call.

Enter age/sex/height/weight → see build rating instantly.

As client answers medical questions, type conditions/meds and select from the dropdown.

Watch the status box update: it might move from “Standardish” to “Strongly trial” once you add, say, Lupus + blood thinner.

Use the summary text as your quick internal guide when deciding what product type to present.

Later we can link the result into /product-explorer (FE vs Senior graded vs POS etc.) so it hints at “products that have a chance here” based on their profile.

Step 5 /ask

How the bot uses these same docs to answer questions and how we wire in SME escalation and email to me when confidence is low. 

5. /ask – what this page does
User flow (site visitor or you):

Type a question about coverage, products, underwriting, scripts, etc.

Bot searches your 3 PDFs (scripts, underwriting, rebuttals) and answers in plain language, citing “internal guidelines.”

If the bot isn’t confident or the question is out of scope, it says “I need Jonathan to review this,” collects name/phone/email, and lets them know someone will get back to them.

Backend logs the question and sends you an email with all the details via Nodemailer (or your email provider).

So /ask is both a knowledge bot and an intake form for SME cases.

5.1. Page layout & states
On /ask:

Left: chat window

Messages from user and bot.

A tag like “Answer based on internal AIL guidelines” when it’s using your docs.

Right:

When needed, a “Have Jonathan review this” panel with fields:

Name

Phone

Email

Best time to reach (dropdown or text)

“Anything else we should know?” (optional)

States:

Normal Q&A (bot confident).

SME recommended (bot not confident / out of policy).

SME request submitted (thank‑you message, expectation setting).

5.2. Back-end API for chat
Create an endpoint, e.g.:

POST /api/ask

Request body:

json
{
  "message": "Can someone with COPD and on oxygen get senior life coverage?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
Server-side steps:

Search your knowledge base

Use a RAG pattern like in modern Next.js examples: embed the question, search similar chunks from your indexed PDFs (scripts, underwriting, rebuttals).

Limit to top N (3–6) chunks.

Build a system prompt

“You are Jonathan’s insurance assistant. Answer only from the provided context from AIL field underwriting, scripts, and rebuttals. If the context is not enough, say you are not sure and recommend that Jonathan review the case.”

Call the LLM

Send messages = system prompt + limited history + user question.

Return:

json
{
  "answer": "Based on the field underwriting manual, COPD using home oxygen with cardiac failure is an automatic decline...",
  "confidence": 0.82,
  "sources": [
    { "type": "internal", "doc": "underwriting.pdf", "section": "COPD", "page": 64 }
  ]
}
You can approximate confidence from retrieval similarity scores or use a heuristic based on how much context was retrieved.

Threshold idea:

If confidence >= 0.7 and the model did not say “I’m not sure,” keep in “normal answer” mode.

If < 0.7 or the question is clearly non‑covered (e.g., tax/legal beyond docs), move to SME flow.

5.3. SME escalation rules
SME mode should kick in when:

There is no relevant chunk in your underwriting/scripting docs.

The question is very specific, like “exact carrier decision in a borderline scenario,” beyond what your manual spells out.

The user explicitly asks “Can I talk to someone?” or “I want Jonathan to call me.”

When that happens, have the API respond:

json
{
  "answer": "I don’t want to guess on this. This question needs a subject-matter expert to review your specific situation. If you’d like, I can have Jonathan look at this and contact you.",
  "requires_sme": true
}
The frontend then:

Shows a panel: “Have Jonathan review this?” with contact fields prefilled if the user has already typed them earlier.

Once submitted, calls a separate endpoint.

5.4. SME request API + email to you
Endpoint:

POST /api/sme-request

Body:

json
{
  "question": "Can someone with COPD and on oxygen get senior life coverage?",
  "answerSoFar": "I don’t want to guess on this...",
  "name": "Jane Doe",
  "phone": "555-555-5555",
  "email": "jane@example.com",
  "bestTime": "Afternoons",
  "source": "ask_page",
  "chatId": "optional-chat-id"
}
Backend does two things:

Persist to DB

Table SmeRequest with status OPEN, createdAt, etc.

Send email

Use nodemailer or similar to send to your email.

Subject: New SME request from Apex Scoop

Body: question, partial answer, contact info, and a link to the admin view of the request.

Node example:

js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

await transporter.sendMail({
  from: '"Apex Scoop Bot" <no-reply@yourdomain.com>',
  to: 'your-email@domain.com',
  subject: 'New SME request from Apex Scoop',
  text: `
Question:
${question}

User details:
Name: ${name}
Phone: ${phone}
Email: ${email}
Best time: ${bestTime}

Bot answer so far:
${answerSoFar}
  `
});
This matches typical nodemailer guides; you can plug in Gmail/Mailtrap/SendGrid, etc.

5.5. Availability and expectations
You mentioned: if you’re unavailable, the site should say so and still capture info. That can be a simple admin toggle in your DB:

settings table with isJonathanAvailableForLiveCalls: boolean and maybe smeResponseEtaHours.

Logic in /ask:

If isJonathanAvailableForLiveCalls is true:

Bot language: “Jonathan usually responds same day. What’s the best time to reach you?”

If false:

Bot language: “Jonathan is currently with other clients, but he will review this and get back to you within 24–48 hours. What’s the best way to reach you?”

You can surface the same flag in your admin dashboard so you can toggle availability quickly.

5.6. Guardrails: keep the bot inside your docs
Because this is real insurance, the bot should never improvise underwriting decisions beyond your manuals.

Guardrails via prompt:

“If the context does not clearly cover this scenario, do not guess. Tell the user that Jonathan must review it and offer to collect their contact info.”

“Do not reference external laws, IRS rules, or carrier-specific product names that are not in the provided context.”

And usage pattern:

In /ask you only send context from your three PDFs and perhaps some structured tables you derived (conditions, meds, build).

You don’t send random web data into the prompt.

5.7. Linking /ask to other modules
Later, you can integrate:

From /underwriting

Button “Ask the bot about this profile” that sends age, build rating, and conditions as context into the first message so it answers more specifically.

From /calls/new

If during a call you hit a weird objection, you can open /ask in an internal mode (“agent mode”), paste the objection and client profile, and get a suggestion sourced from your rebuttals and scripts.

Step 6 is where you see everything that’s happening: calls, where you drop in the script, which objections are killing you, and what SME questions are coming in.

Below is a simple, powerful /admin setup you can build now.

6. Admin area – top-level pages
Create an /admin area with four core views:

/admin/dashboard – quick stats and trends.

/admin/calls – list + drill-down for individual calls.

/admin/rebuttals – objection/rebuttal stats and editing.

/admin/sme-requests – questions the bot escalated to you.

All of this uses data you’re already logging in steps 1–5.

6.1. /admin/dashboard – quick overview
Goal: morning/evening snapshot of how the week is going vs your goals.

Metrics to show (last 7 days, with date filters):

Calls placed.

Appointments set (presentation accepted).

Presentations actually run.

Policies sold and ALP (Annual Life Premium) total.

Lead → appointment → presentation → sale conversion rates.

Average call length (if you timestamp steps).

Plus “script health”:

For each script type (Globe Intro, Lapse, POS, FE, CSK, etc.), what % of calls reach each section (INTRO, FIND WINDOW, SCHEDULE, SEND TEXT, SOLIDIFY).

A simple table:

Script	Reached INTRO	Reached WINDOW	Reached SCHEDULE	Reached SOLIDIFY	Sales rate
Globe Intro	98%	80%	60%	40%	12%
POS	95%	70%	55%	35%	15%
This tells you instantly “I die most often between FIND WINDOW and SCHEDULE on Globe Intro” so you know where to drill and practice.

6.2. /admin/calls – call list + detail
List view
Columns:

Date/time.

Script type (Globe, Lapse, POS, FE, CSK, etc.).

Outcome (presentation accepted, sold, rejected, not qualified).

Max section reached (e.g., INTRO / WINDOW / SOLIDIFY).

# of objections logged.

# of rebuttals used.

Filters:

Date range.

Script type.

Outcome.

“Calls that ended before SCHEDULE” etc.

Call detail view
When you click a call:

Show script progression:

Timeline of sections you actually completed (from CallStep):
INTRO → FIND WINDOW → SCHEDULE → SEND TEXT → SOLIDIFY.

Highlight the last completed one.

Show objections & rebuttals:

“At FIND WINDOW: objection ‘I’m not interested’ → rebuttal ‘Early brush‑off’ used.”

“At SOLIDIFY: objection ‘I already have insurance’ → rebuttal ‘Stacking – different carrier’ used.”

Outcome summary:

Outcome, notes you entered, and maybe a space to add a retrospective comment for training later.

This is your single‑call “game tape”.

6.3. /admin/rebuttals – performance and editing
You wanted to see:

Which objections you are getting.

Which rebuttals you click.

Where in the script they appear.

Which ones correlate with success or failure.

Rebuttal stats view
Table of objection types:

Objection	Script type	Times heard	Times rebuttal used	Close rate after objection
I’m not interested	Globe Intro	42	40	25%
I already have insurance	Lapse	35	30	18%
Can’t afford it	FE	20	18	11%
Then a nested table per objection, listing each rebuttal:

Rebuttal title	Uses	Sales after	Offer rejected	Not qualified
Early brush‑off	25	7	10	3
Alternative wording	15	5	5	2
This uses:

CallRebuttal rows joined to Call (for outcomes) and ScriptSection.

Rebuttal editor
For each rebuttal row:

View/edit the text (pulled from your seed from rebuttals-to-presentations.pdf).

See NLP notes (you can store them as a “coaching notes” field) like “pacing & leading, future pacing, legacy frame.”

Option to mark a rebuttal as active, draft, or deprecated so you can test new language without deleting the old.

Also include a section for “drafts from calls”:

These are rebuttals created on the fly during /calls/new when you hit a new objection and use the “Add new rebuttal” button.

You can categorize them into an existing objection type or create a new objection type from the admin.

6.4. /admin/sme-requests – SME inbox
This is your queue from step 5.

List columns:

Date/time.

Question (shortened).

Status (OPEN, IN_PROGRESS, DONE).

Name, phone, email.

Source (Ask page, underwriting page, etc.).

Click into a request:

Full question.

What the bot answered so far.

A “notes” area for you (“Need APS before answering,” etc.).

Buttons:

“Mark in progress”

“Mark done”

(Later) “Send email reply” directly from the app.

You can also add a “priority” column for anything clearly urgent (e.g., claims‑type questions).

6.5. Analytics for your personal goals
Your PDF calls out specific numeric goals: calls per week, appointments per week, presentations, sales, ALP, referrals, and commission % that can change over time.

Use /admin/dashboard to surface a “Goal vs actual” block:

Config in DB:

weeklyCallsTarget = 750

weeklyAppointmentsTarget = 36

weeklyPresentationsTarget = 12

weeklySalesTarget = 3

alpTarget = 2000 (or dynamic based on commission).

Display for this week:

Metric	Target	Actual	Progress
Calls	750	420	56%
Appointments	36	20	55%
Presentations	12	8	67%
Sales	3	1	33%
ALP	2000	1171.56	59%
Also include commission projection based on your current percentage (default 50%, editable in admin settings, with formulas you described).

6.6. Making it “plug and play” for future agents
Your doc mentions you eventually want others to use the tool and possibly sell leads for states where you’re not licensed.

Design admin with that in mind:

All stats filtered by agentId so that:

You see your numbers only by default.

Later you can add a super‑admin view for team‑wide stats.

Scripts, rebuttals, conditions are global libraries, but usage stats are per agent.

This way you can start solo and still be ready to onboard others without re‑architecture.


Bot-Led Presentation ask: high-level flow 

User is chatting (website visitor):

Bot qualifies a bit, then asks a clear presentation question:

“Would you like to schedule a quick 10‑minute call so Jonathan can walk you through your options?”

Bot shows two big buttons instead of free‑text:

“Yes, schedule my call”

“No / I’m not sure”

Clicks on those buttons drive two different flows:

Yes → presentation scheduling (collect name, phone, email, time; create a Call/Appointment record).

No / unsure → objection capture (show a list of common objections, trigger appropriate rebuttal scripts, track which objection and rebuttal were used).

All of this should be logged similar to /calls/new, just “bot_source” instead of “phone_source.”

Button responses and rebuttal flow
After the bot asks for the appointment:

Buttons:

“Yes, that works”

“I’m not interested”

“I already have insurance”

“I can’t afford it”

“I need to talk to my spouse”

“I just want info by email”

Those map directly to your existing objection categories and rebuttals.

Behavior per button:

Yes, that works

Bot: “Great, let’s get you on the calendar.” Then open a small form: name, phone, email, pick time.

Backend: create a “bot call” or “bot appointment” record with source = 'chat', scriptType = 'WEB_INBOUND', and outcome = PRESENTATION_ACCEPTED.

Any objection button

Log the objection: BotObjection row with type (NOT_INTERESTED, ALREADY_INSURED, etc.).

Bot responds with the matching rebuttal text adapted for chat (shorter versions of your scripts).

Bot then asks again, with buttons:

“Okay, let’s do the 10‑minute call”

“No, I’m going to pass”

Each time an objection is clicked, you log it exactly like a rebuttal in a phone call; the difference is it’s channel = 'chat' and actor = 'bot'.

Tracking this flow
Add a simple “bot session” structure:

BotSession

id

startedAt, endedAt

leadId (if captured)

convertedToCall (bool)

scriptType (e.g., “Final expense info”, “D‑Card info”, etc. based on chat topic).

BotObjection

sessionId

objectionTypeId (NOT_INTERESTED, ALREADY_INSURED, etc.).

rebuttalId (which chat rebuttal was shown).

occurredAt

If the user ends up scheduling, also create:

A Call/Appointment record (like from /calls/new), but with source = 'bot' and outcome = PRESENTATION_ACCEPTED.

Later, in admin, you can see:

How many chats reached the presentation ask.

Of those, how many clicked “Yes” vs an objection.

Which objections are most common in chat and which rebuttals work best there.

Example conversation path
Bot: “Based on what you shared, the next step is a quick 10‑minute call with Jonathan. When would be a good time?”
Buttons: “Schedule my call”, “I’m not interested”, “Already covered”, “Can’t afford it”.

User: clicks “I’m not interested”.

Log BotObjection(NOT_INTERESTED, rebuttal = early_brush_off_chat).

Bot: responds with your “I’m not interested” rebuttal adapted to chat (short, direct).

Bot then re-asks with buttons: “Okay, let’s schedule a quick 10‑minute call”, “No thanks, I’ll pass”.

User: clicks “Schedule call”.

Bot: collects contact info and time.

Backend: create appointment + mark the BotSession as converted.

If they click “No thanks, I’ll pass,” you still log that as outcome for the session so you can analyze conversion after each objection type.

How this ties into your existing flows
The “presentation ask + buttons + objections + rebuttals” is just the chat version of what you do on the phone, using the same objection codes and rebuttal scripts you seeded from rebuttals-to-presentations.pdf.

The appointment created by the bot feeds into the same call tracking system you’ll use in /calls/new, so you can see total presentations and sales regardless of whether they started from chat or from outbound dial.



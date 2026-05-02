/**
 * Seed script — run once to populate all AIL content tables.
 * Usage: npx tsx seed.ts
 * Safe to re-run: all inserts use ON CONFLICT DO NOTHING or DO UPDATE.
 */
import db from './src/db.js';
import bcrypt from 'bcryptjs';

// ─── Script Types ────────────────────────────────────────────────────────────

const SCRIPT_TYPES = [
  { name: 'Globe Intro',           description: 'Initial Globe Life outbound call intro script' },
  { name: 'Globe Lapse',           description: 'Reactivation call for lapsed Globe Life policies' },
  { name: 'D-Card',                description: 'Direct-mail D-Card response follow-up script' },
  { name: 'POS Renewal',           description: 'Point-of-service policy renewal / POS script' },
  { name: 'Final Expense',         description: 'Final expense (burial/senior whole life) presentation script' },
  { name: 'Child Safe Kit (CSK)',  description: 'Free child safety kit outreach script' },
  { name: 'Will Kit (FWK)',        description: 'Free will kit outreach script' },
  { name: 'Union / Credit Union',  description: 'Union and credit union member outreach script' },
  { name: 'Beneficiary Referral',  description: 'Referral call when beneficiary listed on existing policy' },
  { name: 'No-Cost Referral',      description: 'No-cost benefit referral outreach script' },
];

// ─── Script Sections ─────────────────────────────────────────────────────────

interface SSection { section_number: number; title: string; content: string; }

const SCRIPT_SECTIONS: Record<string, SSection[]> = {
  'Globe Intro': [
    { section_number: 1, title: 'INTRO',
      content: `Hi, may I please speak with [Name]? ...Hi [Name], my name is [Agent Name] and I'm calling from Globe Life Insurance. The reason for my call today is that I have some information about your coverage that I'd like to go over with you. Do you have just a few moments?` },
    { section_number: 2, title: 'FIND WINDOW OF OPPORTUNITY',
      content: `Great! So the fastest and easiest way to get this done is for me to set up a brief 10–15 minute appointment where I can go over the full details of what you qualify for. I want to make sure you have all the information you need to make the best decision for yourself and your family. Does that sound fair?\n\nWhat I need to find out first — are you currently working, retired, or disabled? And do you have any life insurance coverage right now?` },
    { section_number: 3, title: 'SCHEDULE APPOINTMENT',
      content: `Perfect. I have some availability this week. What generally works better for you — mornings or afternoons? And are you available [Day 1] or would [Day 2] be better?\n\n[Confirm time and date.]\n\nExcellent, I have you down for [Day/Time]. I'll give you a call at this number. Does that work for you?` },
    { section_number: 4, title: 'SEND TEXT / CALENDLY',
      content: `I'm going to send you a quick text right now so you have my contact information saved. You'll receive a confirmation message from me. If anything comes up before our appointment, please don't hesitate to reach out.\n\n[Send text with: Name, callback number, appointment time, Calendly link if available]` },
    { section_number: 5, title: 'SOLIDIFY',
      content: `So just to confirm — we're set for [Day] at [Time]. I'll be going over the coverage details with you at that time. Is there anyone else in the household who should be part of that conversation, like your spouse or partner?\n\nGreat — I'll talk to you then, [Name]. Have a wonderful day!` },
  ],
  'Globe Lapse': [
    { section_number: 1, title: 'INTRO',
      content: `Hi, may I please speak with [Name]? ...Hi [Name], my name is [Agent Name] calling from Globe Life. I'm reaching out today because our records show there may have been a lapse on a previous policy you held with us. I want to make sure you know about your options. Do you have just a minute?` },
    { section_number: 2, title: 'FIND WINDOW OF OPPORTUNITY',
      content: `I understand, and I appreciate that. I'm not here to pressure you — I just want to make sure you're aware that as a previous policyholder, you may still qualify for reinstatement or a new policy without starting completely from scratch. Can I ask — was there a specific reason the policy lapsed? Was it the premium amount, or did something change in your situation?` },
    { section_number: 3, title: 'PRESENT REINSTATEMENT OPTIONS',
      content: `Here's the thing — we may be able to get you back on the books at a similar or even lower rate depending on your current situation. The protection is still valuable. Let me set up a quick 10-minute conversation to walk you through exactly what you'd qualify for today. Does that make sense?` },
    { section_number: 4, title: 'SCHEDULE APPOINTMENT',
      content: `What works better for you — mornings or afternoons? I have [Day 1] or [Day 2] available. [Confirm.] Perfect, I'll call you at this number at [Time] on [Day].` },
    { section_number: 5, title: 'SOLIDIFY',
      content: `So I have you down for [Day] at [Time]. I'll have your previous account information pulled up so we can hit the ground running. Looking forward to connecting with you then, [Name]!` },
  ],
  'Final Expense': [
    { section_number: 1, title: 'INTRO',
      content: `Hi, is this [Name]? Great! My name is [Agent Name] and I'm a licensed insurance agent. I'm reaching out today because a lot of folks in your area have been asking about final expense coverage — making sure end-of-life costs don't fall on family members. I have some information I'd love to share with you. Is this a good time?` },
    { section_number: 2, title: 'FIND WINDOW OF OPPORTUNITY',
      content: `Let me ask you — do you currently have any life insurance coverage? And have you thought about making sure that funeral and burial expenses are taken care of? The average funeral today runs between $9,000 and $12,000. Most families aren't prepared for that. That's exactly what final expense coverage is designed for. Does that resonate with your situation at all?` },
    { section_number: 3, title: 'QUALIFYING QUESTIONS',
      content: `I'd like to ask a few quick questions to see what you might qualify for. How old are you currently? And in general, how would you describe your health — excellent, good, or fair? Do you smoke? [Note any conditions for underwriting review.]` },
    { section_number: 4, title: 'SCHEDULE APPOINTMENT',
      content: `Based on what you've shared, I think we can find a solid plan for you at a very affordable rate. Let me set up a brief 10–15 minute presentation where I can show you the exact numbers. Are you available [Day/Time]?` },
    { section_number: 5, title: 'SOLIDIFY',
      content: `Perfect, I have you at [Day/Time]. I'll give you a call at this number. I'll have the specific plans and pricing ready for your situation. Talk to you then!` },
  ],
  'D-Card': [
    { section_number: 1, title: 'INTRO',
      content: `Hi, may I please speak with [Name]? Hi [Name]! My name is [Agent Name] with American Income Life. I'm calling because you recently filled out a card about free insurance information — I just want to make sure you get the details you requested. Do you have a few moments?` },
    { section_number: 2, title: 'CONFIRM INTEREST',
      content: `Great. So I have your card here — you were interested in [coverage type noted on card]. Is that still something that's on your radar? Have your insurance needs changed at all since you filled that out?` },
    { section_number: 3, title: 'SCHEDULE APPOINTMENT',
      content: `What I'd love to do is set a short appointment where I can go through exactly what you qualify for and give you real numbers — no obligation, no pressure, just information. I have [Day 1] or [Day 2] available. What works better for you?` },
    { section_number: 4, title: 'SOLIDIFY',
      content: `Wonderful! I have you set for [Day/Time]. I'll be calling you at this number. I'm looking forward to getting you the information you asked for. Take care, [Name]!` },
  ],
  'Child Safe Kit (CSK)': [
    { section_number: 1, title: 'INTRO',
      content: `Hi, may I please speak with [Name]? Hi [Name]! This is [Agent Name] calling about the free child safety kit your family qualifies for through our program. I just want to make sure I can get that out to you. Do you have a quick moment?` },
    { section_number: 2, title: 'EXPLAIN CSK BENEFIT',
      content: `The child safety kit includes things like a fingerprint ID card, family emergency contact information, and some really valuable safety tips for parents. It's completely free — there's absolutely no cost to you. The only thing I need is a good time to drop it off or go over it with you. A lot of families find this really helpful.` },
    { section_number: 3, title: 'SCHEDULE APPOINTMENT',
      content: `I'm going to be in your area on [Day]. Would morning or afternoon work better for you? [Confirm time.]` },
    { section_number: 4, title: 'SOLIDIFY',
      content: `Perfect, I'll see you on [Day] at [Time]. I'll have the kit ready. There's no pressure, no obligation — I'm just coming to deliver the kit and answer any questions you might have. See you then!` },
  ],
  'POS Renewal': [
    { section_number: 1, title: 'INTRO',
      content: `Hi [Name], this is [Agent Name] from American Income Life. I'm reaching out because your policy renewal is coming up and I want to make sure everything looks good on your account and you're aware of any updates or additional benefits available to you. Is this a good time?` },
    { section_number: 2, title: 'ACCOUNT REVIEW',
      content: `I have your policy information here. Your current coverage is [details]. I wanted to go through this with you to make sure it still fits your needs, and also let you know about a few enhancements that are available for existing policyholders like yourself.` },
    { section_number: 3, title: 'PRESENT ENHANCEMENTS',
      content: `Based on your current plan, I see that you may qualify for [additional rider/benefit]. A lot of our clients add this on because it fills a gap that most people don't think about until they need it. Would you like me to walk you through how it works?` },
    { section_number: 4, title: 'SOLIDIFY',
      content: `Great. I'll either process that today or schedule a follow-up to complete the paperwork — whichever is easier for you. Do you have a few more minutes now, or would [Date/Time] work better?` },
  ],
};

// ─── Objection Types ──────────────────────────────────────────────────────────

const OBJECTION_TYPES = [
  { id: 'NOT_INTERESTED',      label: "I'm not interested",                      display_order: 1 },
  { id: 'ALREADY_INSURED',     label: 'I already have insurance',                display_order: 2 },
  { id: 'CANT_AFFORD',         label: "I can't afford it",                       display_order: 3 },
  { id: 'SPOUSE_NOT_HOME',     label: "My spouse isn't home / need to discuss",  display_order: 4 },
  { id: 'EMAIL_INFO',          label: 'Just email me the information',           display_order: 5 },
  { id: 'NEED_TO_THINK',       label: 'I need to think about it',                display_order: 6 },
  { id: 'IS_SALES_CALL',       label: 'Is this a sales call?',                   display_order: 7 },
  { id: 'HEALTH_CRISIS',       label: "I'm dealing with a health issue right now", display_order: 8 },
  { id: 'DIDNT_FILL_OUT',      label: "I didn't fill anything out",              display_order: 9 },
  { id: 'FINANCIALLY_SECURE',  label: "I'm financially secure / don't need it", display_order: 10 },
  { id: 'LAPSE_TOO_EXPENSIVE', label: 'It was too expensive (lapse)',            display_order: 11 },
  { id: 'LAPSE_DONT_NEED',     label: "I don't need it anymore (lapse)",         display_order: 12 },
  { id: 'ALREADY_HAVE_POLICY', label: 'I already have a policy with you',        display_order: 13 },
  { id: 'BUSY_CALL_BACK',      label: "I'm busy / call me back later",           display_order: 14 },
];

// ─── Rebuttals ────────────────────────────────────────────────────────────────

interface RebuttalEntry { objectionId: string; title: string; script: string; nlpNotes?: string; }

const REBUTTALS: RebuttalEntry[] = [
  {
    objectionId: 'NOT_INTERESTED',
    title: 'Early brush-off — acknowledge and redirect',
    script: `I completely understand, and I appreciate your honesty. You know, most people I talk to say the same thing before they hear what I actually have for them. I'm not here to sell you anything today — I literally just need about 90 seconds to share some information that could save your family a lot of money and heartache. Would that be okay?`,
    nlpNotes: 'Pacing and leading. Shrink the commitment to "90 seconds." Future pacing — family benefit.',
  },
  {
    objectionId: 'NOT_INTERESTED',
    title: 'Second push — legacy and family protection angle',
    script: `I hear you — and I respect that. Can I ask you one quick question before I let you go? If something were to happen to you tomorrow, is your family taken care of financially? The reason I ask is that I talk to families every day who weren't prepared and it changes everything for them. I just want to make sure you at least have the information. Can I take 10 minutes to show you what's available?`,
    nlpNotes: 'Pattern interrupt. Creates urgency without fear-mongering. Legacy frame.',
  },
  {
    objectionId: 'ALREADY_INSURED',
    title: 'Acknowledge — different coverage, stacking angle',
    script: `That's great that you have coverage already — that means you understand the value! Here's the thing though: what I have isn't meant to replace what you have, it supplements it. Most people don't realize that their current coverage often has gaps — especially when it comes to final expenses, accidents, or critical illness. Can I just take 10 minutes to show you how this fits alongside what you already have?`,
    nlpNotes: 'Validate their choice. Reframe as "add-on" not replacement. Gap awareness.',
  },
  {
    objectionId: 'ALREADY_INSURED',
    title: 'Work coverage — portability angle',
    script: `Is that through your employer? The challenge with employer coverage is that it's tied to your job — the moment you leave, retire, or get laid off, that coverage disappears. What I'm offering is portable, locked-in coverage that stays with you no matter what. Do you have anything that follows you beyond your current job?`,
    nlpNotes: 'Creates uncertainty about existing coverage. Portability is a strong differentiator.',
  },
  {
    objectionId: 'CANT_AFFORD',
    title: "Can't afford it — cost of inaction angle",
    script: `I completely understand — everyone is watching their budget right now. But let me ask you this: can your family afford a $10,000 funeral? Can they cover your mortgage or rent for 6 months if something happened to you? The truth is, not having coverage is actually the most expensive option. Most of our plans start as low as $15–20 a month — less than a Netflix subscription. Can I at least show you what's available at your budget?`,
    nlpNotes: 'Reframe cost of inaction. Anchor to everyday expenses. Shrink the commitment.',
  },
  {
    objectionId: 'CANT_AFFORD',
    title: "Can't afford it — budget discovery",
    script: `I hear you, and I'm not going to show you anything that doesn't fit your budget. Let me ask — if we found something that fit within [X dollars] a month, would that be something worth looking at? I'd rather show you options at your number than walk away and have you unprotected.`,
    nlpNotes: 'Turn objection into budget discovery. Yes-set building.',
  },
  {
    objectionId: 'SPOUSE_NOT_HOME',
    title: "Spouse isn't home — schedule with both",
    script: `I completely understand — I'd want my spouse involved in something like this too. That's actually the smart way to do it. Let me schedule a time when you're both available so you can both ask questions and make a decision together. What generally works for both of you — evenings, or weekends?`,
    nlpNotes: 'Validate the objection. Turn it into a scheduling opportunity with higher close potential.',
  },
  {
    objectionId: 'SPOUSE_NOT_HOME',
    title: "Spouse isn't home — information gathering mode",
    script: `No problem at all. Tell you what — let me at least get you the information so that when your spouse gets home, you can show them what's available and you two can decide together. That way you're not going in blind. Is that okay?`,
    nlpNotes: 'Frame as informational, not sales. Reduces resistance. Sets up two-contact close.',
  },
  {
    objectionId: 'EMAIL_INFO',
    title: 'Email me — email is not a close',
    script: `I absolutely can send you information — but honestly, insurance is one of those things that's really hard to understand from a pamphlet. There are rates, qualifications, coverage levels... it takes a conversation to match you to the right plan. What I can do is set up a quick 10-minute call where I walk you through everything live, and then send you a summary email after. Would that work?`,
    nlpNotes: 'Acknowledge the request. Reframe email as incomplete. Offer a hybrid solution.',
  },
  {
    objectionId: 'NEED_TO_THINK',
    title: "Need to think — what's holding you back?",
    script: `Of course — it's an important decision and I never want anyone to feel rushed. Can I ask — is there a specific part of it that you're unsure about? Sometimes what seems like "needing to think" is really just a question I haven't answered yet. I want to make sure you have everything you need to make the right choice.`,
    nlpNotes: 'Smoke out the real objection. Diagnose before prescribing. Empathy first.',
  },
  {
    objectionId: 'NEED_TO_THINK',
    title: "Need to think — lock-in rate urgency",
    script: `I totally respect that. Here's the thing I want to share with you — the rates I'm quoting you today are based on your current age and health. Every year that goes by, coverage gets more expensive. I'm not trying to pressure you, I just want to make sure you know the window for the best rate is open right now. What if we scheduled a follow-up for [Day] so you have time to think and I can answer any questions that come up?`,
    nlpNotes: 'Future pacing. Lock-in rate urgency. Soft close into scheduled follow-up.',
  },
  {
    objectionId: 'IS_SALES_CALL',
    title: "Is this a sales call? — honest redirect",
    script: `I appreciate you asking that directly — I'm always honest with people. I am a licensed insurance agent, yes. But the reason I'm calling today is specifically to make sure you're aware of [reason for call: benefits available, lapse, etc.]. I'm not here to talk you into anything — I just want to make sure you have the information. Does that make sense?`,
    nlpNotes: 'Radical honesty disarms resistance. Pivot to information role.',
  },
  {
    objectionId: 'HEALTH_CRISIS',
    title: 'Health crisis — empathy and timing',
    script: `Oh my goodness, I'm so sorry to hear that — please don't worry about this call at all right now. I hope you and your family get through this as quickly as possible. I'll make a note here and I'll follow up with you in [2–4 weeks]. Is there a better time to reach you then? I'll keep this brief — you don't need the extra stress right now.`,
    nlpNotes: 'Immediate empathy. No push. Secure callback. Builds goodwill.',
  },
  {
    objectionId: 'DIDNT_FILL_OUT',
    title: "Didn't fill out a card — household member or verify",
    script: `I completely understand that confusion! Is it possible someone else in the household may have filled it out? We do send these to families, so sometimes a spouse or other family member responds. Regardless — since I have you on the line, would it be okay if I shared a little bit about what was offered? It literally takes two minutes and you can decide if it's even worth pursuing.`,
    nlpNotes: 'Create plausible deniability for their confusion. Pivot to quick value prop.',
  },
  {
    objectionId: 'FINANCIALLY_SECURE',
    title: "Financially secure — asset protection angle",
    script: `That's wonderful — I love hearing that. Here's the thing though: the people who benefit most from this aren't necessarily the ones who can't afford it — it's actually people like yourself who have built something worth protecting. This kind of coverage keeps your assets intact. If you get sick or pass away, your family inherits your wealth — not medical bills or estate costs. Does that make sense from where you're sitting?`,
    nlpNotes: 'Validate their success. Reframe product as wealth protection, not poverty safety net.',
  },
  {
    objectionId: 'LAPSE_TOO_EXPENSIVE',
    title: 'Lapse — premium was too high, explore options',
    script: `I hear you — and that makes sense. Premiums have gone up across the board. Here's what I want to check: there may be a plan at a lower face amount that fits your budget better and still gives you meaningful coverage. Or depending on your health, you might qualify for a different structure. Can I take a look and see what I can find for you?`,
    nlpNotes: 'Acknowledge the real pain point. Offer to solve it with options.',
  },
  {
    objectionId: 'LAPSE_DONT_NEED',
    title: "Lapse — don't think I need it anymore",
    script: `I understand — life changes and priorities shift. Can I ask what changed? Is it because your kids are grown, or maybe you feel your savings could cover it? I ask because sometimes people let go of coverage when they actually need it the most — especially as we age and health conditions change. I just want to make sure you've thought through all the angles.`,
    nlpNotes: 'Discover the real reason. Create gentle doubt without pressure.',
  },
  {
    objectionId: 'BUSY_CALL_BACK',
    title: "Busy — secure a specific callback time",
    script: `No problem at all, I respect your time! When would be the best time to reach you? I want to make sure I call when it's convenient — morning or afternoon, today or tomorrow? I'll put it right in my calendar.`,
    nlpNotes: 'Never let a callback be open-ended. Pin down a specific day and time.',
  },
];

// ─── Conditions (Underwriting) ────────────────────────────────────────────────

const CONDITIONS = [
  // AUTO_TRIAL
  { name: 'ADD/ADHD', category: 'AUTO_TRIAL', notes: 'Automatic trial; no decline. Note any stimulant medications.', is_senior_only: false },
  { name: "Addison's Disease", category: 'AUTO_TRIAL', notes: 'Automatic trial. Note steroid dependency.', is_senior_only: false },
  { name: 'Asthma', category: 'AUTO_TRIAL', notes: 'Automatic trial unless hospitalized in last 12 months or on home oxygen.', is_senior_only: false },
  { name: 'Bipolar Disorder', category: 'AUTO_TRIAL', notes: 'Automatic trial. Note current medications and last hospitalization.', is_senior_only: false },
  { name: 'Cancer — history (over 5 years)', category: 'AUTO_TRIAL', notes: 'Trial if cancer-free > 5 years for most types. Melanoma/basal cell may be standard.', is_senior_only: false },
  { name: "Crohn's Disease", category: 'AUTO_TRIAL', notes: 'Automatic trial. Note flare frequency, hospitalization, and medications.', is_senior_only: false },
  { name: 'Chronic Pain Syndrome', category: 'AUTO_TRIAL', notes: 'Trial. Note opioid medications.', is_senior_only: false },
  { name: 'Depression (treated)', category: 'AUTO_TRIAL', notes: 'Trial if on medication and stable. No recent psychiatric hospitalization.', is_senior_only: false },
  { name: 'Diabetes — Type 2 (non-insulin, controlled)', category: 'AUTO_TRIAL', notes: 'T2–T4 if controlled, A1c < 8, no complications. Combined with obesity or kidney disease = likely decline.', is_senior_only: false },
  { name: 'Diabetes — Type 1 (insulin-dependent)', category: 'AUTO_TRIAL', notes: 'Generally uninsurable for standard whole life. Senior graded only. Note complications.', is_senior_only: false },
  { name: 'Diabetes — new diagnosis < 6 months', category: 'AUTO_TRIAL', notes: 'Auto trial; wait for stability before standard rating.', is_senior_only: false },
  { name: 'Epilepsy / Seizure Disorder', category: 'AUTO_TRIAL', notes: 'Trial. Note frequency, last seizure, and anticonvulsant medications.', is_senior_only: false },
  { name: 'Heart Disease — stable (no recent surgery)', category: 'AUTO_TRIAL', notes: 'Trial. Note type: CAD, CHF, AFib. If recent surgery or hospitalization < 12 months = may decline.', is_senior_only: false },
  { name: 'High Blood Pressure (controlled)', category: 'AUTO_TRIAL', notes: 'T2–T4 if well-controlled. Note number of medications.', is_senior_only: false },
  { name: 'Lupus (SLE)', category: 'AUTO_TRIAL', notes: 'Auto trial. Note organ involvement — kidney involvement may push to decline.', is_senior_only: false },
  { name: 'Multiple Sclerosis (MS)', category: 'AUTO_TRIAL', notes: 'Auto trial. Note relapsing-remitting vs. progressive. Wheelchair-bound = likely decline.', is_senior_only: false },
  { name: "Parkinson's Disease", category: 'AUTO_TRIAL', notes: 'Auto trial for early stage. Note medications (Aricept may indicate advanced stage).', is_senior_only: true },
  { name: 'Rheumatoid Arthritis', category: 'AUTO_TRIAL', notes: 'Trial. Note methotrexate or biologic medications.', is_senior_only: false },
  { name: 'Sleep Apnea (treated with CPAP)', category: 'AUTO_TRIAL', notes: 'Trial if CPAP-compliant. Non-compliant may rate higher.', is_senior_only: false },
  { name: 'Stroke or TIA (over 1 year ago)', category: 'AUTO_TRIAL', notes: 'Trial if no residual deficit and > 12 months ago. Recent stroke = decline.', is_senior_only: false },
  { name: 'Ulcerative Colitis', category: 'AUTO_TRIAL', notes: 'Auto trial. Note current medications and frequency of flares.', is_senior_only: false },
  { name: 'COPD (without oxygen)', category: 'SPECIAL', notes: 'Auto trial list. Senior whole life may be available. Not eligible for accident plans.', is_senior_only: false },
  { name: 'Kidney Disease (chronic, not dialysis)', category: 'SPECIAL', notes: 'Trial. If combined with diabetes = significant rating. Dialysis = auto decline.', is_senior_only: false },
  { name: 'Dementia / Alzheimer\'s (early)', category: 'SPECIAL', notes: "Senior graded only. Note Aricept use. Full Alzheimer's = decline for standard products.", is_senior_only: true },
  // AUTO_DECLINE
  { name: "ALS (Lou Gehrig's Disease)", category: 'AUTO_DECLINE', notes: 'Auto decline for all products.', is_senior_only: false },
  { name: 'Cancer — active treatment', category: 'AUTO_DECLINE', notes: 'Auto decline if currently receiving chemotherapy, radiation, or immunotherapy.', is_senior_only: false },
  { name: 'Cancer — metastatic or stage IV', category: 'AUTO_DECLINE', notes: 'Auto decline regardless of treatment status.', is_senior_only: false },
  { name: 'Cirrhosis of the Liver', category: 'AUTO_DECLINE', notes: 'Auto decline. Alcoholic cirrhosis especially.', is_senior_only: false },
  { name: 'COPD on home oxygen', category: 'AUTO_DECLINE', notes: 'Auto decline. COPD without oxygen = trial only.', is_senior_only: false },
  { name: 'Congestive Heart Failure (CHF)', category: 'AUTO_DECLINE', notes: 'Auto decline if decompensated or recent hospitalization. Stable mild CHF = trial only.', is_senior_only: false },
  { name: 'Dialysis (kidney)', category: 'AUTO_DECLINE', notes: 'Auto decline for all products.', is_senior_only: false },
  { name: 'HIV/AIDS', category: 'AUTO_DECLINE', notes: 'Auto decline for standard life products. Accidental death may still qualify.', is_senior_only: false },
  { name: 'Organ Transplant (any)', category: 'AUTO_DECLINE', notes: 'Auto decline. Anti-rejection meds confirm transplant status.', is_senior_only: false },
  { name: 'Pulmonary Fibrosis', category: 'AUTO_DECLINE', notes: 'Auto decline.', is_senior_only: false },
  { name: 'Schizophrenia', category: 'AUTO_DECLINE', notes: 'Auto decline for standard products.', is_senior_only: false },
  { name: 'Diabetes — Type 2 + obesity (T6+)', category: 'SPECIAL', notes: 'Combined factors push to likely decline. Senior graded only may be available.', is_senior_only: false },
];

// ─── Medications ──────────────────────────────────────────────────────────────

const MEDICATIONS = [
  { name: 'Anastrozole (Arimidex)',          category: 'SENIOR_TRIAL',     notes: "Breast cancer hormone therapy. Senior trial only. Confirm cancer-free status.", is_senior_only: true },
  { name: 'Aricept (Donepezil)',             category: 'SENIOR_TRIAL',     notes: "Dementia / Alzheimer's. Senior graded only. May indicate cognitive impairment.", is_senior_only: true },
  { name: 'Exelon (Rivastigmine)',           category: 'SENIOR_TRIAL',     notes: 'Dementia. Same handling as Aricept. Senior graded only.', is_senior_only: true },
  { name: 'Femara (Letrozole)',              category: 'SENIOR_TRIAL',     notes: 'Breast cancer hormone therapy. Senior trial. Confirm current treatment status.', is_senior_only: true },
  { name: 'Namenda (Memantine)',             category: 'SENIOR_TRIAL',     notes: "Moderate-to-severe Alzheimer's. Senior graded only.", is_senior_only: true },
  { name: 'Suboxone (Buprenorphine)',        category: 'AUTO_TRIAL',       notes: 'Opioid dependency treatment. Trial. Note duration of use.', is_senior_only: false },
  { name: 'Coumadin (Warfarin)',             category: 'BLOOD_THINNER',    notes: 'Blood thinner. Indicates AFib, DVT, valve replacement. Auto trial — note underlying condition.', is_senior_only: false },
  { name: 'Eliquis (Apixaban)',              category: 'BLOOD_THINNER',    notes: 'Blood thinner. Same handling as Coumadin. Common for AFib. Auto trial.', is_senior_only: false },
  { name: 'Xarelto (Rivaroxaban)',           category: 'BLOOD_THINNER',    notes: 'Blood thinner. Auto trial. Note underlying diagnosis.', is_senior_only: false },
  { name: 'Plavix (Clopidogrel)',            category: 'BLOOD_THINNER',    notes: 'Antiplatelet. Indicates stent, heart attack history, or vascular disease. Trial.', is_senior_only: false },
  { name: 'Pradaxa (Dabigatran)',            category: 'BLOOD_THINNER',    notes: 'Blood thinner for AFib. Auto trial.', is_senior_only: false },
  { name: 'Tacrolimus (Prograf)',            category: 'ORGAN_REJECTION',  notes: 'Organ rejection prevention. Auto decline — confirms transplant.', is_senior_only: false },
  { name: 'Mycophenolate (CellCept)',        category: 'ORGAN_REJECTION',  notes: 'Organ rejection prevention. Auto decline — confirms transplant.', is_senior_only: false },
  { name: 'Azathioprine (Imuran)',           category: 'ORGAN_REJECTION',  notes: "Immunosuppressant. Decline if transplant-related; trial if for RA/Crohn's.", is_senior_only: false },
  { name: 'Insulin (any type)',              category: 'AUTO_TRIAL',       notes: 'Confirms insulin-dependent diabetes. IDDM = generally uninsurable for standard life. Senior graded possible.', is_senior_only: false },
  { name: 'Metformin',                       category: 'AUTO_TRIAL',       notes: 'Type 2 diabetes medication. Trial — note A1c, additional meds, and complications.', is_senior_only: false },
  { name: 'Seroquel (Quetiapine)',           category: 'SENIOR_TRIAL',     notes: 'Antipsychotic. Note underlying condition: bipolar, schizophrenia, or dementia.', is_senior_only: false },
  { name: 'Truvada (Emtricitabine/Tenofovir)', category: 'AUTO_TRIAL',    notes: 'HIV treatment or PrEP. If HIV treatment = auto decline. If PrEP (preventive) = trial.', is_senior_only: false },
  { name: 'Humira (Adalimumab)',             category: 'AUTO_TRIAL',       notes: "Biologic for RA, psoriasis, Crohn's. Trial. Note underlying condition severity.", is_senior_only: false },
  { name: 'Enbrel (Etanercept)',             category: 'AUTO_TRIAL',       notes: 'Biologic for RA. Trial — same handling as Humira.', is_senior_only: false },
  { name: 'Lisinopril',                      category: 'INFO_ONLY',        notes: 'ACE inhibitor for HBP. Generally standard or T2 if BP well-controlled.', is_senior_only: false },
  { name: 'Metoprolol',                      category: 'INFO_ONLY',        notes: 'Beta blocker for HBP/heart. Note underlying cardiac condition.', is_senior_only: false },
  { name: 'Atorvastatin (Lipitor)',          category: 'INFO_ONLY',        notes: 'Cholesterol medication. Generally standard if no other cardiac conditions.', is_senior_only: false },
  { name: 'Levothyroxine (Synthroid)',       category: 'INFO_ONLY',        notes: 'Thyroid medication. Standard or T2 if well-controlled.', is_senior_only: false },
  { name: 'Omeprazole (Prilosec)',           category: 'INFO_ONLY',        notes: 'GERD/acid reflux. Generally standard.', is_senior_only: false },
];

// ─── Build Chart ──────────────────────────────────────────────────────────────

function buildRanges() {
  const chart = [
    { h: 60, bands: [[100,148,'Standard'],[149,160,'T2'],[161,170,'T3'],[171,182,'T4'],[183,194,'T6'],[195,208,'T8'],[209,222,'T10'],[223,999,'T12']] },
    { h: 61, bands: [[100,152,'Standard'],[153,165,'T2'],[166,176,'T3'],[177,188,'T4'],[189,201,'T6'],[202,215,'T8'],[216,229,'T10'],[230,999,'T12']] },
    { h: 62, bands: [[100,158,'Standard'],[159,171,'T2'],[172,182,'T3'],[183,195,'T4'],[196,208,'T6'],[209,222,'T8'],[223,237,'T10'],[238,999,'T12']] },
    { h: 63, bands: [[100,163,'Standard'],[164,177,'T2'],[178,189,'T3'],[190,202,'T4'],[203,216,'T6'],[217,231,'T8'],[232,246,'T10'],[247,999,'T12']] },
    { h: 64, bands: [[100,169,'Standard'],[170,183,'T2'],[184,195,'T3'],[196,209,'T4'],[210,223,'T6'],[224,239,'T8'],[240,255,'T10'],[256,999,'T12']] },
    { h: 65, bands: [[100,174,'Standard'],[175,189,'T2'],[190,201,'T3'],[202,215,'T4'],[216,230,'T6'],[231,246,'T8'],[247,262,'T10'],[263,999,'T12']] },
    { h: 66, bands: [[100,180,'Standard'],[181,195,'T2'],[196,208,'T3'],[209,222,'T4'],[223,237,'T6'],[238,254,'T8'],[255,271,'T10'],[272,999,'T12']] },
    { h: 67, bands: [[100,186,'Standard'],[187,202,'T2'],[203,215,'T3'],[216,230,'T4'],[231,246,'T6'],[247,263,'T8'],[264,280,'T10'],[281,999,'T12']] },
    { h: 68, bands: [[100,193,'Standard'],[194,209,'T2'],[210,223,'T3'],[224,238,'T4'],[239,255,'T6'],[256,272,'T8'],[273,290,'T10'],[291,999,'T12']] },
    { h: 69, bands: [[100,199,'Standard'],[200,216,'T2'],[217,230,'T3'],[231,246,'T4'],[247,263,'T6'],[264,281,'T8'],[282,299,'T10'],[300,999,'T12']] },
    { h: 70, bands: [[100,205,'Standard'],[206,223,'T2'],[224,238,'T3'],[239,254,'T4'],[255,272,'T6'],[273,291,'T8'],[292,310,'T10'],[311,999,'T12']] },
    { h: 71, bands: [[100,212,'Standard'],[213,230,'T2'],[231,245,'T3'],[246,262,'T4'],[263,281,'T6'],[282,300,'T8'],[301,320,'T10'],[321,999,'T12']] },
    { h: 72, bands: [[100,219,'Standard'],[220,238,'T2'],[239,254,'T3'],[255,271,'T4'],[272,290,'T6'],[291,310,'T8'],[311,331,'T10'],[332,999,'T12']] },
    { h: 73, bands: [[100,226,'Standard'],[227,246,'T2'],[247,262,'T3'],[263,280,'T4'],[281,300,'T6'],[301,320,'T8'],[321,342,'T10'],[343,999,'T12']] },
    { h: 74, bands: [[100,233,'Standard'],[234,253,'T2'],[254,270,'T3'],[271,289,'T4'],[290,309,'T6'],[310,330,'T8'],[331,352,'T10'],[353,999,'T12']] },
    { h: 75, bands: [[100,241,'Standard'],[242,262,'T2'],[263,279,'T3'],[280,298,'T4'],[299,319,'T6'],[320,341,'T8'],[342,364,'T10'],[365,999,'T12']] },
    { h: 76, bands: [[100,249,'Standard'],[250,270,'T2'],[271,288,'T3'],[289,308,'T4'],[309,330,'T6'],[331,353,'T8'],[354,376,'T10'],[377,999,'T12']] },
    { h: 77, bands: [[100,257,'Standard'],[258,279,'T2'],[280,298,'T3'],[299,319,'T4'],[320,341,'T6'],[342,365,'T8'],[366,389,'T10'],[390,999,'T12']] },
    { h: 78, bands: [[100,265,'Standard'],[266,288,'T2'],[289,307,'T3'],[308,329,'T4'],[330,353,'T6'],[354,377,'T8'],[378,402,'T10'],[403,999,'T12']] },
  ];
  return chart.flatMap(({ h, bands }) =>
    (bands as [number,number,string][]).map(([min, max, rating]) => ({ height_inches: h, min_weight: min, max_weight: max, t_rating: rating }))
  );
}

// ─── Main seed ────────────────────────────────────────────────────────────────

async function seedDatabase() {
  console.log('Seeding database...\n');

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.query(
    'INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
    ['admin@apexscoop.com', hashedPassword, 'Admin']
  );
  console.log('✓ Admin user');

  // Blog posts
  const blogPosts = [
    { title: 'Understanding Life Insurance: A Beginner\'s Guide', slug: 'understanding-life-insurance',
      excerpt: 'Learn the basics of life insurance and why it matters for your family\'s financial security.',
      content: '<h2>What is Life Insurance?</h2><p>Life insurance is a contract between you and an insurance company. You pay regular premiums, and the insurer pays a death benefit to your beneficiaries if you pass away.</p><h2>Types of Life Insurance</h2><p><strong>Term Life:</strong> Coverage for a specific period (10, 20, or 30 years). Affordable and straightforward.</p><p><strong>Permanent Life:</strong> Covers you for life. Includes whole life and universal life options.</p>' },
    { title: 'How Much Life Insurance Do You Need?', slug: 'how-much-life-insurance',
      excerpt: 'Calculate the right coverage amount for your family\'s needs.',
      content: '<h2>Key Factors</h2><ul><li>Your income and dependents</li><li>Outstanding debts (mortgage, loans)</li><li>Future expenses (education)</li><li>Savings and investments</li></ul><h2>Rule of Thumb</h2><p>10–12 times your annual income in coverage is a common starting point. Contact us for a personalized calculation!</p>' },
  ];
  for (const post of blogPosts) {
    await db.query('INSERT INTO blog_posts (title, slug, content, excerpt, author, published) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (slug) DO NOTHING',
      [post.title, post.slug, post.content, post.excerpt, 'ApexScoop', true]);
  }
  console.log('✓ Blog posts');

  // Script types
  for (const st of SCRIPT_TYPES) {
    await db.query('INSERT INTO script_types (name, description) VALUES ($1,$2) ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description', [st.name, st.description]);
  }
  console.log(`✓ ${SCRIPT_TYPES.length} script types`);

  // Script sections
  let sectionCount = 0;
  for (const [typeName, sections] of Object.entries(SCRIPT_SECTIONS)) {
    const typeResult = await db.query('SELECT id FROM script_types WHERE name = $1', [typeName]);
    if (!typeResult.rows[0]) continue;
    const typeId = typeResult.rows[0].id;
    for (const s of sections) {
      const exists = await db.query('SELECT id FROM script_sections WHERE script_type_id=$1 AND section_number=$2', [typeId, s.section_number]);
      if (!exists.rows[0]) {
        await db.query('INSERT INTO script_sections (script_type_id, section_number, title, content) VALUES ($1,$2,$3,$4)', [typeId, s.section_number, s.title, s.content]);
        sectionCount++;
      }
    }
  }
  console.log(`✓ ${sectionCount} script sections inserted`);

  // Call outcomes
  const outcomes = [
    { name: 'Voicemail', description: 'Left voicemail — no live contact' },
    { name: 'Hangup', description: 'Prospect hung up before completing intro' },
    { name: 'Presentation Accepted', description: 'Appointment scheduled or presentation started' },
    { name: 'Insurance Sold', description: 'Policy application submitted successfully' },
    { name: 'Insurance Offer Rejected', description: 'Presentation given but prospect declined' },
    { name: 'Presentation Rejected', description: 'Prospect declined to hear the presentation' },
    { name: 'Not Qualified', description: 'Prospect does not meet underwriting requirements' },
  ];
  for (const o of outcomes) {
    await db.query('INSERT INTO call_outcomes (name, description) VALUES ($1,$2) ON CONFLICT (name) DO NOTHING', [o.name, o.description]);
  }
  console.log(`✓ ${outcomes.length} call outcomes`);

  // Objection types
  for (const ot of OBJECTION_TYPES) {
    await db.query('INSERT INTO objection_types (id, label, display_order) VALUES ($1,$2,$3) ON CONFLICT (id) DO UPDATE SET label=EXCLUDED.label, display_order=EXCLUDED.display_order', [ot.id, ot.label, ot.display_order]);
  }
  console.log(`✓ ${OBJECTION_TYPES.length} objection types`);

  // Rebuttals
  const firstType = await db.query('SELECT id FROM script_types LIMIT 1');
  const defaultTypeId = firstType.rows[0]?.id ?? 1;
  for (const r of REBUTTALS) {
    await db.query('INSERT INTO rebuttals (script_type_id, title, content, objection_type_id, nlp_notes, is_custom, status) VALUES ($1,$2,$3,$4,$5,false,\'active\')',
      [defaultTypeId, r.title, r.script, r.objectionId, r.nlpNotes ?? null]);
  }
  console.log(`✓ ${REBUTTALS.length} rebuttals`);

  // Conditions
  for (const c of CONDITIONS) {
    await db.query('INSERT INTO diseases (name, description, qualifications, category, is_senior_only) VALUES ($1,$2,$2,$3,$4) ON CONFLICT (name) DO UPDATE SET description=EXCLUDED.description, qualifications=EXCLUDED.qualifications, category=EXCLUDED.category, is_senior_only=EXCLUDED.is_senior_only',
      [c.name, c.notes, c.category, c.is_senior_only]);
  }
  console.log(`✓ ${CONDITIONS.length} conditions`);

  // Medications
  for (const m of MEDICATIONS) {
    await db.query('INSERT INTO medications (name, category, notes, is_senior_only) VALUES ($1,$2,$3,$4) ON CONFLICT (name) DO UPDATE SET category=EXCLUDED.category, notes=EXCLUDED.notes, is_senior_only=EXCLUDED.is_senior_only',
      [m.name, m.category, m.notes, m.is_senior_only]);
  }
  console.log(`✓ ${MEDICATIONS.length} medications`);

  // Build ranges
  const ranges = buildRanges();
  const existingRanges = await db.query('SELECT COUNT(*) as cnt FROM build_ranges');
  if (parseInt(existingRanges.rows[0].cnt) === 0) {
    for (const r of ranges) {
      await db.query('INSERT INTO build_ranges (height_inches, min_weight, max_weight, t_rating) VALUES ($1,$2,$3,$4)', [r.height_inches, r.min_weight, r.max_weight, r.t_rating]);
    }
    console.log(`✓ ${ranges.length} build ranges`);
  } else {
    console.log('  (build ranges already seeded)');
  }

  // Insurance types
  const insuranceTypes = [
    { name: 'Final Expense (Whole Life)', description: 'Senior whole life for burial/end-of-life costs', details: 'Covers funeral, burial, and final expenses. Premiums locked at time of issue. No medical exam for most plans. Issue ages 50–85.' },
    { name: 'Term Life', description: 'Temporary coverage for a set period', details: 'Provides coverage for 10, 20, or 30 years. Affordable premiums. Ideal during peak earning/debt years.' },
    { name: 'Senior Whole Life (Standard)', description: 'Permanent whole life for seniors 50+', details: 'Lifetime coverage. Builds cash value. Must pass basic health questions.' },
    { name: 'Senior Graded Whole Life', description: 'Guaranteed-issue whole life for higher-risk seniors', details: 'Graded benefit structure: limited payout in first 2 years, full benefit after. No health questions refused.' },
    { name: 'Accidental Death & Dismemberment (AD&D)', description: 'Coverage for death or injury from accidents', details: 'Pays lump sum on accidental death, loss of limb, or eyesight. Very affordable add-on.' },
    { name: 'Cancer Coverage', description: 'Lump sum on cancer diagnosis', details: 'Pays a lump-sum benefit upon first diagnosis of cancer. Use funds for treatment, travel, or daily bills.' },
    { name: "Child Safe Kit (CSK)", description: 'Free child safety kit with supplemental coverage', details: 'Provides a child ID kit plus children\'s life insurance option. Free to qualifying families.' },
    { name: 'Will Kit (FWK)', description: 'Free will kit with estate planning info', details: 'Provides a free will preparation kit. Opportunity to discuss life insurance needs during delivery.' },
    { name: 'POS Policy', description: 'Point-of-service policy renewal', details: 'Review and update existing AIL policies. Opportunity to add riders or increase coverage.' },
  ];
  for (const t of insuranceTypes) {
    await db.query('INSERT INTO insurance_types (name, description, details) VALUES ($1,$2,$3) ON CONFLICT (name) DO NOTHING', [t.name, t.description, t.details]);
  }
  console.log(`✓ ${insuranceTypes.length} insurance types`);

  console.log('\n✅ Database seeding complete!');
  process.exit(0);
}

seedDatabase().catch((err) => { console.error('Seed failed:', err); process.exit(1); });

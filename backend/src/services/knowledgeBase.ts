import db from '../db.js';

interface QAPair {
  keywords: string[];
  answer: string;
}

interface DBEntry {
  id: number;
  keywords: string[];
  answer: string;
  active: boolean;
  sort_order: number;
}

// ─── Default pairs (used as seed data and fallback when DB is empty) ──────────

export const DEFAULT_PAIRS: QAPair[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    answer: "Hi there! Welcome to ApexScoop. I'm here to help you learn about insurance options for you and your family. What questions do you have today?",
  },
  {
    keywords: ['what is american income life', 'about american income life', 'ail', 'who is american income life'],
    answer: "American Income Life (AIL) is an A+ (Superior) rated insurance company by AM Best — one of the highest ratings in the industry. They specialize in protecting working families, union members, and credit union members with affordable life, accident, and supplemental health coverage.",
  },
  {
    keywords: ['term life', 'term insurance', 'temporary life', 'term policy'],
    answer: "Term life insurance provides coverage for a set period (10, 20, or 30 years) at affordable monthly premiums. It's ideal if you want to protect your family while your kids are young, while paying off a mortgage, or during your peak earning years. Many plans start as low as $15–20/month.",
  },
  {
    keywords: ['whole life', 'permanent life', 'cash value', 'whole life insurance'],
    answer: "Whole life insurance covers you for your entire life and builds cash value over time — like a savings account inside your policy. Premiums stay locked at the rate you qualify for today, so the younger and healthier you are when you start, the better. Jonathan can walk you through the numbers in a free consultation.",
  },
  {
    keywords: ['accidental death', 'ad&d', 'accident coverage', 'accidental', 'dismemberment'],
    answer: "Accidental Death & Dismemberment (AD&D) coverage pays your beneficiaries if you die or suffer a serious injury (like loss of a limb or eyesight) due to an accident. It's a low-cost supplement to life insurance that many working families add for extra peace of mind.",
  },
  {
    keywords: ['supplemental health', 'supplemental', 'health insurance', 'medical bills', 'hospital bills'],
    answer: "Supplemental health insurance fills the gaps your primary health plan doesn't cover — things like deductibles, copays, and out-of-pocket costs from hospital stays. AIL benefits are paid directly to you, not the hospital, so you decide how to use them.",
  },
  {
    keywords: ["children's life", 'child life', 'kids life', 'kids insurance', 'child insurance', 'baby'],
    answer: "Children's life insurance locks in your child's insurability at a very young age, regardless of future health conditions. It also builds cash value they can use as adults. Premiums are very low — often just a few dollars a month — and coverage can never be taken away.",
  },
  {
    keywords: ['mortgage protection', 'mortgage', 'home loan', 'house', 'mortgage insurance'],
    answer: "Mortgage protection insurance ensures your family can keep the home if something happens to you. The death benefit is designed to pay off your remaining mortgage balance so your loved ones don't face foreclosure during an already difficult time.",
  },
  {
    keywords: ['cancer', 'heart attack', 'stroke', 'critical illness', 'critical'],
    answer: "Cancer, heart attack, and stroke coverage pays a lump-sum benefit directly to you upon diagnosis. These funds help cover treatment costs, travel to specialists, lost income, and everyday bills while you focus on recovery — without depleting your savings.",
  },
  {
    keywords: ['cost', 'price', 'how much', 'expensive', 'affordable', 'monthly', 'premium', 'cheap', 'rates'],
    answer: "Coverage through AIL starts from as little as $15–20/month for basic protection. Exact pricing depends on your age, health, coverage amount, and the plan you choose. For personalized numbers, schedule a free consultation with Jonathan — there's no obligation and no pressure.",
  },
  {
    keywords: ['medical exam', 'exam', 'health check', 'blood test', 'physical', 'no exam'],
    answer: "Great news — many AIL plans require no medical exam to qualify! You can often get covered with just a few health questions. Jonathan can help you find the right plan regardless of your current health situation.",
  },
  {
    keywords: ['union', 'union member', 'labor union', 'credit union'],
    answer: "AIL has a long history of partnering with labor unions and credit unions to provide exclusive group rates and benefits to members and their families. If you or a family member are union members, you may qualify for special pricing. Ask Jonathan about your eligibility.",
  },
  {
    keywords: ['consultation', 'appointment', 'meet', 'talk', 'speak', 'schedule', 'book', 'call'],
    answer: "Jonathan offers FREE no-obligation consultations to help you understand your options and find coverage that fits your budget. You can schedule directly on this site or share your contact info and he'll reach out. There's no pressure — just honest guidance.",
  },
  {
    keywords: ['contact', 'reach', 'email', 'phone', 'number', 'get in touch'],
    answer: "You can reach Jonathan through the contact form on this site, or schedule a free consultation to talk directly. Leave your name, email, and phone number here in the chat and Jonathan will follow up personally.",
  },
  {
    keywords: ['beneficiary', 'payout', 'death benefit', 'family', 'loved ones', 'dependents'],
    answer: "With AIL policies, the death benefit is paid directly to your named beneficiary — not the hospital or creditors. Your family receives the money tax-free and can use it however they need: funeral costs, mortgage, bills, education, or daily living expenses.",
  },
  {
    keywords: ['quote', 'estimate', 'coverage amount', 'how much coverage'],
    answer: "I can't generate actual quotes here — only Jonathan can provide personalized pricing after reviewing your specific situation. What I can tell you is that basic coverage starts around $15–20/month. Click 'Schedule Free Consultation' or use the Life Insurance Calculator on this site to get started!",
  },
  {
    keywords: ['life insurance calculator', 'calculator', 'how much do i need', 'calculate'],
    answer: "We have a free Life Insurance Needs Calculator right on this website! It helps you estimate how much coverage makes sense based on your income, debts, dependents, and goals. Give it a try — it only takes about 2 minutes.",
  },
  {
    keywords: ['am best', 'rating', 'a+', 'financial strength', 'trustworthy', 'reliable', 'legit'],
    answer: "American Income Life holds an A+ (Superior) rating from AM Best, the gold standard for evaluating insurance company financial strength. This means AIL has been independently verified to have the resources to pay claims. You can trust your family is protected.",
  },
  {
    keywords: ['why jonathan', 'why apex', 'who are you', 'about jonathan', 'jonathan holloway'],
    answer: "Jonathan Holloway is a licensed American Income Life agent dedicated to helping working families build financial security. He provides honest, no-pressure guidance and takes time to understand your specific situation before recommending any coverage. His goal is to be your long-term insurance partner, not just make a sale.",
  },
  {
    keywords: ['how does it work', 'process', 'steps', 'get started', 'sign up', 'enroll'],
    answer: "Getting started is simple: (1) Schedule a free consultation with Jonathan, (2) He reviews your needs and budget, (3) He recommends plans that fit, (4) You choose — no pressure. Most policies can be activated within days and many don't require a medical exam.",
  },
];

const FALLBACK_RESPONSES = [
  "That's a great question! For detailed information specific to your situation, I'd recommend scheduling a **free consultation with Jonathan**. He can give you accurate, personalized answers. You can book directly on this site.",
  "I want to make sure you get the right answer. Jonathan specializes in exactly this kind of question — reach out for a **free no-obligation consultation** and he'll walk you through everything.",
  "I may not have all the details on that, but Jonathan absolutely does. Would you like to **schedule a free call** with him? There's no pressure — just helpful guidance tailored to your situation.",
];

// ─── In-memory cache (5-minute TTL) ──────────────────────────────────────────

let cache: { entries: DBEntry[]; loadedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

async function loadEntries(): Promise<QAPair[]> {
  const now = Date.now();
  if (cache && now - cache.loadedAt < CACHE_TTL_MS) {
    return cache.entries.filter((e) => e.active);
  }

  try {
    const result = await db.query(
      'SELECT id, keywords, answer, active, sort_order FROM chat_kb_entries ORDER BY sort_order ASC, id ASC'
    );
    cache = { entries: result.rows, loadedAt: now };
    const active = result.rows.filter((e: DBEntry) => e.active);
    return active.length > 0 ? active : DEFAULT_PAIRS;
  } catch {
    return DEFAULT_PAIRS;
  }
}

export function invalidateCache(): void {
  cache = null;
}

// ─── Matching logic ───────────────────────────────────────────────────────────

function scoreMatch(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (lower.includes(kw)) {
      score += kw.split(' ').length;
    }
  }
  return score;
}

export async function getKnowledgeBaseResponse(userMessage: string): Promise<{ answer: string; escalated: boolean }> {
  const pairs = await loadEntries();
  let bestScore = 0;
  let bestAnswer = '';

  for (const pair of pairs) {
    const score = scoreMatch(userMessage, pair.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = pair.answer;
    }
  }

  if (bestScore > 0) return { answer: bestAnswer, escalated: false };

  const idx = userMessage.length % FALLBACK_RESPONSES.length;
  return { answer: FALLBACK_RESPONSES[idx], escalated: true };
}

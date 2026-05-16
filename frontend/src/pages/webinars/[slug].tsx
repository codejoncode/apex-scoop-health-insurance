import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';

const BASE = 'https://docs.google.com/forms/d/e/1FAIpQLScwSVxru7odH1ej_3ZZIs74NMi8Gp5Cy5mWKX6auB2ysTvbiQ/viewform';

interface Webinar {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  // pre-filled embedded form URL — append &embedded=true to the pre-fill link
  formSrc: string;
  paragraphs: string[];
}

export const WEBINARS: Record<string, Webinar> = {
  'whole-life-101': {
    title: 'Whole Life 101',
    subtitle: 'Lifetime Coverage, Cash Value, and a Premium That Never Changes',
    icon: '🏠',
    gradient: 'from-blue-800 to-cyan-700',
    formSrc: `${BASE}?usp=pp_url&entry.1753222212=Whole+Life+101&embedded=true`,
    paragraphs: [
      'Most people have heard of whole life insurance. Far fewer understand what it actually does — and why it\'s fundamentally different from the term policy most employers hand out.',
      'In this session we break it down in plain English: how the death benefit works, how cash value builds year after year, what paid-up options mean for your retirement, and what real AIL premiums look like for working adults at every age.',
      'Whether you\'re 25 and just starting out or 50 and filling a gap, this session gives you the complete picture — and the numbers to back it up.',
    ],
  },

  'income-mortgage-protection': {
    title: 'Income & Mortgage Protection',
    subtitle: "What Happens to Your Family's Finances If Your Paycheck Stops?",
    icon: '🏦',
    gradient: 'from-indigo-800 to-blue-700',
    formSrc: `${BASE}?usp=pp_url&entry.1753222212=Income+%26+Mortgage+Protection&embedded=true`,
    paragraphs: [
      'The mortgage doesn\'t pause. The bills don\'t pause. But income can — without warning.',
      'This session is built for working families who have a mortgage, a spouse or partner who depends on their income, or children who need financial stability through adulthood.',
      'We walk through AIL\'s full term lineup — 4-Year, 10-Year, 20-Year, Decreasing Term, and Term to 65 — show you real premium numbers from the 2025 ratebook, and explain how stacking a whole life base with term protection creates a complete income plan.',
      'We also cover the conversion advantage: how to move from term to whole life without a new medical exam — and why that matters more than most people realize.',
    ],
  },

  'free-membership-benefits': {
    title: 'Free Membership Benefits',
    subtitle: "What Most Families Don't Know They Already Qualify For",
    icon: '🎁',
    gradient: 'from-emerald-700 to-teal-600',
    formSrc: `${BASE}?usp=pp_url&entry.1753222212=Free+membership+Benefits&embedded=true`,
    paragraphs: [
      'Did you know there are membership benefits available to your family — at no cost to start?',
      'In this session we pull back the curtain on the free membership tier that includes a discount card for prescriptions, vision, and dental, a legally-guided Will kit, a Family Guide to organize everything your loved ones would need, and Accidental Death & Dismemberment coverage.',
      'No catch. No pressure. Just real protection most families walk right past.',
      'If you have a family, a mortgage, or anyone who depends on you — this session is 30 minutes that could change everything.',
    ],
  },

  'underwriting-eligibility': {
    title: 'Underwriting & Eligibility 101',
    subtitle: 'What Really Matters on the Application — and Why Honesty Protects Your Family',
    icon: '📋',
    gradient: 'from-slate-700 to-blue-700',
    formSrc: `${BASE}?usp=pp_url&entry.1753222212=Underwriting+%26+Eligibility&embedded=true`,
    paragraphs: [
      'Most people sign an insurance application without fully understanding what underwriting evaluates — or what happens at claim time if something was left out.',
      'This session demystifies the process: the six major factors AIL looks at (age and face amount, build, tobacco status, health history, medications, and driving record), how tobacco user vs. non-tobacco user rates differ in real dollars, what trials and declines actually mean, and which plans have oral specimen requirements.',
      'Most importantly, we cover the contestability period and why complete honesty on the application is the single most important thing you can do to make sure your family\'s claim actually gets paid.',
      'This session is for anyone who is about to apply — or who has ever wondered whether their current policy will hold up when it matters most.',
    ],
  },

  'final-expense-senior-protection': {
    title: 'Final Expense & Senior Protection',
    subtitle: "Every Family Deserves a Plan. It's Never Too Late to Put One in Place.",
    icon: '🕊️',
    gradient: 'from-blue-900 to-slate-700',
    formSrc: `${BASE}?usp=pp_url&entry.1753222212=Final+Expense+%26+Senior+Protection&embedded=true`,
    paragraphs: [
      'The average funeral costs nearly $10,000 before the cemetery plot, headstone, and outstanding bills are added. 73% of seniors have no dedicated final expense plan.',
      'This session is for seniors ages 60–80 and the adult children who love them.',
      'We walk through AIL\'s Senior Whole Life plan for those who qualify through standard underwriting, and the Senior Graded Whole Life — a simplified application with no oral specimen required — for seniors with more complex health histories.',
      'We show real 2025 ratebook premiums at every key senior age, explain the graded benefit structure (25% / 50% / 75% / 100% over four years), and give adult family members the practical language to have this conversation compassionately and confidently.',
    ],
  },

  'senior-underwriting-deep-dive': {
    title: 'Senior Underwriting Deep Dive',
    subtitle: 'Getting the Right Coverage — Compassionately and Correctly',
    icon: '🎓',
    gradient: 'from-blue-900 to-indigo-800',
    formSrc: `${BASE}?usp=pp_url&entry.1753222212=Senior+Underwriting+Deep+Dive&embedded=true`,
    paragraphs: [
      'This is the most specialized session in the series — built for agents, adult children helping a parent apply, and seniors who want to understand the process before they start.',
      'We go deep on the AG-2662 simplified application: the six question categories that determine the outcome, how medications map to underwriting results, and the clear framework for determining whether a senior lands on level coverage, graded coverage, or a decline.',
      'We cover four real senior profiles with actual medications and outcomes, and spend dedicated time on how to present graded coverage in a way that builds confidence rather than doubt.',
      'If you\'ve ever had a senior say "I probably can\'t get coverage" — this session is the preparation that changes that conversation.',
    ],
  },

  'riders-that-matter': {
    title: 'Riders That Matter',
    subtitle: 'The Add-Ons That Turn a Good Policy Into a Complete Plan',
    icon: '🔧',
    gradient: 'from-violet-800 to-purple-700',
    formSrc: `${BASE}?usp=pp_url&entry.1753222212=Riders+That+Matter&embedded=true`,
    paragraphs: [
      'A base policy covers death. Riders cover everything that happens before it — accidents, disability, critical illness, terminal diagnosis.',
      'In this advanced session we go through all eight major AIL riders one by one: Accidental Death, the B2000 Special AD Benefit with its $10K/$25K/$50K payout tiers, the Terminal Illness Rider that pays 50% of your face amount while you\'re still alive (included free on every policy), the Critical Illness Rider, Waiver of Premium, Guaranteed Insurability, the Children\'s Term Rider, and the Spouse Rider.',
      'We show what each one costs from the 2025 ratebook, who needs it, and how they stack together into a protection plan — not just a policy.',
    ],
  },

  'kids-coverage-future-insurability': {
    title: "Kids' Coverage & Future Insurability",
    subtitle: 'The Greatest Financial Gift You Can Give a Child Costs Pennies a Day',
    icon: '👶',
    gradient: 'from-cyan-700 to-teal-600',
    formSrc: `${BASE}?usp=pp_url&entry.1753222212=Kids'+Coverage+%26+Future+Insurability&embedded=true`,
    paragraphs: [
      'Most parents focus on college savings. Almost none think about what happens if a child develops a health condition at 9, 14, or 18 — and can no longer qualify for life insurance on their own.',
      'This session covers AIL\'s Head Start whole life plans for children ages 0–17, the Children\'s Term Rider that covers every child under one flat rate, and most importantly the Guaranteed Insurability Option — the rider that locks in a child\'s right to buy additional whole life coverage at ages 25, 28, 31, 34, 37, and 40, regardless of what happens to their health.',
      'We show real ratebook rates, real cash value tables, and the premium comparison that makes clear why every year of waiting costs more than money.',
    ],
  },
};

interface Props {
  webinar: Webinar;
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(WEBINARS).map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const webinar = WEBINARS[slug] ?? null;
  if (!webinar) return { notFound: true };
  return { props: { webinar, slug } };
};

export default function WebinarPage({ webinar, slug }: Props) {
  return (
    <Layout>

      {/* Hero banner */}
      <section className={`bg-gradient-to-br ${webinar.gradient} text-white py-12 md:py-16`}>
        <div className="max-w-4xl mx-auto px-5">
          <Link
            href="/#webinars"
            className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            ← All Webinars
          </Link>
          <div className="flex items-start gap-4">
            <span className="text-4xl md:text-5xl flex-shrink-0 mt-1">{webinar.icon}</span>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
                Free Webinar · Tuesday &amp; Thursday 7 PM
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3">
                {webinar.title}
              </h1>
              <p className="text-white/80 text-sm sm:text-lg max-w-2xl">
                {webinar.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-xl sm:text-2xl font-bold mb-5 text-gray-800">
            What This Session Covers
          </h2>
          <div className="space-y-4">
            {webinar.paragraphs.map((p, i) => (
              <p key={i} className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
            <p className="text-blue-800 text-sm font-semibold">
              📅 Sessions run every Tuesday &amp; Thursday at 7 PM via Google Meet.
              Register below — you will receive the access link by email 24 hours before.
            </p>
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Reserve Your Spot</h2>
            <p className="text-gray-500 text-sm">Free. No obligation. Just show up ready to learn.</p>
          </div>
          <p className="text-xs text-gray-500 text-center mb-3">
            By submitting this form you agree to our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>.
          </p>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <iframe
              src={webinar.formSrc}
              width="100%"
              height="2099"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title={`Register for ${webinar.title}`}
              className="block w-full"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>

      {/* Other sessions */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-lg font-bold mb-2">Explore Other Sessions</h2>
          <p className="text-gray-500 text-sm mb-6">All webinars are free — pick any topic that fits your family.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(WEBINARS)
              .filter(([s]) => s !== slug)
              .map(([s, w]) => (
                <Link
                  key={s}
                  href={`/webinars/${s}`}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium hover:border-blue-400 hover:text-blue-700 transition-colors shadow-sm"
                >
                  <span>{w.icon}</span>
                  <span>{w.title}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </Layout>
  );
}

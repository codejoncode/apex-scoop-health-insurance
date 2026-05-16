import Link from 'next/link';
import Layout from '@/components/Layout';

const CONSULTATION_FORM_SRC =
  'https://docs.google.com/forms/d/e/1FAIpQLScaYFkfeh3H7SSBTC_J4t2IUihQJ-1_ygsQqjN5R836_Swhsg/viewform?embedded=true';

const WEBINAR_TOPICS = [
  { slug: 'whole-life-101',                  icon: '🏠', title: 'Whole Life 101' },
  { slug: 'income-mortgage-protection',      icon: '🏦', title: 'Income & Mortgage Protection' },
  { slug: 'free-membership-benefits',        icon: '🎁', title: 'Free Membership Benefits' },
  { slug: 'underwriting-eligibility',        icon: '📋', title: 'Underwriting & Eligibility 101' },
  { slug: 'final-expense-senior-protection', icon: '🕊️', title: 'Final Expense & Senior Protection' },
  { slug: 'senior-underwriting-deep-dive',   icon: '🎓', title: 'Senior Underwriting Deep Dive' },
  { slug: 'riders-that-matter',              icon: '🔧', title: 'Riders That Matter' },
  { slug: 'kids-coverage-future-insurability', icon: '👶', title: "Kids' Coverage & Future Insurability" },
];

const OFFERINGS = [
  { icon: '❤️', title: 'Whole Life Insurance',     desc: 'Permanent coverage that builds cash value. Premiums never increase.' },
  { icon: '🛡️', title: 'Term & Income Protection',  desc: 'Replace your paycheck if you pass away during your earning years.' },
  { icon: '⚕️', title: 'Health & Accident Coverage', desc: 'Supplemental coverage for hospital stays, accidents, and critical illness.' },
  { icon: '🏦', title: 'Mortgage Protection',       desc: 'Ensure your family keeps the home if you are no longer here to pay for it.' },
  { icon: '🕊️', title: 'Final Expense',             desc: 'Affordable whole life plans that cover funeral costs and final bills.' },
  { icon: '👶', title: "Children's Coverage",       desc: "Guarantee your child's future insurability at today's low rates." },
];

export default function Home() {
  return (
    <Layout>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-blue-800 to-cyan-700 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <p className="text-cyan-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4">
            Licensed Life, Health &amp; Accident Insurance Agent
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            Protect What Matters Most
          </h1>
          <p className="text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Honest, personalized insurance guidance from a licensed AIL agent. No pressure —
            just answers and options that fit your family and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#consultation"
              className="w-full sm:w-auto bg-white text-blue-800 px-7 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors text-center"
            >
              Book a Free Consultation
            </a>
            <a
              href="#webinars"
              className="w-full sm:w-auto border-2 border-white text-white px-7 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-800 transition-colors text-center"
            >
              View Free Webinars
            </a>
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ── */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">What We Offer</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Through American Income Life, I help families get coverage that actually pays when it counts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFERINGS.map((o) => (
              <div key={o.title} className="card flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">{o.icon}</span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base mb-1">{o.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-5">
          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-2xl px-6 py-8 sm:px-10 sm:py-10 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold">100%</div>
              <div className="text-blue-100 text-xs sm:text-sm mt-1">Personalized</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold">$0</div>
              <div className="text-blue-100 text-xs sm:text-sm mt-1">No hidden fees</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-extrabold">24h</div>
              <div className="text-blue-100 text-xs sm:text-sm mt-1">Response time</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREE CONSULTATION ── */}
      <section id="consultation" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">Book a Free Consultation</h2>
            <p className="text-gray-500 text-sm sm:text-base">
              No obligation. A licensed agent will reach out within 24 hours.
            </p>
          </div>
          <p className="text-xs text-gray-500 text-center mb-3">
            By submitting this form you agree to our{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>.
          </p>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <iframe
              src={CONSULTATION_FORM_SRC}
              width="100%"
              height="820"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Free Consultation Request"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>

      {/* ── FREE WEBINARS ── */}
      <section id="webinars" className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">Free Educational Webinars</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              Live sessions every <strong>Tuesday &amp; Thursday at 7 PM</strong>.
              Click any topic below to read a full overview and register for that session.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {WEBINAR_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/webinars/${topic.slug}`}
                className="card p-4 md:p-5 hover:shadow-lg hover:border-blue-400 border-2 border-transparent transition-all group"
              >
                <div className="text-2xl mb-2">{topic.icon}</div>
                <h3 className="font-bold text-xs sm:text-sm leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                  {topic.title}
                </h3>
                <span className="text-xs text-blue-600 font-semibold">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-blue-800 text-white py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Questions? Let&apos;s Talk.</h2>
          <p className="text-blue-200 text-sm sm:text-base mb-6">
            I am a real person and I will answer.
          </p>
          <a
            href="#consultation"
            className="inline-block bg-white text-blue-800 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>

    </Layout>
  );
}

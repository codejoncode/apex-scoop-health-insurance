import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-0">
      <div className="max-w-6xl mx-auto px-5">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo.svg" alt="ApexScoop" width={28} height={32} />
              <div className="leading-none">
                <div className="text-lg font-black tracking-tight">
                  <span className="text-blue-400">Apex</span>
                  <span className="text-cyan-400">Scoop</span>
                </div>
                <div className="text-[9px] font-semibold text-gray-500 tracking-[0.18em] uppercase">
                  Insurance Services
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A licensed Life, Health &amp; Accident insurance agent helping families protect
              what matters most — through American Income Life.
            </p>
          </div>

          {/* Webinars */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-200 uppercase tracking-wide">
              Free Webinars
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/webinars/whole-life-101" className="hover:text-white transition-colors">Whole Life 101</Link></li>
              <li><Link href="/webinars/income-mortgage-protection" className="hover:text-white transition-colors">Income &amp; Mortgage Protection</Link></li>
              <li><Link href="/webinars/free-membership-benefits" className="hover:text-white transition-colors">Free Membership Benefits</Link></li>
              <li><Link href="/webinars/final-expense-senior-protection" className="hover:text-white transition-colors">Final Expense &amp; Senior Protection</Link></li>
              <li><Link href="/#webinars" className="hover:text-white transition-colors text-blue-400">View all 8 sessions →</Link></li>
            </ul>
          </div>

          {/* Contact / Legal */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-200 uppercase tracking-wide">
              Get Started
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm mb-6">
              <li><a href="/#consultation" className="hover:text-white transition-colors">Book a Free Consultation</a></li>
              <li><a href="/#webinars" className="hover:text-white transition-colors">Join a Webinar</a></li>
              <li>
                <a href="mailto:jonathanholloway.ail@gmail.com" className="hover:text-white transition-colors">
                  jonathanholloway.ail@gmail.com
                </a>
              </li>
            </ul>
            <h4 className="font-bold text-sm mb-3 text-gray-200 uppercase tracking-wide">Legal</h4>
            <ul className="space-y-1 text-gray-500 text-xs">
              <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {year} ApexScoop Insurance Services. All rights reserved.</p>
          <p>Licensed Life, Health &amp; Accident Insurance Agent · American Income Life</p>
        </div>
      </div>
    </footer>
  );
}

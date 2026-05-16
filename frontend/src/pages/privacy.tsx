import Layout from '@/components/Layout';
import Link from 'next/link';

// TODO: Replace IN-XXXXXXX with your actual Indiana insurance license number
const IN_LICENSE = '3968155';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-5 py-12 md:py-16">

        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last Updated: May 16, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm sm:text-base leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-600">
              This Privacy Policy explains how Jonathan Holloway, operating through ApexScoop.com
              (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), collects, uses, stores, and protects
              your personal information when you visit our website, submit our contact form, or
              participate in our webinars.
            </p>
            <p className="text-gray-600 mt-3">
              By using our website or submitting our form, you agree to the practices described in
              this Privacy Policy. If you do not agree, please do not submit your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Information We Collect Online</h2>
            <p className="text-gray-600 mb-3">When you submit our contact form, we collect only the following:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Full name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>State of residence</li>
              <li>Best time to call</li>
              <li>Preferred callback date</li>
              <li>Consent for text messages (if checked)</li>
              <li>Consent for promotional offers (if checked)</li>
            </ul>
            <p className="text-gray-600 mt-4 font-semibold">We do NOT collect through our website form:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2 mt-2">
              <li>Health information (diagnoses, medications, prescriptions)</li>
              <li>Financial information (income, debt amounts, coverage premiums)</li>
              <li>Date of birth</li>
              <li>Coverage details or insurance needs</li>
            </ul>
            <p className="text-gray-600 mt-3">
              All sensitive information is collected verbally during phone consultations only and
              is handled through secure, licensed insurance systems.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-3">We use the information you provide to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Contact you for insurance consultation or webinar access</li>
              <li>Determine insurance licensing availability in your state</li>
              <li>Schedule callbacks at your preferred time</li>
              <li>Send text messages if you provided written consent</li>
              <li>Send promotional offers and newsletters if you provided written consent</li>
              <li>Share your information with a licensed agent in your state if we are not yet licensed there</li>
            </ul>
            <p className="text-gray-600 mt-4 font-semibold">We do NOT:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2 mt-2">
              <li>Sell, rent, or resell your personal information to third parties</li>
              <li>Share your data with third parties for unrelated marketing purposes</li>
              <li>Use your information for any purpose other than insurance consultation and communication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. State Licensing Disclosure</h2>
            <p className="text-gray-600 mb-3">
              Jonathan Holloway is currently licensed to sell and consult on insurance products
              in <strong>Indiana (License # {IN_LICENSE})</strong>.
            </p>
            <p className="text-gray-600 font-semibold">If you reside in Indiana:</p>
            <p className="text-gray-600 ml-2 mt-1">You will be contacted directly by Jonathan Holloway.</p>
            <p className="text-gray-600 font-semibold mt-3">If you reside outside Indiana:</p>
            <p className="text-gray-600 ml-2 mt-1">
              Your information may be shared with a properly licensed insurance agent in your state.
              That agent will contact you directly. You are not required to purchase any product or
              service. We may also contact you directly once we obtain licensing in your state.
            </p>
            <p className="text-gray-600 mt-3">
              For our current licensing status, contact us at{' '}
              <a href="mailto:jonathanholloway.ail@gmail.com" className="text-blue-600 hover:underline">
                jonathanholloway.ail@gmail.com
              </a>{' '}
              or <a href="tel:7734921722" className="text-blue-600 hover:underline">773-492-1722</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Third-Party Agent Sharing</h2>
            <p className="text-gray-600">
              If you reside in a state where we are not yet licensed, your name, phone number,
              email address, and state of residence may be shared with a licensed insurance agent
              who can serve you in your state. These agents are bound by their own privacy
              obligations and state insurance regulations. We do not sell your information to
              these agents. Sharing is done solely for the purpose of connecting you with
              licensed insurance assistance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Google Forms and Google Sheets</h2>
            <p className="text-gray-600">
              Your information is collected via Google Forms and stored in Google Sheets. Google
              acts as our data processor and stores your information on secure servers.
              Google&apos;s{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              govern their handling of your data. We access and use your information only for the
              purposes described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. Text Message Consent (TCPA)</h2>
            <p className="text-gray-600 mb-3">
              If you checked the box to receive text messages, you have provided express written
              consent under the Telephone Consumer Protection Act (TCPA) to receive text messages
              from Jonathan Holloway and/or affiliated licensed agents at the phone number you provided.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Messages may include call reminders, consultation updates, webinar invitations, and promotional offers</li>
              <li>Message frequency varies</li>
              <li>Standard message and data rates may apply</li>
              <li>Opt-out at any time by replying <strong>STOP</strong> to any text message</li>
              <li>Consent to text messages is not required to purchase any product or service</li>
              <li>For help, reply <strong>HELP</strong> to any text message</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Email Marketing (CAN-SPAM)</h2>
            <p className="text-gray-600 mb-3">
              If you checked the box to receive promotional offers, you will receive emails about
              insurance products, webinars, and special promotions.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Opt-out at any time by clicking the Unsubscribe link in any email</li>
              <li>We will process your opt-out request within 10 business days</li>
              <li>Transactional emails (appointment reminders, webinar access) may still be sent after opt-out</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">9. Data Security</h2>
            <p className="text-gray-600">
              We take reasonable measures to protect your personal information from unauthorized
              access, use, or disclosure, including storage in Google Sheets with industry-standard
              encryption, limiting access to only necessary agents and personnel, and not storing
              sensitive health or financial information through our website form. However, no method
              of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">10. Data Retention</h2>
            <p className="text-gray-600">
              We retain your personal information for 12 months from the date of your last contact
              with us, unless you request deletion (we will delete within 30 days), applicable law
              requires longer retention, or you remain an active lead or client.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">11. Your Privacy Rights</h2>
            <p className="text-gray-600 mb-3">Depending on your state of residence, you may have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate personal information</li>
              <li>Delete your personal information</li>
              <li>Opt-out of text messages (reply STOP)</li>
              <li>Opt-out of promotional emails (click Unsubscribe)</li>
              <li>Know whether your information has been shared with third-party agents</li>
            </ul>
            <p className="text-gray-600 mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:jonathanholloway.ail@gmail.com" className="text-blue-600 hover:underline">
                jonathanholloway.ail@gmail.com
              </a>{' '}
              or <a href="tel:7734921722" className="text-blue-600 hover:underline">773-492-1722</a>.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">12. California Residents (CCPA/CPRA)</h2>
            <p className="text-gray-600 mb-3">
              California residents have additional rights under the CCPA and CPRA:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know whether your information is sold (we do <strong>NOT</strong> sell your data)</li>
              <li>Right to request deletion of your personal information</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
              <li>Right to correct inaccurate personal information</li>
            </ul>
            <p className="text-gray-600 mt-3">
              To exercise California privacy rights:{' '}
              <a href="mailto:jonathanholloway.ail@gmail.com" className="text-blue-600 hover:underline">
                jonathanholloway.ail@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">13. License Expansion Notice</h2>
            <p className="text-gray-600">
              We are actively obtaining additional state insurance licenses. If we obtain licensing
              in your state after you submit your information, we may contact you to offer our
              consultation services. You are not required to respond or purchase anything. You may
              request to be removed from our contact list at any time by emailing{' '}
              <a href="mailto:jonathanholloway.ail@gmail.com" className="text-blue-600 hover:underline">
                jonathanholloway.ail@gmail.com
              </a>{' '}
              or replying STOP to any text message.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">14. Children&apos;s Privacy</h2>
            <p className="text-gray-600">
              Our website and services are not directed to individuals under the age of 18. We do
              not knowingly collect personal information from children under 18. If you believe we
              have collected information from a child under 18, please contact us immediately at{' '}
              <a href="mailto:jonathanholloway.ail@gmail.com" className="text-blue-600 hover:underline">
                jonathanholloway.ail@gmail.com
              </a>{' '}
              and we will delete the information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">15. Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. When we do, we will update the
              &ldquo;Last Updated&rdquo; date at the top of this page. Continued use of our website or form
              after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">16. Contact Us</h2>
            <div className="text-gray-600 space-y-1">
              <p><strong>Jonathan Holloway</strong></p>
              <p>Website: <a href="https://www.apexscoop.com" className="text-blue-600 hover:underline">www.ApexScoop.com</a></p>
              <p>Email: <a href="mailto:jonathanholloway.ail@gmail.com" className="text-blue-600 hover:underline">jonathanholloway.ail@gmail.com</a></p>
              <p>Phone: <a href="tel:7734921722" className="text-blue-600 hover:underline">773-492-1722</a></p>
              <p>Location: Crown Point, Indiana</p>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}

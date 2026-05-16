import Layout from '@/components/Layout';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-5 py-12 md:py-16">

        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last Updated: May 16, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm sm:text-base leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using ApexScoop.com (the &ldquo;Website&rdquo;), submitting any form on our
              Website, or communicating with us through any channel, you agree to be bound by
              these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do
              not use our Website or submit your information.
            </p>
            <p className="text-gray-600 mt-3">
              These Terms apply to all visitors, users, and others who access or use the Website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. About Our Services</h2>
            <p className="text-gray-600 mb-3">
              ApexScoop.com is operated by Jonathan Holloway, a licensed Life, Health, and
              Accident Insurance Agent affiliated with American Income Life Insurance Company.
              Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Providing general insurance education and information</li>
              <li>Hosting free educational webinars on insurance topics</li>
              <li>Collecting contact information for insurance consultation scheduling</li>
              <li>Connecting prospective clients with licensed insurance agents</li>
            </ul>
            <p className="text-gray-600 mt-3 font-semibold">We do NOT:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2 mt-2">
              <li>Sell insurance products directly through this Website</li>
              <li>Provide binding insurance quotes through this Website</li>
              <li>Guarantee coverage, approval, or specific premium rates</li>
              <li>Provide legal, tax, or financial planning advice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Insurance Licensing Disclosure</h2>
            <p className="text-gray-600 mb-3">
              Jonathan Holloway is currently licensed to sell and consult on insurance products
              in <strong>Indiana</strong>. Insurance products and services are regulated by state law.
              Not all products described on this Website may be available in your state.
            </p>
            <p className="text-gray-600">
              If you reside outside of a state where we are currently licensed, your inquiry may
              be referred to a licensed agent in your state. By submitting our contact form, you
              acknowledge and consent to this potential referral as described in our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-gray-600 mt-3">
              No insurance products are sold, applied for, or bound through this Website.
              All insurance applications and transactions are handled through proper licensed
              channels outside of this Website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. No Insurance Advice or Guarantee</h2>
            <p className="text-gray-600 mb-3">
              All content on this Website, including webinar content, articles, descriptions of
              insurance products, and calculator tools, is provided for <strong>general educational
              purposes only</strong>. It does not constitute:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>A solicitation to purchase any specific insurance product</li>
              <li>A guarantee of insurability or eligibility for any insurance product</li>
              <li>A binding quote, offer, or contract of insurance</li>
              <li>Legal, tax, or financial advice</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Your actual coverage, premiums, and eligibility will be determined based on your
              individual circumstances, medical history, and the underwriting guidelines of the
              specific insurance carrier at the time of application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Contact Form Submission</h2>
            <p className="text-gray-600 mb-3">
              When you submit our contact form, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>You are requesting to be contacted by Jonathan Holloway or a licensed affiliated agent</li>
              <li>You are not required to purchase any insurance product or service</li>
              <li>Submitting the form does not create an insurance policy, contract, or client relationship</li>
              <li>You have provided accurate and truthful information</li>
              <li>You are at least 18 years of age</li>
              <li>Your information will be handled as described in our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Text Message Communications (TCPA)</h2>
            <p className="text-gray-600 mb-3">
              If you check the box to receive text messages on our contact form, you expressly
              consent to receive recurring automated and non-automated text messages from
              Jonathan Holloway and/or affiliated licensed agents at the phone number you provided,
              including messages sent using an automatic telephone dialing system or artificial
              or prerecorded voice.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Messages may include appointment reminders, consultation updates, webinar invitations, and insurance information</li>
              <li>Message frequency may vary</li>
              <li>Standard message and data rates may apply depending on your carrier plan</li>
              <li>You may opt out at any time by replying <strong>STOP</strong> to any message</li>
              <li>For help, reply <strong>HELP</strong></li>
              <li><strong>Consent to text messages is NOT a condition of purchasing any product or service</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. Webinar Terms</h2>
            <p className="text-gray-600 mb-3">
              Our webinars are provided free of charge for educational purposes. By registering
              for or attending a webinar, you agree that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Webinar content is for general education only and does not constitute insurance advice specific to your situation</li>
              <li>We reserve the right to reschedule, cancel, or modify webinar content at any time</li>
              <li>We may record webinars for quality and educational purposes</li>
              <li>You will not record, redistribute, or commercially exploit webinar content without written permission</li>
              <li>Registration information will be used to send you access details and follow-up communications as described in our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Intellectual Property</h2>
            <p className="text-gray-600 mb-3">
              All content on this Website, including but not limited to text, graphics, logos,
              images, webinar materials, and scripts, is the property of Jonathan Holloway /
              ApexScoop and is protected by applicable intellectual property laws.
            </p>
            <p className="text-gray-600">
              You may not copy, reproduce, distribute, publish, display, or create derivative
              works from any content on this Website without prior written permission, except
              for personal, non-commercial use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">9. Third-Party Links and Services</h2>
            <p className="text-gray-600 mb-3">
              This Website may contain links to third-party websites or use third-party services
              (including Google Forms and Google Meet for webinars). We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>The content, accuracy, or practices of any third-party website</li>
              <li>Any products or services offered by third parties</li>
              <li>The privacy practices of third-party services</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Your use of third-party services is governed by their respective terms of service
              and privacy policies. We encourage you to review those policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">10. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-3">
              THIS WEBSITE AND ITS CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the Website will be uninterrupted, error-free, or secure</li>
              <li>Warranties regarding the accuracy, completeness, or timeliness of information</li>
              <li>Warranties that any defects will be corrected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">11. Limitation of Liability</h2>
            <p className="text-gray-600">
              TO THE FULLEST EXTENT PERMITTED BY LAW, JONATHAN HOLLOWAY AND APEXSCOOP SHALL
              NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL,
              ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THIS WEBSITE, OUR SERVICES, OR
              THESE TERMS, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              OUR TOTAL LIABILITY SHALL NOT EXCEED $100.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">12. Indemnification</h2>
            <p className="text-gray-600">
              You agree to indemnify, defend, and hold harmless Jonathan Holloway, ApexScoop,
              and their affiliates from and against any claims, liabilities, damages, losses,
              and expenses (including reasonable attorneys&apos; fees) arising out of or in any way
              connected with your access to or use of the Website, your violation of these Terms,
              or your violation of any rights of another.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">13. Governing Law and Dispute Resolution</h2>
            <p className="text-gray-600 mb-3">
              These Terms shall be governed by and construed in accordance with the laws of the
              State of Indiana, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-600">
              Any dispute arising from these Terms or your use of the Website shall first be
              attempted to be resolved through good-faith negotiation. If that fails, disputes
              shall be resolved through binding arbitration in Lake County, Indiana, in accordance
              with the American Arbitration Association rules. You waive the right to a jury trial
              and the right to participate in a class action lawsuit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">14. Children&apos;s Use</h2>
            <p className="text-gray-600">
              This Website is intended for individuals 18 years of age or older. We do not
              knowingly collect information from individuals under 18. If you are under 18, please
              do not submit any information through our Website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">15. CAN-SPAM Compliance</h2>
            <p className="text-gray-600 mb-3">
              If you opt in to receive email communications, we comply with the CAN-SPAM Act.
              All marketing emails will:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Clearly identify the sender</li>
              <li>Include a valid physical address</li>
              <li>Include a clear and conspicuous opt-out mechanism</li>
              <li>Honor opt-out requests within 10 business days</li>
            </ul>
            <p className="text-gray-600 mt-3">
              You may opt out of marketing emails at any time by clicking Unsubscribe in any
              email or by contacting us directly. Transactional emails (such as appointment
              confirmations and webinar access links) may still be sent after opt-out.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">16. No Agency Relationship</h2>
            <p className="text-gray-600">
              Submitting your information on this Website does not create an agent-client
              relationship, insurance contract, or any other legal relationship between you and
              Jonathan Holloway or American Income Life Insurance Company. Such a relationship
              is only established upon execution of a formal application and acceptance by the
              insurance carrier.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">17. Accessibility</h2>
            <p className="text-gray-600">
              We are committed to making our Website accessible. If you experience difficulty
              accessing any part of this Website, please contact us at{' '}
              <a href="mailto:jonathanholloway.ail@gmail.com" className="text-blue-600 hover:underline">
                jonathanholloway.ail@gmail.com
              </a>{' '}
              and we will do our best to assist you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">18. Modifications to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. When we make material
              changes, we will update the &ldquo;Last Updated&rdquo; date at the top of this page. Your
              continued use of the Website after any changes constitutes your acceptance of the
              revised Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">19. Severability</h2>
            <p className="text-gray-600">
              If any provision of these Terms is found to be unenforceable or invalid, that
              provision will be modified to the minimum extent necessary to make it enforceable,
              and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">20. Entire Agreement</h2>
            <p className="text-gray-600">
              These Terms, together with our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>,
              constitute the entire agreement between you and ApexScoop regarding your use of
              this Website and supersede all prior agreements and understandings.
            </p>
          </section>

          <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Contact Us</h2>
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

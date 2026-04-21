'use client';

import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Life Insurance Made Simple
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Get personalized life insurance quotes from a licensed agent. Compare options and find the perfect coverage for your family's future.
              </p>
              <Link href="/leads" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
                Get Your Free Quote
              </Link>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-8">
              <div className="space-y-4">
                <p className="text-lg">✓ Licensed Life Insurance Agent</p>
                <p className="text-lg">✓ Health & Accident Coverage</p>
                <p className="text-lg">✓ Fast, Easy Process</p>
                <p className="text-lg">✓ Personalized Recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose ApexScoop?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Expert Guidance</h3>
              <p className="text-gray-600">
                Get personalized recommendations based on your unique needs and budget.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-4">Quick Process</h3>
              <p className="text-gray-600">
                Get quotes and answers fast. Our streamlined process saves you time.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-4">Trusted Professional</h3>
              <p className="text-gray-600">
                Licensed agent with expertise in life, health, and accident insurance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Protect Your Family?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get a personalized quote today. It only takes a few minutes.
          </p>
          <Link href="/leads" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Meet The Expert Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Meet Your Insurance Expert</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/headshot-1.jpg"
                alt="ApexScoop Agent"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Your Trusted Insurance Partner</h3>
              <p className="text-gray-600 mb-4">
                With a valid Life, Health & Accident Insurance license, I'm committed to helping you find the right coverage for your family's needs.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">✓</span>
                  <span>Licensed insurance professional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">✓</span>
                  <span>Personalized policy recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">✓</span>
                  <span>Competitive rates and options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary font-bold mr-3">✓</span>
                  <span>Dedicated customer support</span>
                </li>
              </ul>
              <Link href="/leads" className="btn-primary">
                Connect With Me Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Latest Insurance Insights</h2>
          <p className="text-gray-600 mb-12">
            Check out our blog for tips, guides, and insights about life insurance.
          </p>
          <Link href="/blog" className="btn-primary">
            Read Our Blog
          </Link>
        </div>
      </section>
    </Layout>
  );
}

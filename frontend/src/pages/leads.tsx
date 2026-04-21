'use client';

import Layout from '@/components/Layout';
import { useState } from 'react';

export default function LeadsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4 text-center">Get Your Life Insurance Quote</h1>
        <p className="text-gray-600 text-center mb-12">
          Fill out the form below to get personalized life insurance quotes. Our licensed agent will review your information and reach out with recommendations tailored to your needs.
        </p>

        {/* Google Form Embed */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScaYFkfeh3H7SSBTC_J4t2IUihQJ-1_ygsQqjN5R836_Swhsg/viewform?embedded=true"
            width="100%"
            height="4571"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading…
          </iframe>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">What to Expect</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Personal review of your information</li>
              <li>✓ Customized insurance recommendations</li>
              <li>✓ Multiple coverage options</li>
              <li>✓ Competitive quotes</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">FAQ</h3>
            <p className="text-gray-600 mb-4">
              <strong>How quickly will I hear back?</strong><br/>
              Typically within 24 hours during business days.
            </p>
            <p className="text-gray-600">
              <strong>Is this free?</strong><br/>
              Yes! Quotes and consultations are completely free.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

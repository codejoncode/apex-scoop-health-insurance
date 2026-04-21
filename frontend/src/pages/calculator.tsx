'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function CalculatorPage() {
  const [income, setIncome] = useState(50000);
  const [dependents, setDependents] = useState(2);
  const [mortgage, setMortgage] = useState(300000);
  const [otherDebts, setOtherDebts] = useState(25000);
  const [yearsToSupport, setYearsToSupport] = useState(20);
  const [educationPerChild, setEducationPerChild] = useState(100000);
  const [showResult, setShowResult] = useState(false);

  // Calculate recommended coverage
  const calculateCoverage = () => {
    // Income replacement: income × years to support
    const incomeReplacement = income * yearsToSupport;

    // Education expenses
    const totalEducation = dependents > 0 ? educationPerChild * dependents : 0;

    // Debt payoff
    const totalDebt = mortgage + otherDebts;

    // Living expenses for family (estimated at 75% of current income annually)
    const yearlyLiving = income * 0.75;
    const livingExpenses = yearlyLiving * yearsToSupport;

    // Total recommended coverage
    const recommended = incomeReplacement + totalEducation + totalDebt;

    return {
      recommended: Math.round(recommended / 50000) * 50000, // Round to nearest $50k
      breakdown: {
        incomeReplacement,
        education: totalEducation,
        debts: totalDebt,
        living: livingExpenses,
      },
      monthlyPremium: Math.round((recommended / 100000) * 15), // Rough estimate
    };
  };

  const result = calculateCoverage();

  return (
    <Layout>
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Life Insurance Needs Calculator</h1>
            <p className="text-xl text-gray-600">
              Discover how much life insurance coverage you actually need to protect your family's financial future.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Calculate Your Needs</h2>

              {/* Annual Income */}
              <div className="mb-6">
                <label className="block font-bold mb-2">Annual Income</label>
                <input
                  type="range"
                  min="30000"
                  max="500000"
                  step="10000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">$30k</span>
                  <span className="font-bold text-primary">${income.toLocaleString()}</span>
                  <span className="text-gray-600">$500k+</span>
                </div>
              </div>

              {/* Number of Dependents */}
              <div className="mb-6">
                <label className="block font-bold mb-2">Number of Dependents</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">0</span>
                  <span className="font-bold text-primary">{dependents} {dependents === 1 ? 'person' : 'people'}</span>
                  <span className="text-gray-600">10</span>
                </div>
              </div>

              {/* Mortgage Balance */}
              <div className="mb-6">
                <label className="block font-bold mb-2">Mortgage Balance</label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="50000"
                  value={mortgage}
                  onChange={(e) => setMortgage(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">$0</span>
                  <span className="font-bold text-primary">${mortgage.toLocaleString()}</span>
                  <span className="text-gray-600">$1M+</span>
                </div>
              </div>

              {/* Other Debts */}
              <div className="mb-6">
                <label className="block font-bold mb-2">Other Debts (car, credit cards, student loans)</label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={otherDebts}
                  onChange={(e) => setOtherDebts(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">$0</span>
                  <span className="font-bold text-primary">${otherDebts.toLocaleString()}</span>
                  <span className="text-gray-600">$200k+</span>
                </div>
              </div>

              {/* Years to Support Family */}
              <div className="mb-6">
                <label className="block font-bold mb-2">Years to Support Family</label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={yearsToSupport}
                  onChange={(e) => setYearsToSupport(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">5 years</span>
                  <span className="font-bold text-primary">{yearsToSupport} years</span>
                  <span className="text-gray-600">40 years</span>
                </div>
              </div>

              {/* Education Budget Per Child */}
              {dependents > 0 && (
                <div className="mb-6">
                  <label className="block font-bold mb-2">
                    Education Budget Per Child (College)
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="10000"
                    value={educationPerChild}
                    onChange={(e) => setEducationPerChild(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">$50k</span>
                    <span className="font-bold text-primary">${educationPerChild.toLocaleString()}</span>
                    <span className="text-gray-600">$500k+</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowResult(true)}
                className="w-full btn-primary mt-4"
              >
                Calculate My Coverage
              </button>
            </div>

            {/* Results */}
            <div>
              {showResult ? (
                <div className="card bg-blue-50 border-2 border-primary">
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">Recommended Coverage:</p>
                    <div className="text-5xl font-bold text-primary mb-2">
                      ${result.recommended.toLocaleString()}
                    </div>
                    <p className="text-gray-600">
                      Based on your financial situation and family needs
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-6">
                    <h3 className="font-bold mb-4">Coverage Breakdown:</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Income Replacement</span>
                        <span className="font-bold">
                          ${result.breakdown.incomeReplacement.toLocaleString()}
                        </span>
                      </div>
                      {result.breakdown.education > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Education Expenses</span>
                          <span className="font-bold">
                            ${result.breakdown.education.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Debt Payoff</span>
                        <span className="font-bold">
                          ${result.breakdown.debts.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold">Total Recommended</span>
                        <span className="font-bold text-primary text-lg">
                          ${result.recommended.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-2">Estimated Monthly Cost:</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${result.monthlyPremium}/month
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      *Estimate based on term life insurance at age 35
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm font-bold text-blue-900 mb-2">💡 Next Steps:</p>
                    <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                      <li>Get personalized quotes based on your coverage needs</li>
                      <li>Compare different term lengths (10, 20, 30 years)</li>
                      <li>Review your health and medical history</li>
                      <li>Discuss riders and additional coverage options</li>
                    </ol>
                  </div>

                  <Link href="/leads" className="block w-full btn-primary text-center">
                    Get Personalized Quotes
                  </Link>

                  <button
                    onClick={() => setShowResult(false)}
                    className="w-full mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Adjust Calculation
                  </button>
                </div>
              ) : (
                <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
                  <h3 className="text-2xl font-bold mb-4">How It Works</h3>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <p className="font-bold text-primary mb-2">📊 Get Your Number</p>
                      <p>Use the calculator to determine how much coverage you need</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary mb-2">💬 Speak With An Expert</p>
                      <p>Get personalized quotes matched to your specific situation</p>
                    </div>
                    <div>
                      <p className="font-bold text-primary mb-2">✅ Get Protected</p>
                      <p>Apply online and get coverage in as little as 24 hours</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-primary">
                      <p className="text-sm">
                        <strong>Pro Tip:</strong> Start with the minimum coverage amount and then increase it as your financial situation improves.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Common Questions</h2>
            <div className="space-y-4">
              <details className="card cursor-pointer">
                <summary className="font-bold text-lg">
                  How much life insurance do I actually need?
                </summary>
                <p className="mt-4 text-gray-600">
                  There's no one-size-fits-all answer, but most experts recommend coverage of 10-12 times your annual income. This calculator helps account for your unique situation including dependents, debts, and future expenses.
                </p>
              </details>

              <details className="card cursor-pointer">
                <summary className="font-bold text-lg">
                  What's the difference between term and whole life insurance?
                </summary>
                <p className="mt-4 text-gray-600">
                  Term life provides coverage for a set period (10-30 years) at a lower cost. Whole life covers you for life but costs more. Term is more affordable for most people starting out.
                </p>
              </details>

              <details className="card cursor-pointer">
                <summary className="font-bold text-lg">
                  Can I get life insurance with pre-existing conditions?
                </summary>
                <p className="mt-4 text-gray-600">
                  Yes! Many people with health conditions can get approved. Your rates may be higher, but coverage is available. Let's discuss your specific situation.
                </p>
              </details>

              <details className="card cursor-pointer">
                <summary className="font-bold text-lg">
                  How quickly can I get approved?
                </summary>
                <p className="mt-4 text-gray-600">
                  Many applicants get approved within 24 hours. The process involves a brief health questionnaire and sometimes a phone call. No medical exam required for most policies.
                </p>
              </details>

              <details className="card cursor-pointer">
                <summary className="font-bold text-lg">
                  Can I change my coverage amount later?
                </summary>
                <p className="mt-4 text-gray-600">
                  Yes! You can usually increase or decrease your coverage. Increases may require new underwriting, but decreases are typically straightforward.
                </p>
              </details>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-primary text-white rounded-lg p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Family?</h2>
            <p className="text-xl mb-8">
              Get personalized quotes based on your coverage needs. It only takes 5 minutes.
            </p>
            <Link href="/leads" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

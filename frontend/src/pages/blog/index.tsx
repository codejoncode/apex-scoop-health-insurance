import Link from 'next/link';
import Layout from '@/components/Layout';
import { POSTS } from '@/lib/posts';

const CATEGORIES = ['All', 'Life Insurance Basics', 'Income Protection', 'Planning', 'Underwriting', 'Policy Features', 'Senior Protection', 'Membership', 'Family Planning', "Buyer's Guide"];

export default function BlogPage() {
  const posts = Object.entries(POSTS);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">
            Insurance Education
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            The ApexScoop Blog
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
            Plain-English answers to the questions families ask most about life insurance,
            coverage, and protecting the people they love.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(([slug, post]) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                    {post.category}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-500 mb-8">
            Reading is a great start. A conversation answers the ones that are specific to your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#consultation"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Book a Free Consultation
            </Link>
            <Link
              href="/#webinars"
              className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-full transition-colors"
            >
              Join a Free Webinar
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

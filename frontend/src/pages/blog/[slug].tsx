import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { POSTS, POST_SLUGS, Post } from '@/lib/posts';

interface Props {
  post: Post;
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: POST_SLUGS.map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = POSTS[slug] ?? null;
  if (!post) return { notFound: true };
  return { props: { post, slug } };
};

function TopCTA({ post }: { post: Post }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-blue-800 font-semibold text-sm">
          Want to go deeper on this topic?
        </p>
        <p className="text-blue-700 text-xs mt-0.5">
          {post.webinarSlug
            ? `We cover this in detail in our free "${post.webinarTitle}" webinar.`
            : 'A licensed agent can walk through your specific situation in a free consultation.'}
        </p>
      </div>
      {post.webinarSlug ? (
        <Link
          href={`/webinars/${post.webinarSlug}`}
          className="shrink-0 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
        >
          Join the Webinar →
        </Link>
      ) : (
        <Link
          href="/#consultation"
          className="shrink-0 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
        >
          Book a Consultation →
        </Link>
      )}
    </div>
  );
}

function BottomCTA({ post }: { post: Post }) {
  return (
    <div className="mt-12 bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl p-7 sm:p-10 text-white text-center">
      <h3 className="text-xl sm:text-2xl font-extrabold mb-3">
        Ready to take the next step?
      </h3>
      <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-xl mx-auto">
        Reading about insurance is the first step. Understanding what it looks like for your specific
        family — your ages, your health, your budget — takes a single conversation.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/#consultation"
          className="bg-white text-blue-800 hover:bg-blue-50 font-bold py-3 px-8 rounded-full transition-colors"
        >
          Book a Free Consultation
        </Link>
        {post.webinarSlug && (
          <Link
            href={`/webinars/${post.webinarSlug}`}
            className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-full transition-colors"
          >
            Join the Free Webinar
          </Link>
        )}
      </div>
    </div>
  );
}

export default function BlogPostPage({ post, slug }: Props) {
  const otherPosts = Object.entries(POSTS)
    .filter(([s]) => s !== slug)
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            ← All Articles
          </Link>
          <span className="block text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-blue-200 text-xs">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
            <span>·</span>
            <span>Jonathan Holloway · ApexScoop</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-5">

          <TopCTA post={post} />

          <div className="space-y-8">
            {post.sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    {section.heading}
                  </h2>
                )}
                <div className="space-y-4">
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-4 space-y-2 ml-4">
                    {section.bullets.map((b, k) => (
                      <li key={k} className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                        <span className="text-blue-600 mt-1 shrink-0">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <BottomCTA post={post} />
        </div>
      </article>

      {/* More articles */}
      {otherPosts.length > 0 && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="text-lg font-bold text-gray-800 mb-6">More Articles</h2>
            <div className="space-y-4">
              {otherPosts.map(([s, p]) => (
                <Link
                  key={s}
                  href={`/blog/${s}`}
                  className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm p-4 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {p.category}
                    </span>
                    <p className="text-gray-900 font-semibold text-sm mt-1 group-hover:text-blue-700 transition-colors leading-snug">
                      {p.title}
                    </p>
                  </div>
                  <span className="text-gray-300 group-hover:text-blue-500 text-lg shrink-0 mt-1">→</span>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                View all articles →
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

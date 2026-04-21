'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { blogAPI } from '@/lib/api';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  created_at: string;
}

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await blogAPI.getBySlug(slug as string);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p>Blog post not found.</p>
          <Link href="/blog" className="btn-primary mt-4 inline-block">
            Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/blog" className="text-primary hover:text-secondary mb-8 inline-block">
          ← Back to Blog
        </Link>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex justify-between items-center text-gray-600 mb-8 pb-8 border-b">
          <span>By {post.author}</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-lg mb-4">Ready to get life insurance?</h3>
          <p className="mb-4">
            Use our free quote tool to get personalized insurance recommendations.
          </p>
          <Link href="/leads" className="btn-primary">
            Get Your Free Quote
          </Link>
        </div>
      </article>
    </Layout>
  );
}

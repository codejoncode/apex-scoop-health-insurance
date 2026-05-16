import Layout from '@/components/Layout';
import Link from 'next/link';

export default function ChatPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">💬</div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-3">Live Chat</h1>
          <p className="text-lg font-semibold text-blue-700 mb-2">Coming Soon</p>
          <p className="text-gray-400 text-sm mb-8">
            Real-time visitor chat with AI-assisted responses and agent takeover
            is being configured. Check back soon.
          </p>
          <Link
            href="/admin/dashboard"
            className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}

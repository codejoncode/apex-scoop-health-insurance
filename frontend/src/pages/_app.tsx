import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '../styles/globals.css';

// Load ChatWidget only on the client (uses WebSocket + localStorage)
const ChatWidget = dynamic(() => import('../components/ChatWidget'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <>
      <Component {...pageProps} />
      {!isAdminPage && <ChatWidget />}
    </>
  );
}

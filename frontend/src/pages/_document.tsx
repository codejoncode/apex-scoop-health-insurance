import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* SVG favicon — shows the ApexScoop shield in the browser tab */}
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" />
        <meta name="theme-color" content="#1e40af" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { useEffect } from 'react';
import Head from 'next/head';

import Layout from '@/components/layout';

import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

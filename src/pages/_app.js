import { useEffect } from 'react';
import Head from 'next/head';

import { RecoilRoot } from 'recoil';

import Layout from '@/components/layout';

import { isDev } from '@/util/dev';

import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // remove webview context menu if in production
    if (!isDev())
      window.addEventListener('contextmenu', (e) => e.preventDefault());
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
      </Head>
      <Layout>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </Layout>
    </>
  );
}

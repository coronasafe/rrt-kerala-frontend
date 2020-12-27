import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";

import "../styles/index.css";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div>
      <Head>
        <meta name="description" content="RRT Directory." />
        <link
          rel="icon"
          href="https://cdn.coronasafe.network/care-manifest/images/icons/icon-192x192.png"
        />
      </Head>

      <main className="bg-gray-50 dark:bg-bunker-800 flex justify-center min-h-screen dark:text-gray-200 py-10 px-4">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

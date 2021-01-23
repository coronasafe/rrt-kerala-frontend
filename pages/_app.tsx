import type { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";
import { ThemeProvider } from "use-theme-switcher";

import Footer from "../components/footer";
import Header from "../components/header";
import "../styles/index.css";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ThemeProvider defaultDarkTheme="dark">
      <div className="bg-gray-50 dark:bg-bunker-800 min-h-screen dark:text-gray-200 p-4 flex flex-col transition-colors duration-200 ease-linear">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

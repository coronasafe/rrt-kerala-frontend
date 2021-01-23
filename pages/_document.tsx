import type { DocumentContext } from "next/document";
import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import { ThemeScriptTag } from "use-theme-switcher";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="icon"
            href="https://cdn.coronasafe.network/care-manifest/images/icons/icon-192x192.png"
          />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
            as="style"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="antialiased">
          <ThemeScriptTag defaultDarkTheme="dark" defaultLightTheme="light" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

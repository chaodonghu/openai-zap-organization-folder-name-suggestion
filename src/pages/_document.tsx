import { ZinniaFonts } from "@zapier/design-system";
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="Search for Zaps using AI Vector Search"
          />
          <link
            href="https://cdn.zapier.com/zapier/images/favicon.ico"
            rel="icon"
            type="image/x-icon"
          />
          <ZinniaFonts />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

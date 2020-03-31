import Link from "next/link";
import Head from "next/head";
import styles from "./header.module.scss";
import Navigation from "../atoms/navigation";

const navItems = [
  { label: "Blog", link: "/blog" },
  { label: "Contact", link: "/contact" },
  { label: "Twitter", link: "https://twitter.com/namesphill" },
];

const ogImageUrl = "https://notion-blog.now.sh/og-image.png";

export default function Header({ pageTitle = "" }): JSX.Element {
  return (
    <>
      <Head>
        <title>Felipe Acosta{pageTitle && " - " + pageTitle}</title>
        <meta
          name="description"
          content="An example Next.js site using Notion for the blog"
        />
        <meta name="og:title" content="Felipe Acosta" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@namesphill" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <header className={styles.header}>
        <Navigation
          items={navItems}
          leadingItem={
            <Link href="/">
              <img src="/felipe.png" alt="'Felipe' website logo" height="90" />
            </Link>
          }
        />
      </header>
    </>
  );
}

import Header from "../components/molecules/header";
import ExtLink from "../components/atoms/ext-link";

import sharedStyles from "../styles/shared.module.css";
import contactStyles from "./contact.module.css";

import GitHub from "../components/atoms/svgs/github";
import Twitter from "../components/atoms/svgs/twitter";
import Envelope from "../components/atoms/svgs/envelope";
import LinkedIn from "../components/atoms/svgs/linkedin";

const contacts = [
  {
    Comp: Twitter,
    alt: "twitter icon",
    link: "https://twitter.com/_ijjk",
  },
  {
    Comp: GitHub,
    alt: "github icon",
    link: "https://github.com/ijjk",
  },
  {
    Comp: LinkedIn,
    alt: "linkedin icon",
    link: "https://www.linkedin.com/in/jj-kasper-0b5392166/",
  },
  {
    Comp: Envelope,
    alt: "envelope icon",
    link: "mailto:jj@jjsweb.site?subject=Notion Blog",
  },
];

export default () => (
  <>
    <Header pageTitle="Contact" />
    <div>OBO</div>
  </>
);

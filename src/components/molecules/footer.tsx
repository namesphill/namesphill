import Navigation from "../atoms/navigation";

const navItems = [
  { label: "Github", link: "https://github.com/namesphill" },
  { label: "Twitter", link: "https://twitter.com/namesphill" },
  { label: "Instagram", link: "https://instagram.com/namesphill" },
  { label: "Medium", link: "https://medium.com/namesphill" },
];

export default function Footer(): JSX.Element {
  return (
    <footer>
      <Navigation items={navItems} leadingItem={<div />} />
    </footer>
  );
}

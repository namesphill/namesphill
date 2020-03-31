import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./navigation.module.scss";
import ExtLink from "./ext-link";

export type NavigationProps = {
  items: {
    link: string;
    label: string;
  }[];
  leadingItem?: JSX.Element;
};

export default function Navigation({
  items,
  leadingItem = <></>,
}: NavigationProps) {
  const { pathname } = useRouter();
  return (
    <div className={styles.container}>
      {leadingItem}
      {
        <ul>
          {items.map(({ label, link }) => {
            const linkIsExternal = link[0] !== "/";
            const LinkComponenet = linkIsExternal ? (
              <ExtLink href={link}>{label}</ExtLink>
            ) : (
              <Link href={link}>
                <a className={pathname === link ? styles.active : ""}>
                  {label}
                </a>
              </Link>
            );
            return <li key={label}>{LinkComponenet}</li>;
          })}
        </ul>
      }
    </div>
  );
}

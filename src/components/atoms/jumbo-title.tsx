import styles from "./jumbo-title.module.scss";
export default function JumboTitle(props: {
  children: string | JSX.Element | JSX.Element[];
}) {
  return <h1 className={styles.heading}>{props.children}</h1>;
}

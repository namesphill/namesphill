import styles from "./hero.module.scss";
export default function Hero() {
  return (
    <div className={styles.hero}>
      <h1>
        Hello there,
        <br />
        My name's Phill.
      </h1>
    </div>
  );
}

import styles from "./gallery.module.scss";
import Link from "next/link";

export type GalleryProps = {
  items: {
    key?: string;
    slug?: string;
    link?: string;
    backgroundColor?: string;
    backgroundImg?: string;
    content?: JSX.Element | JSX.Element[] | string;
    footer?: JSX.Element | JSX.Element[] | string;
  }[];
};

export default function Gallery({ items }: GalleryProps) {
  const Items = items.map((item, i) => {
    const {
      slug = "",
      key = "gallery_" + i || slug + i,
      link = "",
      backgroundColor = "none",
      backgroundImg = "",
      content = <></>,
      footer = <></>,
    } = item;
    const Wrapper = ({ children }) =>
      link ? (
        <Link href={link}>
          <div className={styles.link}>{children}</div>
        </Link>
      ) : (
        <>{children}</>
      );
    const backgroundImage = backgroundImg ? `url(${backgroundImg})` : "none";
    return (
      <Wrapper>
        <div className={styles.item} key={key}>
          <div
            className={styles.content}
            style={{ backgroundImage, backgroundColor }}
          >
            {content}
          </div>
          <div className={styles.footer}>{footer}</div>
        </div>
      </Wrapper>
    );
  });
  return (
    <div className={styles.container}>
      <div className={styles.items}>{Items}</div>
    </div>
  );
}

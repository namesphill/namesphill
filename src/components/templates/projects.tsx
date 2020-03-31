import styles from "./projects.module.scss";
import JumboTitle from "../atoms/jumbo-title";
import Gallery from "../molecules/gallery";
export default function Projects() {
  const getLink = (slug: string) => "/blog/" + slug;
  return (
    <div>
      <JumboTitle>Projects</JumboTitle>
      <Gallery
        items={[
          {
            slug: "obo",
            link: "/obo",
            backgroundImg:
              "https://uploads-ssl.webflow.com/5dd20900edfe6a8c17721001/5de1be70d414340129dbad87_Screen%20Shot%202019-11-29%20at%205.57.03%20PM.png",
            content: "Hey there",
            footer: "bye.bye",
          },
          {
            slug: "obo",
            link: "/obo",
            backgroundImg:
              "https://uploads-ssl.webflow.com/5dd20900edfe6a8c17721001/5de1be70d414340129dbad87_Screen%20Shot%202019-11-29%20at%205.57.03%20PM.png",
            content: "Hey there",
            footer: "bye.bye",
          },
        ]}
      />
      <div style={{ backgroundColor: "red", display: "flex" }}>
        Obo besteck!
      </div>
    </div>
  );
}

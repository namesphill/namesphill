import dynamic from "next/dynamic";
import ExtLink from "./ext-link";
const dynamicComponents = {
  ol: "ol",
  ul: "ul",
  li: "li",
  p: "p",
  blockquote: "blockquote",
  a: ExtLink,
  Code: dynamic(() => import("./code"))
};
export default dynamicComponents;

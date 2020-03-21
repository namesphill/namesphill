import React from "react";
import ExtLink from "./ext-link";
import User from "./user";
export default function RichText(props: {
  content: RichTextProp;
  key?: string;
}): JSX.Element {
  const baseKey =
    props.key ||
    Math.random()
      .toString(16)
      .slice(2);
  const children: JSX.Element[] = [];
  let index = 0;
  for (const [text, blockProps] of props.content) {
    index++;
    const key = baseKey + "__" + index;
    if (!blockProps) {
      children.push(<React.Fragment key={key}>{text}</React.Fragment>);
      continue;
    }
    const [[type, modifier]] = blockProps;
    switch (type) {
      case "a":
        const link = modifier;
        children.push(
          <ExtLink key={key} href={link}>
            {text}
          </ExtLink>
        );
        break;

      case "b":
        children.push(<b key={key}>{text}</b>);
        break;

      case "c":
        children.push(<code key={key}>{text}</code>);
        break;

      case "i":
        children.push(<i key={key}>{text}</i>);
        break;

      case "p":
        children.push(<React.Fragment key={key}>{text}</React.Fragment>);
        break;

      case "u":
        const userId = modifier;
        children.push(<User key={key} userId={userId} />);
        break;

      default:
        children.push(<React.Fragment key={key}>{text}</React.Fragment>);
        break;
    }
  }
  return <p key={baseKey}>{children}</p>;
}

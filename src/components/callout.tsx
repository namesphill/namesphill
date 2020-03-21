import React from "react";
import RichText from "./rich-text";
export type CalloutProps = {
  format: Partial<NotionBlockFormat>;
  content: RichTextProp;
};
export default function Callout(props: CalloutProps): JSX.Element {
  const { format, content } = props;
  return (
    <div className="callout">
      {format.page_icon && <div>{format.page_icon}</div>}
      <div className="text">
        <RichText content={content} />
      </div>
    </div>
  );
}

import React from "react";
import previewStyles from "./preview-alert.module.css";
import Link from "next/link";
export default function PreviewAlert({
  previewKey = "",
  previewValue = "",
}): JSX.Element {
  const previewQuery =
    previewKey && previewValue && `?${previewKey}=${previewValue}`;
  return (
    <div className={previewStyles.previewAlertContainer}>
      <div className={previewStyles.previewAlert}>
        <b>Note:</b>
        {` `}Viewing in preview mode{` `}
        <Link href={`/api/clear-preview${previewQuery || ""}`}>
          <button className={previewStyles.escapePreview}>Exit Preview</button>
        </Link>
      </div>
    </div>
  );
}

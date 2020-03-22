import React, { CSSProperties } from "react";
export type MediaProps = {
  type: "image" | "video" | "embed";
  format?: Partial<NotionBlockFormat>;
  id?: string;
  file_ids?: string[];
};
export default function Media({
  type,
  format = {},
  id = "",
  file_ids,
}: MediaProps): JSX.Element {
  const {
    block_width,
    block_height,
    display_source,
    block_aspect_ratio,
  } = format;
  const baseBlockWidth = 768;
  const roundFactor = Math.pow(10, 2);

  const width = block_width
    ? `${
        Math.round((block_width / baseBlockWidth) * 100 * roundFactor) /
        roundFactor
      }%`
    : block_height || "100%";

  const isImage = type === "image";
  const Componenet = isImage ? "img" : "video";
  const useWrapper = block_aspect_ratio && !block_height;
  const childStyle: CSSProperties = useWrapper
    ? {
        width: "100%",
        height: "100%",
        border: "none",
        position: "absolute",
        top: 0,
      }
    : {
        width,
        border: "none",
        height: block_height,
        display: "block",
        maxWidth: "100%",
      };

  let child: JSX.Element = null;

  if (!isImage && !(file_ids || file_ids.length)) {
    child = (
      <iframe
        style={childStyle}
        src={display_source}
        key={!useWrapper ? id : undefined}
        className={!useWrapper ? "asset-wrapper" : undefined}
      />
    );
  } else {
    child = (
      <Componenet
        key={!useWrapper ? id : undefined}
        src={`/api/asset?assetUrl=${encodeURIComponent(
          display_source
        )}&blockId=${id}`}
        controls={!isImage}
        alt={`Dynamic ${type} from Notion`}
        loop={!isImage}
        muted={!isImage}
        autoPlay={!isImage}
        style={childStyle}
      />
    );
  }

  return useWrapper ? (
    <div
      style={{
        paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
        position: "relative",
      }}
      className="asset-wrapper"
    >
      {child}
    </div>
  ) : (
    child
  );
}

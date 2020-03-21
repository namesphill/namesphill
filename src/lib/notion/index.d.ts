type NotionSchemaTypes =
  | "checkbox"
  | "person"
  | "created_time"
  | "select"
  | "date"
  | "'multi_select'"
  | "title";

type UserPropertyValue = ["‣", [["u", string]]];
type UserPropertyDivider = [","];
type UserProp = [
  UserPropertyValue,
  UserPropertyDivider?,
  UserPropertyValue?,
  UserPropertyDivider?,
  UserPropertyValue?,
  UserPropertyDivider?,
  UserPropertyValue?,
  UserPropertyDivider?,
  UserPropertyValue?,
  UserPropertyDivider?,
  UserPropertyValue?
];

type PagePropertyValue = ["‣", [["p", string]]];
type PagePropertyDivider = [string];
type PageProp = [
  PagePropertyValue,
  PagePropertyDivider?,
  PagePropertyValue?,
  PagePropertyDivider?,
  PagePropertyValue?,
  PagePropertyDivider?,
  PagePropertyValue?,
  PagePropertyDivider?,
  PagePropertyValue?,
  PagePropertyDivider?,
  PagePropertyValue?
];

type DatePropertyValue = [
  "‣",
  [
    [
      "d",
      {
        type: "datetimerange" | "date";
        time_zone: string;
        start_date: string;
        start_time?: string;
        end_date?: string;
        end_time?: string;
        reminder?: {
          unit: "minute" | "hour" | "day";
          value: number;
        };
      }
    ]
  ]
];
type DateProp = [DatePropertyValue];

type MediaPropertyValue = [
  "‣",
  [
    [
      "d",
      {
        type: "datetimerange" | "date";
        time_zone: string;
        start_date: string;
        start_time?: string;
        end_date?: string;
        end_time?: string;
        reminder?: {
          unit: "minute" | "hour" | "day";
          value: number;
        };
      }
    ]
  ]
];
type MediaProp = [MediaPropertyValue];

type LinkPropertyValue = [string, [["a", string]]];
type LinkProp = [LinkPropertyValue];

type CodePropertyValue = [string, [["c"]]];
type CodeProp = [CodePropertyValue];

type ItalicsPropertyValue = [string, [["i"]]];
type ItalicsProp = [ItalicsPropertyValue];

type BoldPropertyValue = [string, [["b"]]];
type BoldProp = [BoldPropertyValue];

type NotionColor =
  | "gray"
  | "gray_background"
  | "brown"
  | "brown_background"
  | "yellow"
  | "yellow_background"
  | "green"
  | "green_background"
  | "blue"
  | "blue_background"
  | "purple"
  | "purple_background"
  | "pink"
  | "pink_background"
  | "red"
  | "red_background";
type ColoredTextPropertyValue = [string, [["c", NotionColor]]];
type ColoredTextProp = [BoldPropertyValue];

type TextPropertyValue = [string];
type TextProp = [TextPropertyValue];

type RichTextPropertyValue =
  | UserPropertyValue
  | PagePropertyValue
  | LinkPropertyValue
  | CodePropertyValue
  | ItalicsPropertyValue
  | BoldPropertyValue
  | ColoredTextPropertyValue
  | TextPropertyValue;
type RichTextProp = RichTextPropertyValue[];

type NotionBlockType =
  | "page"
  | "divider"
  | "text"
  | "image"
  | "video"
  | "embed"
  | "header"
  | "bulleted_list"
  | "numbered_list"
  | "sub_header"
  | "sub_sub_header"
  | "code"
  | "quote"
  | "callout"
  | "collection_view"
  | "tweet";

type NotionBlockFormat = {
  /// Block is page
  page_icon: string;
  page_cover: string;
  page_cover_position: number;
  /// Block is block
  block_width: number;
  block_height: number;
  display_source: string;
  block_aspect_ratio: number;
};

type NotionBlock = {
  role: string;
  value: {
    id: string;
    version: number;
    type: NotionBlockType;
    properties?: {
      title: RichTextProp;
      [key: string]: TextProp | UserProp | DateProp | LinkProp | PageProp;
    };
    content: string[];
    format: NotionBlockFormat;
    file_ids?: string[];
    permissions: {
      role: string;
      type: string;
      user_id: string;
    }[];
    collection_id: string;
    view_ids: string[];
    schema: {
      [key: string]: {
        name: string;
        type: NotionSchemaTypes;
        options?: {
          id: string;
          color: string;
          value: string;
          [key: string]: string;
        };
      };
    };
    created_time: number;
    last_edited_time: number;
    parent_id: string;
    parent_table: string;
    alive: true;
    created_by_table: string;
    created_by_id: string;
    last_edited_by_table: string;
    last_edited_by_id: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    profile_photo?: string;
  };
};

type NotionBlockMap = { [key: string]: NotionBlock };

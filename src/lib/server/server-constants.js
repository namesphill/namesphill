// use commonjs so it can be required without transpiling

/**
 * Normalize Notion Url Page Id
 * @param {string} id
 */
function normalizePageId(id) {
  if (!id) id = "";
  if (id.length === 36) return String(id);
  if (id.length !== 32) {
    throw new Error(
      `Invalid page id: ${id} should be 32 characters long. Consult /README.md file.`
    );
  }
  return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(
    16,
    4
  )}-${id.substr(20)}`;
}

const NOTION_TOKEN = require("../../../keys").NOTION_TOKEN;
const BLOG_INDEX_ID = normalizePageId(require("../../keys").BLOG_INDEX_ID);
const API_ENDPOINT = "https://www.notion.so/api/v3";

module.exports = {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
  API_ENDPOINT
};

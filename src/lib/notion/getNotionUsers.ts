import rpc from "./rpc";

export type NotionUser = {
  full_name: string;
};

export default async function getNotionUsers(ids: string[]) {
  const { results = [] } = await rpc("getRecordValues", {
    requests: ids.map((id: string) => ({
      id,
      table: "notion_user"
    }))
  });

  const users: { [key: string]: NotionUser } = {};

  for (const result of results) {
    const { value } = result || {
      value: { given_name: "", family_name: "", id: "" }
    };
    const { given_name, family_name } = value;
    let full_name = given_name || "";

    if (family_name) {
      full_name = `${full_name} ${family_name}`;
    }
    const userId = value.id;
    users[userId] = { full_name };
  }

  return { users };
}

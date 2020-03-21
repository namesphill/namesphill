import rpc from "./rpc";

export type NotionUser = {
  full_name: string;
  id: string;
  email: string;
  given_name: string;
  family_name: string;
  profile_photo: string;
};

export default async function getNotionUsers(ids: string[]) {
  ids = [...new Set(ids)];
  const requests = ids.map((id: string) => ({ id, table: "notion_user" }));
  const { results = [] } = await rpc("getRecordValues", { requests });

  const users: { [key: string]: NotionUser } = {};

  for (const result of results) {
    const defaultValue = {
      given_name: "",
      family_name: "",
      id: "",
      email: "",
      profile_photo: ""
    };
    const { value } = result || { value: defaultValue };
    const { id, email, given_name, family_name, profile_photo } = value;

    let full_name = given_name || "";
    if (family_name) full_name = `${full_name} ${family_name}`;

    const userId = value.id;
    users[userId] = {
      id,
      full_name,
      family_name,
      given_name,
      email,
      profile_photo
    };
  }

  return users;
}

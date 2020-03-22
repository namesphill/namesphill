import {
  CollectionRow,
  CollectionTable,
  CollectionPropertyMap,
} from "../getCollectionData";
import getUsers, { NotionUser } from "../getUsers";

export default async function queryUsersOnTable<T extends CollectionRow>(
  table: CollectionTable<T>
) {
  let userIds: string[] = [];
  const paths: [string, string][] = [];
  for (const row of Object.values(table)) {
    const slug = row.Slug;
    for (const [key, cell] of Object.entries(row)) {
      if (!cell || typeof cell === "string") continue;
      const [type, value] = cell;
      if (type === "userIds") {
        userIds = userIds.concat(value as string[]);
        paths.push([slug, key]);
      }
    }
  }
  const users = await getUsers(userIds);
  for (const [slug, key] of paths) {
    const [, ids] = table[slug][key] as CollectionPropertyMap["userIds"];
    const cellUsers: NotionUser[] = ids.map((id) => users[id]);
    const cell: CollectionPropertyMap["users"] = ["users", cellUsers];
    table[slug][key as keyof T] = cell as any;
  }
  return table;
}

import {
  CollectionRow,
  GetCollectionDataConfigs,
  CollectionTable,
} from "../getCollectionData";
import queryCollection from "../queryCollection";
import getRowsFromCollection from "./getRowsFromCollection";
import sortTableByDate from "./sortTableByDate";
import queryUsersOnTable from "./queryUsersOnTable";

export default async function queryTable<T extends CollectionRow>(
  collectionBlock: NotionBlock,
  configs: GetCollectionDataConfigs
) {
  let table: CollectionTable<T> = {};

  const { value } = collectionBlock;
  const collectionId = value.collection_id;
  const collectionViewId = value.view_ids[0];

  const collection = await queryCollection({
    collectionId,
    collectionViewId,
  });

  const rows = await getRowsFromCollection<T>(
    collection,
    collectionId,
    configs
  );

  for (const row of rows) table[row.Slug] = row;

  table = sortTableByDate(table);
  if (configs.queryUsers) table = await queryUsersOnTable<T>(table);

  return table;
}

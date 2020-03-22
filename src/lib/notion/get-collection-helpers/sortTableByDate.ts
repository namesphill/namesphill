import { CollectionTable, CollectionRow } from "../getCollectionData";

export default function sortTableByDate<T extends CollectionRow>(
  table: CollectionTable<T>
) {
  const newTable: CollectionTable<T> = {};
  Object.values(table)
    .sort((A, B) => {
      let [, a] = A.Date || [];
      let [, b] = B.Date || [];
      a = a instanceof Date ? a : new Date();
      b = b instanceof Date ? b : new Date();
      return Math.sign(a.getTime() || 0 - b.getTime() || 0);
    })
    .forEach((row) => (newTable[row.Slug] = row));
  return newTable;
}

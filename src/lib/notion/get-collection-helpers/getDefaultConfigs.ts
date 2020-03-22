import { GetCollectionDataConfigs } from "../getCollectionData";

export default function getDefaultConfigs(
  configs: GetCollectionDataConfigs
): NonNullable<GetCollectionDataConfigs> {
  const {
    contentBlockLimit,
    queryUsers = false,
    queryPageContent = false,
    separatePreviewContent = queryPageContent && configs.separatePreviewContent,
  } = configs;
  return {
    contentBlockLimit,
    queryUsers,
    queryPageContent,
    separatePreviewContent,
  };
}

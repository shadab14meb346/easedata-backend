import { DataSourceType } from "../types/data-source";

const hubSpotTables = [
  {
    label: "Contacts",
    name: "contacts",
  },
  {
    label: "Companies",
    name: "companies",
  },
  {
    label: "Deals",
    name: "deals",
  },
];
const dataSourceTablesMap = new Map([[DataSourceType.HUB_SPOT, hubSpotTables]]);
export const getDataSourceTables = (dataSourceType: DataSourceType) => {
  if (
    //TODO:improve the logic so that when we add more data sources for which tables are not, we don't have to add them here.
    dataSourceType === DataSourceType.GOOGLE_ANALYTICS ||
    dataSourceType === DataSourceType.MS_OFFICE_SHEET ||
    dataSourceType === DataSourceType.GSHEET
  ) {
    return [];
  }
  return dataSourceTablesMap.get(dataSourceType);
};

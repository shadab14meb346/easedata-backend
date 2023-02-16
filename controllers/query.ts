import { DataSource } from "../model/data-source";
import { DataQuery } from "../model/query";
import { Workspace } from "../model/workspace";
import { UserForJWTGeneration } from "../types/user";
import { DataSourceType, HUB_SPOT_TABLES } from "../types/data-source";
import { getHubSpotCompanies, _getHubSpotContacts } from "./hubspot";

interface DataQueryInput {
  user: UserForJWTGeneration;
  input: DataQuery.CreateOpts;
}
export const createQuery = async (data: DataQueryInput) => {
  const { user, input } = data;
  //TODO:keep the check if workspace exists otherwise throw error
  //TODO:only admin of the workspace can create a query keep this check here.
  const result = await DataQuery.create(input);
  return result;
};
interface GetQueryInput {
  id: number;
  user: UserForJWTGeneration;
}
interface GenericInput {
  user: UserForJWTGeneration;
  id: string;
}
export const getAQuery = async ({ id, user }: GenericInput) => {
  //TODO: keep the check if query exists otherwise throw error
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const result = await DataQuery.get(id);
  return result;
};

export const getDataQueriesOfAWorkspace = async ({
  id,
  user,
}: GenericInput) => {
  const workspace = await Workspace.getAWorkspace(id);
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const results = await DataQuery.getDataQueriesOfAWorkspace(id);
  return results;
};

export const executeQuery = async ({ user, input }) => {
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const { data_source_id, table_name, fields } = input;
  const dataSource = await DataSource.get(data_source_id);
  if (dataSource.type === DataSourceType.HUB_SPOT) {
    if (table_name === HUB_SPOT_TABLES.CONTACTS) {
      const contacts = await _getHubSpotContacts({
        refreshToken: dataSource.refresh_token,
        fields,
      });
      return { data: contacts };
    }
    if (table_name === HUB_SPOT_TABLES.COMPANIES) {
      const companies = await getHubSpotCompanies({
        refreshToken: dataSource.refresh_token,
        fields,
      });
      return { data: companies };
    }
  }
  return [];
};

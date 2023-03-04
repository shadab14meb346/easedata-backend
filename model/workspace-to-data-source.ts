import { DataSourceType } from "../types/data-source";
import { PostGrace, Table } from "../core/db-connection";

interface input {
  workspaceId: number;
  dataSourceId: DataSourceType;
}
export const addDataSourceToWorkspace = async (input: input) => {
  const { workspaceId, dataSourceId } = input;
  const results = await PostGrace.DB()
    .insert({
      workspace_id: workspaceId,
      data_source_id: dataSourceId,
    })
    .returning("*")
    .into(Table.WORKSPACE_TO_DATA_SOURCE);
  return results;
};

export const deleteDataSourceFromWorkspace = async (input: input) => {
  const { workspaceId, dataSourceId } = input;
  const results = await PostGrace.DB()
    .delete()
    .from(Table.WORKSPACE_TO_DATA_SOURCE)
    .where({
      workspace_id: workspaceId,
      data_source_id: dataSourceId,
    });
  return results;
};

export const getDataSourceToWorkspace = async (dataSourceId: string) => {
  const results = await PostGrace.DB()
    .select("workspace_id", "data_source_id")
    .from(Table.WORKSPACE_TO_DATA_SOURCE)
    .where({
      data_source_id: dataSourceId,
    })
    .first();
  return results;
};

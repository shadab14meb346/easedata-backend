import { ApolloError } from "apollo-server-lambda";
import { checkWorkSpaceWriteAuthorization } from "../common/autherization";
import { DataSource } from "../model/data-source";
import { deleteAllQueryOfADataSource } from "../model/query";
import {
  deleteDataSourceFromWorkspace,
  getDataSourceToWorkspace,
} from "../model/workspace-to-data-source";

export const deleteDataSource = async ({ id, user }) => {
  const workspaceToDataSource = await getDataSourceToWorkspace(id);
  if (!workspaceToDataSource) {
    throw new ApolloError("Data source not found", "USER_INPUT_ERROR");
  }
  await checkWorkSpaceWriteAuthorization({
    user,
    workspaceId: workspaceToDataSource.workspace_id,
  });
  await Promise.all([
    DataSource.deleteDataSource(id),
    deleteDataSourceFromWorkspace({
      workspaceId: workspaceToDataSource.workspace_id,
      dataSourceId: id,
    }),
    deleteAllQueryOfADataSource(id),
  ]);
  return {
    id,
    success: true,
  };
};

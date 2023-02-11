import { ApolloError } from "apollo-server-lambda";
import { PostGrace, Table } from "../core/db-connection";
import { WorkspaceRoles } from "../types/workspace";

export type CreateOpts = {
  name: string;
  owner_user_id: number;
};

export async function create(opts: CreateOpts) {
  try {
    const { name, owner_user_id } = opts;
    const result = await PostGrace.DB()
      .insert({
        name,
        owner_user_id,
      })
      .returning("*")
      .into(Table.WORKSPACE)
      .then((rows) => rows[0]);
    return result;
  } catch (error) {
    throw new ApolloError("Couldn't create workspace", "DBError");
  }
}
export async function getOwnedWorkspacesForAUser(userId: string) {
  try {
    const results = await PostGrace.DB()
      .select("*")
      .from(Table.WORKSPACE)
      .where({ owner_user_id: userId });
    return results;
  } catch (error) {
    throw new ApolloError("Couldn't find workspaces", "DBError");
  }
}
export async function getAWorkspace(workspaceId: string) {
  try {
    const result = await PostGrace.DB()
      .select("*")
      .from(Table.WORKSPACE)
      .where({ id: workspaceId })
      .then((rows) => rows[0]);
    return result;
  } catch (error) {
    throw new ApolloError("Couldn't find workspace", "DBError");
  }
}

export * as Workspace from "./workspace";

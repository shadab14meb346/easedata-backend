import { ApolloError } from "apollo-server-lambda";
import { PostGrace, Table } from "../core/db-connection";

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

export * as Workspace from "./workspace";

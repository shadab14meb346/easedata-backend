import { ApolloError } from "apollo-server-lambda";
import { PostGrace, Table } from "../core/db-connection";
import { DataSourceType } from "../types/data-source";

export type CreateOpts = {
  type: DataSourceType;
  access_token: string;
  refresh_token: string;
};

export async function create(opts: CreateOpts) {
  try {
    const { type, access_token, refresh_token } = opts;
    const results = await PostGrace.DB()
      .insert({
        type,
        access_token,
        refresh_token,
      })
      .returning("*")
      .into(Table.DATA_SOURCE);
    return results[0];
  } catch (error) {
    throw new ApolloError("Couldn't create data source", "DBError");
  }
}

export * as DataSource from "./data-source";

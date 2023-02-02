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

export async function getAllForAUser(userId) {
  try {
    const results = await PostGrace.DB()
      .select("ds.id", "ds.type", "ds.access_token", "ds.refresh_token")
      .from("data_source as ds")
      .innerJoin(
        "users_to_data_source",
        "ds.id",
        "=",
        "users_to_data_source.data_source_id"
      )
      .where({ user_id: userId });
    return results;
  } catch (error) {
    throw new ApolloError("Couldn't find user", "DBError");
  }
}

export * as DataSource from "./data-source";

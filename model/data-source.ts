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
      .select("ds.*")
      .from("data_source as ds")
      .innerJoin(
        "users_to_data_source",
        "ds.id",
        "=",
        "users_to_data_source.data_source_id"
      )
      .where({ user_id: userId });
    const resultsWithDatesConvertedToString = results.map((result) => {
      return {
        ...result,
        created_at: String(result.created_at),
        updated_at: String(result.updated_at),
      };
    });
    // console.log(resultsWithDatesConvertedToString);
    return resultsWithDatesConvertedToString;
  } catch (error) {
    throw new ApolloError("Couldn't find user", "DBError");
  }
}

export * as DataSource from "./data-source";

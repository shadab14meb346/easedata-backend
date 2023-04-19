import { ApolloError } from "apollo-server-lambda";
import { PostGrace, Table } from "../core/db-connection";
import { Interval, QueryScheduleStatus } from "../types/query-schedule";
export type CreateOpts = {
  query_id: number;
  g_sheet_id: string;
  interval: Interval;
};
export async function create(opts: CreateOpts) {
  try {
    const { query_id, g_sheet_id, interval } = opts;
    const results = await PostGrace.DB()
      .insert({
        query_id,
        g_sheet_id,
        interval,
        //by default, the query schedule is active
        status: QueryScheduleStatus.ACTIVE,
      })
      .returning("*")
      .into(Table.QUERY_SCHEDULE);
    return results[0];
  } catch (error) {
    throw new ApolloError("Couldn't create query schedule", "DBError");
  }
}
export async function getScheduledQueryOfAWorkspace(workspaceId: string) {
  try {
    const results = await PostGrace.DB()
      .select(
        "query_schedule.id as id",
        "query.id as query_id",
        "query.name as name",
        "query_schedule.interval as interval",
        "query_schedule.status as status"
      )
      .from("query")
      .innerJoin("query_schedule", "query.id", "=", "query_schedule.query_id")
      .where({ workspace_id: workspaceId });
    console.log("results", results);
    return results;
  } catch (error) {
    throw new ApolloError("Couldn't get query schedule", "DBError");
  }
}
export * as QuerySchedule from "./query-schedule";

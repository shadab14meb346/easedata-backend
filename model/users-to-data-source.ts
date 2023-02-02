import { DataSourceType } from "./../types/data-source";
import { PostGrace, Table } from "../core/db-connection";

interface input {
  userId: number;
  dataSourceId: DataSourceType;
}
export const addUserDataSource = async (input: input) => {
  const { userId, dataSourceId } = input;
  const results = await PostGrace.DB()
    .insert({
      user_id: userId,
      data_source_id: dataSourceId,
    })
    .returning("*")
    .into(Table.USERS_TO_DATA_SOURCE);
  return results;
};

import { QuerySchedule } from "../model/query-schedule";
import { Interval } from "../types/query-schedule";

export const eachMinute = async (event, context, callback) => {
  try {
    console.log(`Running each minute cron job`);
    //TODO: now execute the queries and update the data in the gsheet table
    await QuerySchedule.getAllActiveScheduledQueryForAnInterval(
      Interval.EACH_MINUTE
    );
  } catch (error) {
    console.log(`Error in morning cron job:: `, error);
  }
  return {
    status: 200,
  };
};

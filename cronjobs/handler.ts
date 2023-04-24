import { runScheduleQuery } from "../controllers/cron";
import { QuerySchedule } from "../model/query-schedule";
import { Interval } from "../types/query-schedule";

export const eachMinute = async (event, context, callback) => {
  try {
    console.log(`Running each minute cron job`);
    const scheduledQuery =
      await QuerySchedule.getAllActiveScheduledQueryForAnInterval(
        Interval.EACH_MINUTE
      );
    if (!scheduledQuery.length) {
      console.log(`No scheduled query found`);
      return {
        status: 200,
      };
    }
    const requests = [];
    scheduledQuery.forEach((query) => {
      runScheduleQuery({
        queryId: query.query_id,
        gSheetId: query.g_sheet_id,
      });
    });
    await Promise.all(requests);
  } catch (error) {
    console.log(`Error in morning cron job:: `, error);
  } finally {
    return {
      status: 200,
    };
  }
};

export const each30Minute = async (event, context, callback) => {
  try {
    console.log(`Running each 30 minute cron job`);
    const scheduledQuery =
      await QuerySchedule.getAllActiveScheduledQueryForAnInterval(
        Interval.EACH_HALF_HOUR
      );
    if (!scheduledQuery.length) {
      return {
        status: 200,
      };
    }
    const requests = [];
    scheduledQuery.forEach((query) => {
      runScheduleQuery({
        queryId: query.query_id,
        gSheetId: query.g_sheet_id,
      });
    });
    await Promise.all(requests);
  } catch (error) {
    console.log(`Error in morning cron job:: `, error);
  }
};

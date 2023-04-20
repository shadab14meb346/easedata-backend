import {
  createQuery,
  createScheduleQuery,
  executeQuery,
  getAQuery,
  getDataQueriesOfAWorkspace,
  getScheduleQueryOfAWorkspace,
} from "../../controllers/query";

export const DataQueryResolver = {
  Query: {
    getDataQuery: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const query = await getAQuery({
        id: _args.id,
        user,
      });
      return query;
    },
    listAllDataQueriesOfAWorkspace: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const dataQueries = await getDataQueriesOfAWorkspace({
        id: _args.workspaceId,
        user,
      });
      return dataQueries;
    },
    executeQuery: async (_parent, args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      return await executeQuery({
        user,
        input: args.input,
        limit: args?.limit,
        after: args?.after,
      });
    },
    listAllScheduledQueriesOfAWorkspace: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const scheduledQueries = await getScheduleQueryOfAWorkspace({
        id: _args.workspaceId,
        user,
      });
      return scheduledQueries;
    },
  },
  Mutation: {
    createDataQuery: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const createdQuery = await createQuery({
        user,
        input: _args.input,
      });
      return createdQuery;
    },
    scheduleQuery: async (_parent, args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const scheduledQuery = await createScheduleQuery(args.input);
      return scheduledQuery;
    },
  },
};

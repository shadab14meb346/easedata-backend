import * as DataSourceController from "../../controllers/data-source";

import { getAllImportantObjectProperties } from "../../controllers/hubspot";

export const DataSourceResolver = {
  Query: {
    getDataSourceTableFields: async (_parent, args, ctx, _info) => {
      ctx.assertAuthenticated();
      const fields = await getAllImportantObjectProperties({
        objectName: args.input.table_name,
        dataSourceId: args.input.data_source_id,
      });
      return fields;
    },
    getDataSourceSchema: async (_parent, args, ctx, _info) => {
      ctx.assertAuthenticated();
      return await DataSourceController.getDataSourceSchema({
        dataSourceId: args.input.data_source_id,
      });
    },
  },
  Mutation: {
    deleteDataSource: async (_parent, args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      return await DataSourceController.deleteDataSource({
        id: args.input.id,
        user: user,
      });
    },
  },
};

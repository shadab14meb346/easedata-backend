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

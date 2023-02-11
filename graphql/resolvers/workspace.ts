import * as WorkspaceController from "../../controllers/workspace";

export const WorkspaceResolver = {
  Query: {
    getWorkspace: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const workspace = {
        id: "123",
        name: "test",
      };
      return workspace;
    },
  },
  Mutation: {
    createWorkspace: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      return await WorkspaceController.createWorkspace({
        name: _args.input.name,
        owner_user_id: user.id,
      });
    },
  },
};

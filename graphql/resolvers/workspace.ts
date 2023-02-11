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
};

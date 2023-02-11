import * as WorkspaceController from "../../controllers/workspace";

export const WorkspaceResolver = {
  Query: {
    getWorkspace: async (_parent, args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const { workspaceId } = args;
      return await WorkspaceController.getWorkspace({ user, workspaceId });
    },
    getMyWorkspaces: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      return await WorkspaceController.getWorkspacesForAUser(user.id);
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
    inviteUserToWorkspace: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const { workspaceId, email, role } = _args.input;
      return await WorkspaceController.inviteUserToWorkspace({
        workspaceId,
        email,
        role,
        inviterId: user.id,
      });
    },
  },
};

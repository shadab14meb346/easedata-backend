import { WorkspaceRoles } from "./../types/workspace";
import { UserInputError } from "apollo-server-lambda";
import { Workspace } from "../model/workspace";
import { createWorkspaceInputValidator } from "../utils/validators";
import { User } from "../model/user";

const validateCreateWorkspaceInput = (input: Workspace.CreateOpts) => {
  const { error } = createWorkspaceInputValidator(input);
  if (error) {
    throw new UserInputError(
      "Failed to create workspace due to input validation errors",
      {
        validationErrors: error.details,
      }
    );
  }
};
const getWorkspaceRole = async ({ userId, workspace }) => {
  //TODO: handle the case for member and admin
  if (userId === Number(workspace.owner_user_id)) return WorkspaceRoles.OWNER;
  const workspaceUser = await Workspace.findWorkspaceUser({
    workspaceId: workspace.id,
    userId,
  });
  if (workspaceUser) return workspaceUser.role;
  return null;
};
export const createWorkspace = async (input: Workspace.CreateOpts) => {
  validateCreateWorkspaceInput(input);
  const createWorkspace = await Workspace.create(input);
  return { ...createWorkspace, role: WorkspaceRoles.OWNER };
};

export const getWorkspacesForAUser = async (userId: string) => {
  //TODO: get all workspace a user is member of
  //TODO: get all workspaces a user is admin of
  //TODO: now merge all workspaces and return
  const [ownedWorkspaces, nonOwnedWorkspacesOfUser] = await Promise.all([
    Workspace.getOwnedWorkspacesForAUser(userId),
    Workspace.getNonOwnedWorkspacesForAUser(userId),
  ]);
  const ownedWorkspacesWithRole = ownedWorkspaces.map((workspace) => {
    const workspaceObjWithRole = {
      ...workspace,
      role: WorkspaceRoles.OWNER,
    };
    return workspaceObjWithRole;
  });
  const nonOwnedWorkspaceWithJustRequiredFields = nonOwnedWorkspacesOfUser.map(
    (workspace) => {
      const obj = {
        id: workspace.id,
        name: workspace.name,
        role: workspace.role,
      };
      return obj;
    }
  );
  return [
    ...ownedWorkspacesWithRole,
    ...nonOwnedWorkspaceWithJustRequiredFields,
  ];
};

export const getWorkspace = async ({ workspaceId, user }) => {
  //TODO: only member, admin and owner can get workspace
  //TODO: check if the user is member, admin or owner of the workspace
  const workspace = await Workspace.getAWorkspace(workspaceId);
  if (!workspace)
    throw new Error("Workspace not found, not a valid workspace id");
  const workspaceRoleForTheCurrentUser = await getWorkspaceRole({
    userId: user.id,
    workspace,
  });
  const workspaceObjWithRole = {
    ...workspace,
    //TODO: handle this in the dataloader way
    role: workspaceRoleForTheCurrentUser,
  };
  return workspaceObjWithRole;
};

export const inviteUserToWorkspace = async ({
  workspaceId,
  email,
  inviterId,
  role,
}) => {
  //TODO: only owner or admin can invite user to workspace. Keep this check
  //TODO: include the joi validation for the input email
  const user = await User.findByEmail(email);
  if (user) {
    //TODO: check if the user is already a member or admin of the workspace
    //TODO: A user can only be have only one role in a workspace
    const addedUserToWorkspace = await Workspace.addUserToWorkspace({
      workspaceId,
      userId: user.id,
      role,
    });
    const successResponse = {
      message: "User invited successfully to the workspace",
      workspaceId: addedUserToWorkspace.workspace_id,
      createdAt: addedUserToWorkspace.created_at,
      invitedRole: addedUserToWorkspace.role,
    };
    return successResponse;
  }
  //TODO: send email to the user with the invite link
};

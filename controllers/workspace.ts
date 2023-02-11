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
const getWorkspaceRole = ({ userId, workspace }) => {
  //TODO: handle the case for member and admin
  if (userId === Number(workspace.owner_user_id)) return WorkspaceRoles.OWNER;
};
export const createWorkspace = async (input: Workspace.CreateOpts) => {
  validateCreateWorkspaceInput(input);
  return await Workspace.create(input);
};

export const getWorkspacesForAUser = async (userId: string) => {
  //TODO: get all workspace a user is member of
  //TODO: get all workspaces a user is admin of
  //TODO: now merge all workspaces and return
  const getWorkspacesThatUserIsOwnerOf = async () => {
    return Workspace.getOwnedWorkspacesForAUser(userId);
  };
  const [ownerWorkspaces] = await Promise.all([
    getWorkspacesThatUserIsOwnerOf(),
  ]);
  const ownedWorkspacesWithRole = ownerWorkspaces.map((workspace) => {
    const workspaceObjWithRole = {
      ...workspace,
      role: WorkspaceRoles.OWNER,
    };
    return workspaceObjWithRole;
  });
  return ownedWorkspacesWithRole;
};

export const getWorkspace = async ({ workspaceId, user }) => {
  //TODO: only member, admin and owner can get workspace
  //TODO: check if the user is member, admin or owner of the workspace
  const workspace = await Workspace.getAWorkspace(workspaceId);
  if (!workspace)
    throw new Error("Workspace not found, not a valid workspace id");
  const workspaceObjWithRole = {
    ...workspace,
    role: getWorkspaceRole({ userId: user.id, workspace }),
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

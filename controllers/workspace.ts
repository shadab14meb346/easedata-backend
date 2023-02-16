import { WorkspaceRoles } from "./../types/workspace";
import { ApolloError, UserInputError } from "apollo-server-lambda";
import { Workspace } from "../model/workspace";
import {
  createWorkspaceInputValidator,
  emailValidator,
} from "../utils/validators";
import { User } from "../model/user";
import { DataSource } from "../model/data-source";
import { getDataSourceTables } from "../utils/data-source-tables";
import { getAllImportantObjectProperties } from "./hubspot";

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
  if (!workspace) {
    throw new ApolloError(
      "Workspace not found, not a valid workspace id",
      "UserInputError"
    );
  }
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

const checkAuthorizationForInviteUserToWorkspace = async ({
  userId,
  workspaceId,
}) => {
  const allowedRolesToPerformThisAction = [
    WorkspaceRoles.ADMIN,
    WorkspaceRoles.OWNER,
  ];
  const workspace = await Workspace.getAWorkspace(workspaceId);
  if (!workspace) {
    throw new ApolloError("Workspace not found", "UserInputError");
  }
  const workspaceRoleForTheCurrentUser = await getWorkspaceRole({
    userId,
    workspace,
  });
  if (
    !allowedRolesToPerformThisAction.includes(workspaceRoleForTheCurrentUser)
  ) {
    throw new ApolloError(
      "You are not authorized to perform this action",
      "UnauthorizedError"
    );
  }
};
export const inviteUserToWorkspace = async ({
  workspaceId,
  email,
  inviterId,
  role,
}) => {
  emailValidator(email);
  await checkAuthorizationForInviteUserToWorkspace({
    userId: inviterId,
    workspaceId,
  });
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

export const getListOfDataSources = async ({ workspaceId, user }) => {
  //TODO: the user should be a member or admin or owner of the workspace
  const results = await DataSource.getAllForAWorkspace(workspaceId);
  const resultsWithTables = results.map((result) => {
    const tables = getDataSourceTables(result.type);
    return { ...result, tables };
  });
  return resultsWithTables;
};

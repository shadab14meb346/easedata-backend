import { WorkspaceRoles } from "./../types/workspace";
import { UserInputError } from "apollo-server-lambda";
import { Workspace } from "../model/workspace";
import { createWorkspaceInputValidator } from "../utils/validators";

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

import { UserForJWTGeneration } from "../types/user";
import { Workspace } from "../model/workspace";
import { ApolloError } from "apollo-server-lambda";
import { WorkspaceRoles } from "../types/workspace";

type CheckAuthorizationInput = {
  user: UserForJWTGeneration;
  workspaceId: string;
};
export const checkWorkSpaceWriteAuthorization = async ({
  user,
  workspaceId,
}: CheckAuthorizationInput) => {
  console.log("user", user);
  const workspace = await Workspace.getAWorkspace(workspaceId);
  const ownerUserId = workspace.owner_user_id;
  const workspaceToUsers = await Workspace.findWorkspaceUser({
    workspaceId,
    userId: user.id,
  });
  if (
    ownerUserId == user.id ||
    workspaceToUsers?.role === WorkspaceRoles.ADMIN
  ) {
    return true;
  }
  throw new ApolloError("You don't have permission to do this", "Unauthorized");
};

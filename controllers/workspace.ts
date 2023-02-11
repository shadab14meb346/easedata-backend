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

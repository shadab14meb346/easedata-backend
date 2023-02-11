import Joi, { ValidationResult } from "joi";
import { User } from "../model/user";
import { Workspace } from "../model/workspace";

export const registerInputValidator = (
  input: User.CreateOpts
): ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).alphanum().required(),
  });
  return schema.validate(input, { abortEarly: false });
};

export const createWorkspaceInputValidator = (
  input: Workspace.CreateOpts
): ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    owner_user_id: Joi.number().required(),
  });
  return schema.validate(input, { abortEarly: false });
};

export const emailValidator = (email: string): ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate({ email }, { abortEarly: false });
};

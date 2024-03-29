import * as UserController from "../../controllers/user";
import { DataSource } from "../../model/data-source";

export const UserResolver = {
  Query: {
    getAllUsers: async (_parent, _args, ctx, _info) => {
      ctx.assertAuthenticated();
      ctx.adminAuthorization();
      return await UserController.getAll();
    },
    getMe: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      return await UserController.getUserById(user.id);
    },
  },
  Mutation: {
    register: async (_parent, args) => {
      return await UserController.register(args.input);
    },
    login: async (_parent, args) => {
      return await UserController.login(args.input);
    },
  },
  User: {
    id: ({ id }) => id,
    email: ({ email }) => email,
    name: ({ name }) => name,
    admin: ({ admin }) => admin || false,
  },
};

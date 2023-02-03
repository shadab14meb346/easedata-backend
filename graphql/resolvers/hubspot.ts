import { getHubSpotContacts } from "../../controllers/hubspot";

export const HubSpotResolver = {
  Query: {
    getHubSpotContacts: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      return await getHubSpotContacts(user.id);
    },
  },
};

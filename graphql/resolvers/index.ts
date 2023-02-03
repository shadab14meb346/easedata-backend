import merge from "lodash.merge";
import { HealthCheckResolver } from "./health-check";
import { HubSpotResolver } from "./hubspot";
import { UserResolver } from "./user";

const resolvers = merge(UserResolver, HealthCheckResolver, HubSpotResolver);

export default resolvers;

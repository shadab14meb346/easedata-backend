import merge from "lodash.merge";
import { HealthCheckResolver } from "./health-check";
import { HubSpotResolver } from "./hubspot";
import { DataQueryResolver } from "./query";
import { UserResolver } from "./user";
import { WorkspaceResolver } from "./workspace";

const resolvers = merge(
  UserResolver,
  HealthCheckResolver,
  HubSpotResolver,
  WorkspaceResolver,
  DataQueryResolver
);

export default resolvers;

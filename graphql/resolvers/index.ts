import merge from "lodash.merge";
import { DataSourceResolver } from "./data-source";
import { HealthCheckResolver } from "./health-check";
import { DataQueryResolver } from "./query";
import { UserResolver } from "./user";
import { WorkspaceResolver } from "./workspace";

const resolvers = merge(
  UserResolver,
  HealthCheckResolver,
  WorkspaceResolver,
  DataQueryResolver,
  DataSourceResolver
);

export default resolvers;

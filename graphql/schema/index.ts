import DataSourceTypeDef from "./data-source";
import healthCheckTypeDef from "./health-check";
import queryTypeDef from "./query";
import userTypeDef from "./user";
import workspaceTypeDef from "./workspace";

const typeDefs = [
  userTypeDef,
  healthCheckTypeDef,
  DataSourceTypeDef,
  workspaceTypeDef,
  queryTypeDef,
];

export default typeDefs;

import { gql } from "apollo-server-lambda";

const workspaceTypeDef = gql`
  type Query {
    getWorkspace(id: ID!): Workspace!
  }

  type Workspace {
    id: ID!
    name: String!
  }
`;

export default workspaceTypeDef;

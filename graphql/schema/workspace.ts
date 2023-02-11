import { gql } from "apollo-server-lambda";

const workspaceTypeDef = gql`
  type Query {
    getWorkspace(id: ID!): Workspace!
  }

  type Mutation {
    createWorkspace(input: CreateWorkspaceInput!): Workspace!
  }

  type Workspace {
    id: ID!
    name: String!
  }
  input CreateWorkspaceInput {
    name: String!
  }
`;

export default workspaceTypeDef;

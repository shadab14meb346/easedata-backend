import { gql } from "apollo-server-lambda";

const workspaceTypeDef = gql`
  type Query {
    getWorkspace(id: ID!): Workspace!
    getMyWorkspaces: [Workspace!]!
  }

  type Mutation {
    createWorkspace(input: CreateWorkspaceInput!): Workspace!
  }

  type Workspace {
    id: ID!
    name: String!
    role: WorkspaceRole!
  }
  input CreateWorkspaceInput {
    name: String!
  }
  enum WorkspaceRole {
    OWNER
    MEMBER
    ADMIN
  }
`;

export default workspaceTypeDef;

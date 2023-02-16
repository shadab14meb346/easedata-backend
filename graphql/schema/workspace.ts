import { gql } from "apollo-server-lambda";

const workspaceTypeDef = gql`
  type Query {
    getWorkspace(workspaceId: ID!): Workspace!
    getMyWorkspaces: [Workspace!]!
    getListOfDataSources(workspaceId: ID!): [DataSource!]!
  }

  type Mutation {
    createWorkspace(input: CreateWorkspaceInput!): Workspace!
    inviteUserToWorkspace(
      input: InviteUserToWorkspaceInput!
    ): InviteUserToWorkspaceResponse!
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
  enum InputAllowedWorkspaceRole {
    MEMBER
    ADMIN
  }
  input InviteUserToWorkspaceInput {
    workspaceId: ID!
    email: String!
    role: InputAllowedWorkspaceRole!
  }
  type InviteUserToWorkspaceResponse {
    message: String!
    createdAt: String!
    workspaceId: ID!
    invitedRole: InputAllowedWorkspaceRole!
  }
`;

export default workspaceTypeDef;

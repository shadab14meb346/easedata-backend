import { gql } from "apollo-server-lambda";

const queryTypeDef = gql`
  type Query {
    getDataQuery(id: ID!): DataQuery!
    listAllDataQueriesOfAWorkspace(workspaceId: ID!): [DataQuery!]
  }
  type Mutation {
    createDataQuery(input: DataQueryInput!): DataQuery!
  }
  input DataQueryInput {
    name: String!
    description: String
    data_source_id: Int!
    table_name: String!
    workspace_id: Int!
    fields: [String!]!
  }
  type DataQuery {
    id: ID!
    name: String!
    description: String
    data_source_id: Int!
    table_name: String!
    workspace_id: Int!
    fields: [String!]!
    created_at: String
    updated_at: String
  }
`;

export default queryTypeDef;

import { gql } from "apollo-server-lambda";
import { GraphQLScalarType } from "graphql";

const DynamicObjectType = new GraphQLScalarType({
  name: "DynamicObject",
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    // @ts-ignore
    const keys = Object.keys(ast.value);
    // @ts-ignore
    const values = Object.values(ast.value);
    const result = {};
    keys.forEach((key, index) => {
      // @ts-ignore
      result[key] = values[index].value;
    });
    return result;
  },
});
const queryTypeDef = gql`
  type Query {
    getDataQuery(id: ID!): DataQuery!
    listAllDataQueriesOfAWorkspace(workspaceId: ID!): [DataQuery!]
    executeQuery(input: ExecuteQueryInput!): QueryResult!
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
  input ExecuteQueryInput {
    data_source_id: Int!
    table_name: String!
    fields: [String!]!
  }
  type QueryResult {
    data: [DynamicObjectType!]
  }
  scalar DynamicObjectType
`;

export default queryTypeDef;

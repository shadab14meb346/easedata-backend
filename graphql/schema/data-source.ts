import { gql } from "apollo-server-lambda";

/*TODO: Define a proper type for date Reference the below docs 
https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/ 
*/
const DataSourceTypeDef = gql`
  type Query {
    getDataSourceTableFields(input: GetDataSourceTableFieldsInput!): [Field!]!
    getDataSourceSchema(
      input: GetDataSourceSchemaInput!
    ): GetDataSourceSchemaResponse!
  }
  type Mutation {
    deleteDataSource(input: DeleteDataSourceInput!): DeletedDataSourceResponse!
  }
  input DeleteDataSourceInput {
    id: ID!
  }
  type DeletedDataSourceResponse {
    id: ID!
    success: Boolean!
  }
  type DataSource {
    id: ID!
    type: String!
    tables: [Table!]!
    created_at: String!
    updated_at: String!
  }
  type Table {
    name: String!
    label: String!
  }
  input GetDataSourceTableFieldsInput {
    data_source_id: ID!
    table_name: String!
  }
  type Field {
    name: String!
    label: String!
    data_type: DataType!
  }
  enum DataType {
    TEXT
    NUMBER
    DATE
  }
  input GetDataSourceSchemaInput {
    data_source_id: ID!
  }
  type GetDataSourceSchemaResponse {
    data_source: DataSource!
    schema: DynamicObjectType
  }
`;

export default DataSourceTypeDef;

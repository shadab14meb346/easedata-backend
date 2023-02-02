import { gql } from "apollo-server-lambda";

/*TODO: Define a proper type for date Reference the below docs 
https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/ 
*/
const DataSourceTypeDef = gql`
  type DataSource {
    id: ID!
    type: String!
    access_token: String
    refresh_token: String
    created_at: String!
    updated_at: String!
  }
`;

export default DataSourceTypeDef;

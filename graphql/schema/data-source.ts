import { gql } from "apollo-server-lambda";

const DataSourceTypeDef = gql`
  type DataSource {
    id: ID!
    type: String!
    access_token: String
    refresh_token: String
  }
`;

export default DataSourceTypeDef;

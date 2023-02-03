import { gql } from "apollo-server-lambda";

const hubSpotTypeDef = gql`
  type Query {
    getHubSpotContacts: [Contacts!]
  }
  type Contacts {
    created_at: String!
    first_name: String!
    last_name: String
  }
`;

export default hubSpotTypeDef;

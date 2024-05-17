const studentTypeDefs = /* GraphQL */ `
  input FormUpdateUser {
    email: String!
    full_name: String!
  }
  type User {
    id: ID!
    full_name: String!
    email: String!
    status: String!
    created_at: String
    updated_at: String
  }

  type AuthOutput {
    access_token: String!
  }
  type Query {
    me: User!
  }
`;

export default studentTypeDefs;

const studentTypeDefs = /* GraphQL */ `
  input FormUpdateUser {
    email: String!
    full_name: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    images: [String]
    order: Int!
    status: String!
    is_completed: Boolean!
    created_at: String
    updated_at: String
    assignee: User!
  }

  type User {
    id: ID!
    full_name: String!
    email: String!
    status: String!
    created_at: String
    updated_at: String
    tasks: [Task]
  }

  type AuthOutput {
    access_token: String!
  }

  type Query {
    me: User!
  }
`;

export default studentTypeDefs;

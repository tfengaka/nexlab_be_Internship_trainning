const studentTypeDefs = /* GraphQL */ `
  type Student {
    id: String!
    fullName: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input SignUpInput {
    fullName: String!
    email: String!
    password: String!
  }

  type AuthOutput {
    student: Student!
    accessToken: String!
  }

  type Query {
    getMe: Student!
    getStudents: [Student]!
  }

  type Mutation {
    signIn(form: SignInInput!): AuthOutput!
    signUp(form: SignUpInput!): AuthOutput!
  }
`;

export default studentTypeDefs;

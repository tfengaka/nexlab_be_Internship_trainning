const studentTypeDefs = /* GraphQL */ `
  type Student {
    id: String
    fullName: String
    email: String
    createdAt: String
    updatedAt: String
  }

  input SignInInput {
    email: String
    password: String
  }

  input SignUpInput {
    fullName: String
    email: String
    password: String
  }

  type AuthOutputData {
    student: Student
    accessToken: String!
  }

  type AuthOutput {
    data: AuthOutputData!
    code: Int!
    message: String!
  }

  type Query {
    getMe: Student!
  }

  type Mutation {
    signIn(form: SignInInput!): AuthOutput
    signUp(form: SignUpInput!): AuthOutput
  }
`;

export default studentTypeDefs;

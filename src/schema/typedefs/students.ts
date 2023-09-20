const studentTypeDefs = /* GraphQL */ `
  input SignInInput {
    email: String!
    password: String!
  }

  input SignUpInput {
    fullName: String!
    email: String!
    password: String!
  }

  input UpdateStudentInput {
    email: String!
    fullName: String!
  }

  input ChangePasswordForm {
    oldPassword: String!
    newPassword: String!
  }

  type Student {
    id: ID!
    fullName: String!
    email: String!
    createdAt: String
    updatedAt: String
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
    updateStudentByPk(pk: ID!, data: UpdateStudentInput!): Student!
    deleteStudentByPk(pk: ID!): MessagesOutput!
    changePassword(form: ChangePasswordForm!): MessagesOutput!
  }
`;

export default studentTypeDefs;

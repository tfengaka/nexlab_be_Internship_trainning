const studentType = `id: ID!
fullName: String!
email: String!
status: String!
createdAt: String
updatedAt: String`;

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
    ${studentType}
  }
  type StudentWithClasses {
    ${studentType}
    classes: [Class]!
  }
  type AuthOutput {
    student: Student!
    accessToken: String!
  }

  type Query {
    getMe: StudentWithClasses!
    getStudents: [Student]!
  }

  type Mutation {
    signIn(form: SignInInput!): AuthOutput!
    signUp(form: SignUpInput!): AuthOutput!
    updateStudentByPk(pk: ID!, data: UpdateStudentInput!): Student!
    deleteStudentByPk(pk: ID!): MessagesOutput!
    changePassword(form: ChangePasswordForm!): MessagesOutput!
    enrollClass(classId: ID!): MessagesOutput!
  }
`;

export default studentTypeDefs;

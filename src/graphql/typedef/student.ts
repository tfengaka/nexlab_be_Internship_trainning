const studentType = `id: ID!
full_name: String!
email: String!
status: String!
created_at: String
updated_at: String`;

const studentTypeDefs = /* GraphQL */ `
  input FormSignInInput {
    email: String!
    password: String!
  }

  input FormSignUpInput {
    full_name: String!
    email: String!
    password: String!
  }

  input FormUpdateStudent {
    email: String!
    full_name: String!
  }

  input FormEditPasswordInput {
    oldPassword: String!
    newPassword: String!
  }

  type Student {
    ${studentType}
  }
  type StudentWithClass {
    ${studentType}
    classes: [Class]!
  }
  type AuthOutput {
    access_token: String!
  }

  type Query {
    getMe: StudentWithClass!
    getStudents: [Student]!
  }

  type Mutation {
    updateStudentByPk(pk: ID!, form: FormUpdateStudent!): Student!
    deleteStudentByPk(pk: ID!): MessagesOutput!
    change_password(form: FormEditPasswordInput!): MessagesOutput!
    enroll_class(classId: ID!): MessagesOutput!
  }
`;

export default studentTypeDefs;

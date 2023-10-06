const studentType = `id: ID!
full_name: String!
email: String!
status: String!
created_at: String
updated_at: String`;

const studentTypeDefs = /* GraphQL */ `
  input FormUpdateStudent {
    email: String!
    full_name: String!
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
  }
`;

export default studentTypeDefs;

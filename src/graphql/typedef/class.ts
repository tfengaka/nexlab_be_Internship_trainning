const classType = `id: ID!
class_name: String!
status: String!
created_at: String
updated_at: String`;

const classTypeDefs = /* GraphQL */ `
  type Class {
    ${classType}
  }

  type ClassWithStudent {
    ${classType}
    students: [Student]
  }

  type Query {
    getAllClasses: [Class]
    getClassByPk(pk: ID): ClassWithStudent!
    getClassesByStudentPk(pk: ID!): [Class]
  }

  type Mutation {
    createClass(name: String!): Class!
    updateClassNameByPk(pk: ID!, className: String!): Class!
  }
`;

export default classTypeDefs;

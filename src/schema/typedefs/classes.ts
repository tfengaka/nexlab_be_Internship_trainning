const classTypeDefs = /* GraphQL */ `
  type Class {
    id: ID!
    className: String!
    students: [Student]
    createdAt: String
    updatedAt: String
  }

  type Query {
    getAllClasses: [Class]
  }
`;

export default classTypeDefs;

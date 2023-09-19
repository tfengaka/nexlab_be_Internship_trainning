import studentTypeDefs from './students';

const example = /* GraphQL */ `
  type Query {
    hello: String!
  }
`;

const rootTypeDefs = studentTypeDefs + example;

export default rootTypeDefs;

import userTypeDefs from './user';

const commonTypes = /* GraphQL */ `
  type MessagesOutput {
    messages: String!
  }
`;

const rootTypeDefs = commonTypes + userTypeDefs;
export default rootTypeDefs;

import studentTypeDefs from './students';
import classTypeDefs from './classes';

const commonTypes = /* GraphQL */ `
  type MessagesOutput {
    messages: String!
  }
`;

const rootTypeDefs = commonTypes + studentTypeDefs + classTypeDefs;
export default rootTypeDefs;

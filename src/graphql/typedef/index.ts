import studentTypeDefs from './student';
import classTypeDefs from './class';

const commonTypes = /* GraphQL */ `
  type MessagesOutput {
    messages: String!
  }
`;

const rootTypeDefs = commonTypes + studentTypeDefs + classTypeDefs;
export default rootTypeDefs;

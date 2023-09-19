import { createSchema } from 'graphql-yoga';
import typeDefs from './typedefs';
import resolvers from './resolvers';
const schema = createSchema({
  typeDefs,
  resolvers,
});

export default schema;

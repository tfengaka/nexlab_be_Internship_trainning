import { createSchema } from 'graphql-yoga';
import resolvers from './resolver';
import typeDefs from './typedef';
const schema = createSchema({
  typeDefs,
  resolvers,
});

export default schema;

import { createSchema } from 'graphql-yoga';
import resolvers from './resolver';
import typeDefs from './typedef';
export const schema = createSchema({
  typeDefs,
  resolvers,
});

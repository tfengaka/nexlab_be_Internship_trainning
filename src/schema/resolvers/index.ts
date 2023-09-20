import studentResolvers from './students';
import classResolvers from './classes';
const rootResolvers = {
  Query: {
    ...studentResolvers.Query,
    ...classResolvers.Query,
  },
  Mutation: {
    ...studentResolvers.Mutation,
  },
};

export default rootResolvers;

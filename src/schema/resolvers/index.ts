import studentResolvers from './students';
import classResolvers from './classes';
const rootResolvers = {
  Query: {
    ...studentResolvers.Query,
    ...classResolvers.Query,
  },
  Mutation: {
    ...studentResolvers.Mutation,
    ...classResolvers.Mutation,
  },
};

export default rootResolvers;

import studentResolvers from './student';
import classResolvers from './class';
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

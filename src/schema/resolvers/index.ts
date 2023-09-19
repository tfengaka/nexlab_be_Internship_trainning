import studentResolvers from './students';

const rootResolvers = {
  Query: {
    ...studentResolvers.Query,
  },
  Mutation: {
    ...studentResolvers.Mutation,
  },
};

export default rootResolvers;

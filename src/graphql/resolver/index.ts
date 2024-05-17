import userResolvers from './user';
const rootResolvers = {
  Query: {
    ...userResolvers.Query,
  },
  
};

export default rootResolvers;

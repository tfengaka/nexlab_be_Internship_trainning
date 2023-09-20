import { GraphQLError } from 'graphql';
import { getAllClasses } from '~/services/classes.services';

const classResolvers = {
  Query: {
    getAllClasses: async () => {
      try {
        return await getAllClasses();
      } catch (error) {
        console.error(error);
        const errors = new GraphQLError(error as string);
        return errors;
      }
    },
  },
};

export default classResolvers;

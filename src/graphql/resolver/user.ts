import { YogaInitialContext } from 'graphql-yoga';
import {
  getCurrentUser
} from '~/graphql/service/student.service';

const studentResolvers = {
  Query: {
    me: async (_: any, __: any, context: YogaInitialContext) => {
      try {
        const token = context.request.headers.get('authorization')?.split(' ')[1] as string;
        return await getCurrentUser(token);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
  },
};

export default studentResolvers;

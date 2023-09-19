import { YogaInitialContext } from 'graphql-yoga';
import { SignIn, SignUp, getCurrentStudent } from '~/services/students.services';

const studentResolvers = {
  Query: {
    getMe: async (_: any, args: any, context: YogaInitialContext) => {
      try {
        const token = context.request.headers.get('authorization')?.split(' ')[1] as string;
        return await getCurrentStudent(token);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    getStudents: async (_: any, args: any, context: YogaInitialContext) => {},
  },
  Mutation: {
    signUp: async (_: any, args: { form: SignUpInput }, context: YogaInitialContext) => {
      try {
        return await SignUp(args.form);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    signIn: async (_: any, args: { form: SignInInput }, context: YogaInitialContext) => {
      try {
        return await SignIn(args.form);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
  },
};

export default studentResolvers;

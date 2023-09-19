import { YogaInitialContext } from 'graphql-yoga';
import { SignIn, SignUp } from '~/services/students.services';

const rootResolvers = {
  Query: {
    hello: () => 'hello world',
  },
  Mutation: {
    signUp: async (_: any, args: { form: SignUpInput }, context: YogaInitialContext) => {
      try {
        return await SignUp(args.form);
      } catch (error) {
        console.error(error);
      }
    },
    signIn: async (_: any, args: { form: SignInInput }, context: YogaInitialContext) => {
      try {
        return await SignIn(args.form);
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default rootResolvers;

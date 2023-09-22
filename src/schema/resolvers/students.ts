import { YogaInitialContext } from 'graphql-yoga';
import {
  SignIn,
  SignUp,
  changePassword,
  enrollClass,
  getAllStudents,
  getCurrentStudent,
  removeStudentByPk,
  updateStudentDataByPk,
} from '~/services/students.services';

const studentResolvers = {
  Query: {
    getMe: async (_: any, __: any, context: YogaInitialContext) => {
      try {
        const token = context.request.headers.get('authorization')?.split(' ')[1] as string;
        return await getCurrentStudent(token);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    getStudents: async () => await getAllStudents(),
  },
  Mutation: {
    signUp: async (_: any, args: { form: SignUpInput }) => {
      try {
        return await SignUp(args.form);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    signIn: async (_: any, args: { form: SignInInput }) => {
      try {
        return await SignIn(args.form);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    deleteStudentByPk: async (_: any, args: { pk: string }) => {
      try {
        return await removeStudentByPk(args.pk);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    updateStudentByPk: async (_: any, args: { pk: string; data: UpdateStudentInput }) => {
      try {
        return await updateStudentDataByPk(args.pk, args.data);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    changePassword: async (_: any, args: { form: ChangePasswordInput }, context: YogaInitialContext) => {
      try {
        const token = context.request.headers.get('authorization')?.split(' ')[1] as string;
        return await changePassword(token, args.form);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    enrollClass: async (_: any, args: { classId: string }, context: YogaInitialContext) => {
      try {
        const token = context.request.headers.get('authorization')?.split(' ')[1] as string;
        return await enrollClass(token, args.classId);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
  },
};

export default studentResolvers;

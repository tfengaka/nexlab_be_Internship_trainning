import { GraphQLError } from 'graphql';
import {
  createClass,
  getAllClasses,
  getClassDataByPk,
  getClassesByStudentId,
  updateClassNameById,
} from '~/graphql/service/class.service';

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
    getClassByPk: async (_: any, args: { pk: string }) => {
      try {
        return await getClassDataByPk(args.pk);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    getClassesByStudentPk: async (_: any, args: { pk: string }) => {
      try {
        return await getClassesByStudentId(args.pk);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
  },
  Mutation: {
    createClass: async (_: any, args: { name: string }) => {
      try {
        return await createClass(args.name);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    updateClassNameByPk: async (_: any, args: { pk: string; className: string }) => {
      try {
        return await updateClassNameById(args.pk, args.className);
      } catch (error) {
        console.error(error);
        return error;
      }
    },
  },
};

export default classResolvers;

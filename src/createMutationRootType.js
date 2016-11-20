import { GraphQLObjectType } from 'graphql';
import decorateWithResolvers from './decorateWithResolvers';

export default (schema, mutations, middleware, types) => {
  if (!['function', 'object'].includes(typeof mutations)) {
    throw new Error(
      'Argument "mutations" must either be an object or a function that takes a type as its ' +
      'first and only argument.'
    );
  }

  return new GraphQLObjectType({
    name: 'Mutation',
    fields: () => schema.types.reduce((prev, type) => {
      const { name } = type;

      const invokedMutations = typeof mutations === 'function'
        ? mutations(type)
        : mutations;

      return {
        ...prev,
        ...decorateWithResolvers(invokedMutations, middleware, types, name),
      };
    }, {}),
  });
};

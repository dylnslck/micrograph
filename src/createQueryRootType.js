import { GraphQLObjectType } from 'graphql';
import decorateWithResolvers from './decorateWithResolvers';

export default (schema, queries, middleware, types) => {
  if (!['function', 'object'].includes(typeof queries)) {
    throw new Error(
      'Argument "queries" must either be an object or a function that takes a type as its ' +
      'first and only argument.'
    );
  }

  return new GraphQLObjectType({
    name: 'Query',
    fields: () => schema.types.reduce((prev, type) => {
      const { name } = type;

      const invokedQueries = typeof queries === 'function'
        ? queries(type)
        : queries;

      return {
        ...prev,
        ...decorateWithResolvers(invokedQueries, middleware, types, name),
      };
    }, {}),
  });
};

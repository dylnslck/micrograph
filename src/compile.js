import { GraphQLSchema } from 'graphql';

import createMutationRootType from './createMutationRootType';
import createQueryRootType from './createQueryRootType';
import instantiateObjectTypes from './instantiateObjectTypes';

export default ({ schema, queries, mutations, middleware } = {}) => {
  if (typeof schema !== 'object') {
    throw new TypeError('Option "schema" must be an object');
  }

  if (typeof queries !== 'function') {
    throw new TypeError('Option "queries" must be a function');
  }

  const types = instantiateObjectTypes(schema);
  const QueryRootType = createQueryRootType(schema, queries, middleware, types);

  if (mutations) {
    const MutationRootType = createMutationRootType(schema, mutations, middleware, types);

    return new GraphQLSchema({
      query: QueryRootType,
      mutation: MutationRootType,
    });
  }

  return new GraphQLSchema({
    query: QueryRootType,
  });
};

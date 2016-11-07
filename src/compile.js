import { GraphQLSchema } from 'graphql';

import createMutationRootType from './createMutationRootType';
import createQueryRootType from './createQueryRootType';
import instantiateObjectTypes from './instantiateObjectTypes';

export default (schema, resolvers, middleware) => {
  const types = instantiateObjectTypes(schema);
  const QueryRootType = createQueryRootType(schema, resolvers, middleware, types);
  const MutationRootType = createMutationRootType(schema, resolvers, middleware, types);

  return new GraphQLSchema({
    query: QueryRootType,
    mutation: MutationRootType,
  });
};

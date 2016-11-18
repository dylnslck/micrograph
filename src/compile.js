import { GraphQLSchema } from 'graphql';

import createMutationRootType from './createMutationRootType';
import createQueryRootType from './createQueryRootType';
import instantiateObjectTypes from './instantiateObjectTypes';

export default ({ schema, queries, mutations, resolvers, middleware }) => {
  const types = instantiateObjectTypes(schema);
  const QueryRootType = createQueryRootType(schema, queries, resolvers, middleware, types);
  const MutationRootType = createMutationRootType(schema, mutations, resolvers, middleware, types);

  return new GraphQLSchema({
    query: QueryRootType,
    mutation: MutationRootType,
  });
};

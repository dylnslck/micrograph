import { GraphQLSchema } from 'graphql';

import createMutationRootType from './createMutationRootType';
import createQueryRootType from './createQueryRootType';
import instantiateObjectTypes from './instantiateObjectTypes';

export default (schemas, resolvers) => {
  const types = instantiateObjectTypes(schemas);
  const QueryRootType = createQueryRootType(schemas, resolvers, types);
  const MutationRootType = createMutationRootType(schemas, resolvers, types);

  return new GraphQLSchema({
    query: QueryRootType,
    mutation: MutationRootType,
  });
};

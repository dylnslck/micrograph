import { GraphQLSchema } from 'graphql';

import createMutationRootType from './createMutationRootType';
import createQueryRootType from './createQueryRootType';
import instantiateObjectTypes from './instantiateObjectTypes';

export default (schema, resolvers) => {
  const types = instantiateObjectTypes(schema);
  const QueryRootType = createQueryRootType(schema, resolvers, types);
  const MutationRootType = createMutationRootType(schema, resolvers, types);

  return new GraphQLSchema({
    query: QueryRootType,
    mutation: MutationRootType,
  });
};

import { GraphQLSchema } from 'graphql';

import createMutationRootType from './createMutationRootType';
import createQueryRootType from './createQueryRootType';
import instantiateObjectTypes from './instantiateObjectTypes';

export default (schemas) => {
  const types = instantiateObjectTypes(schemas);
  const QueryRootType = createQueryRootType(schemas, types);
  const MutationRootType = createMutationRootType(schemas, types);

  return new GraphQLSchema({
    query: QueryRootType,
    mutation: MutationRootType,
  });
};

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import errorsType from './errorsType';
import titleizeType from './titleizeType';

const PageInfoType = new GraphQLObjectType({
  name: 'PageInfoType',
  fields: {
    hasPreviousPage: { type: GraphQLBoolean },
    hasNextPage: { type: GraphQLBoolean },
    startCursor: { type: GraphQLString },
    endCursor: { type: GraphQLString },
  },
});

export default (name, type) => new GraphQLObjectType({
  name: `${titleizeType(name)}Connection`,
  fields: {
    errors: { type: errorsType },
    pageInfo: { type: PageInfoType },
    totalCount: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(new GraphQLObjectType({
        name: `${titleizeType(name)}ConnectionEdgeType`,
        fields: {
          cursor: { type: GraphQLString },
          node: { type },
        },
      })),
    },
  },
});

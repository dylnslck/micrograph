import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

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

export default (name, graphQLObjectType) => new GraphQLObjectType({
  name: `${titleizeType(name)}Connection`,
  fields: {
    pageInfo: { type: PageInfoType },
    totalCount: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(new GraphQLObjectType({
        name: `${titleizeType(name)}ConnectionEdge`,
        fields: {
          cursor: { type: GraphQLString },
          node: { type: graphQLObjectType },
        },
      })),
    },
  },
});

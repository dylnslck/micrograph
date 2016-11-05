import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

export default new GraphQLInputObjectType({
  name: 'OptionsInput',
  fields: {
    page: {
      type: new GraphQLInputObjectType({
        name: 'PaginationInput',
        description: 'Four fields used for bidirectional pagination.',
        fields: {
          first: { type: GraphQLInt },
          last: { type: GraphQLInt },
          after: { type: GraphQLString },
          before: { type: GraphQLString },
        },
      }),
    },
  },
});

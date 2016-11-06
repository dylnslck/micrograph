import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

export default new GraphQLList(new GraphQLObjectType({
  name: 'ErrorType',
  fields: {
    message: { type: new GraphQLNonNull(GraphQLString) },
    stack: { type: GraphQLString },
  },
}));

import { GraphQLString } from 'graphql';
import { connectionArgs, connectionFromArray } from 'graphql-relay';
import Schema, { hasMany, belongsTo } from 'cohere';
import { Blog, User } from './models';
import createConnectionType from './createConnectionType';

export default new Schema()
  .defineType('blog', {
    attributes: {
      title: GraphQLString,
      content: GraphQLString,
    },
    relationships: {
      author: belongsTo('user', 'blogs'),
    },
    model: Blog,
    inflection: 'blogs',
  })
  .defineType('user', {
    attributes: {
      name: GraphQLString,
      email: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {
        args: connectionArgs,
        output: createConnectionType,
        transform: connectionFromArray,
      }),
    },
    model: User,
    inflection: 'users',
  })
  .compile();

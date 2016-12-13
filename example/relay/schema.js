import { GraphQLString } from 'graphql';
import { connectionArgs, connectionFromArray } from 'graphql-relay';
import Schema, { hasMany, belongsTo } from 'cohere';
import createConnectionType from './createConnectionType';
import { Blog, User } from '../models';

export default new Schema()
  .defineType('blog', {
    attributes: {
      title: { type: GraphQLString },
      content: { type: GraphQLString },
    },
    relationships: {
      author: belongsTo('user', 'blogs'),
    },
    model: Blog,
    inflection: 'blogs',
  })
  .defineType('user', {
    attributes: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
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

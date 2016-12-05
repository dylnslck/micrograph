import { GraphQLString } from 'graphql';
import { Schema, hasMany, belongsTo } from '../../src';
import { Blog, User } from './models';

export default new Schema()
  .defineType(User, {
    attributes: {
      name: GraphQLString,
      email: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {
        args: {
          title: { type: GraphQLString },
        },
      }),
    },
  })
  .defineType(Blog, {
    attributes: {
      title: GraphQLString,
      content: GraphQLString,
    },
    relationships: {
      author: belongsTo('user', 'blogs'),
    },
  })
  .compile();

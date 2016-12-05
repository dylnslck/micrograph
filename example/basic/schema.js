import { GraphQLString } from 'graphql';
import { Blog, User } from './models';
import Schema, { hasMany, belongsTo } from '../../src/Schema';

export default new Schema()
  .defineType(Blog, {
    attributes: {
      title: GraphQLString,
      content: GraphQLString,
    },
    relationships: {
      author: belongsTo('user', 'blogs'),
    },
    meta: {
      inflection: 'blogs',
    },
  })
  .defineType(User, {
    attributes: {
      name: GraphQLString,
      email: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author'),
    },
    meta: {
      inflection: 'users',
    },
  })
  .compile();

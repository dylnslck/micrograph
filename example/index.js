import { GraphQLString } from 'graphql';
import redink, { model } from 'redink';
import Schema, { hasMany, belongsTo } from 'cohere';
import express from 'express';
import graphqlHTTP from 'express-graphql';

import { compile } from '../src';
import flattenConnection from './flattenConnection';
import flattenNode from './flattenNode';
import * as resolvers from './resolvers';

const schema = new Schema()
  .defineType('user', {
    attributes: {
      name: GraphQLString,
      email: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {
        resolve(user, args, ctx) {
          return ctx.model('user').findRelated(user.id, 'blogs').then(flattenConnection);
        },
      }),
    },
    meta: {
      inflection: 'users',
    },
  })
  .defineType('blog', {
    attributes: {
      title: GraphQLString,
      content: GraphQLString,
    },
    relationships: {
      author: belongsTo('user', 'blogs', {
        resolve(blog, args, ctx) {
          return ctx.model('blog').findRelated(blog.id, 'author').then(flattenNode);
        },
      }),
    },
    meta: {
      inflection: 'blogs',
    },
  })
  .compile();

const app = express();

redink().connect({
  schema,
  host: '107.170.131.151',
  verbose: true,
  db: 'test',
}).then(() => {
  console.log('Redink connected!'); // eslint-disable-line

  app.use('/graphql', graphqlHTTP({
    schema: compile(schema, resolvers),
    context: { model },
    graphiql: true,
  }));

  app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql!'); // eslint-disable-line
  });
});

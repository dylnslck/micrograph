import { GraphQLString } from 'graphql';
import redink, { model } from 'redink';
import schema, { hasMany, belongsTo } from 'redink-schema';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import compile from '../src';

const schemas = {
  user: schema('user', {
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
  }),

  blog: schema('blog', {
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
  }),
};

const app = express();

redink().connect({
  schemas,
  host: '107.170.131.151',
  verbose: true,
  db: 'test',
}).then(() => {
  console.log('Redink connected!'); // eslint-disable-line

  app.use('/graphql', graphqlHTTP({
    schema: compile(redink().instance().schemas),
    context: { model },
    graphiql: true,
  }));

  app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql!'); // eslint-disable-line
  });
});

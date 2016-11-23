import redink, { model } from 'redink';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { compile } from '../../src';
import queries from './queries';
import mutations from './mutations';
import middleware from './middleware';
import schema from './schema';

const app = express();

redink().connect({
  schema,
  host: '107.170.131.151',
  verbose: true,
  db: 'test',
}).then(() => {
  console.log('Redink connected!'); // eslint-disable-line
  const compiledSchema = compile({ schema, queries, mutations, middleware });

  app.use('/graphql', graphqlHTTP({
    schema: compiledSchema,
    context: { model },
    graphiql: true,
  }));

  app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql!'); // eslint-disable-line
  });
});

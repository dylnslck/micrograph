import Datastore from 'nedb';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import queries from './queries';
import mutations from './mutations';
import middleware from './middleware';
import schema from './schema';
import { compile } from '../../src';

const app = express();
const compiledSchema = compile({ schema, queries, mutations, middleware });

const db = {
  user: new Datastore({ filename: './data/users.db', autoload: true }),
  blog: new Datastore({ filename: './data/blogs.db', autoload: true }),
};

app.use('/graphql', graphqlHTTP({
  schema: compiledSchema,
  context: { db },
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql!'); // eslint-disable-line
});

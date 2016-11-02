# redink-graphql
⧟ GraphQL utilities for Redink

## Getting started
```
$ npm i -S redink-schema
$ npm i -S redink-graphql
$ npm i -S graphql
```

Creating a Redink GraphQL schema is essentially the same as creating a normal Redink schema; the
difference is that attributes are typed using GraphQL types.


```js
import schema, { hasMany, belongsTo } from 'redink-schema';
import { GraphQLString, GraphQLNonNull } from 'graphql';

export const user = schema('user', {
  attributes: {
    name: GraphQLString,
    email: new GraphQLNonNull(GraphQLString),
  },
  relationships: {
    blogs: hasMany('blog', 'author'),
  },
  meta: {
    description: 'A user is a person who can write blogs, among other things.',
  },
});

export const blog = schema('blog', {
  attributes: {
    title: GraphQLString,
  },
  relationships: {
    author: belongsTo('user', 'blogs'),
  },
  meta: {
    description: 'A blog is some online content, usually written by a user.',
  },
});
```

Then compile the schemas and plug them into your server (i.e. `express-graphql`). There is one
caveat: you need to pass in Redink's `model` method into `graphqlHTTP`'s `context` property.

```js
import redink, { model } from 'redink';
import compile from 'redink-graphql';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import * as schemas from './schemas';

const app = express();

redink()

  // connect to Redink using the defined schemas from above
  .connect({
    host: process.env.RETHINKDB_HOST,
    verbose: true,
    db: 'test',
    schemas,
  })

  // once connected, start the GraphQL server using the compiled schemas
  .then(() => {
    const graphQLSchema = compile(redink().instance().schemas);

    app.use('/graphql', graphqlHTTP({
      schema: graphQLSchema,
      context: { model },
      graphiql: true,
    }));

    app.listen(4000, () => {
      console.log('Running a GraphQL API server at localhost:4000/graphql');
    });
  });
```

The end.

## Todo
- [ ] Add ability to inject custom hooks into `resolve` methods

## License
[MIT](https://github.com/directlyio/redink-graphql/LICENSE)

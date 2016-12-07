# Wire everything together

Finally, we can compile everything into a `GraphQLSchema`.

```javascript
import { compile } from 'micrograph';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema.js';
import queries from './queries.js';
import mutations from './mutations.js';
import middleware from './middleware.js';

// pretend database service used in previous examples
import db from './db';

const compiledSchema = compile({ schema, queries, mutations, middleware });
const app = express();

app.use('/graphql', graphqlHTTP(request => ({
  schema: compiledSchema,
  context: { request, db },
  graphiql: true,
}));

app.listen(4000);
```

Then you can visit **http://localhost:4000/graphql** and view the generated schema.

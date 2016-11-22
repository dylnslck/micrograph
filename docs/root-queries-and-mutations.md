# Define some root queries and mutations

In order to define your root queries and mutations, you need to create a function that maps a type to a series of queries and mutations.

For example:

```js
// queries.js
import { GraphQLNonNull, GraphQLID } from 'graphql';

export default (type) => ({
  [`fetch${type.name}`]: {
    description: `Retrieves a single ${type.name}`,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    actions: {
      resolve: (args, ctx, next) => ctx.db(type.name)
        .fetch(args.id)
        .then(data => ctx.data = data)
        .then(next),
      finalize: (ctx) => ctx.data,
    },
  },
  [`find${type.name}`]: {
      isPlural: true,
      description: `Finds all ${type.name} types`,
      actions: {
        resolve: (args, ctx, next) => ctx.db(type.name)
          .find()
          .then(data => ctx.data = data)
          .then(next),
        finalize: (ctx) => ctx.data,
      },
    },
  },
});
```

The above example show how Micrograph reduces boilerplate. Every **type** defined in the original schema is mapped to the following queries: **fetchuser**,** findblog**,** fetchblog**, and** findblog**. Micrograph expects the function to return an object whose keys are the root query names and whose values are an object with optional **description**, **args**, and **isPlural** keys. The **isPlural** key is required if your query is expected to return multiple object types. More on that later. The fourth key **actions** has a required **resolve **key and optional **finalize** and **error** keys.

```js
// mutations.js
import { GraphQLInputObjectType, GraphQLID, GraphQLNonNull } from 'graphql';
let inputObjectCache = {};

const createInputObject = (type) => {
  if (inputObjectCache.hasOwnProperty(type.name)) return inputObjectCache[type.name];

  const inputObject = new GraphQLInputObjectType({
    name: type.name,
    fields: () => type.attributes.reduce((accumulator, { field, type }) => ({
      ...accumulator,
      [field]: { type },
    }), {}),
  });

  inputObjectCache[type.name] = inputObject;
  return inputObject;
};

export default (type) => ({
  [`create${type.name}`]: {
    description: `Creates a ${type.name}`,
    args: { input: { type: createInputObject(type) } },
    actions: {
      resolve: (args, ctx, next) => ctx.db(type.name),
        .create(args.input)
        .then(data => ctx.data = data),
        .then(next),
      finalize: (ctx) => ctx.data
    },
  },
  [`update${type.name}`]: {
    description: `Updates a ${type.name}`,
    args: {
      input: { type: createInputObject(type) },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve: (args, ctx, next) => ctx.db(type.name)
        .update(args.id, args.input)
        .then(data => ctx.data = data)
        .then(next),
      finalize: (ctx) => ctx.data,
    },
  },
});
```

The above example defines the **createuser**, **updateuser**, **createblog**, and **updateblog** root mutations. The **createInputObject **function in the example maps a type's attributes into a GraphQL input object type, which is passed into **args.input**. The **inputObjectCache** in the example is required so that multiple input object types of the same name are not created, otherwise GraphQL will throw an error.

The **queries.js** and **mutations.js** files are probably the most complex files in an entire Micrograph application, but they only need to be written once. Once written, they will likely never have to change, and your application can continue to grow simply by creating more types in **schema.js**.
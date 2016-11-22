# API
### `.createMiddleware()`
Instantiates middleware. A middleware hook is created with either the `before` or `after` method. The `before` hooks are fired **before** a query/mutation is resolved. The `after` hooks are fired **after** a query/mutation is resolved. Each middleware hook takes in a query/mutation pattern as the first argument and a callback as the second callback.

Valid patterns are `*` for all queries **and** mutations, `pattern*` for queries and mutations whose names start with "pattern", and `fullPattern` for a single query or mutation with the name "fullPattern".

The middleware callback receives three arguments: `args`, `ctx`, and `next`.

1. `args` is a cloned, mutable object passed into either the query or mutation from the client
2. `ctx` is a cloned, mutable object that is defined by the server
3. `next` is a function that is used to propagate to the next middleware hook (or resolve hook if it happens to be located in front of the resolve function)

A common practice is to mutate `args` along the middleware chain with input information (i.e. overwriting `args.input.password` with a hashed string). `ctx` is typically mutated with information pertaining to the state of the request.

Example middleware chain for the `createUser` mutation:

![Typical flow](../assets/chain.svg)

```javascript
// middleware.js
import { createMiddleware } from 'micrograph';

const middleware = createMiddleware();

// fires before all queries and mutations
middleware.before((args, ctx, next) => {...});

// same as above
middleware.before('*', (args, ctx, next) => {...});

// fires before any query or mutation that starts with "create"
middleware.before('create*', (args, ctx, next) => {...});

// fires before the "createUser" mutation
middleware.before('createUser', (args, ctx, next) => {...});

// fires after the "createUser" mutation
middleware.after('createUser', (args, ctx, next) => {...});

// fires after any query or mutation that starts with "create"
middleware.after('create*', (args, ctx, next) => {...});

// fires after all queries and mutations are done resolving
middleware.after((args, ctx, next) => {...});

// same as above
middleware.after('*', (args, ctx, next) => {...});

export default middleware;
```

## Propagation
Middleware propagation happens by calling `next` or by returning a `Promise`. If, at any point, you throw an error or return a rejected `Promise`, the chain breaks and all subsequent middleware hooks (including the resolve hook) are skipped. The error is forwarded to the query/mutation error handler.

### Don't call `next` inside a Promise
In order to avoid unpredictable behavior, avoid calling `next` inside a Promise. Before writing a middleware function, decide whether using `next` or using a `Promise` makes more sense.

```javascript
middleware.before('createUser', (args, ctx, next) => {
  return somePromise.then(() => {
    doSomething();
    next(); // BAD! don't need to call this
  }).then(() => {
    doSomething(); // this may or may not get called
  });
});
```

If you decide to use a `Promise`, return a rejected `Promise` if you need to break the middleware chain:

```javascript
middleware.before('createUser', (args, ctx, next) => {
  return somePromise.then(() => {
    doSomething();
    return Promise.reject(new Error('Oh no!'));
  }).then(() => {
    // this and any subsequent middleware hooks
    // will not be called (including the resolve hook)
  });
});
```

### Don't catch rejected promises
Micrograph automatically handles `Promise` rejections and forwards the error to the query/mutation error handler.

```javascript
middleware.before('createUser', (args, ctx, next) => {
  return somePromise.then(() => {
    doSomething();
    return Promise.reject(new Error('Oh no!'));
  }).then(() => {
    // this and any subsequent middleware hooks
    // will not be called (including the resolve hook)
  })

  // BAD! don't catch!
  .catch(err => {
    // if you catch, middleware will propagate normally
    // and the error handler will not fire
  });
});
```

### Using the error handler
Query and mutation error handlers are defined next to the `resolve` and `finalize` hooks:

```javascript
// mutations.js
[`create${type.name}`]: {
  resolve: ...,
  finalize: ...,

  error(err) {
    // do something with the error
    return err;
  },
},
```

Make sure to return `err` (or a transformed one). The returned `err` is sent to the client. This is a good place to log or transform errors.

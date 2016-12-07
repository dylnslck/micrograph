# Middleware

Every query and mutation specified in `queries.js` and `mutations.js` can have optional middleware.

### Chain

![](../assets/chain.svg)

Middleware supports `before` and `after` hooks. The `before` hooks fire before the root query/mutation resolve method is called, and `after` hooks fire afterwards

```javascript
// middleware.js
import { createMiddleware } from 'micrograph';
import bcrypt from 'bcrypt';

const middleware = createMiddleware();

// fires before all queries and mutations
middleware.before('*', (args, ctx, next) => {
  ctx.startTime = Date.now();
  next();
});

// fires after all queries and mutations
middleware.after('*', (args, ctx, next) => {
  ctx.duration = Date.now() - ctx.startTime;
  next();
});

// fires before the createBlog and createUser mutations
middleware.before('create*', (args, ctx, next) => {
  if (!ctx.request.headers.authorization) {
    throw new Error('Unauthorized');
  }

  next();
});

// only fires before the createuUer mutation
middleware.before('createUser', (args, ctx, next) => {
  bcrypt.hash(args.input.password, 10, (err, hash) => {
    if (err) throw err;

    // override password with hash
    args.input.password = hash;
    next();
  });
});

export default middleware;
```

### Middleware propagation

Middleware propagates by invoking `next` \(the third argument\) or by returning a Promise:

```javascript
middleware.before('*', (args, ctx, next) => {
  // do something
  next();
});
```

or

```javascript
middleware.before('*', (args, ctx) => {
  return somePromise.then(someOtherPromise);
});
```

There are a few gotcha, such as avoiding `next` inside a Promise. Refer to the [create middleware docs](../api/create-middleware).

### Error handling

You can break out of a middleware chain (including inside of a resolve method) by either throwing an error or returning a rejected promise.

```javascript
middleware.before('createUser', (args, ctx, next) => {
  // throwing an error will break out of the middleware chain
  throw new Error('Oh no!');
});
```

or

```javascript
middleware.before('createUser', (args, ctx) => {
  return new Promise((resolve, reject) => {
    reject(new Error('Oh no!'));
  });
});
```

Refer to the [api reference](../api/create-middleware.md) for more information on chaining middleware and handling errors.

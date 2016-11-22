# Middleware

Every query and mutation specified in **queries.js** and **mutations.js **can have optional middleware.

### Chain

![](/assets/chain.svg)

Middleware supports **before **and **after **hooks. The **before** hooks fire before the root query/mutation resolve method is called, and **after** hooks fire afterwards

```
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

// fires before the createblog and createuser mutations
middleware.before('create*', (args, ctx, next) => {
  if (!ctx.request.headers.authorization) {
    throw new Error('Unauthorized');
  }

  next();
});

// only fires before the createuser mutation
middleware.before('createuser', (args, ctx, next) => {
  bcrypt.hash(args.input.password, 10, (err, hash) => {
    if (err) throw err;

    // Override password with hash
    args.input.password = hash;
    next();
  });
});

export default middleware;
```

### Middleware propagation

Middleware propagates by invoking **next **\(the third argument\) or by returning a Promise:

```
middleware.before('*', (args, ctx, next) => {
  // Do something
  next();
});
```

or

```
middleware.before('*', (args, ctx) => {
  return somePromise.then(someOtherPromise);
});
```

In order to avoid unpredictable behavior, avoid invoking **next **inside a Promise.

### Error handling

You can break out of a middleware chain (including inside of a resolve method) by either throwing an error or returning a rejected promise. The final error can be caught using the error action method:

```
middleware.before('createuser', (args, ctx, next) => {
  // Throwing an error will break out of the middleware chain
  throw new Error('Oh no!');
});
```

or

```
middleware.before('createuser', (args, ctx) => {
  return new Promise((resolve, reject) => {
    reject(new Error('Oh no!'));
  });
});
```

You then have an opportunity to catch any errors in mutations.js:

```
// The following code is taken from mutations.js
[`create${type.name}`]: {
  description: ...,
  args: ...,
  actions: {
    resolve: ...,
    finalize: ...,

    // Add an optional error key to catch errors before
    // its sent to the client
    error(err) {
      console.log(err.message); // Oh no!
      return err;
    },
  },
},
```

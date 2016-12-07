# Define your business logic layer

Micrograph is relatively un-opinionated in regards to your business logic layer. In most cases, Micrograph can simply hook into your existing logic without excessive coupling.

For this tutorial, we're going to create two classes: `User` and `Blog` classes.

## `User`
Create a folder called `models`. Then, create a `User.js` and `Blog.js` file inside the models folder.

```js
// User.js
import Blog from './Blog';

// pretend database service
import db from '../db';

// pretend auth function
function checkCanSee(args, ctx) {
  return true;
}

export default class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
  }

  // factory function that performs basic auth (visibility)
  static gen(args, ctx, data) {
    return checkCanSee(args, ctx) ? new User(data) : null;
  }

  // fetches a single user in the db
  static async findOne(args, ctx) {
    const data = await db.user.findOne(args.id);

    if (!data) return null;
    return User.gen(args, ctx, data);
  }

  // fetches all users from the db
  static async findAll(args, ctx) {
    const data = await db.user.findAll();

    if (!data) return [];
    return data.map(d => User.gen(args, ctx, d));
  }

  // creates a user in the db
  static async create(args, ctx) {
    const data = await db.user.create(args.input);

    if (!data) return [];
    return User.gen(args, ctx, data);
  }

  // updates a user in the db
  static async update(args, ctx) {
    const data = await db.user.update(args.id, args.input);

    if (!data) return [];
    return User.gen(args, ctx, data);
  }

  // fetches the blogs that belong to a user instance
  blogs(args, ctx) {
    const data = await db.blog.findAll({ author: this.id });

    if (!data) return [];
    return data.map(d => Blog.gen(args, ctx, d));
  }
}
```

The above class is a unit of business-logic. The class structure is borrowed from Dan Schafer's talk regarding GraphQL at Facebook. Sashko Stubailo from the Apollo core team wrote [an excellent overview](https://dev-blog.apollodata.com/graphql-at-facebook-by-dan-schafer-38d65ef075af#.g59jmj7mk).

The basic idea is that your models should be responsible for their own visibility and CRUD operations. You'll notice that the above class has virtually no coupling with Micrograph. The only caveat is that Micrograph expects your classes to have instance methods for resolving relationships, and it expects those methods to take in an `args` object as the first argument and a `ctx` object as the second argument. Facebook uses a `viewer` object in place of `ctx`, but the concept is the same. In your Micrograph application, you can create a universal `ctx` object that is passed around your business-logic layer. This object can include useful things, like a JWT token that your models can use to determine visibility.

The static methods aren't required, but are certainly good practice because they ensure that any user instance that exists in your application has been properly authenticated. The number and structure of the static methods are left to the developer. As you'll see in a little, we'll use these static methods when defining Micrograph's root queries and mutations.

## `Blog`
The `Blog` class has the same structure.

```js
// Blog.js
import User from './User';

// pretend database service
import db from '../db';

// pretend auth function
function checkCanSee(args, ctx) {
  return true;
}

export default class Blog {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.authorId = data.authorId;
  }

  // factory function that performs basic auth (visibility)
  static gen(args, ctx, data) {
    return checkCanSee(args, ctx) ? new Blog(data) : null;
  }

  // fetches a single user in the db
  static async findOne(args, ctx) {
    const data = await db.blog.findOne(args.id);

    if (!data) return null;
    return User.gen(args, ctx, data);
  }

  // fetches all blogs from the db
  static async findAll(args, ctx) {
    const data = await db.blog.findAll();

    if (!data) return [];
    return data.map(d => User.gen(args, ctx, d));
  }

  // creates a blog in the db
  static async create(args, ctx) {
    const data = await db.blog.create(args.input);

    if (!data) return [];
    return User.gen(args, ctx, data);
  }

  // updates a blog in the db
  static async update(args, ctx) {
    const data = await db.blog.update(args.id, args.input);

    if (!data) return [];
    return User.gen(args, ctx, data);
  }

  // fetches the blog's author
  author(args, ctx) {
    const data = await db.blog.findOne(this.authorId);

    if (!data) return [];
    return User.gen(args, ctx, data);
  }
}
```

The above classes make up the entirety of our example app's business-logic layer. There is a decent amount of boilerplate among these two classes, but that's outside the scope of Micrograph. Remember, Micrograph only cares that your classes have instance methods that resolve relationships. The developer could very well create a mixin or base class that implements the static methods from the classes above, as they're nearly identical. But, Micrograph aims to stay as far away from your business-logic layer as possible.

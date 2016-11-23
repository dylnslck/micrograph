import test from 'ava';
import { graphql } from 'graphql';
import errorLogger from './helpers/errorLogger';
import database from './helpers/database';
import mutations from './helpers/mutations';
import queries from './helpers/queries';
import schema from './helpers/schema';
import { compile, createMiddleware } from '../src';

let middlewareCount = 0;
const middleware = createMiddleware();

const incrementCount = (args, ctx, next) => {
  middlewareCount++;
  next();
};

middleware.before(incrementCount);
middleware.before('*', incrementCount);
middleware.before('create*', incrementCount);
middleware.before('createuser', incrementCount);
middleware.before('invalid', incrementCount);
middleware.after('*', incrementCount);
middleware.after('create*', incrementCount);
middleware.after('createuser', incrementCount);
middleware.after(incrementCount);

const compiled = compile({ schema, queries, mutations, middleware });

test.before(() => {
  errorLogger().init();
  database().init();
});

test('should fail to compile with invalid args', t => {
  try {
    compile();
  } catch (err) {
    t.is(err.message, 'Option "schema" must be an object');
  }

  try {
    compile({ schema: {} });
  } catch (err) {
    t.is(err.message, 'Option "queries" must be a function');
  }
});

test('should throw an error because input.blogs is required', async t => {
  try {
    // middlewareCount += 0
    const results = await graphql(compiled, `
      mutation {
        createuser(input: {
          name: "Dylan"
        }) {
          id
          name
        }
      }
    `);

    t.is(results.errors.length, 1);
  } catch (err) {
    t.pass();
  }
});

test('should successfully call a mutation and some queries', async t => {
  try {
    let results;

    // middlewareCount += 8
    results = await graphql(compiled, `
      mutation {
        createuser(input: {
          name: "Bob"
          blogs: [],
        }) {
          id
          name
          blogs {
            title
          }
        }
      }
    `);

    t.is(results.data.createuser.name, 'Bob');
    t.truthy(typeof results.errors === 'undefined');

    // middlewareCount += 4
    results = await graphql(compiled, `
      {
        allusers {
          name
        }
      }
    `);

    t.is(results.data.allusers.length, 2);
    t.truthy(typeof results.errors === 'undefined');

    // middlewareCount += 4
    results = await graphql(compiled, `
      {
        fetchuser(id: "1") {
          name
        }
      }
    `);


    t.is(results.data.fetchuser.name, 'Dylan');
    t.truthy(typeof results.errors === 'undefined');
  } catch (err) {
    t.fail(err.message);
  }
});

test.after('middleware count should have be equal to num times trigger', t => {
  t.is(middlewareCount, 16);
});

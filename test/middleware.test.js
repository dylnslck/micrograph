import test from 'ava';
import { createMiddleware } from '../src';

const middleware = createMiddleware();

test('should throw an error with invalid pattern', t => {
  try {
    middleware.before();
  } catch (err) {
    t.is(err.message, 'Resolver middleware must be called with a function.');
  }

  try {
    middleware.before('pattern', 'not a function');
  } catch (err) {
    t.is(err.message, 'Resolver middleware must be called with a function.');
  }

  try {
    middleware.after('pattern', 'not a function');
  } catch (err) {
    t.is(err.message, 'Resolver middleware must be called with a function.');
  }

  try {
    middleware.after();
  } catch (err) {
    t.is(err.message, 'Resolver middleware must be called with a function.');
  }
});

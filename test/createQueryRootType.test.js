import test from 'ava';
import createQueryRootType from '../src/createQueryRootType';

test('should fail to create a query root type with invalid args', t => {
  try {
    createQueryRootType({}, 'invalid');
  } catch (err) {
    t.is(
      err.message,
      'Argument "queries" must either be an object or a function that takes a type as its ' +
      'first and only argument.'
    );
  }
});

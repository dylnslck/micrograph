import test from 'ava';
import createMutationRootType from '../src/createMutationRootType';

test('should fail to create a mutation root type with invalid args', t => {
  try {
    createMutationRootType({}, 'invalid');
  } catch (err) {
    t.is(
      err.message,
      'Argument "mutations" must either be an object or a function that takes a type as its ' +
      'first and only argument.'
    );
  }
});

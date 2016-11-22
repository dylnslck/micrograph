import test from 'ava';
import decorateWithResolvers from '../src/decorateWithResolvers';

test('should fail to instantiate a resolver when no actions are present', t => {
  try {
    const queriesOrMutations = {
      createUser: {},
    };

    decorateWithResolvers(queriesOrMutations);
  } catch (err) {
    t.is(err.message, 'You must supply an actions object with each root query and root mutation.');
  }
});

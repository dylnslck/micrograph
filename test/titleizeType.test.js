import test from 'ava';
import titleizeType from '../src/titleizeType';

test('should properly titleizeType some types', t => {
  t.is(titleizeType('user'), 'User');
  t.is(titleizeType('User'), 'User');
});

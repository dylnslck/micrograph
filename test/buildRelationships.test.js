import test from 'ava';
import Schema, { hasMany, belongsTo } from 'cohere';
import buildRelationships from '../src/buildRelationships';

const schema = new Schema()
  .defineType('user', {
    relationships: {
      blogs: hasMany('blog', 'author'),
    },
  })
  .defineType('blog', {
    relationships: {
      author: belongsTo('user', 'blogs'),
    },
  })
  .compile();

test('should fail to compile without field resolvers', t => {
  try {
    const user = schema.types.user;
    buildRelationships(user);
  } catch (err) {
    t.is(
      err.message,
      'Micrograph requires Cohere types to include a resolve method for relationships. There ' +
      'was no resolve method found for the blogs relationship on the user type.',
    );
  }
});

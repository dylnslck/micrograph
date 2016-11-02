import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from 'graphql';

import ensureContextHasModel from './ensureContextHasModel';
import flattenAttributes from './flattenAttributes';

export default (schemas, types) => new GraphQLObjectType({
  name: 'Query',
  fields: () => Object.keys(schemas).reduce((prev, curr) => {
    const { meta } = schemas[curr];

    if (!meta) {
      throw new Error(
        'When using \'redink-graphql\', every schema must have a valid \'meta\' key. The ' +
        `${curr} schema did not have a 'meta' key.`
      );
    }

    if (!meta.inflection) {
      throw new Error(
        'When using \'redink-graphql\', every schema must have a \'meta.inflection\' key. ' +
        'Inflection keys are required to properly build GraphQL queries. Please add a ' +
        `'meta.inflection' key to the '${curr}' schema.`
      );
    }

    const { inflection } = meta;

    return {
      ...prev,

      // retrieve a single record
      [curr]: {
        type: types[curr],
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(root, args, ctx) {
          ensureContextHasModel(ctx);
          return ctx.model(curr).fetchResource(args.id).then(flattenAttributes);
        },
      },

      // retrieve many records
      [inflection]: {
        type: new GraphQLList(types[curr]),
        resolve(root, args, ctx) {
          ensureContextHasModel(ctx);
          return ctx.model(curr).find().then(resources => resources.map(flattenAttributes));
        },
      },
    };
  }, {}),
});

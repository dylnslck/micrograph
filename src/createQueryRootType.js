import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

import buildConnectionType from './buildConnectionType';
import ensureContextHasModel from './ensureContextHasModel';
import flattenAttributes from './flattenAttributes';
import flattenConnection from './flattenConnection';
import titleizeType from './titleizeType';

const OptionsInputType = new GraphQLInputObjectType({
  name: 'OptionsInput',
  fields: {
    page: {
      type: new GraphQLInputObjectType({
        name: 'PaginationInput',
        description: 'Four fields used for bidirectional pagination.',
        fields: {
          first: { type: GraphQLInt },
          last: { type: GraphQLInt },
          after: { type: GraphQLString },
          before: { type: GraphQLString },
        },
      }),
    },
  },
});

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
    const ConnectionType = buildConnectionType(curr, types[curr]);

    return {
      ...prev,

      // retrieve a single record
      [`fetch${titleizeType(curr)}`]: {
        type: types[curr],
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(root, args, ctx) {
          ensureContextHasModel(ctx);
          return ctx.model(curr).fetch(args.id).then(flattenAttributes);
        },
      },

      // retrieve many records
      [`find${titleizeType(inflection)}`]: {
        type: ConnectionType,
        args: {
          options: { type: OptionsInputType },
        },
        resolve(root, args, ctx) {
          ensureContextHasModel(ctx);
          return ctx.model(curr).find(args.options).then(flattenConnection);
        },
      },
    };
  }, {}),
});

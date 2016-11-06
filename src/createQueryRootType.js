import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import buildConnectionType from './buildConnectionType';
import handleResolver from './handleResolver';
import optionsInputType from './optionsInputType';
import titleizeType from './titleizeType';

export default (schemas, resolvers, types) => new GraphQLObjectType({
  name: 'Query',
  fields: () => Object.keys(schemas).reduce((prev, curr) => {
    const { meta } = schemas[curr];

    if (!meta) {
      throw new Error(
        'Every schema must have a valid "meta" key. The ' +
        `"${curr}" schema did not have a "meta" key.`
      );
    }

    if (!meta.inflection) {
      throw new Error(
        'Every schema must have a "meta.inflection" key. ' +
        'Inflection keys are required to properly build GraphQL queries. Please add a ' +
        `"meta.inflection" key to the "${curr}" schema.`
      );
    }

    const { inflection } = meta;
    const connectionType = buildConnectionType(curr, types[curr]);
    const fetchQueryName = `fetch${titleizeType(curr)}`;
    const findQueryName = `find${titleizeType(inflection)}`;

    if (!resolvers.hasOwnProperty(fetchQueryName)) {
      throw new Error(
        `Tried to build the "${fetchQueryName}" root query, but the "${fetchQueryName}" resolver ` +
        'was not found.'
      );
    }

    if (!resolvers.hasOwnProperty(findQueryName)) {
      throw new Error(
        `Tried to build the "${findQueryName}" root query, but the "${findQueryName}" resolver ` +
        'was not found.'
      );
    }

    return {
      ...prev,

      // retrieve a single node
      [fetchQueryName]: {
        type: types[curr],
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(root, args, ctx) {
          return handleResolver(args, ctx, resolvers[fetchQueryName]);
        },
      },

      // create a connection
      [findQueryName]: {
        type: connectionType,
        args: {
          options: { type: optionsInputType },
        },
        resolve(root, args, ctx) {
          return handleResolver(args, ctx, resolvers[findQueryName]);
        },
      },
    };
  }, {}),
});

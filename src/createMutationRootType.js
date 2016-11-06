import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import buildInputType from './buildInputType';
import handleResolver from './handleResolver';
import titleizeType from './titleizeType';

export default (schemas, resolvers, types) => new GraphQLObjectType({
  name: 'Mutation',
  fields: () => Object.keys(schemas).reduce((prev, curr) => {
    const inputType = buildInputType(curr, schemas[curr]);
    const createMutationName = `create${titleizeType(curr)}`;
    const updateMutationName = `update${titleizeType(curr)}`;
    const archiveMutationName = `archive${titleizeType(curr)}`;

    if (!resolvers.hasOwnProperty(createMutationName)) {
      throw new Error(
        `Tried to build the "${createMutationName}" root mutation, but the ` +
        `"${createMutationName}" resolver was not found.`
      );
    }

    if (!resolvers.hasOwnProperty(updateMutationName)) {
      throw new Error(
        `Tried to build the "${updateMutationName}" root mutation, but the ` +
        `"${updateMutationName}" resolver was not found.`
      );
    }

    if (!resolvers.hasOwnProperty(archiveMutationName)) {
      throw new Error(
        `Tried to build the "${archiveMutationName}" root mutation, but the ` +
        `"${archiveMutationName}" resolver was not found.`
      );
    }

    return {
      ...prev,

      // create a new node
      [createMutationName]: {
        type: types[curr],
        args: {
          input: { type: new GraphQLNonNull(inputType) },
        },
        resolve(root, args, ctx) {
          return handleResolver(args, ctx, resolvers[createMutationName]);
        },
      },

      // update an existing node
      [updateMutationName]: {
        type: types[curr],
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          input: { type: new GraphQLNonNull(inputType) },
        },
        resolve(root, args, ctx) {
          return handleResolver(args, ctx, resolvers[updateMutationName]);
        },
      },

      // archive an existing node
      [archiveMutationName]: {
        type: types[curr],
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(root, args, ctx) {
          return handleResolver(args, ctx, resolvers[archiveMutationName]);
        },
      },
    };
  }, {}),
});

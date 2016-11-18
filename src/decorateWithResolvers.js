import buildConnectionType from './buildConnectionType';
import handleResolver from './handleResolver';

export default (queriesOrMutations, resolvers, middleware, types, name) =>
  Object.keys(queriesOrMutations).reduce((accumulator, key) => {
    const { description, args, isPlural } = queriesOrMutations[key];

    const type = isPlural
      ? buildConnectionType(name, types[name])
      : types[name];

    return {
      ...accumulator,
      [key]: {
        description,
        args,
        type,
        resolve(root, mutableArgs, mutableCtx) {
          if (!resolvers.hasOwnProperty(key)) {
            throw new Error(
              `The ${key} resolver was never registered.`
            );
          }

          return handleResolver(mutableArgs, mutableCtx, resolvers[key], middleware);
        },
      },
    };
  }, {});

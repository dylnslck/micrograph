import buildConnectionType from './buildConnectionType';
import handleResolver from './handleResolver';
import createResolver from './resolver';

export default (queriesOrMutations, middleware, types, name) =>
  Object.keys(queriesOrMutations).reduce((accumulator, key) => {
    const { description, args, actions, isPlural } = queriesOrMutations[key];

    if (typeof actions !== 'object') {
      throw new TypeError(
        'You must supply an actions object with each root query and root mutation.'
      );
    }

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
          const { resolve, finalize, error } = actions;

          if (resolve && typeof resolve !== 'function') {
            throw new Error(
              `The ${key} resolve method must be a function.`
            );
          }

          const resolver = createResolver(key, { resolve, finalize, error });
          return handleResolver(mutableArgs, mutableCtx, resolver, middleware);
        },
      },
    };
  }, {});

import { isOutputType } from 'graphql';
import handleResolver from './handleResolver';
import createResolver from './resolver';

export default (queriesOrMutations, middleware, types, name) =>
  Object.keys(queriesOrMutations).reduce((accumulator, key) => {
    const { description, args, actions, output: OutputType } = queriesOrMutations[key];

    if (typeof actions !== 'object') {
      throw new TypeError(
        'You must supply an actions object with each root query and root mutation.'
      );
    }

    let outputType;

    if (isOutputType(OutputType)) {
      outputType = OutputType;
    } else {
      outputType = OutputType
        ? new OutputType(types[name])
        : types[name];
    }

    return {
      ...accumulator,
      [key]: {
        description,
        args,
        type: outputType,
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

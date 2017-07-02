import { GraphQLList, isOutputType } from 'graphql';

export default (type, objectTypes) => {
  const { relationships } = type;

  return relationships.reduce((prev, relationship) => {
    const {
      field,
      relation,
      name,
      transform,
      args = {},
      output: OutputType,
    } = relationship;

    let outputType;

    // TODO: minimize cyclomatic complexity
    if (isOutputType(OutputType)) {
      outputType = OutputType;
    } else {
      if (relation === 'hasMany') {
        outputType = (
          OutputType &&
          new OutputType(objectTypes[name]) ||
          new GraphQLList(objectTypes[name])
        );
      } else {
        outputType = (
          OutputType &&
          new OutputType(objectTypes[name]) ||
          objectTypes[name]
        );
      }
    }

    return {
      ...prev,
      [field]: {
        args,
        type: outputType,
        resolve(parent, fieldArgs, ctx, ast) {
          if (!parent) return null;
          const fieldResolver = parent[field];

          if (typeof fieldResolver !== 'function') return fieldResolver;

          const results = parent[field](fieldArgs, ctx, ast);

          if (results && typeof results.then === 'function') {
            return results.then(data => (
              transform && typeof transform === 'function'
                ? transform(data, fieldArgs, ctx, ast)
                : results
            ));
          }

          return transform && typeof transform === 'function'
            ? transform(results, fieldArgs, ctx, ast)
            : results;
        },
      },
    };
  }, {});
};

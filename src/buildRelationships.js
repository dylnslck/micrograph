import { GraphQLList, isOutputType } from 'graphql';

export default (type, graphQLObjectTypes) => {
  const { relationships } = type;

  return relationships.reduce((prev, relationship) => {
    const {
      field,
      relation,
      name,
      resolve,
      args = {},
      output: OutputType,
    } = relationship;

    if (!resolve) {
      throw new TypeError(
        'Micrograph requires Cohere types to include a resolve method for relationships. There ' +
        `was no resolve method found for the ${field} relationship on the ${type.name} type.`
      );
    }

    let outputType;

    // TODO: minimize cyclomatic complexity
    if (isOutputType(OutputType)) {
      outputType = OutputType;
    } else {
      if (relation === 'hasMany') {
        outputType = (
          OutputType &&
          new OutputType(graphQLObjectTypes[name]) ||
          new GraphQLList(graphQLObjectTypes[name])
        );
      } else {
        outputType = (
          OutputType &&
          new OutputType(graphQLObjectTypes[name]) ||
          graphQLObjectTypes[name]
        );
      }
    }

    return {
      ...prev,
      [field]: {
        type: outputType,
        args,
        resolve,
      },
    };
  }, {});
};

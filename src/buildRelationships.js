import { GraphQLList } from 'graphql';

export default (type, graphQLObjectTypes) => {
  const { relationships } = type;

  return relationships.reduce((prev, relationship) => {
    const { field, relation, name, resolve, output: OutputType, args = {} } = relationship;

    if (!resolve) {
      throw new TypeError(
        'Micrograph requires Cohere types to include a resolve method for relationships. There ' +
        `was no resolve method found for the ${field} relationship on the ${type.name} type.`
      );
    }

    if (relation === 'hasMany') {
      const outputType = (
        OutputType &&
        new OutputType(graphQLObjectTypes[name]) ||
        new GraphQLList(graphQLObjectTypes[name])
      );

      return {
        ...prev,
        [field]: {
          type: outputType,
          args,
          resolve,
        },
      };
    }

    const outputType = (
      OutputType &&
      new OutputType(graphQLObjectTypes[name]) ||
      graphQLObjectTypes[name]
    );

    return {
      ...prev,
      [field]: {
        type: outputType,
        resolve,
      },
    };
  }, {});
};

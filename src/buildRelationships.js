import buildConnectionType from './buildConnectionType';

const cache = {};

export default (type, graphQLObjectTypes) => {
  const { relationships } = type;

  return relationships.reduce((prev, relationship) => {
    const { field, relation, name, resolve, args = {} } = relationship;

    if (!resolve) {
      throw new TypeError(
        'Micrograph requires Cohere types to include a resolve method for relationships. There ' +
        `was no resolve method found for the ${field} relationship on the ${type.name} type.`
      );
    }

    if (relation === 'hasMany') {
      let connectionType;

      if (cache.hasOwnProperty(field)) {
        connectionType = cache[field];
      } else {
        connectionType = buildConnectionType(field, graphQLObjectTypes[name]);
        cache[field] = connectionType;
      }

      return {
        ...prev,
        [field]: {
          type: connectionType,
          args,
          resolve,
        },
      };
    }

    return {
      ...prev,
      [field]: {
        type: graphQLObjectTypes[name],
        resolve,
      },
    };
  }, {});
};

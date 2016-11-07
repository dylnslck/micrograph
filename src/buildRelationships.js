import buildConnectionType from './buildConnectionType';
import optionsInputType from './optionsInputType';

const connectionTypes = {};

export default (type, types) => {
  const { relationships } = type;

  return relationships.reduce((prev, relationship) => {
    const { field, relation, name, resolve } = relationship;

    if (!resolve) {
      throw new TypeError(
        'Micrograph requires Cohere types to include a resolve method for relationships. There ' +
        `was no resolve method found for the ${field} relationship on the ${type.name} type.`
      );
    }

    if (relation === 'hasMany') {
      let connectionType;

      if (connectionTypes.hasOwnProperty(field)) {
        connectionType = connectionTypes[field];
      } else {
        connectionType = buildConnectionType(field, types[name]);
        connectionTypes[field] = connectionType;
      }

      return {
        ...prev,
        [field]: {
          type: connectionType,
          args: {
            options: { type: optionsInputType },
          },
          resolve,
        },
      };
    }

    return {
      ...prev,
      [field]: {
        type: types[name],
        resolve,
      },
    };
  }, {});
};

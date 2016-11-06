import buildConnectionType from './buildConnectionType';
import optionsInputType from './optionsInputType';

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
      return {
        ...prev,
        [field]: {
          type: buildConnectionType(field, types[name]),
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

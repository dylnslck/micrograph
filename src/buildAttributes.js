import { isLeafType } from 'graphql';

export default (type) => {
  const { name, attributes } = type;

  return attributes.reduce((prev, { field, type: attrType }) => {
    if (!isLeafType(attrType)) {
      throw new TypeError(
        `The ${field} attribute of the ${name} type is not a valid GraphQL leaf type. All ` +
        'attributes must be a valid leaf type'
      );
    }

    return {
      ...prev,
      [field]: {
        type: attrType,
      },
    };
  }, {});
};

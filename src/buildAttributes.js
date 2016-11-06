export default (type) => {
  const { attributes } = type;

  return attributes.reduce((prev, { field, type: attrType }) => ({
    ...prev,
    [field]: {
      type: attrType,
    },
  }), {});
};

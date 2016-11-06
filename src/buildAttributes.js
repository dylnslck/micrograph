export default (schemas, name) => {
  if (!schemas[name]) {
    throw new Error(
      `Tried to build the attributes for the '${name}' schema, but the '${name}' schema was not ` +
      'found.'
    );
  }

  const { attributes } = schemas[name];

  return Object.keys(attributes).reduce((prev, curr) => ({
    ...prev,
    [curr]: {
      type: attributes[curr],
    },
  }), {});
};

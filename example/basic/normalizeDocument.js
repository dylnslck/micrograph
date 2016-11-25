export default (doc) => {
  if (!doc) return null;

  return {
    ...doc,

    // eslint-disable-next-line
    id: doc._id,
  };
};

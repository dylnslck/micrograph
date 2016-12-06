import { connectionDefinitions } from 'graphql-relay';

const cache = {};

export default (objectType) => {
  const { name } = objectType;

  if (cache.hasOwnProperty(name)) {
    return cache[name];
  }

  const connectionType = connectionDefinitions({ nodeType: objectType }).connectionType;
  cache[name] = connectionType;

  return connectionType;
};

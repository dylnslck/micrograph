export default (resource) => ({
  ...resource.attributes,
  id: resource.id,
});

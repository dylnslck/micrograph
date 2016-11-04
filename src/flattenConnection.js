import flattenAttributes from './flattenAttributes';

export default (connection) => ({
  totalCount: connection.totalCount,
  pageInfo: connection.pageInfo,
  edges: connection.edges.map(({ node, cursor }) => ({
    node: flattenAttributes(node),
    cursor,
  })),
});

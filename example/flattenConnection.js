import flattenNode from './flattenNode';

export default (connection) => ({
  totalCount: connection.totalCount,
  pageInfo: connection.pageInfo,
  edges: connection.edges.map(({ node, cursor }) => ({
    node: flattenNode(node),
    cursor,
  })),
});

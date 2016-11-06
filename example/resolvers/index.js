import {
  findBlogsResolver,
  fetchBlogResolver,
  createBlogResolver,
  updateBlogResolver,
  archiveBlogResolver,
} from './blog';

import {
  findUsersResolver,
  fetchUserResolver,
  createUserResolver,
  updateUserResolver,
  archiveUserResolver,
} from './user';

export {
  findBlogsResolver as findBlogs,
  fetchBlogResolver as fetchBlog,
  createBlogResolver as createBlog,
  updateBlogResolver as updateBlog,
  archiveBlogResolver as archiveBlog,
  findUsersResolver as findUsers,
  fetchUserResolver as fetchUser,
  createUserResolver as createUser,
  updateUserResolver as updateUser,
  archiveUserResolver as archiveUser,
};

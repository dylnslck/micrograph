class Database {
  data = {
    user: {
      1: {
        name: 'Dylan',
        blogs: ['1'],
      },
    },
    blog: {
      1: {
        title: 'How to Blog',
        author: '1',
      },
    },
  }

  set(type, k, v) {
    if (!this.data[type]) this.data[type] = {};
    this.data[type][k] = v;

    return Promise.resolve({
      data: this.data[type][k],
    });
  }

  getAll(type) {
    return Promise.resolve({
      data: Object.keys(this.data[type]).map(id => ({
        ...this.data[type][id],
        id,
      })),
    });
  }

  get(type, k) {
    return Promise.resolve({
      data: this.data[type][k],
    });
  }
}

export default function database() {
  if (database.db) return database.db;

  return {
    init() {
      database.db = new Database();
    },
  };
}

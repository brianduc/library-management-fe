export class Endpoints {
  static readonly Auth = {
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    REFRESH: "auth/refresh",
  }
  static readonly Users = {
    GET_ALL: "users",
    GET_BY_ID: (id: string) => `users/${id}`,
    CREATE: "users",
    UPDATE: (id: string) => `users/${id}`,
    DELETE: (id: string) => `users/${id}`,
  }
  static readonly Books = {
    GET_ALL: "books",
    GET_BY_ID: (id: string) => `books/${id}`,
    CREATE: "books",
    UPDATE: (id: string) => `books/${id}`,
    DELETE: (id: string) => `books/${id}`,
  }
  static readonly Categories = {
    GET_ALL: 'categories',
    GET_BY_ID: (id: string) => `categories/${id}`,
    CREATE: 'categories',
    UPDATE: (id: string) => `categories/${id}`,
    DELETE: (id: string) => `categories/${id}`,
  }
}

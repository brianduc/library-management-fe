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
}

export class Endpoints {
  static readonly Auth = {
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    REFRESH: "auth/refresh",
    CHANGE_PASSWORD_FIRST_TIME: "auth/change-password-first-time",
  }
  static readonly Fine = {
    GET_ALL: "fines",
    GET_BY_ID: (id: string) => `fines/${id}`,
    CREATE: "fines",
    UPDATE: (id: string) => `fines/${id}`,
    DELETE: (id: string) => `fines/${id}`,
    PATCH: (id: string) => `fines/${id}/pay`,
    GET_BY_USER: "fines/me",
  }
  static readonly Review = {
    CREATE: "reviews",      
    GET_BY_USER_BY_BOOK_ID: (id: string) => `reviews/book/${id}/user`,  
    GET_ALL: (id: string) => `reviews/book/${id}`,
    UPDATE: (id: string) => `reviews/${id}`,
    DELETE: (id: string) => `reviews/${id}`,
  }
  static readonly Users = {
    GET_ALL: "users",
    GET_ALLV2: "users/v2",
    GET_BY_ID: (id: string) => `users/${id}`,
    CREATE: "users",
    UPDATE: (id: string) => `users/${id}`,
    DELETE: (id: string) => `users/${id}`,
  }
  static readonly Books = {
    GET_ALL: "books",
    GET_ALL_V2: "books/v2",
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

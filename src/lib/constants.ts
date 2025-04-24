export class Constants {
  static readonly APP_NAME = "Vite React App"
  static readonly API_TOKEN_KEY = "APP_AT"
  static readonly API_REFRESH_TOKEN_KEY = "APP_RT"
  static readonly API_ROLE = "ROLE"

  static readonly Regex = class {
    static readonly PASSWORD_PATTERN =
      "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$" // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    static readonly EMAIL_PATTERN =
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$" // Email pattern
    static readonly NAME_PATTERN = "^[a-zA-Z]+(?:\\s[a-zA-Z]+)*$" // Name pattern
  }

  static readonly roleMap: Record<string, string> = {
    admin: "Quản trị viên",
    staff: "Nhân viên",
    member: "Thành viên",
  }
}

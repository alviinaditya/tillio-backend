export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  CASHIER = "CASHIER",
  USER = "USER",
}

export enum VerificationCodeTypes {
  RESET_PASSWORD = "RESET_PASSWORD",
  VERIFY_EMAIL = "VERIFY_EMAIL",
}

export enum TokenType {
  ACCESS = "access_token",
  REFRESH = "refresh_token",
}

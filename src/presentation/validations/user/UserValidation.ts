import * as userSchemas from "./userSchemas";

class UserValidation {
  static readonly LOGIN = userSchemas.loginSchema;
  static readonly REGISTER = userSchemas.registerSchema;
  static readonly VERIFICATION_CODE = userSchemas.verificationCodeSchema;
  static readonly FORGOT_PASSWORD = userSchemas.forgotPasswordSchema;
  static readonly RESET_PASSWORD = userSchemas.resetPasswordSchema;
  static readonly RESEND_VERIFICATION_EMAIL =
    userSchemas.resendVerificationEmailSchema;
}

export default UserValidation;

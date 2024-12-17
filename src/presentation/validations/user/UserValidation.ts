import * as userSchemas from "./userSchemas";

class UserValidation {
  static readonly LOGIN = userSchemas.loginSchema;
  static readonly REGISTER = userSchemas.registerSchema;
  static readonly VERIFICATION_CODE = userSchemas.verificationCodeSchema;
  static readonly FORGOT_PASSWORD = userSchemas.forgotPasswordSchema;
  static readonly RESET_PASSWORD = userSchemas.resetPasswordSchema;
  static readonly RESEND_VERIFICATION_EMAIL =
    userSchemas.resendVerificationEmailSchema;
  static readonly CHANGE_PASSWORD = userSchemas.changePasswordSchema;
  static readonly UPDATE_PROFILE = userSchemas.updateProfileSchema;
}

export default UserValidation;

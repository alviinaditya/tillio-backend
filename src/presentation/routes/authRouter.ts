import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.delete("/logout", AuthController.logout);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/verify-email/", AuthController.verifyEmail);
authRouter.post("/verify-email/resend", AuthController.resendVerificationEmail);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.post("/reset-password", AuthController.resetPassword);

export default authRouter;

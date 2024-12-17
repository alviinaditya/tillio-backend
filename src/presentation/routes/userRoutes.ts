import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { hasRole } from "../middlewares/roleMiddleware";
import { UserRole } from "../../shared/constants/enums";
import createUploadMiddleware from "../middlewares/uploadFileMiddleware";
import cleanUploadedFile from "../middlewares/cleanUploadedFileMiddleware";

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get("/", hasRole([UserRole.ADMIN]), UserController.getAll);
userRouter.get("/me", UserController.getCurrent);
userRouter.patch("/change-password", UserController.changePassword);
userRouter.patch(
  "/update-profile",
  createUploadMiddleware("user/avatar").single("avatar"),
  UserController.updateProfile,
  cleanUploadedFile
);

export default userRouter;

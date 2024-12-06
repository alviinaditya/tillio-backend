import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { hasRole } from "../middlewares/roleMiddleware";
import { UserRole } from "../../shared/constants/enums";

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get("/", hasRole([UserRole.ADMIN]), UserController.getAll);
userRouter.get("/me", UserController.getCurrent);

export default userRouter;

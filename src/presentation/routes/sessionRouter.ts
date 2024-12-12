import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { hasRole } from "../middlewares/roleMiddleware";
import { UserRole } from "../../shared/constants/enums";
import SessionController from "../controllers/SessionController";

const sessionRouter = Router();

sessionRouter.use(authMiddleware);
sessionRouter.get("/", SessionController.getByUser);
sessionRouter.get("/all", hasRole([UserRole.ADMIN]), SessionController.getAll);
sessionRouter.delete("/delete/:sessionId", SessionController.delete);

export default sessionRouter;

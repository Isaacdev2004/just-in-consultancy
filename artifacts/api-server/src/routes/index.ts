import { Router, type IRouter } from "express";
import healthRouter from "./health";
import requestsRouter from "./requests";
import contactRouter from "./contact";
import suppliersRouter from "./suppliers";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(requestsRouter);
router.use(contactRouter);
router.use(suppliersRouter);
router.use(adminRouter);

export default router;

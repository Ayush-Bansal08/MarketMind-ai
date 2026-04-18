import express from "express";
import { askQuery,getQueryTrend } from "../controller/query.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { getTrendsJustification } from "../controller/query.controller.js";
const router = express.Router();

router.post("/ask", askQuery);
router.get("/trendsDetection", getQueryTrend); // just in case you want to manually trigger it(completely optional)
router.get("/trendsJustification", getTrendsJustification); // to fetch the latest trends with justifications
export default router;

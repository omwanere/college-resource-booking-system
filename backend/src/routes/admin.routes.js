import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.middleware.js";

const router = express.Router();

router.get('/stats', authenticate, authorizeRoles('ADMIN'), getAdminStats);

export default router;
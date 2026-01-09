import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { 
    getPendingRegistrations, 
    approveRegistration, 
    rejectRegistration 
} from "../controllers/admin-registration.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.middleware.js";

const router = express.Router();

router.get('/stats', authenticate, authorizeRoles('ADMIN'), getAdminStats);

router.get('/registrations/pending', authenticate, authorizeRoles('ADMIN'), getPendingRegistrations);
router.patch('/registrations/:id/approve', authenticate, authorizeRoles('ADMIN'), approveRegistration);
router.patch('/registrations/:id/reject', authenticate, authorizeRoles('ADMIN'), rejectRegistration);

export default router;
import express from "express"
import { createBooking, approveBooking, rejectBooking } from "../controllers/booking.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post('/',authenticate,createBooking);
router.patch('/:id/approve', authenticate, authorizeRoles('ADMIN'), approveBooking);
router.patch('/:id/reject', authenticate, authorizeRoles('ADMIN'), rejectBooking);

export default router;
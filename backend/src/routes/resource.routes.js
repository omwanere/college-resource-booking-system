import express from "express";
import { 
    createResource,
    getResources,
    updateResource,
    disableResource,
    getResourceAvailability,
     } from "../controllers/resource.controller";
import { authenticate} from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.middleware.js";

const router = express.Router();

router.get('/', authenticate, getResources);
router.post('/', authenticate,authorizeRoles('ADMIN'),createResource);
router.put('/', authenticate, authorizeRoles('ADMIN'),updateResource);
router.patch('/:id/disable', authenticate, authorizeRoles('ADMIN'), disableResource);

router.get('/:id/availability', authenticate, getResourceAvailability);


export default router;
import express from "express";
import { registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/register', registerUser);

router.post('login', (req,res)=>{
    res.send('Login Route');
});

export default router;


import express from "express";
import cors from "cors";

import pool from "./db/index.js";
const app = express();
import authRoutes from "./routes/auth.routes.js"
import { authenticate } from "./middleware/auth.middleware.js";

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/protected', authenticate, (req, res)=> {
    res.json({
        message: 'Protected route accessed',
        user: req.user,
    });
});

app.get('/', (req,res)=> {
    res.send("Backend is running");
})

export default app;
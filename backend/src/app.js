import express from "express";
import cors from "cors";

import pool from "./db/index.js";
const app = express();
import authRoutes from "./routes/auth.routes.js"

app.use(cors());
app.use(express.json());

app.get('/db-test',async(req,res)=>{
    const {default: pool} = await import('./db/index.js');
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            success: true,
            time: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false});
    }
});

app.use('/auth', authRoutes);

app.get('/', (req,res)=> {
    res.send("Backend is running");
})

export default app;
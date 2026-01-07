import express from "express";
import cors from "cors";

import pool from "./db/index.js";
const app = express();
import authRoutes from "./routes/auth.routes.js"
import resourceRoutes from './routes/resource.routes.js'
import bookingRoutes from './routes/booking.routes.js'

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/resources', resourceRoutes);
app.use('/bookings', bookingRoutes);

app.get('/', (req,res)=> {
    res.send("Backend is running");
})

export default app;
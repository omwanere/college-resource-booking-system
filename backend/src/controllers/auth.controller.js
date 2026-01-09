import bcrpyt from "bcrypt";
import pool from "../db/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

export const registerUser = async (req, res) => {
    try {
        console.log('Data:', req.body);
        const {name, email, password, role} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "Email and password required"})
        }

        // Check if email already exists in users table
        const existingUser = await pool.query(
            `SELECT id FROM public.users WHERE email = $1`,
            [email]
        );

        if(existingUser.rows.length > 0){
            return res.status(409).json({message: 'Email already registered'});
        }

        // Check if email already exists in pending registrations
        const existingPending = await pool.query(
            `SELECT id FROM public.pending_registrations WHERE email = $1`,
            [email]
        );

        if(existingPending.rows.length > 0){
            return res.status(409).json({message: 'Registration request already pending'});
        }

        const hashedPassword = await bcrpyt.hash(password, 10);
        const userRole = role || 'USER';

        // If ADMIN role, create pending registration request
        if(userRole === 'ADMIN'){
            const pendingResult = await pool.query(
                `INSERT INTO public.pending_registrations (name, email, password_hash, role, status)
                 VALUES ($1, $2, $3, $4, 'PENDING')
                 RETURNING id, email, name, role, created_at`,
                [name, email, hashedPassword, userRole]
            );

            return res.status(201).json({
                message: 'Admin registration request submitted. Waiting for approval.',
                pending: true,
                request: pendingResult.rows[0],
            });
        }

        // For USER role, create account immediately
        const result = await pool.query(
            `INSERT INTO public.users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, role`,
            [name, email, hashedPassword, userRole]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0],
        });
    } catch (error) {
        if(error.code === '23505'){
            return res.status(409).json({message: 'Email already registered'});
        }
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Email and password required'})
        }

        const result = await pool.query(
            `SELECT id, email, password_hash, role FROM public.users WHERE email = $1`,
            [email]
        );

        if(result.rows.length === 0){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const user = result.rows[0];

        const isMatch = await bcrpyt.compare(password, user.password_hash);

        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.json({
            message: 'Login Successful',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};
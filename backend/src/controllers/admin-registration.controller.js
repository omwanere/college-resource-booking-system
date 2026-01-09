import pool from "../db/index.js";
import bcrpyt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const getPendingRegistrations = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, role, created_at, status
             FROM public.pending_registrations
             WHERE status = 'PENDING'
             ORDER BY created_at DESC`
        );

        res.json({
            count: result.rows.length,
            requests: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

export const approveRegistration = async (req, res) => {
    try {
        const {id} = req.params;

        // Get the pending registration
        const pendingResult = await pool.query(
            `SELECT * FROM public.pending_registrations WHERE id = $1 AND status = 'PENDING'`,
            [id]
        );

        if(pendingResult.rows.length === 0){
            return res.status(404).json({message: 'Pending registration not found'});
        }

        const pending = pendingResult.rows[0];

        // Check if email already exists in users
        const existingUser = await pool.query(
            `SELECT id FROM public.users WHERE email = $1`,
            [pending.email]
        );

        if(existingUser.rows.length > 0){
            // Update pending status to rejected and return error
            await pool.query(
                `UPDATE public.pending_registrations SET status = 'REJECTED' WHERE id = $1`,
                [id]
            );
            return res.status(409).json({message: 'Email already registered'});
        }

        // Create the user account
        const userResult = await pool.query(
            `INSERT INTO public.users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, name, role`,
            [pending.name, pending.email, pending.password_hash, pending.role]
        );

        // Update pending registration status to approved
        await pool.query(
            `UPDATE public.pending_registrations SET status = 'APPROVED' WHERE id = $1`,
            [id]
        );

        res.json({
            message: 'Registration approved successfully',
            user: userResult.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

export const rejectRegistration = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await pool.query(
            `UPDATE public.pending_registrations
             SET status = 'REJECTED'
             WHERE id = $1 AND status = 'PENDING'
             RETURNING id, email, name`,
            [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({message: 'Pending registration not found'});
        }

        res.json({
            message: 'Registration rejected successfully',
            request: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

import bcrpyt from "bcrypt";
import pool from "../db/index.js"

export const registerUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password required"})
        }

        const hashedPassword = await bcrpyt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, role`,
            [name, email, hashedPassword, role || 'USER']
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0],
        });
    } catch (error) {
        if(error.code === '23505'){
            return res.status(409).json({message: 'Email already registered'});
        }
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};
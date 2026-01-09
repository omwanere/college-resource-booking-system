import pool from "../db/index.js"
import dotenv from "dotenv";
dotenv.config();

export const createResource = async (req, res) => {
    try {
        const {name, type, capacity, location} = req.body;
        if(!name || !type){
            return res.status(400).json({
                message: "Resource name and type are required",
            });
        }

        const result = await pool.query(
            `INSERT INTO public.resources (name, type, capacity, location)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, type, capacity, location]
        );

        res.status(201).json({
            message: "Resource created successfully",
            resource: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

export const getResources = async (req, res) => {
    try {
        const {type} = req.query;
        let query = 'SELECT * FROM public.resources WHERE is_active = true';
        const values = [];

        if(type){
            query += ' AND type = $1';
            values.push(type);
        }

        const result = await pool.query(query, values);

        res.json({
            count: result.rows.length,
            resources: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

export const updateResource = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, type, capacity, location, is_active} = req.body;

        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
        }
        if (type !== undefined) {
            updates.push(`type = $${paramIndex++}`);
            values.push(type);
        }
        if (capacity !== undefined) {
            updates.push(`capacity = $${paramIndex++}`);
            values.push(capacity);
        }
        if (location !== undefined) {
            updates.push(`location = $${paramIndex++}`);
            values.push(location);
        }
        if (is_active !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            values.push(is_active);
        }

        if (updates.length === 0) {
            return res.status(400).json({message: 'No fields to update'});
        }

        values.push(id);
        const query = `
            UPDATE public.resources
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        if(result.rows.length === 0){
            return res.status(404).json({message: 'Resource not found'});
        }

        res.json({
            message: 'Resource updated successfully',
            resource: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

export const disableResource = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await pool.query(
            `UPDATE public.resources
             SET is_active = false
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({message: 'Resource not found'});
        }

        res.json(
            {
                message: 'Resource disabled successfully',
                resource: result.rows[0],
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

export const getResourceAvailability = async (req, res) => {
    try {
        const {id} = req. params;
        const {date} = req.query;

        if(!date){
            return res.status(400).json({
                message: 'date query parameter is required (YYYY-MM-DD)',
            });
        }

        const resourceCheck = await pool.query(
            `SELECT id, name, type FROM public.resources
             WHERE id = $1 AND is_active = true`,
            [id]
        );

        if(resourceCheck.rows.length === 0)
        {
            return res.status(404).json({message: 'Resource not found'});
        }

        const bookingsResult = await pool.query(
            `SELECT start_time, end_time
             FROM public.bookings
             WHERE resource_id = $1
             AND status = 'APPROVED'
             AND DATE(start_time) = $2
             ORDER BY start_time`,
            [id, date]
        );
        res.json({
            resource: resourceCheck.rows[0],
            date,
            busySlots: bookingsResult.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({messgae: 'Server Error'});
    }
};
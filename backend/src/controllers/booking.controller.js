import pool from "../db/index.js"
import dotenv from "dotenv"
dotenv.config();

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {resource_id, start_time, end_time} = req.body;

        if(!request_id || !start_time || !end_time){
            return res.status(400).json({
                message: 'resource_id, start_time and end_time are required',
            });
        }

        const resourceCheck = await pool.query(
            `SELECT id FROM public.resources
             WHERE id = $1 AND is_active = true`,
            [resource_id]
        );

        if(resourceCheck.rows.length === 0){
            return res.status(404).json({message: 'Resource not available'});
        }

        const overlapCheck = await pool.query(
            `SELECT id FROM public.bookings
             WHERE resource_id = $1
                AND status = 'APPROVED'
                AND start_time < $3
                AND end_time > $2`,
            [resource_id, start_time, end_time]
        );

        if(overlapCheck.rows.length > 0)
        {
            return res.status(409).json({
                message: 'Resource already booked for this time slot',
            });
        }

        const result = await pool.query(
            `INSERT INTO public.bookings
             (user_id, resource_id, start_time, end_time)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, resource_id, start_time, end_time]
        );

        res.json({
            message: "Booking request created",
            booking: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

export const approveBooking = async (req, res) => {
    try {
        const {id} = req.params;
        const bookingResult = await pool.query(
            `SELECT * FROM public.bookings WHERE id = $1`,
            [id]
        );

        if(booking.rows.length === 0){
            res.status(404).json({message: 'Booking Not Found'});
        }

        const booking = bookingResult.rows[0];

        if(booking.status !== 'PENDING'){
            return res.status(400).json({
                message: 'Only pending bookings can be approved',
            });
        }

        const overlapCheck = await pool.query(
            `SELECT id FROM public.bookings
             WHERE resource_id = $1
             AND status = 'APPROVED'
             AND start_time < $3
             AND end_time > $2`,
            [booking.resource_id, booking.start_time, booking.end_time]
        );

        if(overlapCheck.rows.length > 0)
        {
            return res.status(409).json({
                message: 'Booking overlaps with an existing approved booking',
            });
        }

        const result = await pool.query(
            `UPDATE public.bookings
             SET status = 'APPROVED'
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        res.json({
            message: 'Booking approved',
            booking: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};

export const rejectBooking = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await pool.query(
            `UPDATE public.bookings
             SET status = 'REJECTED'
             WHERE id = $1 AND status = 'PENDING'
             RETURNING *`,
            [id]
        );

        if(result.rows.length === 0)
        {
            return res.status(404).json({
                message: "Pending booking not found",
            });
        }

        res.json({
            message: 'Booking rejected',
            booking: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
}


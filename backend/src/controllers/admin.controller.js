import pool from "../db/index.js";
import dotenv from "dotenv";
dotenv.config();

export const getAdminStats = async (req, res) => {
    try {
        const [
            usersCount,
            resourcesCount,
            bookingsCount,
            pendingBookings,
            todayApproved,
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM public.users'),
            pool.query('SELECT COUNT(*) FROM public.resources'),
            pool.query('SELECT COUNT(*) FROM public.bookings'),
            pool.query(
                "SELECT COUNT(*) FROM public.bookings WHERE status = 'PENDING'"
            ),
            pool.query(
                `SELECT COUNT(*) FROM public.bookings
                 WHERE status = 'APPROVED'
                 AND DATE(created_at) = CURRENT_DATE`
            ),
        ]);

        res.json({
            users: Number(usersCount.rows[0].count),
            resources: Number(resourcesCount.rows[0].count),
            bookings: Number(bookingsCount.rows[0].count),
            pendingBookings: Number(pendingBookings.rows[0].count),
            approvedToday: Number(todayApproved.rows[0].count),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
};
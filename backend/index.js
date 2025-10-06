import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import roomsRouter from "./routes/AdminRoomRoute.js";
import authRouter from "./routes/auth.js";
import masterRoutes from "./routes/AdminMaster.js";
import userRoutes from "./routes/userBookingRoute.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import ticketRoutes from "./routes/TicketRoutes.js";
import dashboardRoutes from "./routes/DashboardRoute.js";

dotenv.config();
const  app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));




app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use("/api/rooms", roomsRouter);
app.use("/api/admin", adminBookingRoutes);
app.use("/api/admin/dashboard", dashboardRoutes)
app.use("/api/bookings", userRoutes  )
app.use("/api/auth", authRouter);
app.use("/api/master",masterRoutes);
app.use("/api/tickets", ticketRoutes);

app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
});


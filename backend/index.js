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
import session from 'express-session';
import svgCaptcha from 'svg-captcha';
import userDashboardRoutes from "./routes/UserDashboardRoute.js";
import searchRoom from "./routes/RoomFilterRoutes.js";
import "./cron/bookingMonitor.js";



dotenv.config();
const  app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 5 * 60 * 1000 
  }
}));




app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 3,
    color: true,
    background: '#f4f4f4'
  });

  req.session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
});


app.use("/api/rooms", roomsRouter);
app.use("/api/admin", adminBookingRoutes);
app.use("/api/admin/dashboard", dashboardRoutes)
app.use("/api/bookings", userRoutes  )
app.use("/api/auth", authRouter);
app.use("/api/master",masterRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/user/dashboard", userDashboardRoutes);
app.use("/api/filter", searchRoom)

app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
});


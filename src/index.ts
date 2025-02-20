import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import bodyParser from 'body-parser';
import path from 'path';
import userRouter from './routes/users/userRoutes'
import expertRouter from './routes/expert/expertRouter'
import adminRouter from './routes/admin/adminRouter'
import chatRouter from './routes/shared/chatRouter'
import paymentRouter from './routes/shared/paymentRouter'
import meetingRouter from './routes/shared/meetingRouter'
import concernRouter from './routes/shared/concernRouter'
import walletRouter from './routes/expert/walletRouter'
import connectDb from './config/dbConfig';
import session from 'express-session';
import cookieParser from "cookie-parser"
import cors from 'cors'
import configureSocket from './config/socketConfig';


connectDb()
const app = express();
const server = http.createServer(app);
const io = configureSocket(server)
dotenv.config();
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json());

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://api.razorpay.com"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Payout-Idempotency']
}));

app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/', userRouter);
app.use('/api/expert/',expertRouter)
app.use('/api/admin/', adminRouter)
app.use('/api/chat/', chatRouter)
app.use('/api/payment/', paymentRouter)
app.use('/api/meeting/', meetingRouter)
app.use('/api/concern',concernRouter)
app.use('/api/wallet',walletRouter)

server.listen(process.env.PORT, () => console.log('server connected'));

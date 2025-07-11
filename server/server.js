import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import  authRouter  from './routes/authroutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.port || '4000';
connectDB();

const allowedOrigins = ['http://localhost:5173'];
app.use(express.json());
app.use(cookieParser());

app.use(cors({origin:allowedOrigins,credentials:true}));
// API endpoints-
app.get('/',(req,res)=>{
    res.send("App is working");
})
app.use('/api/auth',authRouter);
app.use("/api/user",userRouter);
app.listen(port,()=>{
    console.log(`app is listening on port ${port}`)
});
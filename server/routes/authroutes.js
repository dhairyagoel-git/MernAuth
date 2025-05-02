import express from 'express';
import { isAuthenticated, login, logout, register, sendResetOtp, sendVerfiyOtp, setNewPassword, verifyEmail, verifyOtp } from '../controllers/authController.js';
import userAuth from '../middleware/UserAuth.js';
const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerfiyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-Auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/set-new-password",setNewPassword);
export default authRouter;

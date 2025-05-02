import express from 'express';
import { getUserData } from '../controllers/userController.js';
import userAuth from '../middleware/UserAuth.js';

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData)

export default userRouter;
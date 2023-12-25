import { verifyJWT } from '../middleware/auth.middleware.js';
import express from 'express';
import { 
    httpLogin,
    httpRegisterUser,
    httpLogout,
    refreshAccessToken,
    updateUserPassword,
    getCurrentUser
} from '../controllers/user.controller.js';

export const userRouter = express.Router();

userRouter.post("/login",httpLogin);
userRouter.get("/user",getCurrentUser);
userRouter.post("/signup",httpRegisterUser);
userRouter.post("/logout",verifyJWT,httpLogout);
userRouter.post("/refresh-token",refreshAccessToken);
userRouter.post("/update-password",verifyJWT,updateUserPassword);
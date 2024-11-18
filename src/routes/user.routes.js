import express from 'express';
import { handleUserSignUp } from '../controllers/user.controller.js'; // 회원가입 처리 함수 import

const userRouter = express.Router();

// POST /api/v1/users/signup: 회원가입 API
userRouter.post('/signup', handleUserSignUp);

export { userRouter };

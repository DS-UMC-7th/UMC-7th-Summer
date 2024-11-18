import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { pool } from "../db.config.js"; // 데이터베이스 연결 객체

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  try {
    const user = await userSignUp(pool, bodyToUser(req.body)); // db 객체인 pool을 전달
    res.status(StatusCodes.OK).json(user); // 성공 응답
  } catch (error) {
    next(error); // 오류 처리 미들웨어로 전달
  }
};

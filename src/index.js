import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { userRouter } from './routes/user.routes.js'; // userRouter import

dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // 환경변수 PORT가 없으면 기본값 3000으로 설정

// 중간에 필요한 미들웨어들 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // CORS 허용
app.use(express.static("public")); // 정적 파일 접근

// 라우터 설정
app.use('/api/v1/users/signup', userRouter);

// 공통 응답 헬퍼 함수
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

// 회원가입 처리 라우터
app.post("/api/v1/users/signup", handleUserSignUp);

// 전역 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    resultType: "FAIL",
    error: {
      errorCode: err.errorCode || "unknown",
      reason: err.reason || err.message || null,
      data: err.data || null,
    },
    success: null,
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

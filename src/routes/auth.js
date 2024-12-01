import express from "express";
import passport from "../auth.config.js"; // 설정된 passport 가져오기

const router = express.Router();

// 네이버 로그인 시작 라우트
router.get(
  "/auth/naver",
  passport.authenticate("naver", { scope: ["profile"] })
);

// 네이버 로그인 콜백 라우트
router.get(
  "/auth/naver/callback",
  passport.authenticate("naver", { failureRedirect: "/" }),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect("/"); // 필요에 따라 다른 경로로 리다이렉트
  }
);

export { router as authRouter };

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { googleStrategy, naverStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";
import { userRouter } from "./routes/user.routes.js"; // User 라우터
import { authRouter } from "./routes/auth.js"; // 위에서 만든 라우트 가져오기


dotenv.config();

const app = express();

passport.use(googleStrategy);
passport.use(naverStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use(authRouter); // 라우트 등록



const port = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 라우트 설정
app.use("/api/v1/users", userRouter);

app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", { failureRedirect: "/oauth2/login/google" }),
  (req, res) => res.redirect("/")
);

app.get("/oauth2/login/naver", passport.authenticate("naver"));
app.get(
  "/oauth2/callback/naver",
  passport.authenticate("naver", { failureRedirect: "/oauth2/login/naver" }),
  (req, res) => res.redirect("/")
);

// 루트 라우터
app.get("/", (req, res) => {
  console.log(req.user);
  res.send("Hello World!");
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS 환경에서 true로 설정
}));
app.use(passport.initialize());
app.use(passport.session());

// 라우트 연결
app.use(authRoutes);
app.use(userRoutes);

// 서버 시작
app.listen(3001, () => {
    console.log('서버가 http://localhost:3001 에서 실행 중입니다.');
});

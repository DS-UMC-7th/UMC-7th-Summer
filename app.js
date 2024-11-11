import express from 'express';
import userController from './src/controllers/user.controller.js'; // 확장자 포함

const app = express();

// Middleware 설정
app.use(express.json()); // JSON 요청 본문 파싱

// 라우터 설정
app.use('/api', userController); // '/api' 경로로 들어오는 요청을 userController로 처리

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

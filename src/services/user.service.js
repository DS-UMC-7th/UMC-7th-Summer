import { addUser } from '../repositories/user.repository.js';  // 경로 수정

// 사용자 추가 함수
export const createUser = async (userData) => {
  const newUser = await addUser(userData);
  return newUser;
};

import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (db, data) => {
  // db 객체를 사용하여 addUser 호출
  const joinUserId = await addUser(db, {
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  // 선호 카테고리 매핑
  for (const preference of data.preferences) {
    await setPreference(db, joinUserId, preference);
  }

  // 사용자 정보와 선호 카테고리 조회
  const user = await getUser(db, joinUserId);
  const preferences = await getUserPreferencesByUserId(db, joinUserId);

  return responseFromUser({ user, preferences });
};

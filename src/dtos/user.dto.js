export const bodyToUser = (body) => {
  const birth = new Date(body.birth);

  // body가 필요한 필드를 모두 포함하는지 확인
  if (!body || !body.email || !body.password || !body.name) {
    throw new Error("이메일, 비밀번호 또는 이름이 없습니다.");
  }

  return {
    email: body.email,
    name: body.name,
    password: body.password,
    gender: body.gender,
    birth,
    address: body.address || "",
    detailAddress: body.detailAddress || "",
    phoneNumber: body.phoneNumber,
    preferences: body.preferences,
  };
};

export const responseFromUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    detailAddress: user.detail_address,
    phoneNumber: user.phone_number,
  };
};

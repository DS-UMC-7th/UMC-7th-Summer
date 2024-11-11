import { PrismaClient } from '@prisma/client';  // Prisma 클라이언트를 import
const prisma = new PrismaClient();  // Prisma 클라이언트 인스턴스 생성

// 새로운 사용자 추가 함수
export const addUser = async (userData) => {
  const user = await prisma.user.create({
    data: userData,
  });
  return user;
};

// 내가 작성한 리뷰 목록
export const getUserReviews = async (userId) => {
  return await prisma.userStoreReview.findMany({
    where: { userId },
    include: {
      store: true, // 가게 정보도 함께 가져오기
    },
  });
};

// 특정 가게의 미션 목록
export const getStoreMissions = async (storeId) => {
  return await prisma.mission.findMany({
    where: { storeId },
    include: {
      participations: true, // 미션에 참여한 사용자 목록도 포함
    },
  });
};

// 내가 진행 중인 미션 목록
export const getUserMissionsInProgress = async (userId) => {
  return await prisma.missionParticipation.findMany({
    where: {
      userId,
      status: 'in-progress', // 진행 중인 미션만 필터링
    },
    include: {
      mission: true, // 미션 정보 포함
    },
  });
};

// 내가 진행 중인 미션을 진행 완료로 바꾸기
export const markMissionAsComplete = async (userId, missionId) => {
  return await prisma.missionParticipation.updateMany({
    where: {
      userId,
      missionId,
      status: 'in-progress', // 진행 중인 미션만 수정
    },
    data: {
      status: 'completed', // 상태를 'completed'로 변경
    },
  });
};

// 가게 리뷰 목록 (커서 기반 페이지네이션)
export const getAllStoreReviews = async (storeId, cursor) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: { id: true, content: true, store: true, user: true },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};

import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import express from 'express';  // 'require' 대신 'import' 사용
import {
  getUserReviews,
  getStoreMissions,
  getUserMissionsInProgress,
  markMissionAsComplete,
} from '../repositories/user.repository.js';  // 'require' 대신 'import' 사용

const router = express.Router();

// 내가 작성한 리뷰 목록
router.get('/user/:id/reviews', async (req, res) => {
  try {
    const reviews = await getUserReviews(parseInt(req.params.id));
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 특정 가게의 미션 목록
router.get('/store/:id/missions', async (req, res) => {
  try {
    const missions = await getStoreMissions(parseInt(req.params.id));
    return res.json(missions);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 내가 진행 중인 미션 목록
router.get('/user/:id/missions/in-progress', async (req, res) => {
  try {
    const missions = await getUserMissionsInProgress(parseInt(req.params.id));
    return res.json(missions);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 내가 진행 중인 미션을 진행 완료로 바꾸기
router.patch('/user/:userId/missions/:missionId/complete', async (req, res) => {
  try {
    const { userId, missionId } = req.params;
    const updatedMission = await markMissionAsComplete(parseInt(userId), parseInt(missionId));
    return res.json(updatedMission);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 리뷰 목록 처리 함수 (Pagination 추가)
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const reviews = await listStoreReviews(
      parseInt(req.params.storeId),
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).json({
      data: reviews,
      pagination: {
        cursor: reviews.length ? reviews[reviews.length - 1].id : null
      }
    });
  } catch (err) {
    next(err);
  }
};

export default router;  // 라우터를 default로 내보내기

export const bodyToUser = (body) => {
  return {
    name: body.name,
    email: body.email,
    // 필요한 다른 필드들 추가
  };
};

export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};

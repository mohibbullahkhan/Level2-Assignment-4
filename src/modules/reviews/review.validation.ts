export const createReviewSchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (!body.rentalRequestId || typeof body.rentalRequestId !== 'string') errors.push({ field: 'body.rentalRequestId', message: 'Rental Request ID is required' });
  if (body.rating === undefined || typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) errors.push({ field: 'body.rating', message: 'Rating must be an integer between 1 and 5' });
  if (body.comment !== undefined && typeof body.comment !== 'string') errors.push({ field: 'body.comment', message: 'Comment must be a string' });

  return { isValid: errors.length === 0, errors };
};

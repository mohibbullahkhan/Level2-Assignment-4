export const updateUserStatusSchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (!body.status || !['ACTIVE', 'BANNED'].includes(body.status)) {
    errors.push({ field: 'body.status', message: 'Status must be ACTIVE or BANNED' });
  }

  return { isValid: errors.length === 0, errors };
};

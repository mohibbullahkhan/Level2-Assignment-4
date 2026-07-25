export const createCategorySchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (!body.name || typeof body.name !== 'string') errors.push({ field: 'body.name', message: 'Name is required' });
  if (body.description !== undefined && typeof body.description !== 'string') errors.push({ field: 'body.description', message: 'Description must be a string' });

  return { isValid: errors.length === 0, errors };
};

export const updateCategorySchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (body.name !== undefined && typeof body.name !== 'string') errors.push({ field: 'body.name', message: 'Name must be a string' });
  if (body.description !== undefined && typeof body.description !== 'string') errors.push({ field: 'body.description', message: 'Description must be a string' });

  return { isValid: errors.length === 0, errors };
};

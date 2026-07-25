export const registerSchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (!body.name || typeof body.name !== 'string') errors.push({ field: 'body.name', message: 'Name is required and must be a string' });
  if (!body.email || typeof body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push({ field: 'body.email', message: 'Valid email is required' });
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) errors.push({ field: 'body.password', message: 'Password must be at least 6 characters long' });
  if (body.role && !['ADMIN', 'LANDLORD', 'TENANT'].includes(body.role)) errors.push({ field: 'body.role', message: 'Invalid role' });

  return { isValid: errors.length === 0, errors };
};

export const loginSchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (!body.email || typeof body.email !== 'string') errors.push({ field: 'body.email', message: 'Valid email is required' });
  if (!body.password || typeof body.password !== 'string') errors.push({ field: 'body.password', message: 'Password is required' });

  return { isValid: errors.length === 0, errors };
};

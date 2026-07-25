export const createRentalSchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (!body.propertyId || typeof body.propertyId !== 'string') errors.push({ field: 'body.propertyId', message: 'Property ID is required' });
  if (!body.moveInDate || typeof body.moveInDate !== 'string' || new Date(body.moveInDate) <= new Date()) errors.push({ field: 'body.moveInDate', message: 'Move in date must be a future date' });
  if (body.message !== undefined && typeof body.message !== 'string') errors.push({ field: 'body.message', message: 'Message must be a string' });
  
  return { isValid: errors.length === 0, errors };
};

export const updateRentalStatusSchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (!body.status || !['APPROVED', 'REJECTED'].includes(body.status)) {
    errors.push({ field: 'body.status', message: 'Status must be APPROVED or REJECTED' });
  }

  return { isValid: errors.length === 0, errors };
};

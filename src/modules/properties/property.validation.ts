export const createPropertySchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (!body.title || typeof body.title !== 'string') errors.push({ field: 'body.title', message: 'Title is required' });
  if (!body.description || typeof body.description !== 'string') errors.push({ field: 'body.description', message: 'Description is required' });
  if (!body.price || typeof body.price !== 'number' || body.price < 0) errors.push({ field: 'body.price', message: 'Price must be a positive number' });
  if (!body.categoryId || typeof body.categoryId !== 'string') errors.push({ field: 'body.categoryId', message: 'Category ID is required' });
  if (!body.address || typeof body.address !== 'string') errors.push({ field: 'body.address', message: 'Address is required' });
  if (!body.city || typeof body.city !== 'string') errors.push({ field: 'body.city', message: 'City is required' });
  if (body.bedrooms === undefined || typeof body.bedrooms !== 'number' || body.bedrooms < 0) errors.push({ field: 'body.bedrooms', message: 'Bedrooms must be a positive number' });
  if (body.bathrooms === undefined || typeof body.bathrooms !== 'number' || body.bathrooms < 0) errors.push({ field: 'body.bathrooms', message: 'Bathrooms must be a positive number' });
  if (body.area === undefined || typeof body.area !== 'number' || body.area < 0) errors.push({ field: 'body.area', message: 'Area must be a positive number' });

  if (!Array.isArray(body.images) || !body.images.every((i: any) => typeof i === 'string')) {
    errors.push({ field: 'body.images', message: 'Images must be an array of strings' });
  }
  
  if (body.amenities && (!Array.isArray(body.amenities) || !body.amenities.every((a: any) => typeof a === 'string'))) {
    errors.push({ field: 'body.amenities', message: 'Amenities must be an array of strings' });
  }

  return { isValid: errors.length === 0, errors };
};

export const updatePropertySchema = (data: any) => {
  const errors = [];
  const body = data.body || {};

  if (body.title !== undefined && typeof body.title !== 'string') errors.push({ field: 'body.title', message: 'Title must be a string' });
  if (body.price !== undefined && (typeof body.price !== 'number' || body.price < 0)) errors.push({ field: 'body.price', message: 'Price must be a positive number' });

  return { isValid: errors.length === 0, errors };
};

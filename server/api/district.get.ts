import { z } from 'zod';
import districtList from '../assets/district.json';

const districtSchema = z.object({
  code: z.string(),
});

export default defineEventHandler(async (event) => {
  const validateResult = await getValidatedQuery(event, query => districtSchema.safeParse(query));

  if (!validateResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'code must be a string',
    });
  }

  const result = districtList.filter((district) => district.code.startsWith(validateResult.data.code));

  if (!result.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found District',
    })
  }
  return result;
});
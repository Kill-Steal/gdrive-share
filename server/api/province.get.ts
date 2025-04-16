import { z } from 'zod';
import provinceList from '../assets/province.json';

const provinceSchema = z.object({
  area: z.string(),
})

export default defineEventHandler(async (event) => {
  const validateResult = await getValidatedQuery(event, query => provinceSchema.safeParse(query));

  if (!validateResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'area must be a string',
    });
  }

  const result = provinceList.filter((province) => province.area === validateResult.data.area);

  if (!result.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found Province',
    })
  }
  return result;
});
import type { Province, District } from './typeData.d.ts';

async function getProvince(area: string): Promise<Province[]> {
  return $fetch('/api/province', {
    method: 'get',
    params: { area },
  });
}

async function getDistrict(code: string): Promise<District[]> {
  return $fetch('/api/district', {
    method: 'get',
    params: { code },
  });
}

export default { getProvince, getDistrict }
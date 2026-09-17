export function normalizeSupabaseUrl(value) {
  return value?.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

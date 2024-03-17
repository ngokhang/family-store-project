export const REPONSE_MESSAGE = 'response_message';

export const IS_PUBLIC_KEY = 'isPublic';

export const USER_ROLE = '9a3286a3-5a1d-4e3e-b6d4-c75418b6aecf';

export const ADMIN_ROLE = '6b3a95db-955e-4fa7-956c-912e5bf35701';

export const metadataResponseFetch = (
  page,
  pageSize,
  totalItems,
  totalPages,
) => ({
  page: Number(page),
  pageSize: Number(pageSize),
  total: totalItems,
  pageCount: totalPages,
});

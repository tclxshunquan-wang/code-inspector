export const fetcher = async ({
  url,
  prams,
  fallbackUrl,
}: {
  url: string;
  prams: URLSearchParams;
  fallbackUrl?: string;
}) => {
  const response = await fetch(`${url}?${prams}`);
  // only 404 need to try fallback legacy endpoint
  if (response.status === 404 && fallbackUrl) {
    return await fetch(`${fallbackUrl}?${prams}`);
  }
  return response;
};

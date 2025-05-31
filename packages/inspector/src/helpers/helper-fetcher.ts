export const fetcher = async ({
  url,
  params,
  fallbackUrl,
}: {
  url: string;
  params: URLSearchParams;
  fallbackUrl?: string;
}) => {
  const response = await fetch(`${url}?${params}`);
  // only 404 need to try fallback legacy endpoint
  if (response.status === 404 && fallbackUrl) {
    return await fetch(`${fallbackUrl}?${params}`);
  }
  return response;
};

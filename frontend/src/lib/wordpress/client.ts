import { apiRequest, createApiUrl } from "@/lib/api/client";

export function wordpressRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  return apiRequest<T>(path, init);
}

export function createWordPressUrl(path: string): URL {
  return createApiUrl(path);
}

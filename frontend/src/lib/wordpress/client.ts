import { apiRequest } from "@/lib/api/client";

export function wordpressRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  return apiRequest<T>(path, init);
}

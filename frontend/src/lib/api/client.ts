import { siteConfig } from "@/config/site";

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = createApiUrl(path);
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function createApiUrl(path: string): URL {
  return new URL(path.replace(/^\//, ""), `${siteConfig.apiUrl}/`);
}

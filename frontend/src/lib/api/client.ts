import { siteConfig } from "@/config/site";

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), `${siteConfig.apiUrl}/`);
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

export type AuthLocale = "en" | "ko";

export function safeAuthRedirect(
  rawRedirect: string | null | undefined,
  locale: AuthLocale,
): string {
  const fallback = `/${locale}`;

  if (typeof rawRedirect !== "string" || rawRedirect.trim() === "") {
    return fallback;
  }

  const value = rawRedirect.trim();

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  try {
    const url = new URL(value, "http://wordcovenantministry.local");

    if (url.origin !== "http://wordcovenantministry.local") {
      return fallback;
    }

    if (!isLocalePath(url.pathname, locale)) {
      return fallback;
    }

    if (url.pathname === `/${locale}/login` || url.pathname === `/${locale}/register`) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function buildAuthRouteWithRedirect(
  path: string,
  redirectTarget: string,
  locale: AuthLocale,
): string {
  if (
    redirectTarget === `/${locale}` ||
    !redirectTarget.startsWith("/") ||
    redirectTarget.startsWith("//")
  ) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}redirect=${encodeURIComponent(redirectTarget)}`;
}

function isLocalePath(pathname: string, locale: AuthLocale): boolean {
  return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
}

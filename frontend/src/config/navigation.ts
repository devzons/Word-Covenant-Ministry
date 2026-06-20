export type NavigationItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Bible", href: "/bible/KRV/genesis/1" },
  { label: "Search", href: "/bible/search" },
];

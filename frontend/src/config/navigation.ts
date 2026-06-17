export type NavigationItem = {
  label: string;
  href: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Sermons", href: "/sermons" },
  { label: "Bible Studies", href: "/bible-studies" },
  { label: "Books", href: "/books" },
  { label: "Resources", href: "/resources" },
];

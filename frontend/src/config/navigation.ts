export type NavigationItem = {
  href: string;
  label: {
    en: string;
    ko: string;
  };
};

export const primaryNavigation: NavigationItem[] = [
  { label: { en: "Home", ko: "홈" }, href: "/" },
  { label: { en: "Bible Reader", ko: "성경 읽기" }, href: "/bible/KRV/genesis/1" },
  { label: { en: "Search", ko: "검색" }, href: "/bible/search" },
  { label: { en: "Timeline", ko: "성경 타임라인" }, href: "/timeline" },
  { label: { en: "Gospel Harmony", ko: "복음서 대조" }, href: "/gospel-harmony" },
  { label: { en: "Sermons", ko: "설교" }, href: "/sermons" },
  { label: { en: "Original Language", ko: "원어 연구" }, href: "/original-language" },
  { label: { en: "About", ko: "소개" }, href: "/about" },
];

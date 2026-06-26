"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { TimelineConfidenceBadge } from "./TimelineConfidenceBadge";
import type { TimelineLocale } from "./passionWeekTimeline";

type TimelineView = "overview" | "events" | "books" | "kingdoms" | "genealogy" | "places" | "themes";

type TimelineFilterLabels = {
  authorship: string;
  book: string;
  clear: string;
  confidence: string;
  covenant: string;
  empire: string;
  future: string;
  of: string;
  period: string;
  people: string;
  place: string;
  prophets: string;
  search: string;
  showing: string;
  theme: string;
  kingdom: string;
};

type TimelineFilterOption = {
  id: string;
  label: string;
};

type TimelineBookSectionNavigationItem = {
  count: number;
  sectionId: string;
  sectionKey: string;
  label: {
    en: string;
    ko: string;
  };
  testament: "OT" | "NT";
};

type TimelineKingdomSectionNavigationItem = {
  count: number;
  sectionId: string;
  sectionKey: string;
  label: {
    en: string;
    ko: string;
  };
};

type TimelineFilterBarProps = {
  activeBookId: string;
  activeBookSectionKey?: string;
  activeKingdomSectionKey?: string;
  activePeriodId: string;
  activePlaceId: string;
  activeView: TimelineView;
  bookOptions: TimelineFilterOption[];
  bookSections?: TimelineBookSectionNavigationItem[];
  booksPreviewStats?: {
    newTestamentCount: number;
    oldTestamentCount: number;
    totalCount: number;
  };
  kingdomSections?: TimelineKingdomSectionNavigationItem[];
  kingdomsPreviewStats?: {
    recordTypeCount: Record<string, number>;
    sectionCount: number;
    totalCount: number;
  };
  confidenceLabel: string;
  confidenceNote: string;
  highlightedBookSectionKeys?: string[];
  highlightedKingdomSectionKeys?: string[];
  labels: TimelineFilterLabels;
  locale: TimelineLocale;
  onBookChange: (bookId: string) => void;
  onBookSectionSelect?: (sectionKey: string) => void;
  onClearFilters: () => void;
  onKingdomSectionSelect?: (sectionKey: string) => void;
  onPeriodChange: (periodId: string) => void;
  onPlaceChange: (placeId: string) => void;
  onSearchChange: (value: string) => void;
  periodOptions: TimelineFilterOption[];
  placeOptions: TimelineFilterOption[];
  previewNote: string;
  searchTerm: string;
  totalCount: number;
  visibleCount: number;
};

export function TimelineFilterBar({
  activeBookId,
  activeBookSectionKey,
  activeKingdomSectionKey,
  activePeriodId,
  activePlaceId,
  activeView,
  bookOptions,
  bookSections,
  booksPreviewStats,
  kingdomSections,
  kingdomsPreviewStats,
  confidenceLabel,
  confidenceNote,
  highlightedBookSectionKeys,
  highlightedKingdomSectionKeys,
  labels,
  locale,
  onBookChange,
  onBookSectionSelect,
  onClearFilters,
  onKingdomSectionSelect,
  onPeriodChange,
  onPlaceChange,
  onSearchChange,
  periodOptions,
  placeOptions,
  previewNote,
  searchTerm,
  totalCount,
  visibleCount,
}: TimelineFilterBarProps) {
  const copy = navigatorCopy[locale];

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 sm:p-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {copy.title}
        </p>
        <p className="text-sm leading-6 text-zinc-600">{copy.subtitle}</p>
      </div>

      {activeView === "events" ? (
        <EventsNavigator
          activeBookId={activeBookId}
          activePeriodId={activePeriodId}
          activePlaceId={activePlaceId}
          bookOptions={bookOptions}
          confidenceLabel={confidenceLabel}
          confidenceNote={confidenceNote}
          labels={labels}
          locale={locale}
          onBookChange={onBookChange}
          onClearFilters={onClearFilters}
          onPeriodChange={onPeriodChange}
          onPlaceChange={onPlaceChange}
          onSearchChange={onSearchChange}
          periodOptions={periodOptions}
          placeOptions={placeOptions}
          searchTerm={searchTerm}
          totalCount={totalCount}
          visibleCount={visibleCount}
        />
      ) : null}

      {activeView === "books" ? (
        <BooksNavigator
          activeSectionKey={activeBookSectionKey}
          highlightedSectionKeys={highlightedBookSectionKeys}
          locale={locale}
          onSectionSelect={onBookSectionSelect}
          sections={bookSections}
          stats={booksPreviewStats}
        />
      ) : null}
      {activeView === "kingdoms" ? (
        <KingdomsNavigator
          activeSectionKey={activeKingdomSectionKey}
          highlightedSectionKeys={highlightedKingdomSectionKeys}
          locale={locale}
          onSectionSelect={onKingdomSectionSelect}
          sections={kingdomSections}
          stats={kingdomsPreviewStats}
        />
      ) : null}
      {activeView === "genealogy" ? <GenealogyNavigator locale={locale} /> : null}
      {activeView === "places" ? <PlacesNavigator locale={locale} /> : null}
      {activeView === "overview" ? <OverviewNavigator locale={locale} /> : null}
      {activeView === "themes" ? <ThemesNavigator locale={locale} previewNote={previewNote} /> : null}
    </aside>
  );
}

type EventsNavigatorProps = {
  activeBookId: string;
  activePeriodId: string;
  activePlaceId: string;
  bookOptions: TimelineFilterOption[];
  confidenceLabel: string;
  confidenceNote: string;
  labels: TimelineFilterLabels;
  locale: TimelineLocale;
  onBookChange: (bookId: string) => void;
  onClearFilters: () => void;
  onPeriodChange: (periodId: string) => void;
  onPlaceChange: (placeId: string) => void;
  onSearchChange: (value: string) => void;
  periodOptions: TimelineFilterOption[];
  placeOptions: TimelineFilterOption[];
  searchTerm: string;
  totalCount: number;
  visibleCount: number;
};

function EventsNavigator({
  activeBookId,
  activePeriodId,
  activePlaceId,
  bookOptions,
  confidenceLabel,
  confidenceNote,
  labels,
  locale,
  onBookChange,
  onClearFilters,
  onPeriodChange,
  onPlaceChange,
  onSearchChange,
  periodOptions,
  placeOptions,
  searchTerm,
  totalCount,
  visibleCount,
}: EventsNavigatorProps) {
  const periodCount = periodOptions.length - 1;
  const bookCount = bookOptions.length - 1;
  const placeCount = placeOptions.length - 1;

  return (
    <>
      <NavigatorCard title={locale === "ko" ? "현재 보기: 사건 흐름" : "Current view: Events"}>
        <p className="text-sm leading-6 text-zinc-600">
          {locale === "ko"
            ? "이 필터는 사건 흐름에 적용됩니다."
            : "These filters apply to the Events view."}
        </p>
      </NavigatorCard>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {labels.search}
        </span>
        <input
          className={cn(
            "min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900",
            "placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/10",
          )}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={
            locale === "ko"
              ? "사건 / 인물 / 장소 검색"
              : "Search events, people, places"
          }
          value={searchTerm}
        />
      </label>

      <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
        <StatusPill>{`${labels.showing} ${visibleCount} ${locale === "ko" ? "/" : labels.of} ${totalCount}`}</StatusPill>
        <StatusPill>{locale === "ko" ? `기간 ${periodCount}` : `Periods ${periodCount}`}</StatusPill>
        <StatusPill>{locale === "ko" ? `책 ${bookCount}` : `Books ${bookCount}`}</StatusPill>
        <StatusPill>{locale === "ko" ? `지명 ${placeCount}` : `Places ${placeCount}`}</StatusPill>
      </div>

      <div className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            {labels.confidence}
          </p>
          <TimelineConfidenceBadge label={confidenceLabel} locale={locale} />
          <p className="text-xs leading-5 text-zinc-500">{confidenceNote}</p>
        </div>
        <button
          className="inline-flex min-h-10 cursor-pointer items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          onClick={onClearFilters}
          type="button"
        >
          {labels.clear}
        </button>
      </div>

      <SidebarSection
        count={periodCount}
        defaultOpen
        label={locale === "ko" ? "시대 구간" : "Periods"}
        subtitle={locale === "ko" ? "사건 필터" : "Events filter"}
      >
        <ChipGrid>
          {periodOptions.map((option) => (
            <FilterChip
              active={activePeriodId === option.id}
              key={option.id}
              label={option.label}
              locale={locale}
              onClick={() => onPeriodChange(option.id)}
            />
          ))}
        </ChipGrid>
      </SidebarSection>

      <SidebarSection
        count={bookCount}
        label={locale === "ko" ? "책 필터" : "Book filter"}
        subtitle={locale === "ko" ? "사건 필터" : "Events filter"}
      >
        <ChipGrid>
          {bookOptions.map((option) => (
            <FilterChip
              active={activeBookId === option.id}
              key={option.id}
              label={option.label}
              locale={locale}
              onClick={() => onBookChange(option.id)}
            />
          ))}
        </ChipGrid>
      </SidebarSection>

      <SidebarSection
        count={placeCount}
        label={locale === "ko" ? "장소 필터" : "Place filter"}
        subtitle={locale === "ko" ? "사건 필터" : "Events filter"}
      >
        <ChipGrid>
          {placeOptions.map((option) => (
            <FilterChip
              active={activePlaceId === option.id}
              key={option.id}
              label={option.label}
              locale={locale}
              onClick={() => onPlaceChange(option.id)}
            />
          ))}
        </ChipGrid>
      </SidebarSection>

      <NavigatorCard title={locale === "ko" ? "한국사 참조" : "Korean History Reference"}>
        <div className="flex flex-wrap gap-1.5">
          <MetaBadge>{locale === "ko" ? "준비 중" : "Planned"}</MetaBadge>
          <MetaBadge>{locale === "ko" ? "출처 검토 필요" : "Source review required"}</MetaBadge>
          <MetaBadge>
            {locale === "ko" ? "성경 해석 근거 아님" : "Not a basis for biblical interpretation"}
          </MetaBadge>
        </div>
      </NavigatorCard>
    </>
  );
}

function BooksNavigator({
  activeSectionKey,
  highlightedSectionKeys,
  locale,
  onSectionSelect,
  sections,
  stats,
}: {
  activeSectionKey?: string;
  highlightedSectionKeys?: string[];
  locale: TimelineLocale;
  onSectionSelect?: (sectionKey: string) => void;
  sections?: TimelineBookSectionNavigationItem[];
  stats?: {
    newTestamentCount: number;
    oldTestamentCount: number;
    totalCount: number;
  };
}) {
  const sectionItems = sections ?? [];
  const highlightedSections = new Set(highlightedSectionKeys ?? []);

  return (
    <>
      <NavigatorCard title={locale === "ko" ? "현재 보기: 책 / 시편" : "Current view: Books / Psalms"}>
        <p className="text-sm leading-6 text-zinc-600">
          {locale === "ko"
            ? "표시 원칙: 시대 / 저자 / 배경 흐름"
            : "Display principle: era / authorship / background flow"}
        </p>
      </NavigatorCard>

      <NavigatorCard title={locale === "ko" ? "66권 전체 skeleton" : "66-book skeleton"}>
        <div className="flex flex-wrap gap-1.5">
          <MetaBadge>{locale === "ko" ? "package 기반 preview" : "Package-backed preview"}</MetaBadge>
          <MetaBadge>{locale === "ko" ? `구약 ${stats?.oldTestamentCount ?? 39}` : `OT ${stats?.oldTestamentCount ?? 39}`}</MetaBadge>
          <MetaBadge>{locale === "ko" ? `신약 ${stats?.newTestamentCount ?? 27}` : `NT ${stats?.newTestamentCount ?? 27}`}</MetaBadge>
          <MetaBadge>{locale === "ko" ? `총 ${stats?.totalCount ?? 66}권` : `${stats?.totalCount ?? 66} books`}</MetaBadge>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {locale === "ko"
            ? "현재 Books / Psalms 보기는 66권 canonical skeleton package를 metadata-only preview로 표시합니다."
            : "The current Books / Psalms view shows the 66-book canonical skeleton package as a metadata-only preview."}
        </p>
      </NavigatorCard>

      <SidebarSection
        count={sectionItems.length}
        defaultOpen
        label={locale === "ko" ? "정경 구간 안내" : "Canonical section guide"}
        subtitle={locale === "ko" ? "package skeleton ready" : "Package skeleton ready"}
      >
        <div className="flex flex-col gap-2">
          {sectionItems.map((section) => {
            const isActive = activeSectionKey === section.sectionKey;
            const isHighlighted = highlightedSections.has(section.sectionKey);
            return (
              <button
                aria-controls={section.sectionId}
                aria-pressed={isActive}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                  isActive
                    ? "border-zinc-900 bg-zinc-950 text-white"
                    : isHighlighted
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-50"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
                )}
                key={section.sectionKey}
                onClick={() => onSectionSelect?.(section.sectionKey)}
                type="button"
              >
                <span className="flex min-w-0 flex-col">
                  <span className={cn("text-sm font-semibold", isActive ? "text-white" : "text-zinc-900")}>
                    {section.label[locale]}
                  </span>
                  <span className={cn("text-xs", isActive ? "text-zinc-200" : "text-zinc-500")}>
                    {section.testament === "OT"
                      ? locale === "ko"
                        ? "구약"
                        : "OT"
                      : locale === "ko"
                        ? "신약"
                        : "NT"}
                  </span>
                </span>
                <span
                  className={cn(
                    "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                    isActive
                      ? "border-white/20 bg-white/10 text-white"
                      : isHighlighted
                        ? "border-emerald-200 bg-white text-emerald-800"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700",
                  )}
                >
                  {section.count}
                </span>
              </button>
            );
          })}
        </div>
      </SidebarSection>
    </>
  );
}

function KingdomsNavigator({
  activeSectionKey,
  highlightedSectionKeys,
  locale,
  onSectionSelect,
  sections,
  stats,
}: {
  activeSectionKey?: string;
  highlightedSectionKeys?: string[];
  locale: TimelineLocale;
  onSectionSelect?: (sectionKey: string) => void;
  sections?: TimelineKingdomSectionNavigationItem[];
  stats?: {
    recordTypeCount: Record<string, number>;
    sectionCount: number;
    totalCount: number;
  };
}) {
  const sectionItems = sections ?? [];
  const highlightedSections = new Set(highlightedSectionKeys ?? []);

  return (
    <>
      <NavigatorCard title={locale === "ko" ? "현재 보기: 왕국 / 제국" : "Current view: Kings / Kingdoms"}>
        <p className="text-sm leading-6 text-zinc-600">{locale === "ko" ? "왕과 왕국 흐름" : "King and kingdom flow"}</p>
      </NavigatorCard>

      <NavigatorCard title={locale === "ko" ? "Skeleton package preview" : "Skeleton package preview"}>
        <div className="flex flex-wrap gap-1.5">
          <MetaBadge>{locale === "ko" ? "package 기반 preview" : "Package-backed preview"}</MetaBadge>
          <MetaBadge>
            {locale === "ko"
              ? `section ${stats?.sectionCount ?? sectionItems.length}`
              : `Sections ${stats?.sectionCount ?? sectionItems.length}`}
          </MetaBadge>
          <MetaBadge>
            {locale === "ko" ? `rows ${stats?.totalCount ?? 0}` : `Rows ${stats?.totalCount ?? 0}`}
          </MetaBadge>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {locale === "ko"
            ? "현재 Kings / Kingdoms 보기는 kings-kingdoms skeleton package를 metadata-only preview로 표시합니다."
            : "The current Kings / Kingdoms view shows the kings-kingdoms skeleton package as a metadata-only preview."}
        </p>
      </NavigatorCard>

      <SidebarSection
        count={sectionItems.length}
        defaultOpen
        label={locale === "ko" ? "왕국 흐름" : "Kingdom Flow"}
        subtitle={locale === "ko" ? "package sections" : "Package sections"}
      >
        <div className="flex flex-col gap-2">
          {sectionItems.map((section) => {
            const isActive = activeSectionKey === section.sectionKey;
            const isHighlighted = highlightedSections.has(section.sectionKey);

            return (
              <button
                aria-controls={section.sectionId}
                aria-pressed={isActive}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
                  isActive
                    ? "border-zinc-900 bg-zinc-950 text-white"
                    : isHighlighted
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-50"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
                )}
                key={section.sectionKey}
                onClick={() => onSectionSelect?.(section.sectionKey)}
                type="button"
              >
                <span className={cn("text-sm font-semibold", isActive ? "text-white" : "text-zinc-900")}>
                  {section.label[locale]}
                </span>
                <span
                  className={cn(
                    "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                    isActive
                      ? "border-white/20 bg-white/10 text-white"
                      : isHighlighted
                        ? "border-emerald-200 bg-white text-emerald-800"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700",
                  )}
                >
                  {section.count}
                </span>
              </button>
            );
          })}
        </div>
      </SidebarSection>

      <NavigatorCard title={locale === "ko" ? "보조 정보 상태" : "Supporting context status"}>
        <div className="space-y-2 text-sm leading-6 text-zinc-600">
          <p>{locale === "ko" ? "성경 근거: reference only" : "Scripture anchors: references only"}</p>
          <p>{locale === "ko" ? "왕정 관계 / 열강: metadata-only" : "Reign relations / empires: metadata only"}</p>
          <p>{locale === "ko" ? "연대 정보: review-gated caution" : "Chronology: review-gated caution"}</p>
        </div>
      </NavigatorCard>
    </>
  );
}

function GenealogyNavigator({ locale }: { locale: TimelineLocale }) {
  const segments =
    locale === "ko"
      ? ["아브라함 → 다윗", "다윗 → 바벨론 포로", "바벨론 포로 → 그리스도"]
      : ["Abraham → David", "David → Deportation", "Deportation → Christ"];
  const observations =
    locale === "ko"
      ? ["이름 차이", "생략 관찰", "구약 왕계보 비교"]
      : ["Name variants", "Omission observations", "OT royal genealogy comparison"];
  const future =
    locale === "ko"
      ? ["누가복음 3장: 준비 중", "창세기 족보: 준비 중", "역대기 족보: 준비 중"]
      : ["Luke 3: planned", "Genesis genealogies: planned", "Chronicles genealogies: planned"];

  return (
    <>
      <NavigatorCard title={locale === "ko" ? "현재 보기: 족보" : "Current view: Genealogy"}>
        <p className="text-sm leading-6 text-zinc-600">
          {locale === "ko" ? "마태복음 1장 구조" : "Matthew 1 Structure"}
        </p>
      </NavigatorCard>

      <SidebarSection
        count={segments.length}
        defaultOpen
        label={locale === "ko" ? "기본 구간" : "Core segments"}
        subtitle={locale === "ko" ? "마태복음 1장" : "Matthew 1"}
      >
        <StaticList items={segments} />
      </SidebarSection>

      <SidebarSection
        count={observations.length}
        label={locale === "ko" ? "비교 관찰" : "Comparison observations"}
        subtitle={locale === "ko" ? "preview" : "Preview"}
      >
        <StaticList items={observations} />
      </SidebarSection>

      <SidebarSection
        count={future.length}
        label={locale === "ko" ? "후속 확장" : "Future coverage"}
        subtitle={locale === "ko" ? "준비 중" : "Planned"}
      >
        <StaticList items={future} />
      </SidebarSection>
    </>
  );
}

function PlacesNavigator({ locale }: { locale: TimelineLocale }) {
  const flowItems =
    locale === "ko"
      ? ["애굽", "시내산 / 광야", "모압 / 요단", "여리고 / 가나안", "유다 / 예루살렘", "블레셋", "바벨론", "바사 / 수산"]
      : [
          "Egypt",
          "Sinai / Wilderness",
          "Moab / Jordan",
          "Jericho / Canaan",
          "Judah / Jerusalem",
          "Philistia",
          "Babylon",
          "Persia / Susa",
        ];

  return (
    <>
      <NavigatorCard title={locale === "ko" ? "현재 보기: 장소 / 개념지도" : "Current view: Places / Schematic Map"}>
        <div className="space-y-1.5 text-sm leading-6 text-zinc-600">
          <p>{locale === "ko" ? "성경 흐름 개념지도" : "Biblical Flow Schematic"}</p>
          <p>{locale === "ko" ? "좌표 지도가 아님" : "Not a coordinate map"}</p>
          <p>{locale === "ko" ? "오늘날 지명은 보조 표기" : "Modern names are supporting references"}</p>
        </div>
      </NavigatorCard>

      <SidebarSection
        count={flowItems.length}
        defaultOpen
        label={locale === "ko" ? "흐름 구간" : "Flow sections"}
        subtitle={locale === "ko" ? "개념지도" : "Schematic"}
      >
        <StaticList items={flowItems} />
      </SidebarSection>
    </>
  );
}

function OverviewNavigator({ locale }: { locale: TimelineLocale }) {
  const items =
    locale === "ko"
      ? [
          "사건: 성경 역사 흐름",
          "책/시편: 책 배경과 표제 근거",
          "왕국/제국: 왕과 선지자, 주변 제국",
          "족보: 마태복음 족보 비교",
          "장소/개념지도: 좌표 없는 성경 흐름 지도",
        ]
      : [
          "Events: biblical history flow",
          "Books / Psalms: book background and superscription basis",
          "Kings / Kingdoms: rulers, prophets, and surrounding empires",
          "Genealogy: Matthew genealogy comparison",
          "Places / Schematic Map: non-coordinate biblical flow map",
        ];

  return (
    <>
      <NavigatorCard title={locale === "ko" ? "작업공간 안내" : "Workspace guide"}>
        <p className="text-sm leading-6 text-zinc-600">
          {locale === "ko"
            ? "상단은 자료 유형, 왼쪽은 탐색, 가운데는 흐름, 오른쪽은 성경 근거 패널입니다."
            : "Tabs choose the material, the left side navigates, the center shows the flow, and the right side shows Scripture evidence."}
        </p>
      </NavigatorCard>

      <SidebarSection
        count={items.length}
        defaultOpen
        label={locale === "ko" ? "보기 안내" : "View guide"}
        subtitle={locale === "ko" ? "개요" : "Overview"}
      >
        <StaticList items={items} />
      </SidebarSection>
    </>
  );
}

function ThemesNavigator({ locale, previewNote }: { locale: TimelineLocale; previewNote: string }) {
  return (
    <>
      <NavigatorCard title={locale === "ko" ? "현재 보기: 주제" : "Current view: Themes"}>
        <div className="flex flex-wrap gap-1.5">
          <MetaBadge>{locale === "ko" ? "준비 중" : "Planned"}</MetaBadge>
          <MetaBadge>{locale === "ko" ? "Preview" : "Preview"}</MetaBadge>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{previewNote}</p>
      </NavigatorCard>
    </>
  );
}

function NavigatorCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

type SidebarSectionProps = {
  children: ReactNode;
  count: number;
  defaultOpen?: boolean;
  label: string;
  subtitle: string;
};

function SidebarSection({
  children,
  count,
  defaultOpen,
  label,
  subtitle,
}: SidebarSectionProps) {
  return (
    <details className="group rounded-xl border border-zinc-200 bg-white p-3" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-600">
            {label}
          </p>
          <p className="mt-0.5 text-[11px] font-medium tracking-normal text-zinc-400">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
            {count}
          </span>
          <span
            aria-hidden="true"
            className="text-xs font-semibold text-zinc-400 transition-transform duration-200 group-open:rotate-180"
          >
            ▾
          </span>
        </div>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function ChipGrid({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function FilterChip({
  active,
  label,
  locale,
  onClick,
}: {
  active: boolean;
  label: string;
  locale: TimelineLocale;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-10 cursor-pointer items-center rounded-md border px-3 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
        active
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white",
      )}
      onClick={onClick}
      type="button"
    >
      <span className="max-w-[12rem] truncate">{label}</span>
      {active ? (
        <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-80">
          {locale === "ko" ? "선택됨" : "Selected"}
        </span>
      ) : null}
    </button>
  );
}

function StaticList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
          key={item}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function MetaBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
      {children}
    </span>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
      {children}
    </span>
  );
}

const navigatorCopy = {
  en: {
    title: "Timeline Navigator",
    subtitle: "Navigate periods and related items within the current view.",
  },
  ko: {
    title: "성경 흐름 탐색",
    subtitle: "현재 보기 안에서 시대 구간과 관련 항목을 탐색합니다.",
  },
} as const;

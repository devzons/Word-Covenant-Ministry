export type TimelineLocale = "en" | "ko";

export type TimelineText = {
  en: string;
  ko: string;
};

export type PassionWeekTimelineEvent = {
  id: string;
  title: TimelineText;
  period: TimelineText;
  eventType: TimelineText;
  sequenceLabel: TimelineText;
  confidenceLabel: TimelineText;
  datingMode: TimelineText;
  datingNote: TimelineText;
  scriptureAnchor: TimelineText;
  reader: {
    book: string;
    chapter: number;
    verse: number;
    translation: Record<TimelineLocale, string>;
  };
};

export const passionWeekTimelineEvents: PassionWeekTimelineEvent[] = [
  {
    id: "triumphal-entry",
    title: {
      en: "Triumphal Entry",
      ko: "예루살렘 입성",
    },
    period: {
      en: "Passion Week",
      ko: "수난 주간",
    },
    eventType: {
      en: "Gospel event",
      ko: "복음서 사건",
    },
    sequenceLabel: {
      en: "Before temple cleansing",
      ko: "성전 정화 이전",
    },
    confidenceLabel: {
      en: "Scripture anchor: High",
      ko: "본문 근거: 높음",
    },
    datingMode: {
      en: "Dating: Internal biblical sequence",
      ko: "연대: 성경 내부 순서",
    },
    datingNote: {
      en: "External chronology is not shown in this MVP.",
      ko: "외부 연대는 이 MVP에서 표시하지 않습니다.",
    },
    scriptureAnchor: {
      en: "Matthew 21:1-11",
      ko: "마태복음 21:1-11",
    },
    reader: {
      book: "matthew",
      chapter: 21,
      verse: 1,
      translation: {
        en: "WEB",
        ko: "KRV",
      },
    },
  },
  {
    id: "temple-cleansing",
    title: {
      en: "Temple Cleansing",
      ko: "성전 정화",
    },
    period: {
      en: "Passion Week",
      ko: "수난 주간",
    },
    eventType: {
      en: "Gospel event",
      ko: "복음서 사건",
    },
    sequenceLabel: {
      en: "After the entry",
      ko: "입성 후",
    },
    confidenceLabel: {
      en: "Scripture anchor: High",
      ko: "본문 근거: 높음",
    },
    datingMode: {
      en: "Dating: Internal biblical sequence",
      ko: "연대: 성경 내부 순서",
    },
    datingNote: {
      en: "External chronology is not shown in this MVP.",
      ko: "외부 연대는 이 MVP에서 표시하지 않습니다.",
    },
    scriptureAnchor: {
      en: "Matthew 21:12-17",
      ko: "마태복음 21:12-17",
    },
    reader: {
      book: "matthew",
      chapter: 21,
      verse: 12,
      translation: {
        en: "WEB",
        ko: "KRV",
      },
    },
  },
  {
    id: "last-supper",
    title: {
      en: "Last Supper",
      ko: "최후의 만찬",
    },
    period: {
      en: "Passion Week",
      ko: "수난 주간",
    },
    eventType: {
      en: "Gospel event",
      ko: "복음서 사건",
    },
    sequenceLabel: {
      en: "Before Gethsemane",
      ko: "겟세마네 이전",
    },
    confidenceLabel: {
      en: "Scripture anchor: High",
      ko: "본문 근거: 높음",
    },
    datingMode: {
      en: "Dating: Internal biblical sequence",
      ko: "연대: 성경 내부 순서",
    },
    datingNote: {
      en: "External chronology is not shown in this MVP.",
      ko: "외부 연대는 이 MVP에서 표시하지 않습니다.",
    },
    scriptureAnchor: {
      en: "Matthew 26:17-35",
      ko: "마태복음 26:17-35",
    },
    reader: {
      book: "matthew",
      chapter: 26,
      verse: 17,
      translation: {
        en: "WEB",
        ko: "KRV",
      },
    },
  },
  {
    id: "gethsemane",
    title: {
      en: "Gethsemane",
      ko: "겟세마네",
    },
    period: {
      en: "Passion Week",
      ko: "수난 주간",
    },
    eventType: {
      en: "Gospel event",
      ko: "복음서 사건",
    },
    sequenceLabel: {
      en: "Before the arrest",
      ko: "체포 이전",
    },
    confidenceLabel: {
      en: "Scripture anchor: High",
      ko: "본문 근거: 높음",
    },
    datingMode: {
      en: "Dating: Internal biblical sequence",
      ko: "연대: 성경 내부 순서",
    },
    datingNote: {
      en: "External chronology is not shown in this MVP.",
      ko: "외부 연대는 이 MVP에서 표시하지 않습니다.",
    },
    scriptureAnchor: {
      en: "Matthew 26:36-46",
      ko: "마태복음 26:36-46",
    },
    reader: {
      book: "matthew",
      chapter: 26,
      verse: 36,
      translation: {
        en: "WEB",
        ko: "KRV",
      },
    },
  },
  {
    id: "trial",
    title: {
      en: "Trial",
      ko: "재판",
    },
    period: {
      en: "Passion Week",
      ko: "수난 주간",
    },
    eventType: {
      en: "Gospel event",
      ko: "복음서 사건",
    },
    sequenceLabel: {
      en: "Before crucifixion",
      ko: "십자가형 이전",
    },
    confidenceLabel: {
      en: "Scripture anchor: High",
      ko: "본문 근거: 높음",
    },
    datingMode: {
      en: "Dating: Internal biblical sequence",
      ko: "연대: 성경 내부 순서",
    },
    datingNote: {
      en: "External chronology is not shown in this MVP.",
      ko: "외부 연대는 이 MVP에서 표시하지 않습니다.",
    },
    scriptureAnchor: {
      en: "Matthew 27:11-31",
      ko: "마태복음 27:11-31",
    },
    reader: {
      book: "matthew",
      chapter: 27,
      verse: 11,
      translation: {
        en: "WEB",
        ko: "KRV",
      },
    },
  },
  {
    id: "crucifixion",
    title: {
      en: "Crucifixion",
      ko: "십자가형",
    },
    period: {
      en: "Passion Week",
      ko: "수난 주간",
    },
    eventType: {
      en: "Gospel event",
      ko: "복음서 사건",
    },
    sequenceLabel: {
      en: "After the trial",
      ko: "재판 후",
    },
    confidenceLabel: {
      en: "Scripture anchor: High",
      ko: "본문 근거: 높음",
    },
    datingMode: {
      en: "Dating: Internal biblical sequence",
      ko: "연대: 성경 내부 순서",
    },
    datingNote: {
      en: "External chronology is not shown in this MVP.",
      ko: "외부 연대는 이 MVP에서 표시하지 않습니다.",
    },
    scriptureAnchor: {
      en: "Matthew 27:32-56",
      ko: "마태복음 27:32-56",
    },
    reader: {
      book: "matthew",
      chapter: 27,
      verse: 32,
      translation: {
        en: "WEB",
        ko: "KRV",
      },
    },
  },
  {
    id: "burial",
    title: {
      en: "Burial",
      ko: "장사",
    },
    period: {
      en: "Passion Week",
      ko: "수난 주간",
    },
    eventType: {
      en: "Gospel event",
      ko: "복음서 사건",
    },
    sequenceLabel: {
      en: "Before the resurrection",
      ko: "부활 이전",
    },
    confidenceLabel: {
      en: "Scripture anchor: High",
      ko: "본문 근거: 높음",
    },
    datingMode: {
      en: "Dating: Internal biblical sequence",
      ko: "연대: 성경 내부 순서",
    },
    datingNote: {
      en: "External chronology is not shown in this MVP.",
      ko: "외부 연대는 이 MVP에서 표시하지 않습니다.",
    },
    scriptureAnchor: {
      en: "Matthew 27:57-66",
      ko: "마태복음 27:57-66",
    },
    reader: {
      book: "matthew",
      chapter: 27,
      verse: 57,
      translation: {
        en: "WEB",
        ko: "KRV",
      },
    },
  },
  {
    id: "resurrection",
    title: {
      en: "Resurrection",
      ko: "부활",
    },
    period: {
      en: "Passion Week",
      ko: "수난 주간",
    },
    eventType: {
      en: "Gospel event",
      ko: "복음서 사건",
    },
    sequenceLabel: {
      en: "After the burial",
      ko: "장사 후",
    },
    confidenceLabel: {
      en: "Scripture anchor: High",
      ko: "본문 근거: 높음",
    },
    datingMode: {
      en: "Dating: Internal biblical sequence",
      ko: "연대: 성경 내부 순서",
    },
    datingNote: {
      en: "External chronology is not shown in this MVP.",
      ko: "외부 연대는 이 MVP에서 표시하지 않습니다.",
    },
    scriptureAnchor: {
      en: "Matthew 28:1-10",
      ko: "마태복음 28:1-10",
    },
    reader: {
      book: "matthew",
      chapter: 28,
      verse: 1,
      translation: {
        en: "WEB",
        ko: "KRV",
      },
    },
  },
];

export function getTimelineText(text: TimelineText, locale: TimelineLocale): string {
  return text[locale];
}

export function getTimelineReaderHref(
  event: PassionWeekTimelineEvent,
  locale: TimelineLocale,
): string {
  const translation = event.reader.translation[locale];

  return `/${locale}/bible/${translation}/${event.reader.book}/${event.reader.chapter}?mode=reader#v${event.reader.verse}`;
}

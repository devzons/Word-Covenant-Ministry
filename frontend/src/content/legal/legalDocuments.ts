import { siteConfig } from "@/config/site";

export type LegalLocale = "en" | "ko";
export type LegalDocumentType = "terms" | "privacy";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  documentType: LegalDocumentType;
  version: string;
  lastUpdated: string;
  title: string;
  description: string;
  intro: string[];
  contactNotice: string[];
  sections: LegalSection[];
};

export const legalDocumentMetadata = {
  version: "1.0",
  lastUpdated: "2026-07-26",
} as const;

export function getLegalDocument(locale: string, documentType: LegalDocumentType): LegalDocument {
  const activeLocale: LegalLocale = locale === "en" ? "en" : "ko";

  if (documentType === "terms") {
    return termsDocuments[activeLocale];
  }

  return privacyDocuments[activeLocale];
}

export function getLegalPath(locale: string, documentType: LegalDocumentType): string {
  const activeLocale = locale === "en" ? "en" : "ko";
  return `/${activeLocale}/${documentType}`;
}

export function getLegalLinkLabels(locale: string): Record<LegalDocumentType, string> {
  const activeLocale = locale === "en" ? "en" : "ko";

  return activeLocale === "en"
    ? {
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      }
    : {
        privacy: "개인정보 처리방침",
        terms: "이용약관",
      };
}

const sharedFacts = {
  accountDataEn:
    "If you use account-based features, the service may process your account identifier, display name, email address, authentication session state, REST nonce session state, password reset workflow data, and your private verse notes.",
  accountDataKo:
    "계정 기반 기능을 사용할 경우 서비스는 계정 식별 정보, 표시 이름, 이메일 주소, 인증 세션 상태, REST nonce 세션 상태, 비밀번호 재설정 처리 정보, 개인 구절 노트를 처리할 수 있습니다.",
  contactEn:
    "Questions about these documents, account privacy, or personal information handling should be directed through the public contact information that Word Covenant Ministry publishes on this site. A dedicated public privacy email address or postal address is not separately identified in the current repository-backed draft.",
  contactKo:
    "이 문서, 계정 개인정보, 또는 개인정보 처리에 관한 문의는 Word Covenant Ministry가 사이트에 게시하는 공개 연락 방법을 통해 접수해야 합니다. 현재 저장소 기준 초안에는 별도의 공개 개인정보 전용 이메일 주소나 우편 주소가 따로 확인되지 않습니다.",
  rightsEn:
    "Scripture texts, source datasets, and study data may be subject to the rights and license terms of their respective owners or licensors. Word Covenant Ministry does not claim ownership over every Bible translation or source dataset used by the service.",
  rightsKo:
    "성경 본문, 원천 데이터, 연구 데이터는 각 권리자 또는 라이선스 제공자의 권리와 사용 조건을 따를 수 있습니다. Word Covenant Ministry는 서비스에서 사용하는 모든 성경 번역본이나 원천 데이터에 대해 일괄적인 소유권을 주장하지 않습니다.",
  serviceEn:
    `${siteConfig.name} is a Scripture-centered reading and study platform that provides Bible reading, search, timeline, chapter context, original-language tools, cross-reference study, and private verse notes.`,
  serviceKo:
    `${siteConfig.name}는 성경 읽기, 검색, 타임라인, 장별 문맥, 원어 도구, 관련 구절 연구, 개인 구절 노트를 제공하는 성경 중심 읽기·연구 플랫폼입니다.`,
  siteUrlEn: `The public production site address documented in this repository is ${siteConfig.productionUrl}.`,
  siteUrlKo: `이 저장소에 문서화된 공개 운영 사이트 주소는 ${siteConfig.productionUrl}입니다.`,
} as const;

const termsDocuments: Record<LegalLocale, LegalDocument> = {
  en: {
    documentType: "terms",
    version: legalDocumentMetadata.version,
    lastUpdated: legalDocumentMetadata.lastUpdated,
    title: "Terms of Service",
    description:
      "Review the service terms that apply to Bible reading, account use, and private verse notes on Word Covenant Ministry.",
    intro: [
      sharedFacts.serviceEn,
      "These Terms of Service govern your access to and use of the site, account-based features, and supporting study tools made available through Word Covenant Ministry.",
    ],
    contactNotice: [sharedFacts.contactEn],
    sections: [
      {
        id: "purpose",
        title: "1. Purpose and scope",
        paragraphs: [
          "These terms explain the rules that apply when you access or use the site, its account features, and related study tools.",
          "These terms work together with the Privacy Policy. If you use the service, you should read both documents.",
        ],
      },
      {
        id: "service-nature",
        title: "2. Nature of the service",
        paragraphs: [
          sharedFacts.serviceEn,
          "The service is designed for Bible reading, study, education, and faith-related reference. It does not replace careful personal study, pastoral care, or professional advice in medical, legal, financial, or other regulated fields.",
        ],
      },
      {
        id: "accounts",
        title: "3. Accounts",
        paragraphs: [
          "Some features require a user account and an authenticated session.",
          "You are responsible for keeping your account information accurate, protecting your password, and notifying the service promptly if you believe your account has been accessed improperly.",
          "You may not share account access in a way that exposes another person's private notes or authenticated features.",
        ],
      },
      {
        id: "permitted-use",
        title: "4. Permitted use",
        paragraphs: [
          "You may use the service for personal Bible reading, teaching preparation, ministry study, education, and ordinary link sharing.",
        ],
        bullets: [
          "read Scripture and related study material through the site interface",
          "use search, timeline, context, and original-language tools for normal study purposes",
          "create and manage your own private verse notes through your authenticated account",
        ],
      },
      {
        id: "prohibited-use",
        title: "5. Prohibited use",
        paragraphs: [
          "You may not use the service in ways that harm the platform, other users, or the rights of content owners.",
        ],
        bullets: [
          "attempting unauthorized access, credential theft, or privilege bypass",
          "sending malicious code, interfering with service availability, or generating excessive automated traffic",
          "attempting to access another user's private notes or account data",
          "bulk copying or redistributing protected content in violation of applicable rights or license terms",
          "misrepresenting the site as an official publisher edition or official institution of a denomination or ministry body when it is not presented that way",
        ],
      },
      {
        id: "private-notes",
        title: "6. Private verse notes",
        paragraphs: [
          "Private verse notes are personal account features tied to a specific verse reference and translation.",
          "You are responsible for the content you write in your notes. The service does not promise permanent preservation, uninterrupted access, or archival storage.",
          "If a note is important to you, maintain your own backup outside the service.",
        ],
      },
      {
        id: "scripture-rights",
        title: "7. Scripture texts and content rights",
        paragraphs: [
          sharedFacts.rightsEn,
          "Word Covenant Ministry owns its own site presentation, interface design, and original ministry-authored explanatory structure to the extent allowed by law, but that does not transfer ownership of third-party Bible texts or source datasets.",
        ],
      },
      {
        id: "service-changes",
        title: "8. Service changes and availability",
        paragraphs: [
          "The service may change features, update data packages, correct errors, add or remove study tools, or perform maintenance at any time.",
          "Continuous availability, error-free operation, and permanent retention of every feature are not guaranteed.",
        ],
      },
      {
        id: "restrictions",
        title: "9. Account restriction or termination",
        paragraphs: [
          "Word Covenant Ministry may limit or suspend access when reasonably necessary to protect the service, respond to security concerns, or address serious misuse of the platform.",
          "Where practical, the service may provide notice or context, but immediate action may be necessary in some cases.",
        ],
      },
      {
        id: "disclaimer",
        title: "10. Disclaimer of warranties",
        paragraphs: [
          "The service is provided on an as-available basis to the extent permitted by applicable law.",
          "Study materials, timeline context, original-language aids, and related references may contain mistakes, omissions, or judgments that are later revised.",
        ],
      },
      {
        id: "liability",
        title: "11. Limitation of liability",
        paragraphs: [
          "To the extent permitted by applicable law, Word Covenant Ministry is not liable for indirect, incidental, special, consequential, or similar losses arising from your use of the service.",
          "Nothing in these terms excludes liability that cannot legally be excluded under applicable law.",
        ],
      },
      {
        id: "changes",
        title: "12. Changes to these terms",
        paragraphs: [
          "If these terms change materially, the service may update the page, the document version, the last-updated date, or other site notices.",
          "Your continued use of the service after updated terms are published means the updated terms apply to your later use of the service.",
        ],
      },
      {
        id: "contact",
        title: "13. Questions",
        paragraphs: [sharedFacts.contactEn, sharedFacts.siteUrlEn],
      },
    ],
  },
  ko: {
    documentType: "terms",
    version: legalDocumentMetadata.version,
    lastUpdated: legalDocumentMetadata.lastUpdated,
    title: "이용약관",
    description:
      "Word Covenant Ministry에서 제공하는 성경 읽기, 계정 기능, 개인 노트 이용 조건을 확인하세요.",
    intro: [
      sharedFacts.serviceKo,
      "이 이용약관은 사이트, 계정 기반 기능, 그리고 관련 연구 도구를 이용할 때 적용되는 기본 규칙을 설명합니다.",
    ],
    contactNotice: [sharedFacts.contactKo],
    sections: [
      {
        id: "purpose",
        title: "1. 목적 및 적용 범위",
        paragraphs: [
          "이 약관은 사이트와 계정 기능, 그리고 관련 연구 도구를 이용할 때 적용되는 규칙을 설명합니다.",
          "이 약관은 개인정보 처리방침과 함께 읽어야 하며, 서비스를 이용하는 경우 두 문서가 모두 적용됩니다.",
        ],
      },
      {
        id: "service-nature",
        title: "2. 서비스의 성격",
        paragraphs: [
          sharedFacts.serviceKo,
          "이 서비스는 성경 읽기, 교육, 연구, 신앙적 참고를 돕기 위한 도구입니다. 의료, 법률, 재정 등 규제된 전문 조언이나 목회적 돌봄을 대체하지 않습니다.",
        ],
      },
      {
        id: "accounts",
        title: "3. 계정",
        paragraphs: [
          "일부 기능은 사용자 계정과 인증된 세션이 필요합니다.",
          "사용자는 계정 정보의 정확성을 유지하고, 비밀번호를 보호하며, 비정상 접근이 의심되면 즉시 알려야 합니다.",
          "다른 사람의 개인 노트나 인증 기능이 노출되는 방식의 계정 공유는 허용되지 않습니다.",
        ],
      },
      {
        id: "permitted-use",
        title: "4. 허용되는 이용",
        paragraphs: [
          "사용자는 개인 성경 읽기, 교육, 설교 준비, 말씀 연구, 일반적인 링크 공유를 위해 서비스를 이용할 수 있습니다.",
        ],
        bullets: [
          "사이트 인터페이스를 통해 성경 본문과 연구 자료를 읽는 행위",
          "검색, 타임라인, 문맥, 원어 도구를 정상적인 연구 목적으로 사용하는 행위",
          "인증된 계정으로 자신의 개인 구절 노트를 작성·수정·삭제하는 행위",
        ],
      },
      {
        id: "prohibited-use",
        title: "5. 금지되는 이용",
        paragraphs: [
          "서비스, 다른 사용자, 또는 콘텐츠 권리자의 권리를 해치는 방식의 이용은 허용되지 않습니다.",
        ],
        bullets: [
          "무단 접근, 자격 증명 탈취, 권한 우회 시도",
          "악성 코드 전송, 서비스 방해, 과도한 자동 요청",
          "다른 사용자의 개인 노트나 계정 정보에 접근하려는 시도",
          "적용 가능한 권리·라이선스 조건을 위반하는 대량 복제 또는 재배포",
          "사이트를 공식 성경 출판사나 특정 교단·기관의 공식 서비스처럼 허위 표시하는 행위",
        ],
      },
      {
        id: "private-notes",
        title: "6. 개인 노트",
        paragraphs: [
          "개인 노트는 특정 번역본과 구절에 연결되는 계정 기반 private 기능입니다.",
          "노트에 입력하는 내용의 책임은 사용자에게 있습니다. 서비스는 영구 보존, 무중단 접근, 보관용 저장을 보장하지 않습니다.",
          "중요한 노트는 사용자가 별도로 백업해 두는 것이 좋습니다.",
        ],
      },
      {
        id: "scripture-rights",
        title: "7. 성경 본문 및 콘텐츠 권리",
        paragraphs: [
          sharedFacts.rightsKo,
          "Word Covenant Ministry는 사이트 UI, 인터페이스 구성, 자체 작성 연구 구조에 관한 권리를 가질 수 있지만, 제3자 성경 본문이나 원천 데이터의 소유권까지 이전받는 것은 아닙니다.",
        ],
      },
      {
        id: "service-changes",
        title: "8. 서비스 변경 및 중단",
        paragraphs: [
          "서비스는 기능 변경, 데이터 패키지 업데이트, 오류 수정, 연구 도구 추가·제거, 유지보수를 수행할 수 있습니다.",
          "지속적인 무중단 운영, 오류 없는 동작, 모든 기능의 영구 보존은 보장되지 않습니다.",
        ],
      },
      {
        id: "restrictions",
        title: "9. 계정 제한 또는 종료",
        paragraphs: [
          "보안 보호, 서비스 안정성 유지, 중대한 오용 대응을 위해 필요한 경우 접근이 제한되거나 중단될 수 있습니다.",
          "가능한 경우 사유를 안내할 수 있지만, 일부 상황에서는 즉시 조치가 필요할 수 있습니다.",
        ],
      },
      {
        id: "disclaimer",
        title: "10. 보증 부인",
        paragraphs: [
          "적용 가능한 법률이 허용하는 범위에서 서비스는 제공 가능한 상태로 제공됩니다.",
          "연구 자료, 타임라인 문맥, 원어 보조 정보, 관련 참고 자료에는 오류·누락·후속 수정 가능성이 있습니다.",
        ],
      },
      {
        id: "liability",
        title: "11. 책임 제한",
        paragraphs: [
          "적용 가능한 법률이 허용하는 범위에서 Word Covenant Ministry는 서비스 이용으로 인한 간접적·부수적·특별·결과적 손실에 대해 책임을 지지 않습니다.",
          "법률상 배제할 수 없는 책임까지 제한하는 것은 아닙니다.",
        ],
      },
      {
        id: "changes",
        title: "12. 약관 변경",
        paragraphs: [
          "약관이 중요하게 변경되면 페이지 내용, 문서 버전, 최종 수정일, 또는 사이트 고지를 통해 반영될 수 있습니다.",
          "업데이트된 약관 게시 후 서비스를 계속 이용하면 이후 이용에는 새 약관이 적용됩니다.",
        ],
      },
      {
        id: "contact",
        title: "13. 문의",
        paragraphs: [sharedFacts.contactKo, sharedFacts.siteUrlKo],
      },
    ],
  },
};

const privacyDocuments: Record<LegalLocale, LegalDocument> = {
  en: {
    documentType: "privacy",
    version: legalDocumentMetadata.version,
    lastUpdated: legalDocumentMetadata.lastUpdated,
    title: "Privacy Policy",
    description:
      "Review how Word Covenant Ministry handles account data, session information, password reset flows, and private verse notes.",
    intro: [
      "This Privacy Policy describes how Word Covenant Ministry processes information when you use the site, account-based features, password reset tools, and private verse notes.",
      sharedFacts.siteUrlEn,
    ],
    contactNotice: [sharedFacts.contactEn],
    sections: [
      {
        id: "scope",
        title: "1. Scope",
        paragraphs: [
          "This policy applies to Word Covenant Ministry site features, including account access, password reset workflows, and private verse notes.",
        ],
      },
      {
        id: "account-information",
        title: "2. Information the service processes",
        paragraphs: [
          sharedFacts.accountDataEn,
          "WordPress manages password hashing and core account authentication. The service does not store your plain-text password as an application-owned field.",
        ],
      },
      {
        id: "session-and-authentication",
        title: "3. Authentication and session data",
        paragraphs: [
          "The service uses WordPress session and authentication cookies together with REST nonce protection for authenticated note requests.",
          "Password reset links are generated through the WordPress password reset workflow and are intended to expire under the underlying WordPress reset mechanism.",
        ],
      },
      {
        id: "private-notes",
        title: "4. Private verse notes",
        paragraphs: [
          "If you use private verse notes, the service stores the note text you write together with the associated translation, book, chapter, verse, and created/updated timestamps.",
          "Private verse notes are designed to be visible only to the authenticated account owner through the private notes API surface.",
        ],
      },
      {
        id: "technical-data",
        title: "5. Technical and operational data",
        paragraphs: [
          "The service and its underlying web infrastructure may process technical request information such as IP address, user agent, request time, request route, and security or error log data as part of normal site operation and protection.",
          "The exact production log retention period is not identified in the current repository-backed draft.",
        ],
      },
      {
        id: "purposes",
        title: "6. Why the service processes information",
        paragraphs: [
          "Information is processed to provide account access, maintain authenticated sessions, issue password reset messages, store private verse notes, protect the service, investigate errors, and improve site operation.",
        ],
      },
      {
        id: "cookies",
        title: "7. Cookies",
        paragraphs: [
          "The service uses essential authentication and session cookies through WordPress account handling.",
          "If you block essential cookies, authenticated features such as login state and private verse notes may not function correctly.",
          "A separate cookie-consent banner is not part of the current implementation covered by this draft.",
        ],
      },
      {
        id: "sharing",
        title: "8. Sharing and service providers",
        paragraphs: [
          "Word Covenant Ministry may rely on hosting, infrastructure, security, and email-delivery providers that process information on behalf of the service as needed to operate the platform.",
          "The current repository-backed draft does not confirm the exact production provider names for hosting, email delivery, or operational logging.",
          "The service does not present itself as selling personal information or using private verse notes for behavioral advertising.",
        ],
      },
      {
        id: "retention",
        title: "9. Retention",
        paragraphs: [
          "Account-related information may be retained while the account remains active and for a reasonable period afterward when necessary for security, dispute handling, or legal obligations.",
          "Private verse notes remain available until they are deleted by the user or otherwise removed under account-related handling.",
          "Password reset material is intended to expire through the underlying WordPress reset flow rather than remain permanently valid.",
        ],
      },
      {
        id: "access-and-deletion",
        title: "10. Access, correction, and deletion",
        paragraphs: [
          "Users can create, edit, and delete their own private verse notes through the existing authenticated note workflow.",
          "This repository-backed draft does not confirm a self-service account deletion feature. Requests about personal information handling should be directed through the public contact method published on the site.",
        ],
      },
      {
        id: "security",
        title: "11. Security",
        paragraphs: [
          "The current implementation uses account authentication, REST nonce checks for authenticated note actions, ownership checks for private note access, and ordinary access-control boundaries.",
          "No online service can promise perfect security, and this policy does not guarantee that every incident can be prevented.",
        ],
      },
      {
        id: "children",
        title: "12. Children's privacy",
        paragraphs: [
          "The service is not designed as an account platform specifically for children under 13, and it does not aim to knowingly collect personal information from children without appropriate permission.",
        ],
      },
      {
        id: "changes",
        title: "13. Changes to this policy",
        paragraphs: [
          "If this policy changes materially, the service may update the page, document version, last-updated date, or other site notices.",
        ],
      },
      {
        id: "contact",
        title: "14. Questions",
        paragraphs: [sharedFacts.contactEn],
      },
    ],
  },
  ko: {
    documentType: "privacy",
    version: legalDocumentMetadata.version,
    lastUpdated: legalDocumentMetadata.lastUpdated,
    title: "개인정보 처리방침",
    description:
      "Word Covenant Ministry가 계정 정보, 세션 정보, 비밀번호 재설정, 개인 구절 노트를 어떻게 처리하는지 확인하세요.",
    intro: [
      "이 개인정보 처리방침은 Word Covenant Ministry가 사이트, 계정 기반 기능, 비밀번호 재설정 도구, 개인 구절 노트를 이용할 때 어떤 정보를 처리하는지 설명합니다.",
      sharedFacts.siteUrlKo,
    ],
    contactNotice: [sharedFacts.contactKo],
    sections: [
      {
        id: "scope",
        title: "1. 적용 범위",
        paragraphs: [
          "이 방침은 계정 접근, 비밀번호 재설정, 개인 구절 노트를 포함한 Word Covenant Ministry 사이트 기능에 적용됩니다.",
        ],
      },
      {
        id: "account-information",
        title: "2. 수집하거나 처리하는 정보",
        paragraphs: [
          sharedFacts.accountDataKo,
          "비밀번호 해싱과 핵심 인증 처리는 WordPress가 담당합니다. 서비스는 원문 비밀번호를 애플리케이션 소유 데이터로 저장하지 않습니다.",
        ],
      },
      {
        id: "session-and-authentication",
        title: "3. 인증 및 세션 정보",
        paragraphs: [
          "서비스는 인증된 노트 요청을 보호하기 위해 WordPress 세션/인증 쿠키와 REST nonce를 함께 사용합니다.",
          "비밀번호 재설정 링크는 WordPress 비밀번호 재설정 흐름을 통해 생성되며, WordPress의 재설정 메커니즘에 따라 만료되도록 설계됩니다.",
        ],
      },
      {
        id: "private-notes",
        title: "4. 개인 구절 노트",
        paragraphs: [
          "개인 구절 노트를 사용하면 노트 본문과 함께 번역본, 성경 책, 장, 절, 생성·수정 시각이 저장됩니다.",
          "개인 구절 노트는 인증된 계정 소유자만 접근할 수 있는 private API 범위 안에서 제공됩니다.",
        ],
      },
      {
        id: "technical-data",
        title: "5. 기술 및 운영 정보",
        paragraphs: [
          "서비스와 그 기반 인프라는 일반적인 운영과 보안을 위해 IP 주소, user agent, 요청 시각, 요청 경로, 오류 또는 보안 로그와 같은 기술적 요청 정보를 처리할 수 있습니다.",
          "현재 저장소 기준 초안에는 production 로그의 정확한 보관 기간이 명시되어 있지 않습니다.",
        ],
      },
      {
        id: "purposes",
        title: "6. 이용 목적",
        paragraphs: [
          "개인정보는 계정 제공, 인증 세션 유지, 비밀번호 재설정 안내, 개인 노트 저장, 서비스 보호, 오류 진단, 운영 개선을 위해 처리됩니다.",
        ],
      },
      {
        id: "cookies",
        title: "7. 쿠키",
        paragraphs: [
          "서비스는 WordPress 계정 처리 과정에서 필수적인 인증 및 세션 쿠키를 사용합니다.",
          "필수 쿠키를 차단하면 로그인 상태나 개인 노트와 같은 인증 기능이 정상적으로 동작하지 않을 수 있습니다.",
          "현재 구현 범위에는 별도의 쿠키 동의 배너가 포함되어 있지 않습니다.",
        ],
      },
      {
        id: "sharing",
        title: "8. 공유 및 제공",
        paragraphs: [
          "Word Covenant Ministry는 서비스 운영을 위해 필요한 범위에서 호스팅, 인프라, 보안, 이메일 전달 제공자를 이용할 수 있습니다.",
          "현재 저장소 기준 초안에는 production 호스팅, 이메일 전달, 운영 로그 제공자의 정확한 회사명이 확정되어 있지 않습니다.",
          "서비스는 개인정보를 판매하거나 private verse notes를 행동 기반 광고 목적으로 사용한다고 표시하지 않습니다.",
        ],
      },
      {
        id: "retention",
        title: "9. 보관 기간",
        paragraphs: [
          "계정 관련 정보는 계정이 유지되는 동안, 그리고 보안·분쟁 대응·법적 의무를 위해 합리적으로 필요한 기간 동안 보관될 수 있습니다.",
          "개인 구절 노트는 사용자가 삭제하거나 계정 관련 처리에 따라 제거될 때까지 유지될 수 있습니다.",
          "비밀번호 재설정 정보는 영구적으로 유효하지 않으며 WordPress 재설정 흐름에 따라 만료되도록 설계됩니다.",
        ],
      },
      {
        id: "access-and-deletion",
        title: "10. 열람·정정·삭제",
        paragraphs: [
          "사용자는 현재 인증된 노트 기능을 통해 자신의 개인 구절 노트를 작성, 수정, 삭제할 수 있습니다.",
          "현재 저장소 기준 초안에는 self-service 계정 삭제 기능이 확인되지 않았습니다. 개인정보 처리 관련 요청은 사이트에 게시된 공개 연락 방법을 통해 접수해야 합니다.",
        ],
      },
      {
        id: "security",
        title: "11. 보안",
        paragraphs: [
          "현재 구현은 계정 인증, 인증된 노트 동작에 대한 REST nonce 확인, private note ownership check, 일반적인 접근 제어 경계를 사용합니다.",
          "어떤 온라인 서비스도 완전한 보안을 보장할 수 없으며, 이 방침 역시 모든 사고를 완전히 방지한다고 약속하지 않습니다.",
        ],
      },
      {
        id: "children",
        title: "12. 아동의 개인정보",
        paragraphs: [
          "이 서비스는 13세 미만 아동을 위한 계정 플랫폼으로 특별히 설계된 것은 아니며, 적절한 허가 없이 아동의 개인정보를 고의로 수집하려는 목적을 두고 있지 않습니다.",
        ],
      },
      {
        id: "changes",
        title: "13. 방침 변경",
        paragraphs: [
          "이 방침이 중요하게 변경되면 페이지 내용, 문서 버전, 최종 수정일, 또는 사이트 고지를 통해 반영될 수 있습니다.",
        ],
      },
      {
        id: "contact",
        title: "14. 문의",
        paragraphs: [sharedFacts.contactKo],
      },
    ],
  },
};

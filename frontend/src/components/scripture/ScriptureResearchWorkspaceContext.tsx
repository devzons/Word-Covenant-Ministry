"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { ResearchPanelSection } from "@/components/scripture/ResearchPanelNavigation";
import type {
  OriginalLanguageReaderMode,
  OriginalLanguageSourceDataset,
} from "@/types/original-language";

export type ScriptureResearchSourceSurface =
  | "reader"
  | "search"
  | "original"
  | "interlinear"
  | "word_study"
  | "cross_reference"
  | "gospel_harmony"
  | "preview_modal";

export type ScriptureResearchReferenceRange = {
  book: string;
  startChapter: number;
  startVerse: number;
  endChapter?: number;
  endVerse?: number;
};

export type ScriptureResearchOriginalTermContext = {
  occurrenceId?: number;
  reference?: ScriptureResearchReferenceRange;
  source?: OriginalLanguageSourceDataset | string;
  strongsNumber?: string;
  termId?: number;
};

export type ScriptureResearchWorkspaceContextValue = {
  activeResearchSection: ResearchPanelSection;
  book: string;
  chapter: number;
  harmonyUnitId?: string;
  locale: string;
  mode: OriginalLanguageReaderMode;
  selectedOriginalTerm?: ScriptureResearchOriginalTermContext;
  selectedReferenceRange?: ScriptureResearchReferenceRange;
  selectedStrongNumber?: string;
  setActiveResearchSection: Dispatch<SetStateAction<ResearchPanelSection>>;
  setHarmonyUnitId: Dispatch<SetStateAction<string | undefined>>;
  setSelectedOriginalTerm: Dispatch<
    SetStateAction<ScriptureResearchOriginalTermContext | undefined>
  >;
  setSelectedReferenceRange: Dispatch<
    SetStateAction<ScriptureResearchReferenceRange | undefined>
  >;
  setSelectedStrongNumber: Dispatch<SetStateAction<string | undefined>>;
  setSourceSurface: Dispatch<SetStateAction<ScriptureResearchSourceSurface>>;
  sourceSurface: ScriptureResearchSourceSurface;
  verse?: number;
  version: string;
};

type ScriptureResearchWorkspaceProviderProps = {
  book: string;
  chapter: number;
  children: ReactNode;
  initialActiveResearchSection?: ResearchPanelSection;
  locale: string;
  mode: OriginalLanguageReaderMode;
  selectedReferenceRange?: ScriptureResearchReferenceRange;
  sourceSurface?: ScriptureResearchSourceSurface;
  verse?: number;
  version: string;
};

const ScriptureResearchWorkspaceContext =
  createContext<ScriptureResearchWorkspaceContextValue | null>(null);

export function ScriptureResearchWorkspaceProvider({
  book,
  chapter,
  children,
  initialActiveResearchSection = "search",
  locale,
  mode,
  selectedReferenceRange,
  sourceSurface = "reader",
  verse,
  version,
}: ScriptureResearchWorkspaceProviderProps) {
  const [activeResearchSection, setActiveResearchSection] =
    useState<ResearchPanelSection>(initialActiveResearchSection);
  const [selectedReferenceRangeOverride, setSelectedReferenceRange] = useState<
    ScriptureResearchReferenceRange | undefined
  >();
  const [currentSourceSurface, setSourceSurface] = useState(sourceSurface);
  const [selectedOriginalTerm, setSelectedOriginalTerm] = useState<
    ScriptureResearchOriginalTermContext | undefined
  >();
  const [selectedStrongNumber, setSelectedStrongNumber] = useState<string | undefined>();
  const [harmonyUnitId, setHarmonyUnitId] = useState<string | undefined>();
  const currentSelectedReferenceRange = selectedReferenceRangeOverride ?? selectedReferenceRange;

  const value = useMemo<ScriptureResearchWorkspaceContextValue>(
    () => ({
      activeResearchSection,
      book,
      chapter,
      harmonyUnitId,
      locale,
      mode,
      selectedOriginalTerm,
      selectedReferenceRange: currentSelectedReferenceRange,
      selectedStrongNumber,
      setActiveResearchSection,
      setHarmonyUnitId,
      setSelectedOriginalTerm,
      setSelectedReferenceRange,
      setSelectedStrongNumber,
      setSourceSurface,
      sourceSurface: currentSourceSurface,
      verse,
      version,
    }),
    [
      activeResearchSection,
      book,
      chapter,
      currentSelectedReferenceRange,
      currentSourceSurface,
      harmonyUnitId,
      locale,
      mode,
      selectedOriginalTerm,
      selectedStrongNumber,
      verse,
      version,
    ],
  );

  return (
    <ScriptureResearchWorkspaceContext.Provider value={value}>
      {children}
    </ScriptureResearchWorkspaceContext.Provider>
  );
}

export function useScriptureResearchWorkspace() {
  const context = useContext(ScriptureResearchWorkspaceContext);

  if (!context) {
    throw new Error(
      "useScriptureResearchWorkspace must be used within ScriptureResearchWorkspaceProvider",
    );
  }

  return context;
}

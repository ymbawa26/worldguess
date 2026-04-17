"use client";

import {
  BrainCircuit,
  Globe2,
  LocateFixed,
  MapPinned,
  Radar,
  RefreshCcw,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "@/components/world-guess-game.module.css";
import type {
  AuditQuestionPayload,
  RemoteAuditCheck,
  RemoteAuditResponse,
} from "@/lib/online-country-audit";
import {
  applyLearnedTraitOverride,
  answerPlayerQuestion,
  applyComputerTurnAnswer,
  buildAssistantTurnMessage,
  chooseComputerQuestion,
  COUNTRIES,
  COUNTRIES_BY_NAME,
  type Continent,
  type CountryRecord,
  type Difficulty,
  getAtlasCountries,
  getContinentColor,
  getLearnableTraitKey,
  getPoolForDifficulty,
  getShortlistPreview,
  type LearnableTraitKey,
  parsePlayerIntent,
  pickComputerCountry,
  REFERENCE_COUNTRY_NAMES,
  SUGGESTED_PLAYER_QUESTIONS,
  toMapPoint,
  type GameQuestion,
  type TurnAnswer,
} from "@/lib/world-game";

type PlayMode = "computer-only" | "both-ways";
type MatchStatus = "setup" | "playing" | "user-won" | "ai-won" | "ai-stuck";
type AtlasFilter =
  | "all"
  | "shortlist"
  | "transcontinental"
  | "territories"
  | "non-un"
  | "amazon"
  | "christian"
  | "mediterranean"
  | "sahara"
  | Continent;

type LogEntry = {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
};

type AnswerHistoryEntry = {
  question: GameQuestion;
  answer: TurnAnswer;
};

type LearnedOverride = {
  countryName: string;
  questionId: string;
  questionPrompt: string;
  traitKey: LearnableTraitKey;
  value: boolean;
  learnedAt: string;
};

type DiagnosisResult = {
  title: string;
  summary: string;
  details: string[];
  learnedOverrides?: LearnedOverride[];
};

type AnalyzedAnswerEntry = AnswerHistoryEntry & {
  local: ReturnType<typeof formatExpectedAnswer>;
  remote?: RemoteAuditCheck;
};

type MatchState = {
  status: MatchStatus;
  playMode: PlayMode;
  difficulty: Difficulty;
  computerCountry: CountryRecord | null;
  userCandidates: CountryRecord[];
  currentQuestion: GameQuestion | null;
  askedQuestionIds: string[];
  answerHistory: AnswerHistoryEntry[];
  log: LogEntry[];
};

const DIFFICULTY_COPY: Record<
  Difficulty,
  { title: string; subtitle: string; detail: string }
> = {
  easy: {
    title: "Easy",
    subtitle: "Top 70 well-known countries",
    detail: "The computer plays looser and mostly sticks to broad eliminations.",
  },
  medium: {
    title: "Medium",
    subtitle: "All UN member states",
    detail: "The computer balances broad and narrow questions with decent accuracy.",
  },
  hard: {
    title: "Hard",
    subtitle: "Countries, territories, and edge cases",
    detail: "The computer uses the full atlas and gets more aggressive about narrowing.",
  },
};

const LEARNED_OVERRIDES_STORAGE_KEY = "worldguess.learned-overrides.v2";

const MODE_COPY: Record<
  PlayMode,
  { title: string; subtitle: string; detail: string }
> = {
  "computer-only": {
    title: "Computer Only",
    subtitle: "The computer only has to guess your country",
    detail: "You just answer the clue stream and watch the shortlist collapse.",
  },
  "both-ways": {
    title: "Both Ways",
    subtitle: "You ask back and race the computer",
    detail: "Each round you answer the computer and fire back your own clue or guess.",
  },
};

function createLogEntry(
  role: LogEntry["role"],
  content: string,
  prefix = role,
) {
  return {
    id: `${prefix}-${crypto.randomUUID()}`,
    role,
    content,
  } satisfies LogEntry;
}

function createMatchState(difficulty: Difficulty, playMode: PlayMode) {
  const computerCountry =
    playMode === "both-ways" ? pickComputerCountry(difficulty) : null;
  const userCandidates = getPoolForDifficulty(difficulty);
  const openingQuestion = chooseComputerQuestion(userCandidates, new Set(), difficulty);

  return {
    status: "playing",
    playMode,
    difficulty,
    computerCountry,
    userCandidates,
    currentQuestion: openingQuestion ?? null,
    askedQuestionIds: openingQuestion ? [openingQuestion.id] : [],
    answerHistory: [],
    log: [
      createLogEntry(
        "system",
        playMode === "both-ways"
          ? `Difficulty set to ${DIFFICULTY_COPY[difficulty].title}. Think of one country that fits this mode and keep it secret. Each turn has two steps: answer my clue, then ask yours.`
          : `Difficulty set to ${DIFFICULTY_COPY[difficulty].title}. Think of one country that fits this mode and keep it secret. I will only try to guess yours.`,
      ),
      createLogEntry(
        "assistant",
        playMode === "both-ways"
          ? openingQuestion
            ? `I picked my country. ${openingQuestion.prompt}`
            : "I picked my country. Ask your first question while I build a better opening clue."
          : openingQuestion
            ? `Let’s begin. ${openingQuestion.prompt}`
            : "Let’s begin. I’m building the first clue now.",
      ),
    ],
  } satisfies MatchState;
}

function getPersistentAskedQuestionIds(
  askedQuestionIds: string[],
  currentQuestion: MatchState["currentQuestion"],
  currentAnswer: TurnAnswer,
) {
  if (currentQuestion?.kind === "guess" && currentAnswer === "idk") {
    return askedQuestionIds.filter((questionId) => questionId !== currentQuestion.id);
  }

  return askedQuestionIds;
}

function formatUserTurn(playMode: PlayMode, answer: TurnAnswer, question: string) {
  if (playMode === "computer-only") {
    return `Your answer: ${answer.toUpperCase()}`;
  }

  const lines = [`1. Your answer: ${answer.toUpperCase()}`];

  if (question.trim()) {
    lines.push(`2. Your clue: ${question.trim()}`);
  } else {
    lines.push("2. Your clue: skipped this round");
  }

  return lines.join("\n\n");
}

function matchesAtlasFilter(
  country: CountryRecord,
  filter: AtlasFilter,
  shortlistNames: Set<string>,
) {
  if (filter === "all") {
    return true;
  }

  if (filter === "shortlist") {
    return shortlistNames.has(country.name);
  }

  if (filter === "transcontinental") {
    return country.transcontinental;
  }

  if (filter === "territories") {
    return country.territoryLike;
  }

  if (filter === "non-un") {
    return !country.unMember;
  }

  if (filter === "amazon") {
    return country.amazonBasin;
  }

  if (filter === "christian") {
    return country.majorityChristian;
  }

  if (filter === "mediterranean") {
    return country.mediterraneanAccess;
  }

  if (filter === "sahara") {
    return country.saharaDesert;
  }

  return country.continents.includes(filter);
}

function buildComputerOnlyTurnMessage({
  nextQuestion,
  candidateCount,
  inconsistencyWarning,
}: {
  nextQuestion?: GameQuestion | null;
  candidateCount: number;
  inconsistencyWarning?: string;
}) {
  const lines = [
    inconsistencyWarning
      ? `Shortlist note: ${inconsistencyWarning}`
      : `I’m down to ${candidateCount} possible countries for you.`,
  ];

  if (nextQuestion) {
    lines.push(`My question: ${nextQuestion.prompt}`);
  }

  return lines.join("\n\n");
}

function formatExpectedAnswer(question: GameQuestion, country: CountryRecord) {
  if (question.kind === "guess") {
    return {
      answer: question.guessedCountry === country.name ? "yes" : "no",
      confident: true,
    };
  }

  const resolved = question.evaluateForPlayer
    ? question.evaluateForPlayer(country).toLowerCase()
    : question.test(country)
      ? "yes"
      : "no";
  const confident = !(
    question.id.startsWith("relative:") ||
    ((question.id === "geo:tropical" || question.id === "geo:arctic") &&
      !country.preciseBounds)
  );

  return {
    answer: resolved as "yes" | "no" | "maybe",
    confident,
  };
}

function getStoredOverrides() {
  if (typeof window === "undefined") {
    return [] as LearnedOverride[];
  }

  try {
    const raw = window.localStorage.getItem(LEARNED_OVERRIDES_STORAGE_KEY);

    if (!raw) {
      return [] as LearnedOverride[];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LearnedOverride[]) : [];
  } catch {
    return [] as LearnedOverride[];
  }
}

function persistLearnedOverride(override: LearnedOverride) {
  if (typeof window === "undefined") {
    return;
  }

  const previous = getStoredOverrides().filter(
    (entry) =>
      !(
        entry.countryName === override.countryName && entry.traitKey === override.traitKey
      ),
  );

  window.localStorage.setItem(
    LEARNED_OVERRIDES_STORAGE_KEY,
    JSON.stringify([...previous, override]),
  );
}

function formatSources(check: RemoteAuditCheck | undefined) {
  if (!check || check.sources.length === 0) {
    return "online references";
  }

  if (check.sources.length === 1) {
    return check.sources[0];
  }

  return check.sources.join(" + ");
}

function hasAuthoritativeLearningSource(check: RemoteAuditCheck | undefined) {
  if (!check || !check.supported) {
    return false;
  }

  return check.sources.some(
    (source) => source === "REST Countries" || /\bofficial\b/i.test(source),
  );
}

function buildDiagnosis({
  difficulty,
  answerHistory,
  userCandidates,
  revealedCountryName,
  remoteChecks,
  remoteNote,
}: {
  difficulty: Difficulty;
  answerHistory: AnswerHistoryEntry[];
  userCandidates: CountryRecord[];
  revealedCountryName: string;
  remoteChecks?: RemoteAuditCheck[];
  remoteNote?: string;
}) {
  const actualCountry = COUNTRIES_BY_NAME.get(revealedCountryName);

  if (!actualCountry) {
    return {
      diagnosis: {
        title: "I could not find that country in the atlas",
        summary:
          "That looks like a database naming gap on my side, so I could not audit it correctly from the current roster.",
        details: [
          `I could not match "${revealedCountryName}" to a country or territory in the local atlas.`,
          "If you use the atlas search spelling, I can audit the round more precisely next time.",
          ...(remoteNote ? [remoteNote] : []),
        ],
      } satisfies DiagnosisResult,
      actualCountry: null,
    };
  }

  const pool = getPoolForDifficulty(difficulty);
  const inDifficulty = pool.some((country) => country.name === actualCountry.name);

  if (!inDifficulty) {
    return {
      diagnosis: {
        title: "This was the wrong difficulty for that country",
        summary: `${actualCountry.name} is outside the ${difficulty} pool, so I was filtering inside the wrong set from the start.`,
        details: [
          `You revealed ${actualCountry.name}.`,
          `The ${difficulty} mode only includes ${difficulty === "easy" ? "the smaller well-known pool" : difficulty === "medium" ? "UN member states" : "the full atlas plus territories and disputed states"}.`,
          `Try ${actualCountry.unMember ? "medium" : "hard"} for this country next time.`,
          ...(remoteNote ? [remoteNote] : []),
        ],
      } satisfies DiagnosisResult,
      actualCountry,
    };
  }

  const remoteChecksById = new Map(
    (remoteChecks ?? []).map((check) => [check.questionId, check] as const),
  );
  const analyzedEntries = answerHistory
    .filter((entry) => entry.answer !== "idk")
    .map((entry) => ({
      ...entry,
      local: formatExpectedAnswer(entry.question, actualCountry),
      remote: remoteChecksById.get(entry.question.id),
    })) satisfies AnalyzedAnswerEntry[];
  const localContradictions = analyzedEntries.filter(
    (entry) => entry.local.answer !== "maybe" && entry.local.answer !== entry.answer,
  );
  const confidentContradictions = localContradictions.filter((entry) => entry.local.confident);
  const lowConfidenceContradictions = localContradictions.filter((entry) => !entry.local.confident);
  const remotelyVerifiedEntries = analyzedEntries.filter(
    (entry) => entry.remote?.supported && entry.remote.answer !== "maybe",
  );
  const remotelyVerifiedContradictions = remotelyVerifiedEntries.filter(
    (entry) => entry.remote && entry.remote.answer !== entry.answer,
  );
  const userVerifiedMistakes = remotelyVerifiedContradictions.filter(
    (entry) => entry.local.answer === "maybe" || entry.local.answer === entry.remote?.answer,
  );
  const atlasVerifiedMistakes = remotelyVerifiedContradictions.filter(
    (entry) =>
      entry.local.answer !== "maybe" &&
      entry.remote &&
      entry.local.answer !== entry.remote.answer,
  );
  const safeAtlasVerifiedMistakes = atlasVerifiedMistakes.filter((entry) =>
    hasAuthoritativeLearningSource(entry.remote),
  );
  const unsafeAtlasVerifiedMistakes = atlasVerifiedMistakes.filter(
    (entry) => !hasAuthoritativeLearningSource(entry.remote),
  );

  if (userVerifiedMistakes.length > 0) {
    return {
      diagnosis: {
        title: "At least one answer conflicted with the online fact check",
        summary:
          "The miss came from one or more answers that did not match the revealed country once I checked live references.",
        details: [
          ...userVerifiedMistakes.slice(0, 4).map(
            (entry) =>
              `${entry.question.prompt} You answered ${entry.answer.toUpperCase()}, but ${entry.remote?.answer.toUpperCase()} is what ${formatSources(entry.remote)} says for ${actualCountry.name}.`,
          ),
          ...(remoteNote ? [remoteNote] : []),
        ],
      } satisfies DiagnosisResult,
      actualCountry,
    };
  }

  if (safeAtlasVerifiedMistakes.length > 0) {
    const learnedOverrides = safeAtlasVerifiedMistakes.flatMap((entry) => {
      const traitKey =
        entry.question.kind === "predicate"
          ? getLearnableTraitKey(entry.question.id)
          : null;

      if (!traitKey || !entry.remote || entry.remote.answer === "maybe") {
        return [];
      }

      const learnedValue = entry.remote.answer === "yes";
      const previousValue = actualCountry[traitKey];

      if (previousValue === learnedValue) {
        return [];
      }

      applyLearnedTraitOverride(actualCountry.name, traitKey, learnedValue);

      const learnedOverride: LearnedOverride = {
        countryName: actualCountry.name,
        questionId: entry.question.id,
        questionPrompt: entry.question.prompt,
        traitKey,
        value: learnedValue,
        learnedAt: new Date().toISOString(),
      };

      persistLearnedOverride(learnedOverride);
      return [learnedOverride];
    });

    if (learnedOverrides.length > 0) {
      return {
        diagnosis: {
          title: "The online fact check confirmed atlas mistakes, and I learned them",
          summary:
            "Your answers matched the live references better than my stored data, so I updated the local atlas for future rounds in this browser.",
          details: [
            ...safeAtlasVerifiedMistakes.slice(0, 4).map((entry) => {
              const matchingOverride = learnedOverrides.find(
                (override) => override.questionId === entry.question.id,
              );

              return `${entry.question.prompt} ${formatSources(entry.remote)} says ${entry.remote?.answer.toUpperCase()} for ${actualCountry.name}, while my atlas had ${entry.local.answer.toUpperCase()}.${matchingOverride ? ` I updated ${matchingOverride.traitKey} to ${String(matchingOverride.value)}.` : ""}`;
            }),
            ...(remoteNote ? [remoteNote] : []),
          ],
          learnedOverrides,
        } satisfies DiagnosisResult,
        actualCountry,
      };
    }

    return {
      diagnosis: {
        title: "The online fact check says my atlas was wrong",
        summary:
          "I found a mismatch between my stored facts and the live references, but it was not a learnable boolean trait that I could safely patch automatically.",
        details: [
          ...safeAtlasVerifiedMistakes.slice(0, 4).map(
            (entry) =>
              `${entry.question.prompt} ${formatSources(entry.remote)} says ${entry.remote?.answer.toUpperCase()} for ${actualCountry.name}, while my atlas had ${entry.local.answer.toUpperCase()}.`,
          ),
          ...(remoteNote ? [remoteNote] : []),
        ],
      } satisfies DiagnosisResult,
      actualCountry,
    };
  }

  if (unsafeAtlasVerifiedMistakes.length > 0) {
    return {
      diagnosis: {
        title: "I found a possible atlas mismatch, but I did not auto-learn it",
        summary:
          "The disagreement came from a source that was not authoritative enough for automatic learning, so I left the atlas unchanged.",
        details: [
          ...unsafeAtlasVerifiedMistakes.slice(0, 4).map(
            (entry) =>
              `${entry.question.prompt} ${formatSources(entry.remote)} suggested ${entry.remote?.answer.toUpperCase()} for ${actualCountry.name}, but I did not store that update automatically.`,
          ),
          ...(remoteNote ? [remoteNote] : []),
        ],
      } satisfies DiagnosisResult,
      actualCountry,
    };
  }

  if (confidentContradictions.length === 0 && lowConfidenceContradictions.length > 0) {
    return {
      diagnosis: {
        title: "My geography audit was too rough to trust",
        summary:
          "The only mismatches came from exact coordinate-style clues, and for this country my atlas still uses approximate bounds rather than precise geometry.",
        details: [
          ...lowConfidenceContradictions.slice(0, 4).map(
            (entry) =>
              `${entry.question.prompt} I marked this as a mismatch, but that clue depends on approximate map bounds for ${actualCountry.name}, so I should not blame your answer here.`,
          ),
          ...(remoteNote ? [remoteNote] : []),
        ],
      } satisfies DiagnosisResult,
      actualCountry,
    };
  }

  if (remotelyVerifiedEntries.length === 0 && confidentContradictions.length > 0) {
    return {
      diagnosis: {
        title: "I found local mismatches, but I could not verify them online",
        summary:
          "The clue types that disagreed with the revealed country were not covered by the live fact check, so I did not auto-learn from them.",
        details: [
          ...confidentContradictions.slice(0, 4).map(
            (entry) =>
              `${entry.question.prompt} You answered ${entry.answer.toUpperCase()}, while my local atlas expected ${entry.local.answer.toUpperCase()}. I left the database unchanged because that clue was not verified online.`,
          ),
          ...(remoteNote ? [remoteNote] : []),
        ],
      } satisfies DiagnosisResult,
      actualCountry,
    };
  }

  if (confidentContradictions.length === 0) {
    const stillOnShortlist = userCandidates.some((country) => country.name === actualCountry.name);

    return {
      diagnosis: {
        title: stillOnShortlist
          ? "The clues still fit your country"
          : "I ran out of useful discriminators",
        summary: stillOnShortlist
          ? "Your answers stayed consistent with the revealed country, so this was not a filtering mistake. I just did not finish the deduction before the match ended."
          : "Your answers were internally consistent, but my current question bank still failed to keep the revealed country alive to the end.",
        details: stillOnShortlist
          ? [
              `${actualCountry.name} still fits the answer trail I recorded.`,
              `I ended the round with ${userCandidates.length} candidates left, so this was a pacing problem rather than a bad fact.`,
              ...(remoteNote ? [remoteNote] : []),
            ]
          : [
              `${actualCountry.name} was valid for this difficulty and your recorded answers were self-consistent.`,
              "That means the miss came from my current elimination strategy rather than from you using the wrong mode.",
              ...(remoteNote ? [remoteNote] : []),
            ],
      } satisfies DiagnosisResult,
      actualCountry,
    };
  }

  return {
    diagnosis: {
      title: "One or more answers conflicted with the revealed country",
      summary:
        "The miss was most likely caused by at least one answer that pushed the correct country out of the shortlist.",
      details: [
        ...confidentContradictions.slice(0, 4).map(
          (entry) =>
            `${entry.question.prompt} You answered ${entry.answer.toUpperCase()}, but ${entry.local.answer.toUpperCase()} fits ${actualCountry.name} in the local atlas.`,
        ),
        ...(remoteNote ? [remoteNote] : []),
      ],
    } satisfies DiagnosisResult,
    actualCountry,
  };
}

function AtlasMap({
  countries,
  shortlistNames,
  selectedCountryName,
}: {
  countries: CountryRecord[];
  shortlistNames: Set<string>;
  selectedCountryName: string | null;
}) {
  const selectedCountry = selectedCountryName
    ? COUNTRIES_BY_NAME.get(selectedCountryName) ?? null
    : null;

  return (
    <svg
      className={styles.atlasMap}
      viewBox="0 0 1000 520"
      role="img"
      aria-label="Stylized country reference atlas"
    >
      <defs>
        <radialGradient id="atlasGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(96,165,250,0.26)" />
          <stop offset="100%" stopColor="rgba(15,23,42,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="520" rx="28" fill="url(#atlasGlow)" />
      <path
        d="M70 155C135 92 240 82 305 124C345 150 382 188 438 186C518 182 588 102 687 119C779 135 832 183 916 230C970 260 956 343 885 356C780 374 723 304 648 300C570 295 528 371 441 386C355 401 276 372 218 342C136 300 30 226 70 155Z"
        className={styles.continentSilhouette}
      />
      <path
        d="M786 367C838 351 897 362 938 394C972 420 956 474 900 479C839 484 782 460 750 432C712 399 735 377 786 367Z"
        className={styles.continentSilhouetteSoft}
      />

      {countries.map((country) => {
        const point = toMapPoint(country);
        const x = point.x * 10;
        const y = point.y * 5.2;
        const isShortlisted = shortlistNames.has(country.name);
        const isSelected = selectedCountryName === country.name;

        return (
          <g key={country.name}>
            {isShortlisted ? (
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 10 : 7}
                fill="rgba(248,250,252,0.10)"
                stroke="rgba(248,250,252,0.6)"
                strokeWidth="1.5"
              />
            ) : null}
            <circle
              cx={x}
              cy={y}
              r={isSelected ? 5.4 : 3.2}
              fill={getContinentColor(country.continent)}
              stroke={isSelected ? "#f8fafc" : "rgba(255,255,255,0.18)"}
              strokeWidth={isSelected ? 2.2 : 0.8}
              opacity={isShortlisted || isSelected ? 1 : 0.72}
            />
          </g>
        );
      })}

      {REFERENCE_COUNTRY_NAMES.map((name) => {
        const country = COUNTRIES_BY_NAME.get(name);

        if (!country) {
          return null;
        }

        const point = toMapPoint(country);
        const x = point.x * 10;
        const y = point.y * 5.2;

        return (
          <g key={name}>
            <line
              x1={x}
              y1={y}
              x2={x + 18}
              y2={y - 18}
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
            />
            <text x={x + 22} y={y - 20} className={styles.referenceLabel}>
              {name}
            </text>
          </g>
        );
      })}

      {selectedCountry ? (
        <text x="34" y="44" className={styles.selectionTitle}>
          {selectedCountry.name}
        </text>
      ) : null}
    </svg>
  );
}

export default function WorldGuessGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [playMode, setPlayMode] = useState<PlayMode>("both-ways");
  const [match, setMatch] = useState<MatchState>({
    status: "setup",
    playMode: "both-ways",
    difficulty: "medium",
    computerCountry: null,
    userCandidates: [],
    currentQuestion: null,
    askedQuestionIds: [],
    answerHistory: [],
    log: [],
  });
  const [turnAnswer, setTurnAnswer] = useState<TurnAnswer | null>(null);
  const [playerQuestion, setPlayerQuestion] = useState("");
  const [revealedCountry, setRevealedCountry] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [atlasQuery, setAtlasQuery] = useState("");
  const [atlasFilter, setAtlasFilter] = useState<AtlasFilter>("all");
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const deferredAtlasQuery = useDeferredValue(atlasQuery);
  const selectedDifficulty = match.status === "setup" ? difficulty : match.difficulty;
  const selectedPlayMode = match.status === "setup" ? playMode : match.playMode;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [match.log]);

  useEffect(() => {
    for (const override of getStoredOverrides()) {
      applyLearnedTraitOverride(override.countryName, override.traitKey, override.value);
    }
  }, []);

  const shortlistPreview = useMemo(
    () => getShortlistPreview(match.userCandidates, 10),
    [match.userCandidates],
  );
  const fullShortlistNameSet = useMemo(
    () => new Set(match.userCandidates.map((country) => country.name)),
    [match.userCandidates],
  );
  const atlasQueryMatches = useMemo(
    () => getAtlasCountries(deferredAtlasQuery),
    [deferredAtlasQuery],
  );
  const atlasCountries = useMemo(
    () =>
      atlasQueryMatches.filter((country) =>
        matchesAtlasFilter(country, atlasFilter, fullShortlistNameSet),
      ),
    [atlasFilter, atlasQueryMatches, fullShortlistNameSet],
  );
  const atlasSelection =
    selectedCountryName && COUNTRIES_BY_NAME.has(selectedCountryName)
      ? COUNTRIES_BY_NAME.get(selectedCountryName) ?? null
      : shortlistPreview[0] ?? atlasCountries[0] ?? null;

  function startGame(nextDifficulty: Difficulty) {
    setDifficulty(nextDifficulty);
    setTurnAnswer(null);
    setPlayerQuestion("");
    setRevealedCountry("");
    setDiagnosis(null);
    setIsAuditing(false);
    setAtlasQuery("");
    setAtlasFilter("all");
    const nextMatch = createMatchState(nextDifficulty, playMode);
    setSelectedCountryName(nextMatch.userCandidates[0]?.name ?? null);
    setMatch(nextMatch);
  }

  function resetGame() {
    setTurnAnswer(null);
    setPlayerQuestion("");
    setRevealedCountry("");
    setDiagnosis(null);
    setIsAuditing(false);
    setAtlasQuery("");
    setAtlasFilter("all");
    setSelectedCountryName(null);
    setMatch({
      status: "setup",
      playMode,
      difficulty,
      computerCountry: null,
      userCandidates: [],
      currentQuestion: null,
      askedQuestionIds: [],
      answerHistory: [],
      log: [],
    });
  }

  function handleTurnSubmit() {
    if (
      !match.currentQuestion ||
      !turnAnswer ||
      (match.playMode === "both-ways" && !match.computerCountry)
    ) {
      return;
    }

    const currentQuestion = match.currentQuestion;
    const currentCandidates = match.userCandidates;
    const askedQuestionIds = [...match.askedQuestionIds];
    const playerTurnSummary = formatUserTurn(match.playMode, turnAnswer, playerQuestion);
    const playerIntent = parsePlayerIntent(playerQuestion);
    const nextAnswerHistory = [
      ...match.answerHistory,
      { question: currentQuestion, answer: turnAnswer },
    ];

    startTransition(() => {
      const answerResolution = applyComputerTurnAnswer(
        currentQuestion,
        turnAnswer,
        currentCandidates,
      );
      const baseLog = [...match.log, createLogEntry("user", playerTurnSummary)];
      const persistentAskedQuestionIds = getPersistentAskedQuestionIds(
        askedQuestionIds,
        currentQuestion,
        turnAnswer,
      );

      if (answerResolution.aiWon) {
        setMatch({
          ...match,
          status: "ai-won",
          userCandidates: answerResolution.candidates,
          currentQuestion: null,
          answerHistory: nextAnswerHistory,
          log: [
            ...baseLog,
            createLogEntry(
              "assistant",
              match.playMode === "both-ways"
                ? "That confirms it. I guessed your country before you got mine."
                : "That confirms it. I’ve got your country.",
            ),
          ],
        });
        setTurnAnswer(null);
        setPlayerQuestion("");
        return;
      }

      if (match.playMode === "computer-only") {
        const askedSet = new Set(persistentAskedQuestionIds);
        const nextQuestion = chooseComputerQuestion(
          answerResolution.candidates,
          askedSet,
          match.difficulty,
        );
        const nextAskedIds = nextQuestion
          ? [...persistentAskedQuestionIds, nextQuestion.id]
          : persistentAskedQuestionIds;
        const auditMessage = buildComputerOnlyTurnMessage({
          nextQuestion,
          candidateCount: answerResolution.candidates.length,
          inconsistencyWarning: answerResolution.inconsistencyWarning,
        });

        if (!nextQuestion) {
          setMatch({
            ...match,
            status: "ai-stuck",
            userCandidates: answerResolution.candidates,
            currentQuestion: null,
            askedQuestionIds: nextAskedIds,
            answerHistory: nextAnswerHistory,
            log: [
              ...baseLog,
              createLogEntry(
                "assistant",
                `${auditMessage}\n\nI’m out of strong clues for this round. Tell me which country you picked and I’ll audit whether the problem was the difficulty, an inconsistent answer, or a bad atlas fact.`,
              ),
            ],
          });
          setTurnAnswer(null);
          setPlayerQuestion("");
          return;
        }

        setMatch({
          ...match,
          status: "playing",
          userCandidates: answerResolution.candidates,
          currentQuestion: nextQuestion ?? null,
          askedQuestionIds: nextAskedIds,
          answerHistory: nextAnswerHistory,
          log: [
            ...baseLog,
            createLogEntry("assistant", auditMessage),
          ],
        });
        setTurnAnswer(null);
        setPlayerQuestion("");
        return;
      }

      const computerCountry = match.computerCountry;

      if (!computerCountry) {
        return;
      }

      const computerReply = answerPlayerQuestion(playerIntent, computerCountry);

      if (computerReply.playerWon) {
        setMatch({
          ...match,
          status: "user-won",
          userCandidates: answerResolution.candidates,
          currentQuestion: null,
          answerHistory: nextAnswerHistory,
          log: [
            ...baseLog,
            createLogEntry(
              "assistant",
              `About my country: ${computerReply.answer}. ${computerReply.explanation}\n\nYou won the race.\n\nNow tell me which country you picked and I’ll audit why I missed it.`,
            ),
          ],
        });
        setTurnAnswer(null);
        setPlayerQuestion("");
        return;
      }

      const askedSet = new Set(persistentAskedQuestionIds);
      const nextQuestion = chooseComputerQuestion(
        answerResolution.candidates,
        askedSet,
        match.difficulty,
      );
      const nextAskedIds = nextQuestion
        ? [...persistentAskedQuestionIds, nextQuestion.id]
        : persistentAskedQuestionIds;

      const assistantMessage = buildAssistantTurnMessage({
        computerReply,
        nextQuestion,
        candidateCount: answerResolution.candidates.length,
        inconsistencyWarning: answerResolution.inconsistencyWarning,
      });

      if (!nextQuestion) {
        setMatch({
          ...match,
          status: "ai-stuck",
          userCandidates: answerResolution.candidates,
          currentQuestion: null,
          askedQuestionIds: nextAskedIds,
          answerHistory: nextAnswerHistory,
          log: [
            ...baseLog,
            createLogEntry(
              "assistant",
              `${assistantMessage}\n\nI’m out of strong clues for this round. Tell me which country you picked and I’ll audit whether the issue was difficulty, an inconsistent answer, or my own atlas data.`,
            ),
          ],
        });
        setTurnAnswer(null);
        setPlayerQuestion("");
        return;
      }

      setMatch({
        ...match,
        status: "playing",
        userCandidates: answerResolution.candidates,
        currentQuestion: nextQuestion ?? null,
        askedQuestionIds: nextAskedIds,
        answerHistory: nextAnswerHistory,
        log: [...baseLog, createLogEntry("assistant", assistantMessage)],
      });
      setTurnAnswer(null);
      setPlayerQuestion("");
    });
  }

  async function handleRevealCountry() {
    const parsed = parsePlayerIntent(revealedCountry);
    const revealedCountryName =
      parsed.kind === "guess"
        ? parsed.countryName
        : COUNTRIES_BY_NAME.has(revealedCountry.trim())
          ? revealedCountry.trim()
          : null;

    if (!revealedCountryName) {
      setDiagnosis({
        title: "I need the country name to audit the round",
        summary:
          "Try entering the country or territory name directly, like `Chad`, `Niger`, or `Democratic Republic of the Congo`.",
        details: [
          "I only run the post-match audit after I can match your reveal to a country in the atlas.",
        ],
      });
      return;
    }

    setIsAuditing(true);
    setDiagnosis(null);

    let remoteChecks: RemoteAuditCheck[] | undefined;
    let remoteNote: string | undefined;

    try {
      const response = await fetch("/api/country-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          revealedCountryName,
          questions: match.answerHistory.map((entry) => ({
            questionId: entry.question.id,
            prompt: entry.question.prompt,
            answer: entry.answer,
          })) satisfies AuditQuestionPayload[],
        }),
      });

      if (response.ok) {
        const remoteResult = (await response.json()) as RemoteAuditResponse;
        remoteChecks = remoteResult.checks;
        remoteNote = remoteResult.note;
      } else {
        remoteNote =
          "I could not complete the online fact check, so this audit fell back to the local atlas only.";
      }
    } catch {
      remoteNote =
        "I could not complete the online fact check, so this audit fell back to the local atlas only.";
    }

    const result = buildDiagnosis({
      difficulty: match.difficulty,
      answerHistory: match.answerHistory,
      userCandidates: match.userCandidates,
      revealedCountryName,
      remoteChecks,
      remoteNote,
    });

    setDiagnosis(result.diagnosis);
    setSelectedCountryName(result.actualCountry?.name ?? revealedCountryName);
    setIsAuditing(false);
  }

  const needsAudit =
    match.status === "user-won" || match.status === "ai-stuck";

  const titleCopy =
    match.status === "setup"
      ? "A country deduction game with one-way or duel play"
      : match.status === "user-won"
        ? "You found the country first"
        : match.status === "ai-won"
          ? match.playMode === "both-ways"
            ? "The computer got there first"
            : "The computer locked in your country"
          : match.status === "ai-stuck"
            ? "The model needs a post-match audit"
          : match.playMode === "both-ways"
            ? "Trade clues, cut the map in half, and race to the right answer"
            : "Answer the clue stream and watch the shortlist collapse";

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>
            <Sparkles size={16} />
            WorldGuess
          </span>
          <h1>{titleCopy}</h1>
          <p>
            Choose a solo deduction mode where the computer only hunts your country,
            or a duel mode where both sides ask questions and race to the answer.
            Every round still runs on <strong>yes</strong>, <strong>no</strong>, or{" "}
            <strong>idk</strong>, with the atlas ready on the side whenever you need a
            geography check.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Radar size={18} />
            <span>About {COUNTRIES.length} countries and territories</span>
          </div>
          <div className={styles.statCard}>
            <BrainCircuit size={18} />
            <span>Rule-based narrowing that changes by difficulty</span>
          </div>
          <div className={styles.statCard}>
            <MapPinned size={18} />
            <span>Built-in atlas for geography checks mid-game</span>
          </div>
        </div>
      </section>

      <section className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Match Setup</p>
                <h2>Mode and difficulty</h2>
              </div>
              {match.status !== "setup" ? (
                <button className={styles.ghostButton} onClick={resetGame} type="button">
                  <RefreshCcw size={16} />
                  New match
                </button>
              ) : null}
            </div>

            <div className={styles.difficultyGrid}>
              {(["computer-only", "both-ways"] as PlayMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`${styles.difficultyCard} ${selectedPlayMode === mode ? styles.difficultyCardActive : ""}`}
                  onClick={() => setPlayMode(mode)}
                >
                  <span>{MODE_COPY[mode].title}</span>
                  <strong>{MODE_COPY[mode].subtitle}</strong>
                  <small>{MODE_COPY[mode].detail}</small>
                </button>
              ))}
            </div>

            <div className={styles.difficultyGrid}>
              {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`${styles.difficultyCard} ${selectedDifficulty === level ? styles.difficultyCardActive : ""}`}
                  onClick={() => setDifficulty(level)}
                >
                  <span>{DIFFICULTY_COPY[level].title}</span>
                  <strong>{DIFFICULTY_COPY[level].subtitle}</strong>
                  <small>{DIFFICULTY_COPY[level].detail}</small>
                </button>
              ))}
            </div>

            {match.status === "setup" ? (
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => startGame(difficulty)}
              >
                <Globe2 size={18} />
                Start match
              </button>
            ) : (
              <div className={styles.metaGrid}>
                <div className={styles.metaCard}>
                  <span>Mode</span>
                  <strong>{MODE_COPY[match.playMode].title}</strong>
                </div>
                <div className={styles.metaCard}>
                  <span>Difficulty</span>
                  <strong>{DIFFICULTY_COPY[match.difficulty].title}</strong>
                </div>
                <div className={styles.metaCard}>
                  <span>Computer shortlist</span>
                  <strong>{match.userCandidates.length} left</strong>
                </div>
                <div className={styles.metaCard}>
                  <span>Status</span>
                  <strong>
                    {match.status === "playing"
                      ? "In progress"
                      : match.status === "user-won"
                        ? "You won"
                        : match.status === "ai-stuck"
                          ? "Needs audit"
                          : "Computer won"}
                  </strong>
                </div>
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Computer Logic</p>
                <h2>Current shortlist</h2>
              </div>
              <span className={styles.panelBadge}>{shortlistPreview.length} shown</span>
            </div>

            {match.status === "setup" ? (
              <p className={styles.emptyState}>
                Start a match to watch the computer’s candidate pool shrink after each answer.
              </p>
            ) : (
              <>
                <div className={styles.shortlist}>
                  {shortlistPreview.map((country) => (
                    <button
                      key={country.name}
                      className={`${styles.countryPill} ${atlasSelection?.name === country.name ? styles.countryPillActive : ""}`}
                      type="button"
                      onClick={() => setSelectedCountryName(country.name)}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
                <p className={styles.helperText}>
                  These are the current leading possibilities for your secret country according to the computer.
                </p>
              </>
            )}
          </div>

          {selectedPlayMode === "both-ways" ? (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.panelEyebrow}>Player Hints</p>
                  <h2>Good question ideas</h2>
                </div>
              </div>
              <div className={styles.suggestionWrap}>
                {SUGGESTED_PLAYER_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className={styles.suggestionChip}
                    onClick={() => setPlayerQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.centerColumn}>
          <div className={`${styles.panel} ${styles.chatPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Turn Flow</p>
                <h2>Game log</h2>
              </div>
            </div>

            <div className={styles.log}>
              {match.log.length === 0 ? (
                <div className={styles.emptyStateTall}>
                  Pick a difficulty and start the first match.
                </div>
              ) : (
                match.log.map((entry) => (
                  <article
                    key={entry.id}
                    className={`${styles.message} ${styles[`message${entry.role[0].toUpperCase()}${entry.role.slice(1)}`]}`}
                  >
                    <span className={styles.messageRole}>{entry.role}</span>
                    {entry.content.split("\n").map((line, index) => (
                      <p key={`${entry.id}-${index}`}>{line}</p>
                    ))}
                  </article>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className={styles.turnPanel}>
              <div className={styles.turnPrompt}>
                <div>
                  <span className={styles.turnLabel}>
                    {needsAudit ? "Post-match audit" : "Step 1: Answer the computer"}
                  </span>
                  <strong>
                    {needsAudit
                      ? "Reveal your country so I can explain why I missed it."
                      : match.currentQuestion?.prompt ??
                        (match.status === "setup"
                          ? "Start the match to get the opening question."
                          : "The match is over.")}
                  </strong>
                </div>
              </div>

              {needsAudit ? (
                <>
                  <label className={styles.formLabel} htmlFor="reveal-country">
                    Reveal your country
                  </label>
                  <label className={styles.searchField} htmlFor="reveal-country">
                    <Search size={16} />
                    <input
                      id="reveal-country"
                      value={revealedCountry}
                      disabled={isAuditing}
                      onChange={(event) => {
                        setRevealedCountry(event.target.value);
                        setDiagnosis(null);
                      }}
                      placeholder="Type the country or territory you had in mind"
                    />
                  </label>

                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleRevealCountry}
                    disabled={!revealedCountry.trim() || isAuditing}
                  >
                    <LocateFixed size={18} />
                    {isAuditing ? "Checking online references..." : "Audit miss"}
                  </button>

                  {diagnosis ? (
                    <div className={styles.auditListCompact}>
                      <p className={styles.auditItem}>
                        <strong>{diagnosis.title}</strong>
                        <br />
                        {diagnosis.summary}
                      </p>
                      {diagnosis.details.map((detail) => (
                        <p key={detail} className={styles.auditItem}>
                          {detail}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.helperText}>
                      {isAuditing
                        ? "I’m rechecking the round against online references before deciding whether the issue was your answers or my data."
                        : "I’ll tell you whether the miss came from the wrong difficulty, an inconsistent answer, or one of my stored facts."}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.answerRow}>
                    {(["yes", "no", "idk"] as TurnAnswer[]).map((answer) => (
                      <button
                        key={answer}
                        type="button"
                        onClick={() => setTurnAnswer(answer)}
                        disabled={match.status !== "playing"}
                        className={`${styles.answerButton} ${turnAnswer === answer ? styles.answerButtonActive : ""}`}
                      >
                        {answer.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <label className={styles.formLabel} htmlFor="player-question">
                    {selectedPlayMode === "both-ways"
                      ? "Step 2: Ask your clue or make a direct guess"
                      : "One-way mode"}
                  </label>
                  {selectedPlayMode === "both-ways" ? (
                    <textarea
                      id="player-question"
                      value={playerQuestion}
                      onChange={(event) => setPlayerQuestion(event.target.value)}
                      placeholder="Examples: Is your country in Europe? Has it ever had a communist government? Your country is India."
                      className={styles.textarea}
                      disabled={match.status !== "playing"}
                    />
                  ) : (
                    <p className={styles.helperText}>
                      In this mode you only answer the computer’s clues. Switch to
                      Both Ways if you want to ask back and guess the hidden country.
                    </p>
                  )}

                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={
                      match.status !== "playing" ||
                      !turnAnswer ||
                      (selectedPlayMode === "both-ways" && !playerQuestion.trim())
                    }
                    onClick={handleTurnSubmit}
                  >
                    <LocateFixed size={18} />
                    {selectedPlayMode === "both-ways" ? "End turn" : "Send answer"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Reference Atlas</p>
                <h2>Map and lookup</h2>
              </div>
            </div>

            <label className={styles.searchField}>
              <Search size={16} />
              <input
                value={atlasQuery}
                onChange={(event) => setAtlasQuery(event.target.value)}
                placeholder="Search a country or territory"
              />
            </label>

            <div className={styles.atlasOptions}>
              {([
                ["all", "All"],
                ["shortlist", "Shortlist"],
                ["Europe", "Europe"],
                ["Asia", "Asia"],
                ["Africa", "Africa"],
                ["territories", "Territories"],
                ["transcontinental", "2 Continents"],
                ["non-un", "Non-UN"],
                ["amazon", "Amazon"],
                ["christian", "Christian"],
                ["mediterranean", "Mediterranean"],
                ["sahara", "Sahara"],
              ] as Array<[AtlasFilter, string]>).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`${styles.atlasOptionChip} ${atlasFilter === value ? styles.atlasOptionChipActive : ""}`}
                  onClick={() => setAtlasFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <AtlasMap
              countries={COUNTRIES}
              shortlistNames={fullShortlistNameSet}
              selectedCountryName={atlasSelection?.name ?? null}
            />

            <div className={styles.atlasMeta}>
              <div className={styles.atlasCard}>
                <span>Selected</span>
                <strong>{atlasSelection?.name ?? "Nothing selected"}</strong>
              </div>
              <div className={styles.atlasCard}>
                  <span>Region</span>
                <strong>
                  {atlasSelection
                    ? `${atlasSelection.continents.join(" + ")} / ${atlasSelection.subregions.join(" + ")}`
                    : "Use search or shortlist"}
                </strong>
              </div>
              <div className={styles.atlasCard}>
                <span>Traits</span>
                <strong>
                  {atlasSelection
                    ? [
                        atlasSelection.transcontinental ? "Transcontinental" : null,
                        atlasSelection.island ? "Island" : null,
                        atlasSelection.archipelago ? "Archipelago" : null,
                        atlasSelection.landlocked ? "Landlocked" : null,
                        atlasSelection.crossesEquator ? "Equator" : null,
                        atlasSelection.majorityMuslim ? "Muslim-majority" : null,
                        atlasSelection.majorityChristian ? "Christian-majority" : null,
                        atlasSelection.mediterraneanAccess ? "Mediterranean" : null,
                        atlasSelection.saharaDesert ? "Sahara" : null,
                        atlasSelection.eu ? "EU" : null,
                      ]
                        .filter(Boolean)
                        .join(" • ") || "No special tags"
                    : "No country selected"}
                </strong>
              </div>
            </div>

            <div className={styles.lookupList}>
              {atlasCountries.slice(0, 18).map((country) => (
                <button
                  key={country.name}
                  type="button"
                  className={`${styles.lookupRow} ${atlasSelection?.name === country.name ? styles.lookupRowActive : ""}`}
                  onClick={() => setSelectedCountryName(country.name)}
                >
                  <span>{country.name}</span>
                  <small>
                    {country.continents.join(" + ")} / {country.subregions[0]}
                  </small>
                </button>
              ))}
            </div>
          </div>

          {match.playMode === "both-ways" &&
          (match.status === "user-won" || match.status === "ai-won") &&
          match.computerCountry ? (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.panelEyebrow}>Reveal</p>
                  <h2>Result</h2>
                </div>
              </div>
              <div className={styles.resultCard}>
                <Trophy size={20} />
                <div>
                  <strong>
                    {match.status === "user-won" ? "You won" : "Computer won"}
                  </strong>
                  <p>The hidden computer country was {match.computerCountry.name}.</p>
                </div>
              </div>
            </div>
          ) : null}

          {needsAudit ? (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.panelEyebrow}>Post-Match Audit</p>
                  <h2>Why I missed it</h2>
                </div>
              </div>

              <label className={styles.searchField}>
                <Search size={16} />
                <input
                  value={revealedCountry}
                  disabled={isAuditing}
                  onChange={(event) => {
                    setRevealedCountry(event.target.value);
                    setDiagnosis(null);
                  }}
                  placeholder="Reveal your country to audit the miss"
                />
              </label>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleRevealCountry}
                disabled={!revealedCountry.trim() || isAuditing}
              >
                <LocateFixed size={18} />
                {isAuditing ? "Checking online references..." : "Audit miss"}
              </button>

              {diagnosis ? (
                <div className={styles.auditWrap}>
                  <div className={styles.resultCard}>
                    <BrainCircuit size={20} />
                    <div>
                      <strong>{diagnosis.title}</strong>
                      <p>{diagnosis.summary}</p>
                    </div>
                  </div>

                  <div className={styles.auditList}>
                    {diagnosis.details.map((detail) => (
                      <p key={detail} className={styles.auditItem}>
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <p className={styles.helperText}>
                  {isAuditing
                    ? "I’m checking the recorded answers against online references before I decide whether to blame your answers or my atlas."
                    : "I’ll check whether the miss came from the wrong difficulty, an inconsistent answer trail, or a fact I stored incorrectly."}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

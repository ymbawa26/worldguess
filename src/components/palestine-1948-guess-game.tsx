"use client";

import {
  BrainCircuit,
  Landmark,
  LocateFixed,
  MapPinned,
  Radar,
  RefreshCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import styles from "@/components/world-guess-game.module.css";
import {
  applyPalestineTurnAnswer,
  choosePalestineQuestion,
  findPalestineCityName,
  getPalestineLookup,
  getPalestineShortlistPreview,
  PALESTINE_1948_CITIES,
  PALESTINE_1948_BY_NAME,
  type PalestineCityName,
  type PalestineCityRecord,
  type PalestineQuestion,
  type PalestineTurnAnswer,
} from "@/lib/palestine-1948-game";

type MatchStatus = "setup" | "playing" | "ai-won" | "ai-stuck";

type LogEntry = {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
};

type AnswerHistoryEntry = {
  question: PalestineQuestion;
  answer: PalestineTurnAnswer;
};

type DiagnosisResult = {
  title: string;
  summary: string;
  details: string[];
};

type MatchState = {
  status: MatchStatus;
  candidates: PalestineCityRecord[];
  currentQuestion: PalestineQuestion | null;
  askedQuestionIds: string[];
  answerHistory: AnswerHistoryEntry[];
  log: LogEntry[];
};

function createLogEntry(role: LogEntry["role"], content: string, prefix = role) {
  return {
    id: `${prefix}-${crypto.randomUUID()}`,
    role,
    content,
  } satisfies LogEntry;
}

function createMatchState() {
  const openingQuestion = choosePalestineQuestion(PALESTINE_1948_CITIES, new Set());

  return {
    status: "playing",
    candidates: PALESTINE_1948_CITIES,
    currentQuestion: openingQuestion ?? null,
    askedQuestionIds: openingQuestion ? [openingQuestion.id] : [],
    answerHistory: [],
    log: [
      createLogEntry(
        "system",
        "Palestine 1948 mode is fixed to one city roster. Think of one city from the list and keep it secret.",
      ),
      createLogEntry(
        "assistant",
        openingQuestion
          ? `Let’s begin. ${openingQuestion.prompt}`
          : "Let’s begin. I’m building my opening city clue.",
      ),
    ],
  } satisfies MatchState;
}

function getPersistentAskedQuestionIds(
  askedQuestionIds: string[],
  currentQuestion: MatchState["currentQuestion"],
  currentAnswer: PalestineTurnAnswer,
) {
  if (currentQuestion?.guessedCity && currentAnswer === "idk") {
    return askedQuestionIds.filter((questionId) => questionId !== currentQuestion.id);
  }

  return askedQuestionIds;
}

function buildAssistantMessage({
  nextQuestion,
  candidateCount,
  inconsistencyWarning,
}: {
  nextQuestion?: PalestineQuestion | null;
  candidateCount: number;
  inconsistencyWarning?: string;
}) {
  const lines = [
    inconsistencyWarning
      ? `Shortlist note: ${inconsistencyWarning}`
      : `I’m down to ${candidateCount} possible cities for you.`,
  ];

  if (nextQuestion) {
    lines.push(`My question: ${nextQuestion.prompt}`);
  }

  return lines.join("\n\n");
}

function buildDiagnosis(match: MatchState, revealedCityName: PalestineCityName) {
  const actualCity = PALESTINE_1948_BY_NAME.get(revealedCityName);

  if (!actualCity) {
    return {
      title: "I could not match that city name",
      summary: "Use one of the listed city names so I can replay the clue trail correctly.",
      details: [`I could not match "${revealedCityName}" to the current city roster.`],
    } satisfies DiagnosisResult;
  }

  const contradictions = match.answerHistory
    .filter((entry) => entry.answer !== "idk")
    .filter((entry) => {
      const expected = entry.question.test(actualCity) ? "yes" : "no";
      return expected !== entry.answer;
    })
    .map((entry) => {
      const expected = entry.question.test(actualCity) ? "yes" : "no";
      return { entry, expected };
    });

  if (contradictions.length === 0) {
    const stillOnShortlist = match.candidates.some((city) => city.name === actualCity.name);

    return {
      title: stillOnShortlist
        ? "Your answers still fit the revealed city"
        : "I ran out of city separators before isolating it",
      summary: stillOnShortlist
        ? "The clue trail still fits the city you revealed, so I simply did not finish the deduction fast enough."
        : "The answer trail was self-consistent, but my current city question bank still failed to keep that city alive to the end.",
      details: [
        `${actualCity.name} still fits the recorded clues.`,
        `I ended the round with ${match.candidates.length} cities still alive in the shortlist.`,
      ],
    } satisfies DiagnosisResult;
  }

  return {
    title: "At least one answer conflicted with the revealed city",
    summary:
      "The miss most likely came from one or more answers that filtered the correct city out of the shortlist.",
    details: contradictions.slice(0, 4).map(
      ({ entry, expected }) =>
        `${entry.question.prompt} You answered ${entry.answer.toUpperCase()}, but ${expected.toUpperCase()} fits ${actualCity.name}.`,
    ),
  } satisfies DiagnosisResult;
}

export default function Palestine1948GuessGame() {
  const [match, setMatch] = useState<MatchState>({
    status: "setup",
    candidates: [],
    currentQuestion: null,
    askedQuestionIds: [],
    answerHistory: [],
    log: [],
  });
  const [turnAnswer, setTurnAnswer] = useState<PalestineTurnAnswer | null>(null);
  const [revealedCity, setRevealedCity] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [lookupQuery, setLookupQuery] = useState("");
  const [selectedCityName, setSelectedCityName] = useState<PalestineCityName | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [match.log]);

  const shortlistPreview = useMemo(
    () => getPalestineShortlistPreview(match.candidates, 10),
    [match.candidates],
  );
  const lookupCities = useMemo(() => getPalestineLookup(lookupQuery), [lookupQuery]);
  const selectedCity =
    selectedCityName && PALESTINE_1948_BY_NAME.has(selectedCityName)
      ? PALESTINE_1948_BY_NAME.get(selectedCityName) ?? null
      : shortlistPreview[0] ?? lookupCities[0] ?? null;
  const needsAudit = match.status === "ai-stuck";

  function startGame() {
    setTurnAnswer(null);
    setRevealedCity("");
    setDiagnosis(null);
    setLookupQuery("");
    const nextMatch = createMatchState();
    setSelectedCityName(nextMatch.candidates[0]?.name ?? null);
    setMatch(nextMatch);
  }

  function resetGame() {
    setTurnAnswer(null);
    setRevealedCity("");
    setDiagnosis(null);
    setLookupQuery("");
    setSelectedCityName(null);
    setMatch({
      status: "setup",
      candidates: [],
      currentQuestion: null,
      askedQuestionIds: [],
      answerHistory: [],
      log: [],
    });
  }

  function handleTurnSubmit() {
    if (!match.currentQuestion || !turnAnswer) {
      return;
    }

    const currentQuestion = match.currentQuestion;
    const nextAnswerHistory = [
      ...match.answerHistory,
      { question: currentQuestion, answer: turnAnswer },
    ];

    startTransition(() => {
      const resolution = applyPalestineTurnAnswer(
        currentQuestion,
        turnAnswer,
        match.candidates,
      );
      const baseLog = [
        ...match.log,
        createLogEntry("user", `Your answer: ${turnAnswer.toUpperCase()}`),
      ];
      const persistentAskedQuestionIds = getPersistentAskedQuestionIds(
        match.askedQuestionIds,
        currentQuestion,
        turnAnswer,
      );

      if (resolution.aiWon) {
        setMatch({
          ...match,
          status: "ai-won",
          candidates: resolution.candidates,
          currentQuestion: null,
          answerHistory: nextAnswerHistory,
          log: [...baseLog, createLogEntry("assistant", "That confirms it. I got your city.")],
        });
        setTurnAnswer(null);
        return;
      }

      const askedSet = new Set(persistentAskedQuestionIds);
      const nextQuestion = choosePalestineQuestion(resolution.candidates, askedSet);
      const nextAskedIds = nextQuestion
        ? [...persistentAskedQuestionIds, nextQuestion.id]
        : persistentAskedQuestionIds;
      const assistantMessage = buildAssistantMessage({
        nextQuestion,
        candidateCount: resolution.candidates.length,
        inconsistencyWarning: resolution.inconsistencyWarning,
      });

      if (!nextQuestion) {
        setMatch({
          ...match,
          status: "ai-stuck",
          candidates: resolution.candidates,
          currentQuestion: null,
          askedQuestionIds: nextAskedIds,
          answerHistory: nextAnswerHistory,
          log: [
            ...baseLog,
            createLogEntry(
              "assistant",
              `${assistantMessage}\n\nReveal your city and I’ll explain why I missed it.`,
            ),
          ],
        });
        setTurnAnswer(null);
        return;
      }

      setMatch({
        ...match,
        status: "playing",
        candidates: resolution.candidates,
        currentQuestion: nextQuestion,
        askedQuestionIds: nextAskedIds,
        answerHistory: nextAnswerHistory,
        log: [...baseLog, createLogEntry("assistant", assistantMessage)],
      });
      setTurnAnswer(null);
    });
  }

  function handleRevealCity() {
    const cityName = findPalestineCityName(revealedCity);

    if (!cityName) {
      setDiagnosis({
        title: "I need one of the listed city names",
        summary:
          "Try one of the roster names like `Haifa`, `Jericho`, `Tabarias`, or `Umm al Rashrash`.",
        details: ["I only audit the miss after I can match your reveal to the current city list."],
      });
      return;
    }

    setSelectedCityName(cityName);
    setDiagnosis(buildDiagnosis(match, cityName));
  }

  const titleCopy =
    match.status === "setup"
      ? "A separate city mode built around Palestine 1948"
      : match.status === "ai-won"
        ? "The computer nailed your city"
        : match.status === "ai-stuck"
          ? "Reveal the city so I can audit the miss"
          : "Answer the clues and watch the city shortlist tighten";

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>
            <Sparkles size={16} />
            Palestine 1948
          </span>
          <h1>{titleCopy}</h1>
          <p>
            This separate mode focuses on a fixed roster of Palestine 1948 cities.
            The computer only has to identify your city, using geography, historical
            grouping, coastal access, and religious-significance clues.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Radar size={18} />
            <span>{PALESTINE_1948_CITIES.length} cities in one fixed roster</span>
          </div>
          <div className={styles.statCard}>
            <BrainCircuit size={18} />
            <span>Jordan Valley, Galilee, Gaza, Naqab, and significance clues</span>
          </div>
          <div className={styles.statCard}>
            <MapPinned size={18} />
            <span>Searchable city reference list on the side</span>
          </div>
        </div>
      </section>

      <section className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Setup</p>
                <h2>Palestine 1948 mode</h2>
              </div>
              {match.status !== "setup" ? (
                <button className={styles.ghostButton} onClick={resetGame} type="button">
                  <RefreshCcw size={16} />
                  New match
                </button>
              ) : null}
            </div>

            <div className={styles.difficultyGrid}>
              <button type="button" className={`${styles.difficultyCard} ${styles.difficultyCardActive}`}>
                <span>Single Difficulty</span>
                <strong>Fixed historical city roster</strong>
                <small>The computer always works from the same Palestine 1948 city list.</small>
              </button>
            </div>

            {match.status === "setup" ? (
              <button className={styles.primaryButton} type="button" onClick={startGame}>
                <LocateFixed size={18} />
                Start Palestine 1948 match
              </button>
            ) : (
              <div className={styles.metaGrid}>
                <div className={styles.metaCard}>
                  <span>Mode</span>
                  <strong>Computer Only</strong>
                </div>
                <div className={styles.metaCard}>
                  <span>Difficulty</span>
                  <strong>Fixed</strong>
                </div>
                <div className={styles.metaCard}>
                  <span>Shortlist</span>
                  <strong>{match.candidates.length} left</strong>
                </div>
                <div className={styles.metaCard}>
                  <span>Status</span>
                  <strong>
                    {match.status === "playing"
                      ? "In progress"
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
              <p className={styles.emptyState}>Start a match to see the live shortlist.</p>
            ) : (
              <>
                <div className={styles.shortlist}>
                  {shortlistPreview.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      className={`${styles.countryPill} ${selectedCity?.name === city.name ? styles.countryPillActive : ""}`}
                      onClick={() => setSelectedCityName(city.name)}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
                <p className={styles.helperText}>
                  These are the leading city candidates still alive in the computer’s shortlist.
                </p>
              </>
            )}
          </div>
        </div>

        <div className={styles.centerColumn}>
          <div className={`${styles.panel} ${styles.chatPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Turn Flow</p>
                <h2>City log</h2>
              </div>
            </div>

            <div className={styles.log}>
              {match.log.length === 0 ? (
                <div className={styles.emptyStateTall}>Start the Palestine 1948 mode to begin.</div>
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
                    {needsAudit ? "Post-match audit" : "Answer the computer"}
                  </span>
                  <strong>
                    {needsAudit
                      ? "Reveal your city so I can explain why I missed it."
                      : match.currentQuestion?.prompt ??
                        (match.status === "setup"
                          ? "Start the mode to get the opening clue."
                          : "The match is over.")}
                  </strong>
                </div>
              </div>

              {needsAudit ? (
                <>
                  <label className={styles.formLabel} htmlFor="reveal-city">
                    Reveal your city
                  </label>
                  <label className={styles.searchField} htmlFor="reveal-city">
                    <Search size={16} />
                    <input
                      id="reveal-city"
                      value={revealedCity}
                      onChange={(event) => {
                        setRevealedCity(event.target.value);
                        setDiagnosis(null);
                      }}
                      placeholder="Type the city you had in mind"
                    />
                  </label>

                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={!revealedCity.trim()}
                    onClick={handleRevealCity}
                  >
                    <LocateFixed size={18} />
                    Audit miss
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
                      I’ll explain whether the miss came from contradictory answers or
                      from me running out of good city separators.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.answerRow}>
                    {(["yes", "no", "idk"] as PalestineTurnAnswer[]).map((answer) => (
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

                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={match.status !== "playing" || !turnAnswer}
                    onClick={handleTurnSubmit}
                  >
                    <LocateFixed size={18} />
                    Send answer
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
                <p className={styles.panelEyebrow}>Reference List</p>
                <h2>City lookup</h2>
              </div>
            </div>

            <label className={styles.searchField}>
              <Search size={16} />
              <input
                value={lookupQuery}
                onChange={(event) => setLookupQuery(event.target.value)}
                placeholder="Search a city"
              />
            </label>

            <div className={styles.atlasMeta}>
              <div className={styles.atlasCard}>
                <span>Selected</span>
                <strong>{selectedCity?.name ?? "Nothing selected"}</strong>
              </div>
              <div className={styles.atlasCard}>
                <span>Area</span>
                <strong>{selectedCity?.area ?? "Use search or shortlist"}</strong>
              </div>
              <div className={styles.atlasCard}>
                <span>Tags</span>
                <strong>
                  {selectedCity
                    ? [
                        selectedCity.palestine48 ? "Palestine 48" : null,
                        selectedCity.westBank ? "West Bank" : null,
                        selectedCity.gazaStrip ? "Gaza" : null,
                        selectedCity.jordanValley ? "Jordan Valley" : null,
                        selectedCity.muslimSignificance ? "Muslim significance" : null,
                        selectedCity.christianSignificance ? "Christian significance" : null,
                        selectedCity.closeToLebanon ? "Near Lebanon" : null,
                        selectedCity.closeToEgypt ? "Near Egypt" : null,
                        selectedCity.mediterraneanCoast ? "Mediterranean" : null,
                        selectedCity.redSea ? "Red Sea" : null,
                      ]
                        .filter(Boolean)
                        .join(" • ") || "No special tags"
                    : "No city selected"}
                </strong>
              </div>
            </div>

            <div className={styles.lookupList}>
              {lookupCities.slice(0, 23).map((city) => (
                <button
                  key={city.name}
                  type="button"
                  className={`${styles.lookupRow} ${selectedCity?.name === city.name ? styles.lookupRowActive : ""}`}
                  onClick={() => setSelectedCityName(city.name)}
                >
                  <span>{city.name}</span>
                  <small>{city.area}</small>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Mode Notes</p>
                <h2>Custom clue themes</h2>
              </div>
            </div>
            <div className={styles.resultCard}>
              <Landmark size={20} />
              <div>
                <strong>Question bank</strong>
                <p>
                  This mode includes Palestine 48, Jordan Valley, Lebanon, Egypt,
                  Muslim significance, Christian significance, Gaza, Galilee, and
                  Naqab clue paths.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import {
  BrainCircuit,
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
  applyStateTurnAnswer,
  chooseStateQuestion,
  findStateName,
  getStateLookup,
  getStateShortlistPreview,
  STATES,
  STATES_BY_NAME,
  type StateName,
  type StateQuestion,
  type StateRecord,
  type StateTurnAnswer,
} from "@/lib/us-state-game";

type MatchStatus = "setup" | "playing" | "ai-won" | "ai-stuck";

type LogEntry = {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
};

type AnswerHistoryEntry = {
  question: StateQuestion;
  answer: StateTurnAnswer;
};

type DiagnosisResult = {
  title: string;
  summary: string;
  details: string[];
};

type MatchState = {
  status: MatchStatus;
  candidates: StateRecord[];
  currentQuestion: StateQuestion | null;
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
  const openingQuestion = chooseStateQuestion(STATES, new Set());

  return {
    status: "playing",
    candidates: STATES,
    currentQuestion: openingQuestion ?? null,
    askedQuestionIds: openingQuestion ? [openingQuestion.id] : [],
    answerHistory: [],
    log: [
      createLogEntry(
        "system",
        "US states mode is locked to one difficulty: all 50 states. Think of one state and keep it secret.",
      ),
      createLogEntry(
        "assistant",
        openingQuestion
          ? `Let’s begin. ${openingQuestion.prompt}`
          : "Let’s begin. I’m building my opening state clue.",
      ),
    ],
  } satisfies MatchState;
}

function buildAssistantMessage({
  nextQuestion,
  candidateCount,
  inconsistencyWarning,
}: {
  nextQuestion?: StateQuestion | null;
  candidateCount: number;
  inconsistencyWarning?: string;
}) {
  const lines = [
    inconsistencyWarning
      ? `Shortlist note: ${inconsistencyWarning}`
      : `I’m down to ${candidateCount} possible states for you.`,
  ];

  if (nextQuestion) {
    lines.push(`My question: ${nextQuestion.prompt}`);
  }

  return lines.join("\n\n");
}

function buildDiagnosis(match: MatchState, revealedStateName: StateName) {
  const actualState = STATES_BY_NAME.get(revealedStateName);

  if (!actualState) {
    return {
      title: "I could not match that state name",
      summary: "Use the full state name so I can replay the clue trail correctly.",
      details: [`I could not match "${revealedStateName}" to one of the 50 states.`],
    } satisfies DiagnosisResult;
  }

  const contradictions = match.answerHistory
    .filter((entry) => entry.answer !== "idk")
    .filter((entry) => {
      const expected = entry.question.test(actualState) ? "yes" : "no";
      return expected !== entry.answer;
    })
    .map((entry) => {
      const expected = entry.question.test(actualState) ? "yes" : "no";
      return { entry, expected };
    });

  if (contradictions.length === 0) {
    const stillOnShortlist = match.candidates.some((state) => state.name === actualState.name);

    return {
      title: stillOnShortlist
        ? "Your answers still fit the revealed state"
        : "I ran out of state clues before isolating it",
      summary: stillOnShortlist
        ? "The answer trail still fits the state you revealed, so I simply did not finish the deduction fast enough."
        : "The answer trail was self-consistent, but my current state question bank still failed to keep that state alive to the end.",
      details: [
        `${actualState.name} was a valid state for this mode.`,
        `I finished with ${match.candidates.length} states still alive in the shortlist.`,
      ],
    } satisfies DiagnosisResult;
  }

  return {
    title: "At least one answer conflicted with the revealed state",
    summary:
      "The miss most likely came from one or more answers that filtered the correct state out of the shortlist.",
    details: contradictions.slice(0, 4).map(
      ({ entry, expected }) =>
        `${entry.question.prompt} You answered ${entry.answer.toUpperCase()}, but ${expected.toUpperCase()} fits ${actualState.name}.`,
    ),
  } satisfies DiagnosisResult;
}

export default function USStateGuessGame() {
  const [match, setMatch] = useState<MatchState>({
    status: "setup",
    candidates: [],
    currentQuestion: null,
    askedQuestionIds: [],
    answerHistory: [],
    log: [],
  });
  const [turnAnswer, setTurnAnswer] = useState<StateTurnAnswer | null>(null);
  const [revealedState, setRevealedState] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [lookupQuery, setLookupQuery] = useState("");
  const [selectedStateName, setSelectedStateName] = useState<StateName | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [match.log]);

  const shortlistPreview = useMemo(
    () => getStateShortlistPreview(match.candidates, 10),
    [match.candidates],
  );
  const lookupStates = useMemo(() => getStateLookup(lookupQuery), [lookupQuery]);
  const selectedState =
    selectedStateName && STATES_BY_NAME.has(selectedStateName)
      ? STATES_BY_NAME.get(selectedStateName) ?? null
      : shortlistPreview[0] ?? lookupStates[0] ?? null;
  const needsAudit = match.status === "ai-stuck";

  function startGame() {
    setTurnAnswer(null);
    setRevealedState("");
    setDiagnosis(null);
    setLookupQuery("");
    const nextMatch = createMatchState();
    setSelectedStateName(nextMatch.candidates[0]?.name ?? null);
    setMatch(nextMatch);
  }

  function resetGame() {
    setTurnAnswer(null);
    setRevealedState("");
    setDiagnosis(null);
    setLookupQuery("");
    setSelectedStateName(null);
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
      const resolution = applyStateTurnAnswer(currentQuestion, turnAnswer, match.candidates);
      const baseLog = [
        ...match.log,
        createLogEntry("user", `Your answer: ${turnAnswer.toUpperCase()}`),
      ];

      if (resolution.aiWon) {
        setMatch({
          ...match,
          status: "ai-won",
          candidates: resolution.candidates,
          currentQuestion: null,
          answerHistory: nextAnswerHistory,
          log: [...baseLog, createLogEntry("assistant", "That confirms it. I got your state.")],
        });
        setTurnAnswer(null);
        return;
      }

      const askedSet = new Set(match.askedQuestionIds);
      const nextQuestion = chooseStateQuestion(resolution.candidates, askedSet);
      const nextAskedIds = nextQuestion
        ? [...match.askedQuestionIds, nextQuestion.id]
        : match.askedQuestionIds;
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
              `${assistantMessage}\n\nReveal your state and I’ll explain why I missed it.`,
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

  function handleRevealState() {
    const stateName = findStateName(revealedState);

    if (!stateName) {
      setDiagnosis({
        title: "I need the full state name",
        summary: "Try the full state name like `New Mexico` or `North Carolina`.",
        details: ["I only audit the miss after I can match your reveal to one of the 50 states."],
      });
      return;
    }

    setSelectedStateName(stateName);
    setDiagnosis(buildDiagnosis(match, stateName));
  }

  const titleCopy =
    match.status === "setup"
      ? "A separate mode just for the 50 US states"
      : match.status === "ai-won"
        ? "The computer nailed your state"
        : match.status === "ai-stuck"
          ? "Reveal the state so I can audit the miss"
          : "Answer the clues and watch the state shortlist tighten";

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>
            <Sparkles size={16} />
            US States
          </span>
          <h1>{titleCopy}</h1>
          <p>
            This separate mode uses the same deduction idea, but the computer is only
            trying to identify one of the 50 US states. It is locked to a single
            difficulty and built for one-way play.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Radar size={18} />
            <span>All 50 states in one fixed difficulty</span>
          </div>
          <div className={styles.statCard}>
            <BrainCircuit size={18} />
            <span>Region, coastline, borders, terrain, and time-zone clues</span>
          </div>
          <div className={styles.statCard}>
            <MapPinned size={18} />
            <span>Searchable state reference list on the side</span>
          </div>
        </div>
      </section>

      <section className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Setup</p>
                <h2>US states mode</h2>
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
                <strong>All 50 US states</strong>
                <small>The state mode always uses the full 50-state roster.</small>
              </button>
            </div>

            {match.status === "setup" ? (
              <button className={styles.primaryButton} type="button" onClick={startGame}>
                <LocateFixed size={18} />
                Start state match
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
                  {shortlistPreview.map((state) => (
                    <button
                      key={state.name}
                      type="button"
                      className={`${styles.countryPill} ${selectedState?.name === state.name ? styles.countryPillActive : ""}`}
                      onClick={() => setSelectedStateName(state.name)}
                    >
                      {state.name}
                    </button>
                  ))}
                </div>
                <p className={styles.helperText}>
                  These are the leading state candidates still alive in the computer’s shortlist.
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
                <h2>State log</h2>
              </div>
            </div>

            <div className={styles.log}>
              {match.log.length === 0 ? (
                <div className={styles.emptyStateTall}>Start the state mode to begin.</div>
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
                      ? "Reveal your state so I can explain why I missed it."
                      : match.currentQuestion?.prompt ??
                        (match.status === "setup"
                          ? "Start the state mode to get the opening clue."
                          : "The match is over.")}
                  </strong>
                </div>
              </div>

              {needsAudit ? (
                <>
                  <label className={styles.formLabel} htmlFor="reveal-state">
                    Reveal your state
                  </label>
                  <label className={styles.searchField} htmlFor="reveal-state">
                    <Search size={16} />
                    <input
                      id="reveal-state"
                      value={revealedState}
                      onChange={(event) => {
                        setRevealedState(event.target.value);
                        setDiagnosis(null);
                      }}
                      placeholder="Type the state you had in mind"
                    />
                  </label>

                  <button
                    type="button"
                    className={styles.primaryButton}
                    disabled={!revealedState.trim()}
                    onClick={handleRevealState}
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
                      from me running out of good state clues.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.answerRow}>
                    {(["yes", "no", "idk"] as StateTurnAnswer[]).map((answer) => (
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
                <p className={styles.panelEyebrow}>State Reference</p>
                <h2>Lookup</h2>
              </div>
            </div>

            <label className={styles.searchField}>
              <Search size={16} />
              <input
                value={lookupQuery}
                onChange={(event) => setLookupQuery(event.target.value)}
                placeholder="Search a US state"
              />
            </label>

            <div className={styles.atlasMeta}>
              <div className={styles.atlasCard}>
                <span>Selected</span>
                <strong>{selectedState?.name ?? "Nothing selected"}</strong>
              </div>
              <div className={styles.atlasCard}>
                <span>Region</span>
                <strong>
                  {selectedState
                    ? `${selectedState.region} / ${selectedState.division}`
                    : "Search or pick a shortlist state"}
                </strong>
              </div>
              <div className={styles.atlasCard}>
                <span>Traits</span>
                <strong>
                  {selectedState
                    ? [
                        selectedState.coastal ? "Coastal" : "Landlocked",
                        selectedState.bordersCanada ? "Canada" : null,
                        selectedState.bordersMexico ? "Mexico" : null,
                        selectedState.greatLakes ? "Great Lakes" : null,
                        selectedState.originalThirteen ? "Original 13" : null,
                        selectedState.nonContiguous ? "Non-contiguous" : null,
                      ]
                        .filter(Boolean)
                        .join(" • ")
                    : "No state selected"}
                </strong>
              </div>
            </div>

            <div className={styles.lookupList}>
              {lookupStates.map((state) => (
                <button
                  key={state.name}
                  type="button"
                  className={`${styles.lookupRow} ${selectedState?.name === state.name ? styles.lookupRowActive : ""}`}
                  onClick={() => setSelectedStateName(state.name)}
                >
                  <span>{state.name}</span>
                  <small>
                    {state.abbreviation} / {state.region}
                  </small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

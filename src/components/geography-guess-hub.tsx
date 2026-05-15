"use client";

import { Globe2, Landmark, Map } from "lucide-react";
import { useState } from "react";

import styles from "@/components/geography-guess-hub.module.css";
import Palestine1948GuessGame from "@/components/palestine-1948-guess-game";
import USStateGuessGame from "@/components/us-state-guess-game";
import WorldGuessGame from "@/components/world-guess-game";

type GeographyMode = "world" | "states" | "palestine1948";

const MODE_COPY: Record<
  GeographyMode,
  {
    eyebrow: string;
    title: string;
    detail: string;
    icon: typeof Globe2;
  }
> = {
  world: {
    eyebrow: "Countries",
    title: "World Countries",
    detail:
      "Play the full country game with easy, medium, and hard difficulty, plus computer-only or both-ways play.",
    icon: Globe2,
  },
  states: {
    eyebrow: "States",
    title: "US States",
    detail:
      "Play a separate one-difficulty state mode where the computer narrows down one of the 50 US states.",
    icon: Map,
  },
  palestine1948: {
    eyebrow: "Cities",
    title: "Palestine 1948",
    detail:
      "Play a separate city mode with a fixed historical roster and custom clues like Jordan Valley, Palestine 48, Lebanon, Egypt, and religious significance.",
    icon: Landmark,
  },
};

export default function GeographyGuessHub() {
  const [mode, setMode] = useState<GeographyMode>("world");

  return (
    <div className={styles.page}>
      <section className={styles.modeShell}>
        <div className={styles.modeBar}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Geography Game Modes</span>
            <h2>Switch between world countries, US states, and Palestine 1948 cities</h2>
            <p>
              Countries keeps the full original game. States is a separate fixed
              state roster. Palestine 1948 is its own city mode with custom
              historical and geographic clue groups.
            </p>
          </div>

          <div className={styles.modeGrid}>
            {(Object.keys(MODE_COPY) as GeographyMode[]).map((modeKey) => {
              const option = MODE_COPY[modeKey];
              const Icon = option.icon;

              return (
                <button
                  key={modeKey}
                  type="button"
                  className={`${styles.modeCard} ${mode === modeKey ? styles.modeCardActive : ""}`}
                  onClick={() => setMode(modeKey)}
                >
                  <span>
                    <Icon size={15} /> {option.eyebrow}
                  </span>
                  <strong>{option.title}</strong>
                  <p>{option.detail}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {mode === "world" ? (
        <WorldGuessGame />
      ) : mode === "states" ? (
        <USStateGuessGame />
      ) : (
        <Palestine1948GuessGame />
      )}
    </div>
  );
}

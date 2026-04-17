"use client";

import { Globe2, Map } from "lucide-react";
import { useState } from "react";

import styles from "@/components/geography-guess-hub.module.css";
import USStateGuessGame from "@/components/us-state-guess-game";
import WorldGuessGame from "@/components/world-guess-game";

type GeographyMode = "world" | "states";

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
};

export default function GeographyGuessHub() {
  const [mode, setMode] = useState<GeographyMode>("world");

  return (
    <div className={styles.page}>
      <section className={styles.modeShell}>
        <div className={styles.modeBar}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Geography Game Modes</span>
            <h2>Switch between world countries and a separate US states mode</h2>
            <p>
              Countries keeps the full original game. States is its own mode with
              one fixed difficulty and the computer focused only on guessing your
              state.
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

      {mode === "world" ? <WorldGuessGame /> : <USStateGuessGame />}
    </div>
  );
}

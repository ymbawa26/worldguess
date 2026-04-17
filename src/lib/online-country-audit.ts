import type { TurnAnswer } from "@/lib/world-game";

export type AuditQuestionPayload = {
  questionId: string;
  prompt: string;
  answer: TurnAnswer;
};

export type RemoteAuditCheck = {
  questionId: string;
  prompt: string;
  answer: "yes" | "no" | "maybe";
  supported: boolean;
  sources: string[];
  note?: string;
};

export type RemoteAuditResponse = {
  available: boolean;
  resolvedCountryName: string;
  checks: RemoteAuditCheck[];
  note?: string;
};

type RestCountryApiResult = {
  name?: {
    common?: string;
    official?: string;
  };
  cca3?: string;
  altSpellings?: string[];
  continents?: string[];
  subregion?: string;
  borders?: string[];
  languages?: Record<string, string>;
  landlocked?: boolean;
  population?: number;
  unMember?: boolean;
};

type RestCountrySnapshot = {
  commonName: string;
  officialName: string;
  cca3: string;
  altSpellings: string[];
  continents: string[];
  subregion: string | null;
  borders: string[];
  languages: string[];
  landlocked: boolean | null;
  population: number | null;
  unMember: boolean | null;
};

type WikidataSearchResult = {
  id: string;
  label?: string;
  description?: string;
  aliases?: string[];
};

type WikidataSummary = {
  memberships: string[];
  borders: string[];
  languages: string[];
  governments: string[];
  continents: string[];
  waters: string[];
};

const REST_COUNTRIES_URL = "https://restcountries.com/v3.1";
const WIKIDATA_ACTION_API = "https://www.wikidata.org/w/api.php";
const WIKIDATA_QUERY_API = "https://query.wikidata.org/sparql";
const USER_AGENT = "WorldGuess/0.1 (country audit)";

const BORDER_CODE_BY_ANCHOR: Record<string, string> = {
  China: "CHN",
  Brazil: "BRA",
  Russia: "RUS",
  India: "IND",
  Iran: "IRN",
  Iraq: "IRQ",
  Pakistan: "PAK",
  Tanzania: "TZA",
  Mexico: "MEX",
  Colombia: "COL",
  Greece: "GRC",
  Hungary: "HUN",
  Moldova: "MDA",
  France: "FRA",
  Senegal: "SEN",
  Indonesia: "IDN",
  Yemen: "YEM",
  Panama: "PAN",
  Poland: "POL",
  "Saudi Arabia": "SAU",
  "United States": "USA",
  Nigeria: "NGA",
  Sudan: "SDN",
  Algeria: "DZA",
  Kazakhstan: "KAZ",
  "Bosnia and Herzegovina": "BIH",
  "Democratic Republic of the Congo": "COD",
  "Costa Rica": "CRI",
};

const SUBREGION_LABEL_BY_ID: Record<string, string> = {
  "northern-africa": "Northern Africa",
  "western-africa": "Western Africa",
  "middle-africa": "Middle Africa",
  "eastern-africa": "Eastern Africa",
  "southern-africa": "Southern Africa",
  "western-asia": "Western Asia",
  "central-asia": "Central Asia",
  "southern-asia": "Southern Asia",
  "south-eastern-asia": "South-Eastern Asia",
  "eastern-asia": "Eastern Asia",
  "northern-europe": "Northern Europe",
  "western-europe": "Western Europe",
  "southern-europe": "Southern Europe",
  "eastern-europe": "Eastern Europe",
  "central-america": "Central America",
  caribbean: "Caribbean",
};

const LANGUAGE_LABEL_BY_QUESTION: Record<string, string> = {
  "trait:english-official": "English",
  "trait:spanish-official": "Spanish",
  "trait:french-official": "French",
  "trait:arabic-official": "Arabic",
  "trait:portuguese-official": "Portuguese",
};

const MEMBERSHIP_ALIASES: Record<string, string[]> = {
  "org:eu": ["european union"],
  "org:nato": ["north atlantic treaty organization", "nato"],
  "org:g20": ["g20", "group of twenty"],
  "org:arab-league": ["arab league", "league of arab states"],
  "org:un-member": ["united nations"],
};

const OFFICIAL_MEMBERSHIP_NAMES: Partial<Record<string, Set<string>>> = {
  "org:eu": new Set([
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
  ]),
  "org:nato": new Set([
    "Albania",
    "Belgium",
    "Bulgaria",
    "Canada",
    "Croatia",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Montenegro",
    "Netherlands",
    "North Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Turkey",
    "United Kingdom",
    "United States",
  ]),
  "org:g20": new Set([
    "Argentina",
    "Australia",
    "Brazil",
    "Canada",
    "China",
    "France",
    "Germany",
    "India",
    "Indonesia",
    "Italy",
    "Japan",
    "Mexico",
    "Russia",
    "Saudi Arabia",
    "South Africa",
    "South Korea",
    "Turkey",
    "United Kingdom",
    "United States",
  ]),
  "org:arab-league": new Set([
    "Algeria",
    "Bahrain",
    "Comoros",
    "Djibouti",
    "Egypt",
    "Iraq",
    "Jordan",
    "Kuwait",
    "Lebanon",
    "Libya",
    "Mauritania",
    "Morocco",
    "Oman",
    "Palestine",
    "Qatar",
    "Saudi Arabia",
    "Somalia",
    "Sudan",
    "Syria",
    "Tunisia",
    "United Arab Emirates",
    "Yemen",
  ]),
};

const OFFICIAL_MEMBERSHIP_SOURCES: Partial<Record<string, string>> = {
  "org:eu": "EU official country list",
  "org:nato": "NATO official member list",
  "org:g20": "G20 official member list",
  "org:arab-league": "Arab League official member list",
};

const WATER_ALIASES: Record<string, string[]> = {
  "geo:persian-gulf": ["persian gulf", "arabian gulf"],
  "geo:red-sea": ["red sea", "gulf of aqaba", "gulf of suez"],
  "geo:caribbean-sea": ["caribbean sea"],
  "geo:pacific-ocean": ["pacific ocean", "north pacific ocean", "south pacific ocean"],
  "geo:caspian-sea": ["caspian sea"],
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function buildCheck(
  question: AuditQuestionPayload,
  {
    answer,
    supported,
    sources,
    note,
  }: {
    answer: "yes" | "no" | "maybe";
    supported: boolean;
    sources?: string[];
    note?: string;
  },
) {
  return {
    questionId: question.questionId,
    prompt: question.prompt,
    answer,
    supported,
    sources: unique(sources ?? []),
    note,
  } satisfies RemoteAuditCheck;
}

function resolveBooleanCheck(
  question: AuditQuestionPayload,
  candidates: Array<{ value: boolean | null | undefined; source: string }>,
) {
  const defined = candidates.filter(
    (candidate): candidate is { value: boolean; source: string } =>
      typeof candidate.value === "boolean",
  );

  if (defined.length === 0) {
    return buildCheck(question, {
      answer: "maybe",
      supported: false,
      note: "No online reference in this audit could verify this clue.",
    });
  }

  const yesCount = defined.filter((candidate) => candidate.value).length;
  const noCount = defined.length - yesCount;

  if (yesCount > 0 && noCount > 0) {
    return buildCheck(question, {
      answer: "maybe",
      supported: false,
      sources: defined.map((candidate) => candidate.source),
      note: "The online references disagreed, so this clue was not used for learning.",
    });
  }

  return buildCheck(question, {
    answer: yesCount > 0 ? "yes" : "no",
    supported: true,
    sources: defined.map((candidate) => candidate.source),
  });
}

function scoreCountryMatch(inputName: string, country: RestCountryApiResult) {
  const normalizedInput = normalizeText(inputName);
  const candidateNames = unique([
    country.name?.common ?? "",
    country.name?.official ?? "",
    ...(country.altSpellings ?? []),
  ]).map(normalizeText);

  let score = 0;

  for (const candidateName of candidateNames) {
    if (!candidateName) {
      continue;
    }

    if (candidateName === normalizedInput) {
      score = Math.max(score, 100);
    } else if (candidateName.includes(normalizedInput) || normalizedInput.includes(candidateName)) {
      score = Math.max(score, 60);
    }
  }

  return score;
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

async function fetchRestCountrySnapshot(countryName: string) {
  const fields = [
    "name",
    "cca3",
    "altSpellings",
    "continents",
    "subregion",
    "borders",
    "languages",
    "landlocked",
    "population",
    "unMember",
  ].join(",");
  const encodedCountryName = encodeURIComponent(countryName);
  const results = await fetchJson<RestCountryApiResult[]>(
    `${REST_COUNTRIES_URL}/name/${encodedCountryName}?fields=${fields}`,
  );

  if (!results || results.length === 0) {
    return null;
  }

  const sorted = [...results].sort(
    (left, right) => scoreCountryMatch(countryName, right) - scoreCountryMatch(countryName, left),
  );
  const best = sorted[0];

  if (!best?.name?.common || !best.cca3) {
    return null;
  }

  return {
    commonName: best.name.common,
    officialName: best.name.official ?? best.name.common,
    cca3: best.cca3,
    altSpellings: best.altSpellings ?? [],
    continents: best.continents ?? [],
    subregion: best.subregion ?? null,
    borders: best.borders ?? [],
    languages: Object.values(best.languages ?? {}),
    landlocked: typeof best.landlocked === "boolean" ? best.landlocked : null,
    population: typeof best.population === "number" ? best.population : null,
    unMember: typeof best.unMember === "boolean" ? best.unMember : null,
  } satisfies RestCountrySnapshot;
}

function scoreWikidataMatch(inputName: string, result: WikidataSearchResult) {
  const normalizedInput = normalizeText(inputName);
  const names = unique([result.label ?? "", ...(result.aliases ?? [])]).map(normalizeText);
  let score = 0;

  for (const name of names) {
    if (!name) {
      continue;
    }

    if (name === normalizedInput) {
      score = Math.max(score, 100);
    } else if (name.includes(normalizedInput) || normalizedInput.includes(name)) {
      score = Math.max(score, 55);
    }
  }

  if (normalizeText(result.description ?? "").includes("country")) {
    score += 10;
  }

  return score;
}

async function fetchWikidataItemId(countryName: string) {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    format: "json",
    language: "en",
    limit: "5",
    type: "item",
    search: countryName,
  });
  const result = await fetchJson<{ search?: WikidataSearchResult[] }>(
    `${WIKIDATA_ACTION_API}?${params.toString()}`,
  );
  const matches = result?.search ?? [];

  if (matches.length === 0) {
    return null;
  }

  const sorted = [...matches].sort(
    (left, right) => scoreWikidataMatch(countryName, right) - scoreWikidataMatch(countryName, left),
  );
  return sorted[0]?.id ?? null;
}

function splitGroupedValue(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function fetchWikidataSummary(itemId: string) {
  const query = `
    SELECT
      (GROUP_CONCAT(DISTINCT ?membershipLabel; separator="|") AS ?memberships)
      (GROUP_CONCAT(DISTINCT ?borderLabel; separator="|") AS ?borders)
      (GROUP_CONCAT(DISTINCT ?languageLabel; separator="|") AS ?languages)
      (GROUP_CONCAT(DISTINCT ?governmentLabel; separator="|") AS ?governments)
      (GROUP_CONCAT(DISTINCT ?continentLabel; separator="|") AS ?continents)
      (GROUP_CONCAT(DISTINCT ?waterLabel; separator="|") AS ?waters)
    WHERE {
      VALUES ?country { wd:${itemId} }
      OPTIONAL { ?country wdt:P463 ?membership . }
      OPTIONAL { ?country wdt:P47 ?border . }
      OPTIONAL { ?country wdt:P37 ?language . }
      OPTIONAL { ?country wdt:P122 ?government . }
      OPTIONAL { ?country wdt:P30 ?continent . }
      OPTIONAL { ?country wdt:P206 ?water . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;
  const response = await fetch(`${WIKIDATA_QUERY_API}?format=json&query=${encodeURIComponent(query)}`, {
    cache: "no-store",
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    results?: {
      bindings?: Array<Record<string, { value: string }>>;
    };
  };
  const row = data.results?.bindings?.[0];

  if (!row) {
    return null;
  }

  return {
    memberships: splitGroupedValue(row.memberships?.value),
    borders: splitGroupedValue(row.borders?.value),
    languages: splitGroupedValue(row.languages?.value),
    governments: splitGroupedValue(row.governments?.value),
    continents: splitGroupedValue(row.continents?.value),
    waters: splitGroupedValue(row.waters?.value),
  } satisfies WikidataSummary;
}

function includesLabel(values: string[], target: string) {
  const normalizedTarget = normalizeText(target);
  return values.some((value) => normalizeText(value) === normalizedTarget);
}

function includesAnyLabel(values: string[], targets: string[]) {
  return targets.some((target) => includesLabel(values, target));
}

function includesAnyFuzzyLabel(values: string[], targets: string[]) {
  return values.some((value) => {
    const normalizedValue = normalizeText(value);
    return targets.some((target) => normalizedValue.includes(normalizeText(target)));
  });
}

function checkContinent(question: AuditQuestionPayload, rest: RestCountrySnapshot | null, wikidata: WikidataSummary | null) {
  const targetLabel = question.questionId.replace("continent:", "").replace(/-/g, " ");
  const normalizedTarget = normalizeText(targetLabel);

  return resolveBooleanCheck(question, [
    {
      value:
        rest?.continents.some((continent) => normalizeText(continent) === normalizedTarget) ?? null,
      source: "REST Countries",
    },
    {
      value:
        wikidata?.continents.some((continent) => normalizeText(continent) === normalizedTarget) ?? null,
      source: "Wikidata",
    },
  ]);
}

function checkSubregion(question: AuditQuestionPayload, rest: RestCountrySnapshot | null) {
  const subregionId = question.questionId.replace("subregion:", "");
  const target = SUBREGION_LABEL_BY_ID[subregionId];

  if (!target) {
    return buildCheck(question, {
      answer: "maybe",
      supported: false,
      note: "This subregion clue is not mapped for online verification yet.",
    });
  }

  return resolveBooleanCheck(question, [
    {
      value: rest?.subregion ? normalizeText(rest.subregion) === normalizeText(target) : null,
      source: "REST Countries",
    },
  ]);
}

function checkLanguage(question: AuditQuestionPayload, rest: RestCountrySnapshot | null, wikidata: WikidataSummary | null) {
  const target = LANGUAGE_LABEL_BY_QUESTION[question.questionId];

  if (!target) {
    return buildCheck(question, {
      answer: "maybe",
      supported: false,
      note: "This language clue is not mapped for online verification yet.",
    });
  }

  return resolveBooleanCheck(question, [
    {
      value: rest?.languages ? includesLabel(rest.languages, target) : null,
      source: "REST Countries",
    },
    {
      value: wikidata?.languages ? includesLabel(wikidata.languages, target) : null,
      source: "Wikidata",
    },
  ]);
}

function checkMembership(
  question: AuditQuestionPayload,
  countryName: string,
  wikidata: WikidataSummary | null,
  rest: RestCountrySnapshot | null,
) {
  const officialMembers = OFFICIAL_MEMBERSHIP_NAMES[question.questionId];
  const officialSource = OFFICIAL_MEMBERSHIP_SOURCES[question.questionId];

  if (officialMembers && officialSource) {
    return buildCheck(question, {
      answer: officialMembers.has(countryName) ? "yes" : "no",
      supported: true,
      sources: [officialSource],
    });
  }

  if (question.questionId === "org:un-member") {
    return resolveBooleanCheck(question, [
      { value: rest?.unMember ?? null, source: "REST Countries" },
    ]);
  }

  const aliases = MEMBERSHIP_ALIASES[question.questionId];

  if (!aliases) {
    return buildCheck(question, {
      answer: "maybe",
      supported: false,
      note: "This organization clue is not mapped for online verification yet.",
    });
  }

  return resolveBooleanCheck(question, [
    {
      value: wikidata?.memberships ? includesAnyLabel(wikidata.memberships, aliases) : null,
      source: "Wikidata",
    },
  ]);
}

function checkKingdom(question: AuditQuestionPayload, wikidata: WikidataSummary | null) {
  return resolveBooleanCheck(question, [
    {
      value: wikidata?.governments
        ? wikidata.governments.some((government) =>
            /\bmonarchy\b|\bkingdom\b|\bsultanate\b|\bemirate\b|\bprincipality\b/.test(
              normalizeText(government),
            ),
          )
        : null,
      source: "Wikidata",
    },
  ]);
}

function checkNamedWater(question: AuditQuestionPayload, wikidata: WikidataSummary | null) {
  const aliases = WATER_ALIASES[question.questionId];

  if (!aliases) {
    return buildCheck(question, {
      answer: "maybe",
      supported: false,
      note: "This named-water clue is not mapped for online verification yet.",
    });
  }

  return resolveBooleanCheck(question, [
    {
      value: wikidata?.waters ? includesAnyFuzzyLabel(wikidata.waters, aliases) : null,
      source: "Wikidata",
    },
  ]);
}

function checkBorder(question: AuditQuestionPayload, rest: RestCountrySnapshot | null, wikidata: WikidataSummary | null) {
  const anchorName = question.prompt.replace(/^Does your country border (the )?/i, "").replace(/\?$/, "");
  const anchorCode = BORDER_CODE_BY_ANCHOR[anchorName];

  return resolveBooleanCheck(question, [
    {
      value: anchorCode ? rest?.borders.includes(anchorCode) ?? null : null,
      source: "REST Countries",
    },
    {
      value: wikidata?.borders ? includesLabel(wikidata.borders, anchorName) : null,
      source: "Wikidata",
    },
  ]);
}

function resolveQuestionCheck(
  question: AuditQuestionPayload,
  countryName: string,
  rest: RestCountrySnapshot | null,
  wikidata: WikidataSummary | null,
) {
  if (question.questionId.startsWith("continent:")) {
    return checkContinent(question, rest, wikidata);
  }

  if (question.questionId.startsWith("subregion:")) {
    return checkSubregion(question, rest);
  }

  if (question.questionId === "trait:landlocked") {
    return resolveBooleanCheck(question, [
      { value: rest?.landlocked ?? null, source: "REST Countries" },
    ]);
  }

  if (question.questionId === "trait:coastline") {
    return resolveBooleanCheck(question, [
      {
        value: typeof rest?.landlocked === "boolean" ? !rest.landlocked : null,
        source: "REST Countries",
      },
    ]);
  }

  if (question.questionId === "trait:transcontinental") {
    return resolveBooleanCheck(question, [
      {
        value: rest ? rest.continents.length > 1 : null,
        source: "REST Countries",
      },
      {
        value: wikidata ? unique(wikidata.continents).length > 1 : null,
        source: "Wikidata",
      },
    ]);
  }

  if (question.questionId in LANGUAGE_LABEL_BY_QUESTION) {
    return checkLanguage(question, rest, wikidata);
  }

  if (question.questionId.startsWith("border:")) {
    return checkBorder(question, rest, wikidata);
  }

  if (question.questionId === "population:giant") {
    return resolveBooleanCheck(question, [
      {
        value: typeof rest?.population === "number" ? rest.population > 100_000_000 : null,
        source: "REST Countries",
      },
    ]);
  }

  if (question.questionId === "org:sub-saharan-africa") {
    return resolveBooleanCheck(question, [
      {
        value: rest
          ? rest.continents.some((continent) => normalizeText(continent) === "africa") &&
            Boolean(rest.subregion) &&
            normalizeText(rest.subregion ?? "") !== normalizeText("Northern Africa")
          : null,
        source: "REST Countries",
      },
    ]);
  }

  if (
    question.questionId === "org:eu" ||
    question.questionId === "org:nato" ||
    question.questionId === "org:g20" ||
    question.questionId === "org:arab-league" ||
    question.questionId === "org:un-member"
  ) {
    return checkMembership(question, countryName, wikidata, rest);
  }

  if (question.questionId === "org:kingdom") {
    return checkKingdom(question, wikidata);
  }

  if (question.questionId in WATER_ALIASES) {
    return checkNamedWater(question, wikidata);
  }

  return buildCheck(question, {
    answer: "maybe",
    supported: false,
    note: "This clue type is not verified online yet, so it will not trigger learning.",
  });
}

export async function verifyCountryAnswersOnline(
  countryName: string,
  questions: AuditQuestionPayload[],
) {
  const [restSnapshot, wikidataItemId] = await Promise.all([
    fetchRestCountrySnapshot(countryName),
    fetchWikidataItemId(countryName),
  ]);
  const wikidataSummary = wikidataItemId ? await fetchWikidataSummary(wikidataItemId) : null;
  const checks = questions.map((question) =>
    resolveQuestionCheck(question, countryName, restSnapshot, wikidataSummary),
  );
  const hasAnySource = Boolean(restSnapshot || wikidataSummary);

  return {
    available: hasAnySource,
    resolvedCountryName: restSnapshot?.commonName ?? countryName,
    checks,
    note: hasAnySource
      ? undefined
      : "The online references could not be reached for this audit, so no remote verification was applied.",
  } satisfies RemoteAuditResponse;
}

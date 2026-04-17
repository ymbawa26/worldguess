export type StateTurnAnswer = "yes" | "no" | "idk";
export type StateQuestionStage = "broad" | "medium" | "narrow";
export type StateRegion = "Northeast" | "Midwest" | "South" | "West";
export type StateDivision =
  | "New England"
  | "Middle Atlantic"
  | "East North Central"
  | "West North Central"
  | "South Atlantic"
  | "East South Central"
  | "West South Central"
  | "Mountain"
  | "Pacific";

const STATE_NAMES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

export type StateName = (typeof STATE_NAMES)[number];

export type StateRecord = {
  name: StateName;
  abbreviation: string;
  region: StateRegion;
  division: StateDivision;
  coastal: boolean;
  landlocked: boolean;
  pacific: boolean;
  atlantic: boolean;
  gulf: boolean;
  greatLakes: boolean;
  bordersCanada: boolean;
  bordersMexico: boolean;
  fourCorners: boolean;
  appalachian: boolean;
  mountain: boolean;
  plains: boolean;
  desert: boolean;
  originalThirteen: boolean;
  nonContiguous: boolean;
  easternTime: boolean;
  centralTime: boolean;
  mountainTime: boolean;
  pacificTime: boolean;
  alaskaTime: boolean;
  hawaiiTime: boolean;
  populationTier: "small" | "medium" | "large";
  areaTier: "small" | "medium" | "large";
};

export type StateQuestion = {
  id: string;
  prompt: string;
  shortLabel: string;
  stage: StateQuestionStage;
  category: string;
  test: (state: StateRecord) => boolean;
  guessedState?: StateName;
};

export type StateTurnResolution = {
  candidates: StateRecord[];
  aiWon: boolean;
  inconsistencyWarning?: string;
};

const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

const DIVISION_BY_STATE: Record<string, StateDivision> = {
  Connecticut: "New England",
  Maine: "New England",
  Massachusetts: "New England",
  "New Hampshire": "New England",
  "Rhode Island": "New England",
  Vermont: "New England",
  "New Jersey": "Middle Atlantic",
  "New York": "Middle Atlantic",
  Pennsylvania: "Middle Atlantic",
  Illinois: "East North Central",
  Indiana: "East North Central",
  Michigan: "East North Central",
  Ohio: "East North Central",
  Wisconsin: "East North Central",
  Iowa: "West North Central",
  Kansas: "West North Central",
  Minnesota: "West North Central",
  Missouri: "West North Central",
  Nebraska: "West North Central",
  "North Dakota": "West North Central",
  "South Dakota": "West North Central",
  Delaware: "South Atlantic",
  Florida: "South Atlantic",
  Georgia: "South Atlantic",
  Maryland: "South Atlantic",
  "North Carolina": "South Atlantic",
  "South Carolina": "South Atlantic",
  Virginia: "South Atlantic",
  "West Virginia": "South Atlantic",
  Alabama: "East South Central",
  Kentucky: "East South Central",
  Mississippi: "East South Central",
  Tennessee: "East South Central",
  Arkansas: "West South Central",
  Louisiana: "West South Central",
  Oklahoma: "West South Central",
  Texas: "West South Central",
  Arizona: "Mountain",
  Colorado: "Mountain",
  Idaho: "Mountain",
  Montana: "Mountain",
  Nevada: "Mountain",
  "New Mexico": "Mountain",
  Utah: "Mountain",
  Wyoming: "Mountain",
  Alaska: "Pacific",
  California: "Pacific",
  Hawaii: "Pacific",
  Oregon: "Pacific",
  Washington: "Pacific",
};

const REGION_BY_DIVISION: Record<StateDivision, StateRegion> = {
  "New England": "Northeast",
  "Middle Atlantic": "Northeast",
  "East North Central": "Midwest",
  "West North Central": "Midwest",
  "South Atlantic": "South",
  "East South Central": "South",
  "West South Central": "South",
  Mountain: "West",
  Pacific: "West",
};

const PACIFIC_STATES = new Set(["Alaska", "California", "Hawaii", "Oregon", "Washington"]);
const ATLANTIC_STATES = new Set([
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Maine",
  "Maryland",
  "Massachusetts",
  "New Hampshire",
  "New Jersey",
  "New York",
  "North Carolina",
  "Rhode Island",
  "South Carolina",
  "Virginia",
]);
const GULF_STATES = new Set(["Alabama", "Florida", "Louisiana", "Mississippi", "Texas"]);
const GREAT_LAKES_STATES = new Set([
  "Illinois",
  "Indiana",
  "Michigan",
  "Minnesota",
  "New York",
  "Ohio",
  "Pennsylvania",
  "Wisconsin",
]);
const CANADA_BORDER_STATES = new Set([
  "Alaska",
  "Idaho",
  "Maine",
  "Michigan",
  "Minnesota",
  "Montana",
  "New Hampshire",
  "New York",
  "North Dakota",
  "Vermont",
  "Washington",
]);
const MEXICO_BORDER_STATES = new Set(["Arizona", "California", "New Mexico", "Texas"]);
const FOUR_CORNERS_STATES = new Set(["Arizona", "Colorado", "New Mexico", "Utah"]);
const APPALACHIAN_STATES = new Set([
  "Alabama",
  "Georgia",
  "Kentucky",
  "Maryland",
  "North Carolina",
  "Pennsylvania",
  "South Carolina",
  "Tennessee",
  "Virginia",
  "West Virginia",
]);
const MOUNTAIN_STATES = new Set([
  "Alaska",
  "Arizona",
  "California",
  "Colorado",
  "Idaho",
  "Montana",
  "Nevada",
  "New Mexico",
  "Oregon",
  "Utah",
  "Washington",
  "Wyoming",
]);
const PLAINS_STATES = new Set([
  "Colorado",
  "Kansas",
  "Montana",
  "Nebraska",
  "New Mexico",
  "North Dakota",
  "Oklahoma",
  "South Dakota",
  "Texas",
  "Wyoming",
]);
const DESERT_STATES = new Set(["Arizona", "California", "Nevada", "New Mexico", "Texas", "Utah"]);
const ORIGINAL_THIRTEEN_STATES = new Set([
  "Connecticut",
  "Delaware",
  "Georgia",
  "Maryland",
  "Massachusetts",
  "New Hampshire",
  "New Jersey",
  "New York",
  "North Carolina",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "Virginia",
]);
const NON_CONTIGUOUS_STATES = new Set(["Alaska", "Hawaii"]);
const EASTERN_TIME_STATES = new Set([
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Indiana",
  "Kentucky",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "New Hampshire",
  "New Jersey",
  "New York",
  "North Carolina",
  "Ohio",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "Tennessee",
  "Vermont",
  "Virginia",
  "West Virginia",
]);
const CENTRAL_TIME_STATES = new Set([
  "Alabama",
  "Arkansas",
  "Florida",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Nebraska",
  "North Dakota",
  "Oklahoma",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Wisconsin",
]);
const MOUNTAIN_TIME_STATES = new Set([
  "Arizona",
  "Colorado",
  "Idaho",
  "Kansas",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Mexico",
  "North Dakota",
  "Oregon",
  "South Dakota",
  "Texas",
  "Utah",
  "Wyoming",
]);
const PACIFIC_TIME_STATES = new Set(["California", "Idaho", "Nevada", "Oregon", "Washington"]);
const ALASKA_TIME_STATES = new Set(["Alaska"]);
const HAWAII_TIME_STATES = new Set(["Hawaii"]);
const LARGE_POPULATION_STATES = new Set([
  "California",
  "Florida",
  "Georgia",
  "Illinois",
  "Michigan",
  "New Jersey",
  "New York",
  "North Carolina",
  "Ohio",
  "Pennsylvania",
  "Texas",
]);
const SMALL_POPULATION_STATES = new Set([
  "Alaska",
  "Delaware",
  "Hawaii",
  "Maine",
  "Montana",
  "New Hampshire",
  "North Dakota",
  "Rhode Island",
  "South Dakota",
  "Vermont",
  "West Virginia",
  "Wyoming",
]);
const LARGE_AREA_STATES = new Set([
  "Alaska",
  "Arizona",
  "California",
  "Colorado",
  "Idaho",
  "Kansas",
  "Montana",
  "Nevada",
  "New Mexico",
  "Oregon",
  "Texas",
  "Utah",
  "Wyoming",
]);
const SMALL_AREA_STATES = new Set([
  "Connecticut",
  "Delaware",
  "Hawaii",
  "Maryland",
  "Massachusetts",
  "New Hampshire",
  "New Jersey",
  "Rhode Island",
  "Vermont",
]);

function buildStates() {
  return STATE_NAMES.map((name) => {
    const division = DIVISION_BY_STATE[name];
    const region = REGION_BY_DIVISION[division];
    const pacific = PACIFIC_STATES.has(name);
    const atlantic = ATLANTIC_STATES.has(name);
    const gulf = GULF_STATES.has(name);
    const coastal = pacific || atlantic || gulf;

    return {
      name,
      abbreviation: STATE_ABBREVIATIONS[name],
      region,
      division,
      coastal,
      landlocked: !coastal,
      pacific,
      atlantic,
      gulf,
      greatLakes: GREAT_LAKES_STATES.has(name),
      bordersCanada: CANADA_BORDER_STATES.has(name),
      bordersMexico: MEXICO_BORDER_STATES.has(name),
      fourCorners: FOUR_CORNERS_STATES.has(name),
      appalachian: APPALACHIAN_STATES.has(name),
      mountain: MOUNTAIN_STATES.has(name),
      plains: PLAINS_STATES.has(name),
      desert: DESERT_STATES.has(name),
      originalThirteen: ORIGINAL_THIRTEEN_STATES.has(name),
      nonContiguous: NON_CONTIGUOUS_STATES.has(name),
      easternTime: EASTERN_TIME_STATES.has(name),
      centralTime: CENTRAL_TIME_STATES.has(name),
      mountainTime: MOUNTAIN_TIME_STATES.has(name),
      pacificTime: PACIFIC_TIME_STATES.has(name),
      alaskaTime: ALASKA_TIME_STATES.has(name),
      hawaiiTime: HAWAII_TIME_STATES.has(name),
      populationTier: LARGE_POPULATION_STATES.has(name)
        ? "large"
        : SMALL_POPULATION_STATES.has(name)
          ? "small"
          : "medium",
      areaTier: LARGE_AREA_STATES.has(name)
        ? "large"
        : SMALL_AREA_STATES.has(name)
          ? "small"
          : "medium",
    } satisfies StateRecord;
  });
}

export const STATES = buildStates();
export const STATES_BY_NAME = new Map<StateName, StateRecord>(
  STATES.map((state) => [state.name, state]),
);

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const NORMALIZED_STATE_NAMES = new Map(
  STATES.map((state) => [normalizeText(state.name), state.name]),
);

export function findStateName(input: string): StateName | null {
  const normalized = normalizeText(input);

  if (!normalized) {
    return null;
  }

  for (const [normalizedName, stateName] of NORMALIZED_STATE_NAMES) {
    if (normalized === normalizedName || normalized.includes(normalizedName)) {
      return stateName;
    }
  }

  return null;
}

function makeQuestion(
  id: string,
  prompt: string,
  shortLabel: string,
  stage: StateQuestionStage,
  category: string,
  test: (state: StateRecord) => boolean,
) {
  return {
    id,
    prompt,
    shortLabel,
    stage,
    category,
    test,
  } satisfies StateQuestion;
}

const STATE_QUESTIONS: StateQuestion[] = [
  makeQuestion("region:northeast", "Is your state in the Northeast?", "Northeast", "broad", "region", (state) => state.region === "Northeast"),
  makeQuestion("region:midwest", "Is your state in the Midwest?", "Midwest", "broad", "region", (state) => state.region === "Midwest"),
  makeQuestion("region:south", "Is your state in the South?", "South", "broad", "region", (state) => state.region === "South"),
  makeQuestion("region:west", "Is your state in the West?", "West", "broad", "region", (state) => state.region === "West"),
  makeQuestion("division:new-england", "Is your state in New England?", "New England", "medium", "division", (state) => state.division === "New England"),
  makeQuestion("division:middle-atlantic", "Is your state in the Middle Atlantic?", "Middle Atlantic", "medium", "division", (state) => state.division === "Middle Atlantic"),
  makeQuestion("division:east-north-central", "Is your state in the East North Central division?", "East North Central", "medium", "division", (state) => state.division === "East North Central"),
  makeQuestion("division:west-north-central", "Is your state in the West North Central division?", "West North Central", "medium", "division", (state) => state.division === "West North Central"),
  makeQuestion("division:south-atlantic", "Is your state in the South Atlantic division?", "South Atlantic", "medium", "division", (state) => state.division === "South Atlantic"),
  makeQuestion("division:east-south-central", "Is your state in the East South Central division?", "East South Central", "medium", "division", (state) => state.division === "East South Central"),
  makeQuestion("division:west-south-central", "Is your state in the West South Central division?", "West South Central", "medium", "division", (state) => state.division === "West South Central"),
  makeQuestion("division:mountain", "Is your state in the Mountain division?", "Mountain division", "medium", "division", (state) => state.division === "Mountain"),
  makeQuestion("division:pacific", "Is your state in the Pacific division?", "Pacific division", "medium", "division", (state) => state.division === "Pacific"),
  makeQuestion("trait:coastal", "Does your state touch an ocean or the Gulf of Mexico?", "Coastal", "medium", "coast", (state) => state.coastal),
  makeQuestion("trait:landlocked", "Is your state landlocked?", "Landlocked", "medium", "coast", (state) => state.landlocked),
  makeQuestion("trait:pacific", "Does your state touch the Pacific Ocean?", "Pacific coast", "narrow", "coast", (state) => state.pacific),
  makeQuestion("trait:atlantic", "Does your state touch the Atlantic Ocean?", "Atlantic coast", "narrow", "coast", (state) => state.atlantic),
  makeQuestion("trait:gulf", "Does your state touch the Gulf of Mexico?", "Gulf coast", "narrow", "coast", (state) => state.gulf),
  makeQuestion("trait:great-lakes", "Does your state touch one of the Great Lakes?", "Great Lakes", "narrow", "water", (state) => state.greatLakes),
  makeQuestion("border:canada", "Does your state border Canada?", "Borders Canada", "medium", "border", (state) => state.bordersCanada),
  makeQuestion("border:mexico", "Does your state border Mexico?", "Borders Mexico", "medium", "border", (state) => state.bordersMexico),
  makeQuestion("trait:four-corners", "Is your state one of the Four Corners states?", "Four Corners", "narrow", "shape", (state) => state.fourCorners),
  makeQuestion("trait:appalachian", "Does your state include part of the Appalachian Mountains?", "Appalachian", "narrow", "terrain", (state) => state.appalachian),
  makeQuestion("trait:mountain", "Does your state include major Rocky Mountain or western mountain terrain?", "Mountain", "narrow", "terrain", (state) => state.mountain),
  makeQuestion("trait:plains", "Is your state part of the Great Plains?", "Great Plains", "narrow", "terrain", (state) => state.plains),
  makeQuestion("trait:desert", "Does your state include major desert terrain?", "Desert", "narrow", "terrain", (state) => state.desert),
  makeQuestion("history:original-thirteen", "Was your state one of the original thirteen colonies?", "Original 13", "narrow", "history", (state) => state.originalThirteen),
  makeQuestion("trait:non-contiguous", "Is your state non-contiguous with the lower 48?", "Non-contiguous", "narrow", "shape", (state) => state.nonContiguous),
  makeQuestion("time:eastern", "Is any part of your state in the Eastern Time Zone?", "Eastern Time", "medium", "time", (state) => state.easternTime),
  makeQuestion("time:central", "Is any part of your state in the Central Time Zone?", "Central Time", "medium", "time", (state) => state.centralTime),
  makeQuestion("time:mountain", "Is any part of your state in the Mountain Time Zone?", "Mountain Time", "medium", "time", (state) => state.mountainTime),
  makeQuestion("time:pacific", "Is any part of your state in the Pacific Time Zone?", "Pacific Time", "medium", "time", (state) => state.pacificTime),
  makeQuestion("time:alaska", "Is your state in the Alaska Time Zone?", "Alaska Time", "narrow", "time", (state) => state.alaskaTime),
  makeQuestion("time:hawaii", "Is your state in the Hawaii Time Zone?", "Hawaii Time", "narrow", "time", (state) => state.hawaiiTime),
  makeQuestion("population:large", "Does your state have a very large population?", "Large population", "narrow", "population", (state) => state.populationTier === "large"),
  makeQuestion("population:small", "Is your state small in population?", "Small population", "narrow", "population", (state) => state.populationTier === "small"),
  makeQuestion("area:large", "Is your state geographically very large?", "Large area", "narrow", "area", (state) => state.areaTier === "large"),
  makeQuestion("area:small", "Is your state geographically small?", "Small area", "narrow", "area", (state) => state.areaTier === "small"),
];

function scoreQuestion(
  question: StateQuestion,
  candidates: StateRecord[],
  askedQuestionIds: Set<string>,
) {
  if (askedQuestionIds.has(question.id)) {
    return null;
  }

  const yesCount = candidates.filter(question.test).length;
  const noCount = candidates.length - yesCount;

  if (yesCount === 0 || noCount === 0) {
    return null;
  }

  const balance = Math.min(yesCount, noCount) / candidates.length;
  const stageBonus =
    candidates.length > 20
      ? question.stage === "broad"
        ? 0.18
        : question.stage === "medium"
          ? 0.08
          : -0.02
      : candidates.length > 8
        ? question.stage === "medium"
          ? 0.18
          : question.stage === "broad"
            ? 0.06
            : 0.08
        : question.stage === "narrow"
          ? 0.2
          : 0.05;

  return {
    question,
    score: balance + stageBonus,
  };
}

export function chooseStateQuestion(
  candidates: StateRecord[],
  askedQuestionIds: Set<string>,
) {
  if (candidates.length <= 2) {
    const guessState = candidates[0];

    if (guessState && !askedQuestionIds.has(`guess:${guessState.name}`)) {
      return {
        id: `guess:${guessState.name}`,
        prompt: `Is your state ${guessState.name}?`,
        shortLabel: guessState.name,
        stage: "narrow",
        category: "guess",
        test: (state: StateRecord) => state.name === guessState.name,
        guessedState: guessState.name,
      } satisfies StateQuestion;
    }
  }

  const scored = STATE_QUESTIONS.map((question) =>
    scoreQuestion(question, candidates, askedQuestionIds),
  ).filter((value): value is { question: StateQuestion; score: number } => Boolean(value));

  if (scored.length === 0) {
    return null;
  }

  const sorted = [...scored].sort((left, right) => right.score - left.score);
  const maxIndex = Math.min(2, sorted.length - 1);
  return sorted[Math.floor(Math.random() * (maxIndex + 1))].question;
}

export function applyStateTurnAnswer(
  question: StateQuestion,
  answer: StateTurnAnswer,
  candidates: StateRecord[],
) {
  if (question.guessedState) {
    if (answer === "yes") {
      return {
        candidates: candidates.filter((state) => state.name === question.guessedState),
        aiWon: true,
      } satisfies StateTurnResolution;
    }

    if (answer === "no") {
      return {
        candidates: candidates.filter((state) => state.name !== question.guessedState),
        aiWon: false,
      } satisfies StateTurnResolution;
    }

    return {
      candidates,
      aiWon: false,
    } satisfies StateTurnResolution;
  }

  if (answer === "idk") {
    return {
      candidates,
      aiWon: false,
    } satisfies StateTurnResolution;
  }

  const filtered =
    answer === "yes"
      ? candidates.filter(question.test)
      : candidates.filter((state) => !question.test(state));

  if (filtered.length === 0) {
    return {
      candidates,
      aiWon: false,
      inconsistencyWarning:
        "That answer would remove every remaining state, so I kept the previous shortlist.",
    } satisfies StateTurnResolution;
  }

  return {
    candidates: filtered,
    aiWon: false,
  } satisfies StateTurnResolution;
}

export function getStateShortlistPreview(candidates: StateRecord[], count = 10) {
  return candidates.slice(0, count);
}

export function getStateLookup(query: string) {
  const normalized = normalizeText(query);

  if (!normalized) {
    return STATES;
  }

  return STATES.filter((state) => normalizeText(state.name).includes(normalized));
}

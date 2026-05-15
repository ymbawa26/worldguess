export type PalestineTurnAnswer = "yes" | "no" | "idk";
export type PalestineQuestionStage = "broad" | "medium" | "narrow";

export type PalestineCityName =
  | "Haifa"
  | "Acre"
  | "Jaffa"
  | "Jerusalem"
  | "Ramallah"
  | "Bethelehem"
  | "Hebron"
  | "Qalqilya"
  | "Jericho"
  | "Nablus"
  | "Tulkarem"
  | "Khan Younis"
  | "Lod"
  | "Ramla"
  | "Gaza"
  | "Rafah"
  | "Safad"
  | "Nazerith"
  | "Bisan"
  | "Tabarias"
  | "Janin"
  | "Tubas"
  | "Beer al sabaa"
  | "Umm al Rashrash";

export type PalestineArea =
  | "North Coast"
  | "Galilee"
  | "Central Coast"
  | "Jerusalem Hills"
  | "West Bank North"
  | "Jordan Valley"
  | "Gaza Strip"
  | "Naqab";

export type PalestineCityRecord = {
  name: PalestineCityName;
  aliases: string[];
  area: PalestineArea;
  north: boolean;
  south: boolean;
  palestine48: boolean;
  westBank: boolean;
  gazaStrip: boolean;
  jordanValley: boolean;
  muslimSignificance: boolean;
  christianSignificance: boolean;
  closeToLebanon: boolean;
  closeToEgypt: boolean;
  mediterraneanCoast: boolean;
  redSea: boolean;
  majorPort: boolean;
  galilee: boolean;
  jerusalemHills: boolean;
  centralHighlands: boolean;
  southernHighlands: boolean;
  northernWestBank: boolean;
  centralWestBank: boolean;
  greenLineSide: boolean;
  northwesternWestBank: boolean;
  gazaSouth: boolean;
  egyptBorder: boolean;
  naqab: boolean;
  inland: boolean;
  lakeTabariasArea: boolean;
  deadSeaSide: boolean;
  samariaHeartland: boolean;
  southernmost: boolean;
  earlyIslamicCapital?: boolean;
};

export type PalestineQuestion = {
  id: string;
  prompt: string;
  shortLabel: string;
  stage: PalestineQuestionStage;
  category: string;
  test: (city: PalestineCityRecord) => boolean;
  guessedCity?: PalestineCityName;
};

export type PalestineTurnResolution = {
  candidates: PalestineCityRecord[];
  aiWon: boolean;
  inconsistencyWarning?: string;
};

const CITIES: PalestineCityRecord[] = [
  {
    name: "Haifa",
    aliases: [],
    area: "North Coast",
    north: true,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: true,
    redSea: false,
    majorPort: true,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: false,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Acre",
    aliases: ["Akka"],
    area: "North Coast",
    north: true,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: true,
    closeToEgypt: false,
    mediterraneanCoast: true,
    redSea: false,
    majorPort: true,
    galilee: true,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: false,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Jaffa",
    aliases: ["Yafa"],
    area: "Central Coast",
    north: false,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: true,
    redSea: false,
    majorPort: true,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: false,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Jerusalem",
    aliases: ["Al Quds"],
    area: "Jerusalem Hills",
    north: false,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: true,
    christianSignificance: true,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: true,
    centralHighlands: true,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: true,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Ramallah",
    aliases: [],
    area: "Jerusalem Hills",
    north: false,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: true,
    centralHighlands: true,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: true,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Bethelehem",
    aliases: ["Bethlehem", "Bayt Lahm"],
    area: "Jerusalem Hills",
    north: false,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: true,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: true,
    centralHighlands: true,
    southernHighlands: true,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Hebron",
    aliases: ["Al Khalil"],
    area: "Jerusalem Hills",
    north: false,
    south: true,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: true,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: true,
    southernHighlands: true,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Qalqilya",
    aliases: ["Qalqilia"],
    area: "West Bank North",
    north: false,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: true,
    centralWestBank: false,
    greenLineSide: true,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Jericho",
    aliases: ["Ariha"],
    area: "Jordan Valley",
    north: false,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: true,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: true,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: true,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Nablus",
    aliases: [],
    area: "West Bank North",
    north: false,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: true,
    southernHighlands: false,
    northernWestBank: true,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: true,
    southernmost: false,
  },
  {
    name: "Tulkarem",
    aliases: ["Tulkarm"],
    area: "West Bank North",
    north: true,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: true,
    centralWestBank: false,
    greenLineSide: true,
    northwesternWestBank: true,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Khan Younis",
    aliases: ["Khan Yunis"],
    area: "Gaza Strip",
    north: false,
    south: true,
    palestine48: false,
    westBank: false,
    gazaStrip: true,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: true,
    mediterraneanCoast: true,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: true,
    egyptBorder: false,
    naqab: false,
    inland: false,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Lod",
    aliases: ["Lydda"],
    area: "Central Coast",
    north: false,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Ramla",
    aliases: ["Ramle", "Al-Ramla", "al Ramla"],
    area: "Central Coast",
    north: false,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
    earlyIslamicCapital: true,
  },
  {
    name: "Gaza",
    aliases: ["Gaza City", "Ghazzah"],
    area: "Gaza Strip",
    north: false,
    south: true,
    palestine48: false,
    westBank: false,
    gazaStrip: true,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: true,
    mediterraneanCoast: true,
    redSea: false,
    majorPort: true,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: false,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Rafah",
    aliases: [],
    area: "Gaza Strip",
    north: false,
    south: true,
    palestine48: false,
    westBank: false,
    gazaStrip: true,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: true,
    mediterraneanCoast: true,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: true,
    egyptBorder: true,
    naqab: false,
    inland: false,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Safad",
    aliases: ["Safed"],
    area: "Galilee",
    north: true,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: true,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: true,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Nazerith",
    aliases: ["Nazareth"],
    area: "Galilee",
    north: true,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: true,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: true,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Bisan",
    aliases: ["Beisan", "Beit Shean", "Beisan"],
    area: "Jordan Valley",
    north: true,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: true,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Tabarias",
    aliases: ["Tiberias"],
    area: "Galilee",
    north: true,
    south: false,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: true,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: true,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: true,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Janin",
    aliases: ["Jenin"],
    area: "West Bank North",
    north: true,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: true,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: true,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: true,
    southernmost: false,
  },
  {
    name: "Tubas",
    aliases: [],
    area: "Jordan Valley",
    north: true,
    south: false,
    palestine48: false,
    westBank: true,
    gazaStrip: false,
    jordanValley: true,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: true,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: false,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: true,
    southernmost: false,
  },
  {
    name: "Beer al sabaa",
    aliases: ["Beersheba", "Beer al Sabaa", "Be'er al-Sabaa"],
    area: "Naqab",
    north: false,
    south: true,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: false,
    mediterraneanCoast: false,
    redSea: false,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: false,
    naqab: true,
    inland: true,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: false,
  },
  {
    name: "Umm al Rashrash",
    aliases: ["Eilat", "Umm Rashrash", "Umm al-Rashrash"],
    area: "Naqab",
    north: false,
    south: true,
    palestine48: true,
    westBank: false,
    gazaStrip: false,
    jordanValley: false,
    muslimSignificance: false,
    christianSignificance: false,
    closeToLebanon: false,
    closeToEgypt: true,
    mediterraneanCoast: false,
    redSea: true,
    majorPort: false,
    galilee: false,
    jerusalemHills: false,
    centralHighlands: false,
    southernHighlands: false,
    northernWestBank: false,
    centralWestBank: false,
    greenLineSide: false,
    northwesternWestBank: false,
    gazaSouth: false,
    egyptBorder: true,
    naqab: true,
    inland: false,
    lakeTabariasArea: false,
    deadSeaSide: false,
    samariaHeartland: false,
    southernmost: true,
  },
];

export const PALESTINE_1948_CITIES = CITIES;
export const PALESTINE_1948_BY_NAME = new Map<PalestineCityName, PalestineCityRecord>(
  CITIES.map((city) => [city.name, city]),
);

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const NORMALIZED_CITY_NAMES = new Map<string, PalestineCityName>();

for (const city of CITIES) {
  NORMALIZED_CITY_NAMES.set(normalizeText(city.name), city.name);

  for (const alias of city.aliases) {
    NORMALIZED_CITY_NAMES.set(normalizeText(alias), city.name);
  }
}

export function findPalestineCityName(input: string): PalestineCityName | null {
  const normalized = normalizeText(input);

  if (!normalized) {
    return null;
  }

  for (const [normalizedName, cityName] of NORMALIZED_CITY_NAMES) {
    if (normalized === normalizedName || normalized.includes(normalizedName)) {
      return cityName;
    }
  }

  return null;
}

function makeQuestion(
  id: string,
  prompt: string,
  shortLabel: string,
  stage: PalestineQuestionStage,
  category: string,
  test: (city: PalestineCityRecord) => boolean,
) {
  return {
    id,
    prompt,
    shortLabel,
    stage,
    category,
    test,
  } satisfies PalestineQuestion;
}

const QUESTIONS: PalestineQuestion[] = [
  makeQuestion("area:48", "Is it in Palestine 48?", "Palestine 48", "broad", "history", (city) => city.palestine48),
  makeQuestion("area:west-bank", "Is it in the West Bank?", "West Bank", "broad", "region", (city) => city.westBank),
  makeQuestion("area:gaza", "Is it in the Gaza Strip?", "Gaza Strip", "broad", "region", (city) => city.gazaStrip),
  makeQuestion("geo:north", "Is it in the northern part of the country?", "North", "broad", "direction", (city) => city.north),
  makeQuestion("geo:south", "Is it in the southern part of the country?", "South", "broad", "direction", (city) => city.south),
  makeQuestion("geo:jordan-valley", "Is it near the Jordan Valley?", "Jordan Valley", "medium", "region", (city) => city.jordanValley),
  makeQuestion("faith:muslim", "Is it of Muslim significance?", "Muslim significance", "narrow", "faith", (city) => city.muslimSignificance),
  makeQuestion("faith:christian", "Is it of Christian significance?", "Christian significance", "narrow", "faith", (city) => city.christianSignificance),
  makeQuestion("geo:lebanon", "Is it close to Lebanon?", "Close to Lebanon", "narrow", "border", (city) => city.closeToLebanon),
  makeQuestion("geo:egypt", "Is it close to Egypt?", "Close to Egypt", "medium", "border", (city) => city.closeToEgypt),
  makeQuestion("geo:mediterranean", "Is it on the Mediterranean coast?", "Mediterranean coast", "medium", "coast", (city) => city.mediterraneanCoast),
  makeQuestion("geo:red-sea", "Is it on the Red Sea?", "Red Sea", "narrow", "coast", (city) => city.redSea),
  makeQuestion("geo:port", "Is it a major port city?", "Major port", "narrow", "coast", (city) => city.majorPort),
  makeQuestion("area:galilee", "Is it in the Galilee?", "Galilee", "medium", "region", (city) => city.galilee),
  makeQuestion("area:jerusalem-hills", "Is it in the Jerusalem hills area?", "Jerusalem hills", "medium", "region", (city) => city.jerusalemHills),
  makeQuestion("area:central-highlands", "Is it in the central highlands?", "Central highlands", "medium", "region", (city) => city.centralHighlands),
  makeQuestion("area:southern-highlands", "Is it in the southern highlands?", "Southern highlands", "narrow", "region", (city) => city.southernHighlands),
  makeQuestion("area:northern-west-bank", "Is it in the northern West Bank?", "Northern West Bank", "medium", "region", (city) => city.northernWestBank),
  makeQuestion("area:central-west-bank", "Is it in the central West Bank?", "Central West Bank", "narrow", "region", (city) => city.centralWestBank),
  makeQuestion("geo:green-line-side", "Is it on the Green Line side of the West Bank?", "Green Line side", "narrow", "border", (city) => city.greenLineSide),
  makeQuestion("geo:northwestern-west-bank", "Is it in the northwestern West Bank?", "Northwestern WB", "narrow", "direction", (city) => city.northwesternWestBank),
  makeQuestion("geo:gaza-south", "Is it south of Gaza City inside the Gaza Strip?", "South of Gaza City", "narrow", "direction", (city) => city.gazaSouth),
  makeQuestion("geo:egypt-border", "Does it sit right on the Egyptian border area?", "Egypt border", "narrow", "border", (city) => city.egyptBorder),
  makeQuestion("area:naqab", "Is it in the Naqab / far south?", "Naqab", "medium", "region", (city) => city.naqab),
  makeQuestion("geo:inland", "Is it inland rather than on a coast?", "Inland", "medium", "coast", (city) => city.inland),
  makeQuestion("geo:lake-tabarias", "Is it near Lake Tabarias?", "Lake Tabarias", "narrow", "water", (city) => city.lakeTabariasArea),
  makeQuestion("geo:dead-sea-side", "Is it on the Dead Sea side of the Jordan Valley?", "Dead Sea side", "narrow", "water", (city) => city.deadSeaSide),
  makeQuestion("area:samaria", "Is it in the Samaria heartland?", "Samaria", "narrow", "region", (city) => city.samariaHeartland),
  makeQuestion("geo:southernmost", "Is it the southernmost city on this list?", "Southernmost", "narrow", "direction", (city) => city.southernmost),
  makeQuestion(
    "history:early-islamic-capital",
    "Was it founded as an early Islamic administrative capital?",
    "Early Islamic capital",
    "narrow",
    "history",
    (city) => city.earlyIslamicCapital === true,
  ),
];

const OPENING_QUESTION_IDS = new Set([
  "area:48",
  "area:west-bank",
  "area:gaza",
  "geo:north",
  "geo:south",
  "geo:mediterranean",
  "area:galilee",
  "geo:jordan-valley",
]);

function scoreQuestion(
  question: PalestineQuestion,
  candidates: PalestineCityRecord[],
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
  let stageBonus = 0;
  let categoryBonus = 0;

  if (candidates.length > 12) {
    stageBonus =
      question.stage === "broad"
        ? 0.18
        : question.stage === "medium"
          ? 0.08
          : -0.02;
    categoryBonus =
      question.category === "region"
        ? 0.05
        : question.category === "coast"
          ? 0.03
          : question.category === "faith"
            ? -0.02
            : 0;
  } else if (candidates.length > 5) {
    stageBonus =
      question.stage === "medium"
        ? 0.16
        : question.stage === "narrow"
          ? 0.08
          : 0.03;
    categoryBonus =
      question.category === "border" || question.category === "water" ? 0.03 : 0;
  } else {
    stageBonus =
      question.stage === "narrow"
        ? 0.18
        : question.stage === "medium"
          ? 0.08
          : -0.02;
    categoryBonus =
      question.category === "faith" || question.category === "border" || question.category === "water"
        ? 0.05
        : 0;
  }

  return {
    question,
    score: balance + stageBonus + categoryBonus,
  };
}

function pickQuestion(scoredQuestions: { question: PalestineQuestion; score: number }[]) {
  const sorted = [...scoredQuestions].sort((left, right) => right.score - left.score);

  if (sorted.length === 0) {
    return null;
  }

  const maxIndex = Math.min(2, sorted.length - 1);
  return sorted[Math.floor(Math.random() * (maxIndex + 1))].question;
}

export function choosePalestineQuestion(
  candidates: PalestineCityRecord[],
  askedQuestionIds: Set<string>,
) {
  const scored = QUESTIONS.map((question) =>
    scoreQuestion(question, candidates, askedQuestionIds),
  ).filter(
    (value): value is { question: PalestineQuestion; score: number } => Boolean(value),
  );

  if (askedQuestionIds.size <= 1) {
    const openings = scored
      .filter((entry) => OPENING_QUESTION_IDS.has(entry.question.id))
      .sort((left, right) => right.score - left.score);

    if (openings.length > 0) {
      const maxIndex = Math.min(4, openings.length - 1);
      return openings[Math.floor(Math.random() * (maxIndex + 1))].question;
    }
  }

  const sorted = [...scored].sort((left, right) => right.score - left.score);
  const bestFilter = sorted[0]?.question ?? null;
  const bestFilterScore = sorted[0]?.score ?? -1;
  const shouldGuessNow =
    candidates.length <= 2 || (candidates.length === 3 && bestFilterScore < 0.46);

  if (shouldGuessNow) {
    const guessCity = candidates.find(
      (city) => !askedQuestionIds.has(`guess:${city.name}`),
    );

    if (guessCity) {
      return {
        id: `guess:${guessCity.name}`,
        prompt: `Is it ${guessCity.name}?`,
        shortLabel: guessCity.name,
        stage: "narrow",
        category: "guess",
        test: (city: PalestineCityRecord) => city.name === guessCity.name,
        guessedCity: guessCity.name,
      } satisfies PalestineQuestion;
    }
  }

  if (!bestFilter) {
    const fallbackGuess = candidates.find(
      (city) => !askedQuestionIds.has(`guess:${city.name}`),
    );

    if (!fallbackGuess) {
      return null;
    }

    return {
      id: `guess:${fallbackGuess.name}`,
      prompt: `Is it ${fallbackGuess.name}?`,
      shortLabel: fallbackGuess.name,
      stage: "narrow",
      category: "guess",
      test: (city: PalestineCityRecord) => city.name === fallbackGuess.name,
      guessedCity: fallbackGuess.name,
    } satisfies PalestineQuestion;
  }

  return pickQuestion(scored);
}

export function applyPalestineTurnAnswer(
  question: PalestineQuestion,
  answer: PalestineTurnAnswer,
  candidates: PalestineCityRecord[],
) {
  if (question.guessedCity) {
    if (answer === "yes") {
      return {
        candidates: candidates.filter((city) => city.name === question.guessedCity),
        aiWon: true,
      } satisfies PalestineTurnResolution;
    }

    if (answer === "no") {
      return {
        candidates: candidates.filter((city) => city.name !== question.guessedCity),
        aiWon: false,
      } satisfies PalestineTurnResolution;
    }

    return {
      candidates,
      aiWon: false,
    } satisfies PalestineTurnResolution;
  }

  if (answer === "idk") {
    return {
      candidates,
      aiWon: false,
    } satisfies PalestineTurnResolution;
  }

  const filtered =
    answer === "yes"
      ? candidates.filter(question.test)
      : candidates.filter((city) => !question.test(city));

  if (filtered.length === 0) {
    return {
      candidates,
      aiWon: false,
      inconsistencyWarning:
        "That answer would remove every remaining city, so I kept the previous shortlist.",
    } satisfies PalestineTurnResolution;
  }

  return {
    candidates: filtered,
    aiWon: false,
  } satisfies PalestineTurnResolution;
}

export function getPalestineShortlistPreview(
  candidates: PalestineCityRecord[],
  count = 10,
) {
  return candidates.slice(0, count);
}

export function getPalestineLookup(query: string) {
  const normalized = normalizeText(query);

  if (!normalized) {
    return CITIES;
  }

  return CITIES.filter((city) => {
    if (normalizeText(city.name).includes(normalized)) {
      return true;
    }

    return city.aliases.some((alias) => normalizeText(alias).includes(normalized));
  });
}

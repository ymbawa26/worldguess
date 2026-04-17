import countrySource from "./countries.json";

export type Difficulty = "easy" | "medium" | "hard";
export type TurnAnswer = "yes" | "no" | "idk";
export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania";
type SovereignStatus =
  | "sovereign"
  | "territory"
  | "disputed"
  | "associated-state";
type GeographyBounds = {
  south: number;
  north: number;
  west: number;
  east: number;
};
type GeoQuarter = "NW" | "NE" | "SW" | "SE";
export type QuestionKind = "predicate" | "guess";
type QuestionStage = "broad" | "medium" | "narrow";

export type CountryRecord = {
  name: string;
  continent: Continent;
  subregion: string;
  continents: Continent[];
  subregions: string[];
  bounds: GeographyBounds;
  preciseBounds: boolean;
  latitude: number;
  longitude: number;
  geoQuarters: GeoQuarter[];
  transcontinental: boolean;
  sovereignStatus: SovereignStatus;
  island: boolean;
  archipelago: boolean;
  landlocked: boolean;
  coastline: boolean;
  microstate: boolean;
  territoryLike: boolean;
  majorityMuslim: boolean;
  majorityChristian: boolean;
  majorityHindu: boolean;
  majorityBuddhist: boolean;
  englishOfficial: boolean;
  spanishOfficial: boolean;
  frenchOfficial: boolean;
  arabicOfficial: boolean;
  portugueseOfficial: boolean;
  eu: boolean;
  nato: boolean;
  g20: boolean;
  caribbean: boolean;
  nordic: boolean;
  balkans: boolean;
  arabLeague: boolean;
  subSaharanAfrica: boolean;
  amazonBasin: boolean;
  formerCommunist: boolean;
  unMember: boolean;
  kingdom: boolean;
  mediterraneanAccess: boolean;
  saharaDesert: boolean;
  persianGulfCoast: boolean;
  redSeaCoast: boolean;
  caribbeanSeaCoast: boolean;
  pacificOceanCoast: boolean;
  caspianSeaCoast: boolean;
  populationTier: "micro" | "small" | "medium" | "large" | "giant";
  crossesEquator: boolean;
  crossesPrimeMeridian: boolean;
  tropical: boolean;
  arctic: boolean;
  entirelyNorthernHemisphere: boolean;
  entirelySouthernHemisphere: boolean;
  entirelyEasternHemisphere: boolean;
  entirelyWesternHemisphere: boolean;
  bordersChina: boolean;
  bordersBrazil: boolean;
  bordersRussia: boolean;
  bordersIndia: boolean;
  bordersTanzania: boolean;
  bordersSaudiArabia: boolean;
  bordersUnitedStates: boolean;
  bordersNigeria: boolean;
  bordersSudan: boolean;
  bordersAlgeria: boolean;
  bordersIran: boolean;
  bordersIraq: boolean;
  bordersPakistan: boolean;
  bordersMexico: boolean;
  bordersColombia: boolean;
  bordersGreece: boolean;
  bordersHungary: boolean;
  bordersMoldova: boolean;
  bordersBosniaHerzegovina: boolean;
  bordersDRC: boolean;
  bordersKazakhstan: boolean;
  bordersFrance: boolean;
  bordersSenegal: boolean;
  bordersIndonesia: boolean;
  bordersYemen: boolean;
  bordersPanama: boolean;
  bordersCostaRica: boolean;
  bordersPoland: boolean;
};

export type LearnableTraitKey =
  | "island"
  | "archipelago"
  | "landlocked"
  | "coastline"
  | "territoryLike"
  | "transcontinental"
  | "microstate"
  | "majorityMuslim"
  | "majorityChristian"
  | "majorityHindu"
  | "majorityBuddhist"
  | "englishOfficial"
  | "spanishOfficial"
  | "frenchOfficial"
  | "arabicOfficial"
  | "portugueseOfficial"
  | "eu"
  | "nato"
  | "g20"
  | "nordic"
  | "balkans"
  | "arabLeague"
  | "subSaharanAfrica"
  | "amazonBasin"
  | "formerCommunist"
  | "unMember"
  | "kingdom"
  | "mediterraneanAccess"
  | "saharaDesert"
  | "persianGulfCoast"
  | "redSeaCoast"
  | "caribbeanSeaCoast"
  | "pacificOceanCoast"
  | "caspianSeaCoast"
  | "bordersChina"
  | "bordersBrazil"
  | "bordersRussia"
  | "bordersIndia"
  | "bordersTanzania"
  | "bordersSaudiArabia"
  | "bordersUnitedStates"
  | "bordersNigeria"
  | "bordersSudan"
  | "bordersAlgeria"
  | "bordersIran"
  | "bordersIraq"
  | "bordersPakistan"
  | "bordersMexico"
  | "bordersColombia"
  | "bordersGreece"
  | "bordersHungary"
  | "bordersMoldova"
  | "bordersBosniaHerzegovina"
  | "bordersDRC"
  | "bordersKazakhstan"
  | "bordersFrance"
  | "bordersSenegal"
  | "bordersIndonesia"
  | "bordersYemen"
  | "bordersPanama"
  | "bordersCostaRica"
  | "bordersPoland";

export type GameQuestion = {
  id: string;
  kind: QuestionKind;
  prompt: string;
  shortLabel: string;
  stage: QuestionStage;
  category: string;
  test: (country: CountryRecord) => boolean;
  evaluateForPlayer?: (country: CountryRecord) => "Yes" | "No" | "Maybe";
  guessedCountry?: string;
};

export type PlayerIntent =
  | { kind: "empty" }
  | { kind: "unknown" }
  | { kind: "guess"; countryName: string }
  | { kind: "predicate"; question: GameQuestion };

export type ComputerReply = {
  answer: "Yes" | "No" | "Maybe";
  explanation: string;
  playerWon: boolean;
};

export type ComputerTurnResolution = {
  candidates: CountryRecord[];
  aiWon: boolean;
  inconsistencyWarning?: string;
};

const EASY_POOL = new Set<string>([
  "United States",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "United Kingdom",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Ireland",
  "Norway",
  "Sweden",
  "Denmark",
  "Poland",
  "Ukraine",
  "Russia",
  "Turkey",
  "Greece",
  "Egypt",
  "Morocco",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Ethiopia",
  "Saudi Arabia",
  "United Arab Emirates",
  "Israel",
  "Iran",
  "India",
  "Pakistan",
  "Bangladesh",
  "China",
  "Japan",
  "South Korea",
  "North Korea",
  "Taiwan",
  "Thailand",
  "Vietnam",
  "Malaysia",
  "Singapore",
  "Indonesia",
  "Philippines",
  "Australia",
  "New Zealand",
  "Chile",
  "Colombia",
  "Peru",
  "Venezuela",
  "Cuba",
  "Dominican Republic",
  "Jamaica",
  "Costa Rica",
  "Panama",
  "Iceland",
  "Finland",
  "Romania",
  "Hungary",
  "Czech Republic",
  "Qatar",
  "Iraq",
  "Syria",
  "Nepal",
  "Sri Lanka",
  "Kazakhstan",
]);

const SUBREGION_GROUPS = {
  "Northern Africa": [
    "Algeria",
    "Egypt",
    "Libya",
    "Morocco",
    "Sudan",
    "Tunisia",
    "Western Sahara",
  ],
  "Western Africa": [
    "Cote d'Ivoire",
    "Benin",
    "Burkina Faso",
    "Cabo Verde",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Liberia",
    "Mali",
    "Mauritania",
    "Niger",
    "Nigeria",
    "Senegal",
    "Sierra Leone",
    "Togo",
  ],
  "Middle Africa": [
    "Angola",
    "Cameroon",
    "Central African Republic",
    "Chad",
    "Democratic Republic of the Congo",
    "Equatorial Guinea",
    "Gabon",
    "Republic of the Congo",
    "Sao Tome and Principe",
  ],
  "Eastern Africa": [
    "Burundi",
    "Comoros",
    "Djibouti",
    "Eritrea",
    "Ethiopia",
    "Kenya",
    "Madagascar",
    "Malawi",
    "Mauritius",
    "Mozambique",
    "Rwanda",
    "Seychelles",
    "Somalia",
    "South Sudan",
    "Tanzania",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ],
  "Southern Africa": [
    "Botswana",
    "Bouvet Island",
    "Eswatini",
    "Lesotho",
    "Namibia",
    "South Africa",
    "Saint Helena",
  ],
  "Western Asia": [
    "Armenia",
    "Azerbaijan",
    "Bahrain",
    "Cyprus",
    "Georgia",
    "Iran",
    "Iraq",
    "Israel",
    "Jordan",
    "Kuwait",
    "Lebanon",
    "Oman",
    "Palestine",
    "Qatar",
    "Saudi Arabia",
    "Syria",
    "Turkey",
    "United Arab Emirates",
    "Yemen",
  ],
  "Central Asia": [
    "Afghanistan",
    "Kazakhstan",
    "Kyrgyzstan",
    "Tajikistan",
    "Turkmenistan",
    "Uzbekistan",
  ],
  "Southern Asia": [
    "Bangladesh",
    "Bhutan",
    "India",
    "Maldives",
    "Nepal",
    "Pakistan",
    "Sri Lanka",
  ],
  "South-Eastern Asia": [
    "Brunei",
    "Cambodia",
    "Christmas Island",
    "Cocos Islands",
    "East Timor",
    "Indonesia",
    "Laos",
    "Malaysia",
    "Myanmar",
    "Philippines",
    "Singapore",
    "Thailand",
    "Vietnam",
  ],
  "Eastern Asia": [
    "China",
    "Hong Kong",
    "Japan",
    "Macao",
    "Mongolia",
    "North Korea",
    "South Korea",
    "Taiwan",
  ],
  "Northern Europe": [
    "Aland Islands",
    "Denmark",
    "Estonia",
    "Faroe Islands",
    "Finland",
    "Guernsey",
    "Iceland",
    "Ireland",
    "Isle of Man",
    "Jersey",
    "Latvia",
    "Lithuania",
    "Norway",
    "Svalbard",
    "Sweden",
    "United Kingdom",
  ],
  "Western Europe": [
    "Austria",
    "Belgium",
    "France",
    "Germany",
    "Liechtenstein",
    "Luxembourg",
    "Monaco",
    "Netherlands",
    "Switzerland",
  ],
  "Southern Europe": [
    "Albania",
    "Andorra",
    "Bosnia and Herzegovina",
    "Croatia",
    "Gibraltar",
    "Greece",
    "Italy",
    "Kosovo",
    "Malta",
    "Montenegro",
    "North Macedonia",
    "Portugal",
    "San Marino",
    "Serbia",
    "Slovenia",
    "Spain",
    "Vatican City",
  ],
  "Eastern Europe": [
    "Belarus",
    "Bulgaria",
    "Czech Republic",
    "Hungary",
    "Moldova",
    "Poland",
    "Romania",
    "Russia",
    "Slovakia",
    "Ukraine",
  ],
  "Northern America": [
    "Bermuda",
    "Canada",
    "Greenland",
    "Saint Pierre and Miquelon",
    "United States",
  ],
  "Central America": [
    "Belize",
    "Costa Rica",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Mexico",
    "Nicaragua",
    "Panama",
  ],
  Caribbean: [
    "Antigua and Barbuda",
    "Anguilla",
    "Aruba",
    "Bahamas",
    "Barbados",
    "British Virgin Islands",
    "Cayman Islands",
    "Cuba",
    "Curacao",
    "Dominica",
    "Dominican Republic",
    "Grenada",
    "Haiti",
    "Jamaica",
    "Montserrat",
    "Puerto Rico",
    "Saint Barthelemy",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin",
    "Saint Vincent",
    "Sint Maarten",
    "Trinidad and Tobago",
    "Turks and Caicos Islands",
    "US Virgin Islands",
  ],
  "South America": [
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Falkland Islands",
    "French Guiana",
    "Guyana",
    "Paraguay",
    "Peru",
    "Suriname",
    "Uruguay",
    "Venezuela",
  ],
  "Australia and New Zealand": [
    "Australia",
    "New Zealand",
    "Norfolk Island",
  ],
  Melanesia: [
    "Fiji",
    "New Caledonia",
    "Papua New Guinea",
    "Solomon Islands",
    "Vanuatu",
  ],
  Micronesia: [
    "Guam",
    "Kiribati",
    "Marshall Islands",
    "Micronesia",
    "Nauru",
    "Northern Mariana Islands",
    "Palau",
  ],
  Polynesia: [
    "American Samoa",
    "Cook Islands",
    "French Polynesia",
    "Niue",
    "Pitcairn Islands",
    "Samoa",
    "Tokelau",
    "Tonga",
    "Tuvalu",
    "Wallis and Futuna",
  ],
} as const;

const SUBREGION_CONTINENTS: Record<string, Continent> = {
  "Northern Africa": "Africa",
  "Western Africa": "Africa",
  "Middle Africa": "Africa",
  "Eastern Africa": "Africa",
  "Southern Africa": "Africa",
  "Western Asia": "Asia",
  "Central Asia": "Asia",
  "Southern Asia": "Asia",
  "South-Eastern Asia": "Asia",
  "Eastern Asia": "Asia",
  "Northern Europe": "Europe",
  "Western Europe": "Europe",
  "Southern Europe": "Europe",
  "Eastern Europe": "Europe",
  "Northern America": "North America",
  "Central America": "North America",
  Caribbean: "North America",
  "South America": "South America",
  "Australia and New Zealand": "Oceania",
  Melanesia: "Oceania",
  Micronesia: "Oceania",
  Polynesia: "Oceania",
};

const SUBREGION_BASE_COORDS: Record<string, { lat: number; lon: number }> = {
  "Northern Africa": { lat: 28, lon: 12 },
  "Western Africa": { lat: 9, lon: -7 },
  "Middle Africa": { lat: 1, lon: 20 },
  "Eastern Africa": { lat: -4, lon: 39 },
  "Southern Africa": { lat: -24, lon: 24 },
  "Western Asia": { lat: 31, lon: 43 },
  "Central Asia": { lat: 41, lon: 68 },
  "Southern Asia": { lat: 22, lon: 79 },
  "South-Eastern Asia": { lat: 7, lon: 106 },
  "Eastern Asia": { lat: 34, lon: 117 },
  "Northern Europe": { lat: 59, lon: 14 },
  "Western Europe": { lat: 48, lon: 5 },
  "Southern Europe": { lat: 41, lon: 18 },
  "Eastern Europe": { lat: 49, lon: 28 },
  "Northern America": { lat: 48, lon: -95 },
  "Central America": { lat: 14, lon: -87 },
  Caribbean: { lat: 18, lon: -72 },
  "South America": { lat: -16, lon: -61 },
  "Australia and New Zealand": { lat: -31, lon: 143 },
  Melanesia: { lat: -10, lon: 160 },
  Micronesia: { lat: 8, lon: 156 },
  Polynesia: { lat: -15, lon: -151 },
};

const ISLAND_NAMES = new Set<string>([
  "Aland Islands",
  "American Samoa",
  "Antigua and Barbuda",
  "Aruba",
  "Australia",
  "Bahamas",
  "Bahrain",
  "Barbados",
  "Bermuda",
  "Bouvet Island",
  "British Virgin Islands",
  "Cabo Verde",
  "Cayman Islands",
  "Christmas Island",
  "Cocos Islands",
  "Comoros",
  "Cook Islands",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Dominica",
  "Dominican Republic",
  "Faroe Islands",
  "Fiji",
  "French Polynesia",
  "Greenland",
  "Grenada",
  "Guam",
  "Haiti",
  "Hong Kong",
  "Iceland",
  "Indonesia",
  "Ireland",
  "Isle of Man",
  "Jamaica",
  "Japan",
  "Jersey",
  "Kiribati",
  "Madagascar",
  "Maldives",
  "Malta",
  "Marshall Islands",
  "Mauritius",
  "Micronesia",
  "Montserrat",
  "Nauru",
  "New Caledonia",
  "New Zealand",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Palau",
  "Papua New Guinea",
  "Philippines",
  "Pitcairn Islands",
  "Puerto Rico",
  "Samoa",
  "Sao Tome and Principe",
  "Saint Barthelemy",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent",
  "Seychelles",
  "Singapore",
  "Sint Maarten",
  "Solomon Islands",
  "Sri Lanka",
  "Svalbard",
  "Taiwan",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Turks and Caicos Islands",
  "Tuvalu",
  "United Kingdom",
  "US Virgin Islands",
  "Vanuatu",
  "Wallis and Futuna",
]);

const LANDLOCKED_NAMES = new Set<string>([
  "Afghanistan",
  "Armenia",
  "Austria",
  "Azerbaijan",
  "Andorra",
  "Belarus",
  "Bhutan",
  "Bolivia",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Central African Republic",
  "Chad",
  "Czech Republic",
  "Eswatini",
  "Ethiopia",
  "Hungary",
  "Kazakhstan",
  "Kosovo",
  "Kyrgyzstan",
  "Laos",
  "Lesotho",
  "Liechtenstein",
  "Luxembourg",
  "Malawi",
  "Mali",
  "Moldova",
  "Mongolia",
  "Nepal",
  "Niger",
  "North Macedonia",
  "Paraguay",
  "Rwanda",
  "San Marino",
  "Serbia",
  "Slovakia",
  "South Sudan",
  "Switzerland",
  "Tajikistan",
  "Turkmenistan",
  "Uganda",
  "Uzbekistan",
  "Vatican City",
  "Zambia",
  "Zimbabwe",
]);

const ENGLISH_OFFICIAL_NAMES = new Set<string>([
  "Antigua and Barbuda",
  "Australia",
  "Bahamas",
  "Barbados",
  "Belize",
  "Botswana",
  "Cameroon",
  "Canada",
  "Dominica",
  "Eswatini",
  "Fiji",
  "Gambia",
  "Ghana",
  "Grenada",
  "Guyana",
  "India",
  "Ireland",
  "Jamaica",
  "Kenya",
  "Kiribati",
  "Liberia",
  "Malawi",
  "Malta",
  "Marshall Islands",
  "Mauritius",
  "Micronesia",
  "Namibia",
  "Nauru",
  "New Zealand",
  "Nigeria",
  "Pakistan",
  "Palau",
  "Papua New Guinea",
  "Philippines",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent",
  "Samoa",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Solomon Islands",
  "South Africa",
  "South Sudan",
  "Tanzania",
  "Tonga",
  "Trinidad and Tobago",
  "Tuvalu",
  "Uganda",
  "United Kingdom",
  "United States",
  "Vanuatu",
  "Zambia",
  "Zimbabwe",
]);

const SPANISH_OFFICIAL_NAMES = new Set<string>([
  "Argentina",
  "Bolivia",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Dominican Republic",
  "Ecuador",
  "El Salvador",
  "Equatorial Guinea",
  "Guatemala",
  "Honduras",
  "Mexico",
  "Nicaragua",
  "Panama",
  "Paraguay",
  "Peru",
  "Puerto Rico",
  "Spain",
  "Uruguay",
  "Venezuela",
]);

const FRENCH_OFFICIAL_NAMES = new Set<string>([
  "Belgium",
  "Benin",
  "Burkina Faso",
  "Burundi",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Cote d'Ivoire",
  "Democratic Republic of the Congo",
  "Djibouti",
  "Equatorial Guinea",
  "France",
  "French Guiana",
  "French Polynesia",
  "Gabon",
  "Guinea",
  "Haiti",
  "Luxembourg",
  "Madagascar",
  "Mali",
  "Monaco",
  "Niger",
  "New Caledonia",
  "Republic of the Congo",
  "Rwanda",
  "Saint Barthelemy",
  "Saint Martin",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Switzerland",
  "Togo",
  "Vanuatu",
  "Wallis and Futuna",
]);

const ARABIC_OFFICIAL_NAMES = new Set<string>([
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
  "Western Sahara",
  "Yemen",
]);

const PORTUGUESE_OFFICIAL_NAMES = new Set<string>([
  "Angola",
  "Brazil",
  "Cabo Verde",
  "East Timor",
  "Equatorial Guinea",
  "Guinea-Bissau",
  "Mozambique",
  "Portugal",
  "Sao Tome and Principe",
]);

const MAJORITY_MUSLIM_NAMES = new Set<string>([
  "Afghanistan",
  "Albania",
  "Algeria",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Brunei",
  "Chad",
  "Comoros",
  "Djibouti",
  "Egypt",
  "Guinea",
  "Indonesia",
  "Iran",
  "Iraq",
  "Jordan",
  "Kazakhstan",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Libya",
  "Malaysia",
  "Maldives",
  "Mauritania",
  "Morocco",
  "Niger",
  "Oman",
  "Pakistan",
  "Palestine",
  "Qatar",
  "Saudi Arabia",
  "Senegal",
  "Somalia",
  "Sudan",
  "Syria",
  "Tajikistan",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "United Arab Emirates",
  "Uzbekistan",
  "Western Sahara",
  "Yemen",
]);

const MAJORITY_CHRISTIAN_NAMES = new Set<string>([
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Bahamas",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Bolivia",
  "Botswana",
  "Brazil",
  "Bulgaria",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "El Salvador",
  "Equatorial Guinea",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Georgia",
  "Germany",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Jamaica",
  "Kenya",
  "Kiribati",
  "Latvia",
  "Lesotho",
  "Liberia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malta",
  "Marshall Islands",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Montenegro",
  "Namibia",
  "Nauru",
  "Netherlands",
  "Nicaragua",
  "North Macedonia",
  "Norway",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Republic of the Congo",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Serbia",
  "Seychelles",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "South Africa",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "Tonga",
  "Trinidad and Tobago",
  "Uganda",
  "Ukraine",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Zambia",
  "Zimbabwe",
]);

const MAJORITY_HINDU_NAMES = new Set<string>(["India", "Nepal"]);

const MAJORITY_BUDDHIST_NAMES = new Set<string>([
  "Bhutan",
  "Cambodia",
  "Laos",
  "Myanmar",
  "Sri Lanka",
  "Thailand",
  "Mongolia",
]);

const AMAZON_BASIN_NAMES = new Set<string>([
  "Bolivia",
  "Brazil",
  "Colombia",
  "Ecuador",
  "French Guiana",
  "Guyana",
  "Peru",
  "Suriname",
  "Venezuela",
]);

const MEDITERRANEAN_ACCESS_NAMES = new Set<string>([
  "Albania",
  "Algeria",
  "Bosnia and Herzegovina",
  "Croatia",
  "Cyprus",
  "Egypt",
  "France",
  "Gibraltar",
  "Greece",
  "Israel",
  "Italy",
  "Lebanon",
  "Libya",
  "Malta",
  "Monaco",
  "Montenegro",
  "Morocco",
  "Palestine",
  "Slovenia",
  "Spain",
  "Syria",
  "Tunisia",
  "Turkey",
]);

const SAHARA_DESERT_NAMES = new Set<string>([
  "Algeria",
  "Chad",
  "Egypt",
  "Libya",
  "Mali",
  "Mauritania",
  "Morocco",
  "Niger",
  "Sudan",
  "Tunisia",
  "Western Sahara",
]);

const PERSIAN_GULF_COAST_NAMES = new Set<string>([
  "Bahrain",
  "Iran",
  "Iraq",
  "Kuwait",
  "Qatar",
  "Saudi Arabia",
  "United Arab Emirates",
]);

const RED_SEA_COAST_NAMES = new Set<string>([
  "Djibouti",
  "Egypt",
  "Eritrea",
  "Israel",
  "Jordan",
  "Saudi Arabia",
  "Sudan",
  "Yemen",
]);

const CARIBBEAN_SEA_COAST_NAMES = new Set<string>([
  "Antigua and Barbuda",
  "Belize",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Dominica",
  "Dominican Republic",
  "Grenada",
  "Guatemala",
  "Haiti",
  "Honduras",
  "Jamaica",
  "Mexico",
  "Nicaragua",
  "Panama",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent",
  "Trinidad and Tobago",
  "Venezuela",
]);

const PACIFIC_OCEAN_COAST_NAMES = new Set<string>([
  "Australia",
  "Brunei",
  "Cambodia",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "Indonesia",
  "Japan",
  "Malaysia",
  "Mexico",
  "Nicaragua",
  "North Korea",
  "Panama",
  "Papua New Guinea",
  "Peru",
  "Philippines",
  "Russia",
  "South Korea",
  "Taiwan",
  "United States",
  "Vietnam",
  "New Zealand",
  "East Timor",
]);

const CASPIAN_SEA_COAST_NAMES = new Set<string>([
  "Azerbaijan",
  "Iran",
  "Kazakhstan",
  "Russia",
  "Turkmenistan",
]);

const FORMER_COMMUNIST_NAMES = new Set<string>([
  "Afghanistan",
  "Albania",
  "Angola",
  "Armenia",
  "Azerbaijan",
  "Belarus",
  "Benin",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Cambodia",
  "China",
  "Croatia",
  "Cuba",
  "Czech Republic",
  "East Timor",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Georgia",
  "Hungary",
  "Kazakhstan",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lithuania",
  "Moldova",
  "Mongolia",
  "Montenegro",
  "Mozambique",
  "North Korea",
  "North Macedonia",
  "Poland",
  "Republic of the Congo",
  "Romania",
  "Russia",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "South Yemen",
  "Tajikistan",
  "Turkmenistan",
  "Ukraine",
  "Uzbekistan",
  "Vietnam",
]);

const UN_MEMBER_NAMES = new Set(countrySource.medium);

const KINGDOM_NAMES = new Set<string>([
  "Bahrain",
  "Belgium",
  "Bhutan",
  "Cambodia",
  "Denmark",
  "Eswatini",
  "Jordan",
  "Lesotho",
  "Morocco",
  "Netherlands",
  "Norway",
  "Saudi Arabia",
  "Spain",
  "Sweden",
  "Thailand",
  "Tonga",
  "United Kingdom",
]);

const EU_NAMES = new Set<string>([
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
]);

const NATO_NAMES = new Set<string>([
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
  "Turkey",
  "United Kingdom",
  "United States",
]);

const G20_NAMES = new Set<string>([
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
]);

const NORDIC_NAMES = new Set<string>([
  "Aland Islands",
  "Denmark",
  "Faroe Islands",
  "Finland",
  "Iceland",
  "Norway",
  "Sweden",
]);

const BALKAN_NAMES = new Set<string>([
  "Albania",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Croatia",
  "Greece",
  "Kosovo",
  "Montenegro",
  "North Macedonia",
  "Romania",
  "Serbia",
  "Slovenia",
]);

const ARAB_LEAGUE_NAMES = new Set<string>([
  "Algeria",
  "Bahrain",
  "Chad",
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
]);

const GIANT_POPULATION_NAMES = new Set<string>([
  "Bangladesh",
  "Brazil",
  "China",
  "Democratic Republic of the Congo",
  "Egypt",
  "Ethiopia",
  "India",
  "Indonesia",
  "Japan",
  "Mexico",
  "Nigeria",
  "Pakistan",
  "Philippines",
  "Russia",
  "United States",
  "Vietnam",
]);

const LARGE_POPULATION_NAMES = new Set<string>([
  "Afghanistan",
  "Algeria",
  "Argentina",
  "Canada",
  "Colombia",
  "Cote d'Ivoire",
  "France",
  "Germany",
  "Iran",
  "Iraq",
  "Italy",
  "Kenya",
  "Malaysia",
  "Morocco",
  "Myanmar",
  "Nepal",
  "Peru",
  "Poland",
  "Saudi Arabia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sudan",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Kingdom",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
]);

const SMALL_POPULATION_NAMES = new Set<string>([
  "Aland Islands",
  "American Samoa",
  "Anguilla",
  "Andorra",
  "Antigua and Barbuda",
  "Aruba",
  "Bahamas",
  "Bahrain",
  "Barbados",
  "Bermuda",
  "Bouvet Island",
  "British Virgin Islands",
  "Cabo Verde",
  "Cayman Islands",
  "Christmas Island",
  "Cocos Islands",
  "Cook Islands",
  "Curacao",
  "Dominica",
  "Faroe Islands",
  "French Polynesia",
  "Greenland",
  "Grenada",
  "Guam",
  "Guyana",
  "Iceland",
  "Isle of Man",
  "Jersey",
  "Kiribati",
  "Liechtenstein",
  "Luxembourg",
  "Macao",
  "Maldives",
  "Malta",
  "Marshall Islands",
  "Mauritius",
  "Micronesia",
  "Monaco",
  "Montserrat",
  "Nauru",
  "New Caledonia",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Palau",
  "Pitcairn Islands",
  "Saint Barthelemy",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Seychelles",
  "Sint Maarten",
  "Svalbard",
  "Tokelau",
  "Tonga",
  "Tuvalu",
  "US Virgin Islands",
  "Vanuatu",
  "Vatican City",
  "Wallis and Futuna",
]);

const MICROSTATE_NAMES = new Set<string>([
  "Aland Islands",
  "Andorra",
  "Anguilla",
  "Aruba",
  "Bouvet Island",
  "British Virgin Islands",
  "Cayman Islands",
  "Christmas Island",
  "Cocos Islands",
  "Cook Islands",
  "Faroe Islands",
  "Gibraltar",
  "Guernsey",
  "Isle of Man",
  "Jersey",
  "Liechtenstein",
  "Monaco",
  "Montserrat",
  "Nauru",
  "Niue",
  "Norfolk Island",
  "Pitcairn Islands",
  "Saint Barthelemy",
  "Saint Helena",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "San Marino",
  "Sint Maarten",
  "Svalbard",
  "Tokelau",
  "Tuvalu",
  "Vatican City",
  "Wallis and Futuna",
]);

const TERRITORY_LIKE_NAMES = new Set<string>([
  ...countrySource.hard.filter((name) => name !== "Vatican City"),
  "Kosovo",
]);

const BORDER_CHINA_NAMES = new Set<string>([
  "Afghanistan",
  "Bhutan",
  "India",
  "Kazakhstan",
  "Kyrgyzstan",
  "Laos",
  "Mongolia",
  "Myanmar",
  "Nepal",
  "North Korea",
  "Pakistan",
  "Russia",
  "Tajikistan",
  "Vietnam",
]);

const BORDER_BRAZIL_NAMES = new Set<string>([
  "Argentina",
  "Bolivia",
  "Colombia",
  "French Guiana",
  "Guyana",
  "Paraguay",
  "Peru",
  "Suriname",
  "Uruguay",
  "Venezuela",
]);

const BORDER_RUSSIA_NAMES = new Set<string>([
  "Azerbaijan",
  "Belarus",
  "China",
  "Estonia",
  "Finland",
  "Georgia",
  "Kazakhstan",
  "Latvia",
  "Lithuania",
  "Mongolia",
  "North Korea",
  "Norway",
  "Poland",
  "Ukraine",
]);

const BORDER_INDIA_NAMES = new Set<string>([
  "Bangladesh",
  "Bhutan",
  "China",
  "Myanmar",
  "Nepal",
  "Pakistan",
]);

const BORDER_TANZANIA_NAMES = new Set<string>([
  "Burundi",
  "Kenya",
  "Malawi",
  "Mozambique",
  "Rwanda",
  "Uganda",
  "Zambia",
]);

const BORDER_SAUDI_ARABIA_NAMES = new Set<string>([
  "Iraq",
  "Jordan",
  "Kuwait",
  "Oman",
  "Qatar",
  "United Arab Emirates",
  "Yemen",
]);

const BORDER_US_NAMES = new Set<string>(["Canada", "Mexico"]);
const BORDER_NIGERIA_NAMES = new Set<string>([
  "Benin",
  "Cameroon",
  "Chad",
  "Niger",
]);
const BORDER_SUDAN_NAMES = new Set<string>([
  "Central African Republic",
  "Chad",
  "Egypt",
  "Eritrea",
  "Ethiopia",
  "Libya",
  "South Sudan",
]);
const BORDER_ALGERIA_NAMES = new Set<string>([
  "Libya",
  "Mali",
  "Mauritania",
  "Morocco",
  "Niger",
  "Tunisia",
  "Western Sahara",
]);
const BORDER_IRAN_NAMES = new Set<string>([
  "Afghanistan",
  "Armenia",
  "Azerbaijan",
  "Iraq",
  "Pakistan",
  "Turkey",
  "Turkmenistan",
]);
const BORDER_IRAQ_NAMES = new Set<string>([
  "Iran",
  "Jordan",
  "Kuwait",
  "Saudi Arabia",
  "Syria",
  "Turkey",
]);
const BORDER_PAKISTAN_NAMES = new Set<string>([
  "Afghanistan",
  "China",
  "India",
  "Iran",
]);
const BORDER_MEXICO_NAMES = new Set<string>([
  "Belize",
  "Guatemala",
  "United States",
]);
const BORDER_COLOMBIA_NAMES = new Set<string>([
  "Brazil",
  "Ecuador",
  "Panama",
  "Peru",
  "Venezuela",
]);
const BORDER_GREECE_NAMES = new Set<string>([
  "Albania",
  "Bulgaria",
  "North Macedonia",
  "Turkey",
]);
const BORDER_HUNGARY_NAMES = new Set<string>([
  "Austria",
  "Croatia",
  "Romania",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Ukraine",
]);
const BORDER_MOLDOVA_NAMES = new Set<string>([
  "Romania",
  "Ukraine",
]);
const BORDER_BOSNIA_NAMES = new Set<string>([
  "Croatia",
  "Montenegro",
  "Serbia",
]);
const BORDER_DRC_NAMES = new Set<string>([
  "Angola",
  "Burundi",
  "Central African Republic",
  "Republic of the Congo",
  "Rwanda",
  "South Sudan",
  "Tanzania",
  "Uganda",
  "Zambia",
]);
const BORDER_KAZAKHSTAN_NAMES = new Set<string>([
  "China",
  "Kyrgyzstan",
  "Russia",
  "Turkmenistan",
  "Uzbekistan",
]);
const BORDER_FRANCE_NAMES = new Set<string>([
  "Andorra",
  "Belgium",
  "Germany",
  "Italy",
  "Luxembourg",
  "Monaco",
  "Spain",
  "Switzerland",
]);
const BORDER_SENEGAL_NAMES = new Set<string>([
  "Gambia",
  "Guinea",
  "Guinea-Bissau",
  "Mali",
  "Mauritania",
]);
const BORDER_INDONESIA_NAMES = new Set<string>([
  "East Timor",
  "Malaysia",
  "Papua New Guinea",
]);
const BORDER_YEMEN_NAMES = new Set<string>(["Oman", "Saudi Arabia"]);
const BORDER_PANAMA_NAMES = new Set<string>(["Colombia", "Costa Rica"]);
const BORDER_COSTA_RICA_NAMES = new Set<string>(["Nicaragua", "Panama"]);
const BORDER_POLAND_NAMES = new Set<string>([
  "Belarus",
  "Czech Republic",
  "Germany",
  "Lithuania",
  "Russia",
  "Slovakia",
  "Ukraine",
]);

const ARCHIPELAGO_NAMES = new Set<string>([
  "Aland Islands",
  "American Samoa",
  "Bahamas",
  "Cabo Verde",
  "Comoros",
  "Cook Islands",
  "Faroe Islands",
  "Fiji",
  "French Polynesia",
  "Indonesia",
  "Japan",
  "Kiribati",
  "Maldives",
  "Marshall Islands",
  "Micronesia",
  "New Zealand",
  "Palau",
  "Philippines",
  "Seychelles",
  "Solomon Islands",
  "Tonga",
  "Tuvalu",
  "Vanuatu",
  "Wallis and Futuna",
]);

const SOVEREIGN_STATUS_OVERRIDES: Partial<Record<string, SovereignStatus>> = {
  "American Samoa": "territory",
  Anguilla: "territory",
  Aruba: "territory",
  Bermuda: "territory",
  "British Virgin Islands": "territory",
  "Cayman Islands": "territory",
  "Christmas Island": "territory",
  "Cocos Islands": "territory",
  "Cook Islands": "associated-state",
  Curacao: "territory",
  "Faroe Islands": "associated-state",
  Gibraltar: "territory",
  Greenland: "associated-state",
  Guam: "territory",
  "Hong Kong": "territory",
  Kosovo: "disputed",
  Macao: "territory",
  Montserrat: "territory",
  "New Caledonia": "territory",
  Niue: "associated-state",
  "Northern Mariana Islands": "territory",
  Palestine: "disputed",
  "Puerto Rico": "territory",
  Taiwan: "disputed",
  Tokelau: "territory",
  "Turks and Caicos Islands": "territory",
  "US Virgin Islands": "territory",
  "Vatican City": "sovereign",
  "Western Sahara": "disputed",
};

const SUBREGION_SPANS: Record<string, { lat: number; lon: number }> = {
  "Northern Africa": { lat: 10, lon: 12 },
  "Western Africa": { lat: 12, lon: 14 },
  "Middle Africa": { lat: 10, lon: 12 },
  "Eastern Africa": { lat: 14, lon: 12 },
  "Southern Africa": { lat: 12, lon: 12 },
  "Western Asia": { lat: 10, lon: 12 },
  "Central Asia": { lat: 12, lon: 16 },
  "Southern Asia": { lat: 12, lon: 12 },
  "South-Eastern Asia": { lat: 14, lon: 16 },
  "Eastern Asia": { lat: 12, lon: 14 },
  "Northern Europe": { lat: 12, lon: 16 },
  "Western Europe": { lat: 8, lon: 10 },
  "Southern Europe": { lat: 8, lon: 12 },
  "Eastern Europe": { lat: 10, lon: 14 },
  "Northern America": { lat: 16, lon: 28 },
  "Central America": { lat: 8, lon: 10 },
  Caribbean: { lat: 8, lon: 16 },
  "South America": { lat: 16, lon: 16 },
  "Australia and New Zealand": { lat: 16, lon: 18 },
  Melanesia: { lat: 12, lon: 16 },
  Micronesia: { lat: 12, lon: 20 },
  Polynesia: { lat: 16, lon: 24 },
};

const CONTINENT_OVERRIDES: Partial<Record<string, Continent[]>> = {
  Armenia: ["Asia", "Europe"],
  Azerbaijan: ["Asia", "Europe"],
  Cyprus: ["Asia", "Europe"],
  Egypt: ["Africa", "Asia"],
  Georgia: ["Asia", "Europe"],
  Kazakhstan: ["Asia", "Europe"],
  Russia: ["Europe", "Asia"],
  Turkey: ["Asia", "Europe"],
};

const SUBREGION_OVERRIDES: Partial<Record<string, string[]>> = {
  Armenia: ["Western Asia", "Eastern Europe"],
  Azerbaijan: ["Western Asia", "Eastern Europe"],
  Cyprus: ["Western Asia", "Southern Europe"],
  Egypt: ["Northern Africa", "Western Asia"],
  Georgia: ["Western Asia", "Eastern Europe"],
  Kazakhstan: ["Central Asia", "Eastern Europe"],
  Russia: ["Eastern Europe", "Central Asia", "Eastern Asia"],
  Turkey: ["Western Asia", "Southern Europe"],
};

const BOUNDS_OVERRIDES: Partial<Record<string, GeographyBounds>> = {
  Australia: { south: -44, north: -10, west: 113, east: 154 },
  Brazil: { south: -34, north: 5, west: -74, east: -35 },
  Canada: { south: 42, north: 83, west: -141, east: -52 },
  China: { south: 18, north: 53, west: 73, east: 135 },
  Egypt: { south: 22, north: 32, west: 25, east: 36 },
  France: { south: 42, north: 51.5, west: -5.5, east: 8.5 },
  India: { south: 6, north: 37, west: 68, east: 97 },
  Indonesia: { south: -11, north: 6, west: 95, east: 141 },
  Kazakhstan: { south: 40, north: 56, west: 46, east: 88 },
  Russia: { south: 41, north: 82, west: 19, east: 169 },
  Tanzania: { south: -12, north: -1, west: 29, east: 41 },
  Togo: { south: 6, north: 11.2, west: -0.2, east: 1.9 },
  Turkey: { south: 36, north: 42.5, west: 26, east: 45 },
  "United States": { south: 24, north: 49, west: -125, east: -66 },
};

const BOTH_LATITUDE_HEMISPHERES_NAMES = new Set<string>([
  "Brazil",
  "Colombia",
  "Democratic Republic of the Congo",
  "Ecuador",
  "Equatorial Guinea",
  "Gabon",
  "Indonesia",
  "Kenya",
  "Kiribati",
  "Maldives",
  "Republic of the Congo",
  "Sao Tome and Principe",
  "Uganda",
]);

const SOUTHERN_HEMISPHERE_ONLY_NAMES = new Set<string>([
  "American Samoa",
  "Angola",
  "Argentina",
  "Australia",
  "Bolivia",
  "Botswana",
  "Bouvet Island",
  "Burundi",
  "Chile",
  "Christmas Island",
  "Cocos Islands",
  "Comoros",
  "Cook Islands",
  "East Timor",
  "Eswatini",
  "Falkland Islands",
  "Fiji",
  "French Polynesia",
  "Lesotho",
  "Madagascar",
  "Malawi",
  "Mauritius",
  "Mozambique",
  "Namibia",
  "Nauru",
  "New Caledonia",
  "New Zealand",
  "Niue",
  "Norfolk Island",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Pitcairn Islands",
  "Rwanda",
  "Samoa",
  "Seychelles",
  "Solomon Islands",
  "South Africa",
  "Tanzania",
  "Tokelau",
  "Tonga",
  "Tuvalu",
  "Uruguay",
  "Vanuatu",
  "Wallis and Futuna",
  "Zambia",
  "Zimbabwe",
  "Saint Helena",
]);

const BOTH_LONGITUDE_HEMISPHERES_NAMES = new Set<string>([
  "Algeria",
  "Burkina Faso",
  "France",
  "Ghana",
  "Kiribati",
  "Mali",
  "Spain",
  "Togo",
  "United Kingdom",
]);

const WESTERN_HEMISPHERE_ONLY_NAMES = new Set<string>([
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Aruba",
  "Bahamas",
  "Barbados",
  "Belize",
  "Bermuda",
  "Bolivia",
  "Brazil",
  "British Virgin Islands",
  "Cabo Verde",
  "Canada",
  "Cayman Islands",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cote d'Ivoire",
  "Cuba",
  "Curacao",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "El Salvador",
  "Falkland Islands",
  "French Guiana",
  "Gambia",
  "Gibraltar",
  "Greenland",
  "Grenada",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Iceland",
  "Ireland",
  "Isle of Man",
  "Jamaica",
  "Jersey",
  "Liberia",
  "Mauritania",
  "Mexico",
  "Montserrat",
  "Morocco",
  "Nicaragua",
  "Panama",
  "Paraguay",
  "Peru",
  "Pitcairn Islands",
  "Portugal",
  "Puerto Rico",
  "Saint Barthelemy",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent",
  "Senegal",
  "Sierra Leone",
  "Suriname",
  "Trinidad and Tobago",
  "Turks and Caicos Islands",
  "United States",
  "Uruguay",
  "US Virgin Islands",
  "Venezuela",
  "Western Sahara",
]);

function clampLatitude(value: number) {
  return Math.max(-89, Math.min(89, value));
}

function clampLongitude(value: number) {
  return Math.max(-179, Math.min(179, value));
}

function getLatitudeHemisphereProfile(name: string, bounds: GeographyBounds) {
  if (BOTH_LATITUDE_HEMISPHERES_NAMES.has(name)) {
    return {
      northern: true,
      southern: true,
      crossesEquator: true,
    };
  }

  if (SOUTHERN_HEMISPHERE_ONLY_NAMES.has(name)) {
    return {
      northern: false,
      southern: true,
      crossesEquator: false,
    };
  }

  if (BOUNDS_OVERRIDES[name]) {
    return {
      northern: bounds.north > 0,
      southern: bounds.south < 0,
      crossesEquator: boundsCrossLatitude(bounds, 0),
    };
  }

  return {
    northern: true,
    southern: false,
    crossesEquator: false,
  };
}

function getLongitudeHemisphereProfile(name: string, bounds: GeographyBounds) {
  if (BOTH_LONGITUDE_HEMISPHERES_NAMES.has(name)) {
    return {
      eastern: true,
      western: true,
      crossesPrimeMeridian: true,
    };
  }

  if (WESTERN_HEMISPHERE_ONLY_NAMES.has(name)) {
    return {
      eastern: false,
      western: true,
      crossesPrimeMeridian: false,
    };
  }

  if (BOUNDS_OVERRIDES[name]) {
    return {
      eastern: bounds.east > 0,
      western: bounds.west < 0,
      crossesPrimeMeridian: boundsCrossLongitude(bounds, 0),
    };
  }

  return {
    eastern: true,
    western: false,
    crossesPrimeMeridian: false,
  };
}

function getGeoQuarters(
  latitudeProfile: { northern: boolean; southern: boolean },
  longitudeProfile: { eastern: boolean; western: boolean },
) {
  const quarters: GeoQuarter[] = [];

  if (latitudeProfile.northern && longitudeProfile.western) {
    quarters.push("NW");
  }

  if (latitudeProfile.northern && longitudeProfile.eastern) {
    quarters.push("NE");
  }

  if (latitudeProfile.southern && longitudeProfile.western) {
    quarters.push("SW");
  }

  if (latitudeProfile.southern && longitudeProfile.eastern) {
    quarters.push("SE");
  }

  return quarters;
}

function getDefaultBounds(
  latitude: number,
  longitude: number,
  subregion: string,
): GeographyBounds {
  const span = SUBREGION_SPANS[subregion];
  const latRadius = span.lat / 2;
  const lonRadius = span.lon / 2;

  return {
    south: clampLatitude(latitude - latRadius),
    north: clampLatitude(latitude + latRadius),
    west: clampLongitude(longitude - lonRadius),
    east: clampLongitude(longitude + lonRadius),
  };
}

function getCountryBounds(
  name: string,
  latitude: number,
  longitude: number,
  subregion: string,
) {
  return BOUNDS_OVERRIDES[name] ?? getDefaultBounds(latitude, longitude, subregion);
}

function getCountryContinents(name: string, continent: Continent) {
  return CONTINENT_OVERRIDES[name] ?? [continent];
}

function getCountrySubregions(name: string, subregion: string) {
  return SUBREGION_OVERRIDES[name] ?? [subregion];
}

function boundsCrossLatitude(bounds: GeographyBounds, latitude: number) {
  return bounds.south < latitude && bounds.north > latitude;
}

function boundsCrossLongitude(bounds: GeographyBounds, longitude: number) {
  return bounds.west < longitude && bounds.east > longitude;
}

function invertSubregionGroups() {
  const mapping = new Map<string, string>();

  for (const [subregion, names] of Object.entries(SUBREGION_GROUPS)) {
    for (const name of names) {
      mapping.set(name, subregion);
    }
  }

  return mapping;
}

const NAME_TO_SUBREGION = invertSubregionGroups();

const ALL_COUNTRY_NAMES = Array.from(
  new Set([...countrySource.medium, ...countrySource.hard]),
).sort((a, b) => a.localeCompare(b));

const normalizedNameMap = new Map<string, string>();

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

for (const name of ALL_COUNTRY_NAMES) {
  normalizedNameMap.set(name, normalizeText(name));
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function jitter(value: string, spread: number) {
  const hash = hashString(value);
  return ((hash % 1000) / 1000 - 0.5) * spread;
}

function getPopulationTier(name: string): CountryRecord["populationTier"] {
  if (GIANT_POPULATION_NAMES.has(name)) {
    return "giant";
  }

  if (LARGE_POPULATION_NAMES.has(name)) {
    return "large";
  }

  if (MICROSTATE_NAMES.has(name)) {
    return "micro";
  }

  if (SMALL_POPULATION_NAMES.has(name)) {
    return "small";
  }

  return "medium";
}

function buildCountries() {
  return ALL_COUNTRY_NAMES.map((name) => {
    const subregion = NAME_TO_SUBREGION.get(name);

    if (!subregion) {
      throw new Error(`Missing subregion for ${name}`);
    }

    const baseCoords = SUBREGION_BASE_COORDS[subregion];
    const continent = SUBREGION_CONTINENTS[subregion];
    const latitude = baseCoords.lat + jitter(`${name}:lat`, 8);
    const longitude = baseCoords.lon + jitter(`${name}:lon`, 12);
    const bounds = getCountryBounds(name, latitude, longitude, subregion);
    const latitudeProfile = getLatitudeHemisphereProfile(name, bounds);
    const longitudeProfile = getLongitudeHemisphereProfile(name, bounds);
    const continents = getCountryContinents(name, continent);
    const subregions = getCountrySubregions(name, subregion);
    const sovereignStatus =
      SOVEREIGN_STATUS_OVERRIDES[name] ??
      (countrySource.hard.includes(name) ? "territory" : "sovereign");
    const microstate = MICROSTATE_NAMES.has(name);

    return {
      name,
      continent,
      subregion,
      continents,
      subregions,
      bounds,
      preciseBounds: Boolean(BOUNDS_OVERRIDES[name]),
      latitude,
      longitude,
      geoQuarters: getGeoQuarters(latitudeProfile, longitudeProfile),
      transcontinental: continents.length > 1,
      sovereignStatus,
      island: ISLAND_NAMES.has(name),
      archipelago: ARCHIPELAGO_NAMES.has(name),
      landlocked: LANDLOCKED_NAMES.has(name),
      coastline: !LANDLOCKED_NAMES.has(name),
      microstate,
      territoryLike: TERRITORY_LIKE_NAMES.has(name),
      majorityMuslim: MAJORITY_MUSLIM_NAMES.has(name),
      majorityChristian: MAJORITY_CHRISTIAN_NAMES.has(name),
      majorityHindu: MAJORITY_HINDU_NAMES.has(name),
      majorityBuddhist: MAJORITY_BUDDHIST_NAMES.has(name),
      englishOfficial: ENGLISH_OFFICIAL_NAMES.has(name),
      spanishOfficial: SPANISH_OFFICIAL_NAMES.has(name),
      frenchOfficial: FRENCH_OFFICIAL_NAMES.has(name),
      arabicOfficial: ARABIC_OFFICIAL_NAMES.has(name),
      portugueseOfficial: PORTUGUESE_OFFICIAL_NAMES.has(name),
      eu: EU_NAMES.has(name),
      nato: NATO_NAMES.has(name),
      g20: G20_NAMES.has(name),
      caribbean: subregion === "Caribbean",
      nordic: NORDIC_NAMES.has(name),
      balkans: BALKAN_NAMES.has(name),
      arabLeague: ARAB_LEAGUE_NAMES.has(name),
      subSaharanAfrica:
        continents.includes("Africa") && !subregions.includes("Northern Africa"),
      amazonBasin: AMAZON_BASIN_NAMES.has(name),
      mediterraneanAccess: MEDITERRANEAN_ACCESS_NAMES.has(name),
      saharaDesert: SAHARA_DESERT_NAMES.has(name),
      persianGulfCoast: PERSIAN_GULF_COAST_NAMES.has(name),
      redSeaCoast: RED_SEA_COAST_NAMES.has(name),
      caribbeanSeaCoast: CARIBBEAN_SEA_COAST_NAMES.has(name),
      pacificOceanCoast: PACIFIC_OCEAN_COAST_NAMES.has(name),
      caspianSeaCoast: CASPIAN_SEA_COAST_NAMES.has(name),
      formerCommunist: FORMER_COMMUNIST_NAMES.has(name),
      unMember: UN_MEMBER_NAMES.has(name),
      kingdom: KINGDOM_NAMES.has(name),
      populationTier: getPopulationTier(name),
      crossesEquator: latitudeProfile.crossesEquator,
      crossesPrimeMeridian: longitudeProfile.crossesPrimeMeridian,
      tropical: bounds.south < 23.5 && bounds.north > -23.5,
      arctic: bounds.north >= 66.3,
      entirelyNorthernHemisphere:
        latitudeProfile.northern && !latitudeProfile.southern,
      entirelySouthernHemisphere:
        latitudeProfile.southern && !latitudeProfile.northern,
      entirelyEasternHemisphere:
        longitudeProfile.eastern && !longitudeProfile.western,
      entirelyWesternHemisphere:
        longitudeProfile.western && !longitudeProfile.eastern,
      bordersChina: BORDER_CHINA_NAMES.has(name),
      bordersBrazil: BORDER_BRAZIL_NAMES.has(name),
      bordersRussia: BORDER_RUSSIA_NAMES.has(name),
      bordersIndia: BORDER_INDIA_NAMES.has(name),
      bordersTanzania: BORDER_TANZANIA_NAMES.has(name),
      bordersSaudiArabia: BORDER_SAUDI_ARABIA_NAMES.has(name),
      bordersUnitedStates: BORDER_US_NAMES.has(name),
      bordersNigeria: BORDER_NIGERIA_NAMES.has(name),
      bordersSudan: BORDER_SUDAN_NAMES.has(name),
      bordersAlgeria: BORDER_ALGERIA_NAMES.has(name),
      bordersIran: BORDER_IRAN_NAMES.has(name),
      bordersIraq: BORDER_IRAQ_NAMES.has(name),
      bordersPakistan: BORDER_PAKISTAN_NAMES.has(name),
      bordersMexico: BORDER_MEXICO_NAMES.has(name),
      bordersColombia: BORDER_COLOMBIA_NAMES.has(name),
      bordersGreece: BORDER_GREECE_NAMES.has(name),
      bordersHungary: BORDER_HUNGARY_NAMES.has(name),
      bordersMoldova: BORDER_MOLDOVA_NAMES.has(name),
      bordersBosniaHerzegovina: BORDER_BOSNIA_NAMES.has(name),
      bordersDRC: BORDER_DRC_NAMES.has(name),
      bordersKazakhstan: BORDER_KAZAKHSTAN_NAMES.has(name),
      bordersFrance: BORDER_FRANCE_NAMES.has(name),
      bordersSenegal: BORDER_SENEGAL_NAMES.has(name),
      bordersIndonesia: BORDER_INDONESIA_NAMES.has(name),
      bordersYemen: BORDER_YEMEN_NAMES.has(name),
      bordersPanama: BORDER_PANAMA_NAMES.has(name),
      bordersCostaRica: BORDER_COSTA_RICA_NAMES.has(name),
      bordersPoland: BORDER_POLAND_NAMES.has(name),
    } satisfies CountryRecord;
  });
}

export const COUNTRIES = buildCountries();
export const COUNTRIES_BY_NAME = new Map(COUNTRIES.map((country) => [country.name, country]));
const COUNTRY_NAMES_DESC = [...COUNTRIES]
  .map((country) => country.name)
  .sort((left, right) => right.length - left.length);

function makePlainAnswer(result: boolean): "Yes" | "No" {
  return result ? "Yes" : "No";
}

function evaluateContinentMembership(
  country: CountryRecord,
  continent: Continent,
): "Yes" | "No" | "Maybe" {
  if (!country.continents.includes(continent)) {
    return "No";
  }

  return country.transcontinental ? "Maybe" : "Yes";
}

function evaluateSubregionMembership(
  country: CountryRecord,
  subregion: string,
): "Yes" | "No" | "Maybe" {
  if (!country.subregions.includes(subregion)) {
    return "No";
  }

  return country.subregions.length > 1 ? "Maybe" : "Yes";
}

function evaluateRelativeLatitude(
  country: CountryRecord,
  anchor: CountryRecord,
  direction: "north" | "south",
): "Yes" | "No" | "Maybe" {
  if (direction === "north") {
    if (country.bounds.south > anchor.bounds.north) {
      return "Yes";
    }

    if (country.bounds.north < anchor.bounds.south) {
      return "No";
    }

    return "Maybe";
  }

  if (country.bounds.north < anchor.bounds.south) {
    return "Yes";
  }

  if (country.bounds.south > anchor.bounds.north) {
    return "No";
  }

  return "Maybe";
}

function evaluateRelativeLongitude(
  country: CountryRecord,
  anchor: CountryRecord,
  direction: "east" | "west",
): "Yes" | "No" | "Maybe" {
  if (direction === "east") {
    if (country.bounds.west > anchor.bounds.east) {
      return "Yes";
    }

    if (country.bounds.east < anchor.bounds.west) {
      return "No";
    }

    return "Maybe";
  }

  if (country.bounds.east < anchor.bounds.west) {
    return "Yes";
  }

  if (country.bounds.west > anchor.bounds.east) {
    return "No";
  }

  return "Maybe";
}

function makePredicateQuestion(
  id: string,
  prompt: string,
  shortLabel: string,
  stage: QuestionStage,
  category: string,
  test: (country: CountryRecord) => boolean,
  evaluateForPlayer?: (country: CountryRecord) => "Yes" | "No" | "Maybe",
): GameQuestion {
  return {
    id,
    kind: "predicate",
    prompt,
    shortLabel,
    stage,
    category,
    test,
    evaluateForPlayer,
  };
}

const STATIC_QUESTIONS: GameQuestion[] = [
  makePredicateQuestion(
    "continent:africa",
    "Is any part of your country in Africa?",
    "Africa",
    "broad",
    "continent",
    (country) => country.continents.includes("Africa"),
    (country) => evaluateContinentMembership(country, "Africa"),
  ),
  makePredicateQuestion(
    "continent:asia",
    "Is any part of your country in Asia?",
    "Asia",
    "broad",
    "continent",
    (country) => country.continents.includes("Asia"),
    (country) => evaluateContinentMembership(country, "Asia"),
  ),
  makePredicateQuestion(
    "continent:europe",
    "Is any part of your country in Europe?",
    "Europe",
    "broad",
    "continent",
    (country) => country.continents.includes("Europe"),
    (country) => evaluateContinentMembership(country, "Europe"),
  ),
  makePredicateQuestion(
    "continent:north-america",
    "Is any part of your country in North America?",
    "North America",
    "broad",
    "continent",
    (country) => country.continents.includes("North America"),
    (country) => evaluateContinentMembership(country, "North America"),
  ),
  makePredicateQuestion(
    "continent:south-america",
    "Is any part of your country in South America?",
    "South America",
    "broad",
    "continent",
    (country) => country.continents.includes("South America"),
    (country) => evaluateContinentMembership(country, "South America"),
  ),
  makePredicateQuestion(
    "continent:oceania",
    "Is any part of your country in Oceania?",
    "Oceania",
    "broad",
    "continent",
    (country) => country.continents.includes("Oceania"),
    (country) => evaluateContinentMembership(country, "Oceania"),
  ),
  makePredicateQuestion(
    "subregion:northern-africa",
    "Is your country in North Africa?",
    "North Africa",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Northern Africa"),
    (country) => evaluateSubregionMembership(country, "Northern Africa"),
  ),
  makePredicateQuestion(
    "subregion:western-africa",
    "Is your country in West Africa?",
    "West Africa",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Western Africa"),
    (country) => evaluateSubregionMembership(country, "Western Africa"),
  ),
  makePredicateQuestion(
    "subregion:middle-africa",
    "Is your country in Central Africa?",
    "Central Africa",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Middle Africa"),
    (country) => evaluateSubregionMembership(country, "Middle Africa"),
  ),
  makePredicateQuestion(
    "subregion:eastern-africa",
    "Is your country in East Africa?",
    "East Africa",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Eastern Africa"),
    (country) => evaluateSubregionMembership(country, "Eastern Africa"),
  ),
  makePredicateQuestion(
    "subregion:southern-africa",
    "Is your country in Southern Africa?",
    "Southern Africa",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Southern Africa"),
    (country) => evaluateSubregionMembership(country, "Southern Africa"),
  ),
  makePredicateQuestion(
    "subregion:western-asia",
    "Is your country in the Middle East or Western Asia?",
    "Western Asia",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Western Asia"),
    (country) => evaluateSubregionMembership(country, "Western Asia"),
  ),
  makePredicateQuestion(
    "subregion:central-asia",
    "Is your country in Central Asia?",
    "Central Asia",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Central Asia"),
    (country) => evaluateSubregionMembership(country, "Central Asia"),
  ),
  makePredicateQuestion(
    "subregion:southern-asia",
    "Is your country in South Asia?",
    "South Asia",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Southern Asia"),
    (country) => evaluateSubregionMembership(country, "Southern Asia"),
  ),
  makePredicateQuestion(
    "subregion:south-eastern-asia",
    "Is your country in Southeast Asia?",
    "Southeast Asia",
    "medium",
    "subregion",
    (country) => country.subregions.includes("South-Eastern Asia"),
    (country) => evaluateSubregionMembership(country, "South-Eastern Asia"),
  ),
  makePredicateQuestion(
    "subregion:eastern-asia",
    "Is your country in East Asia?",
    "East Asia",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Eastern Asia"),
    (country) => evaluateSubregionMembership(country, "Eastern Asia"),
  ),
  makePredicateQuestion(
    "subregion:northern-europe",
    "Is your country in Northern Europe?",
    "Northern Europe",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Northern Europe"),
    (country) => evaluateSubregionMembership(country, "Northern Europe"),
  ),
  makePredicateQuestion(
    "subregion:western-europe",
    "Is your country in Western Europe?",
    "Western Europe",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Western Europe"),
    (country) => evaluateSubregionMembership(country, "Western Europe"),
  ),
  makePredicateQuestion(
    "subregion:southern-europe",
    "Is your country in Southern Europe?",
    "Southern Europe",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Southern Europe"),
    (country) => evaluateSubregionMembership(country, "Southern Europe"),
  ),
  makePredicateQuestion(
    "subregion:eastern-europe",
    "Is your country in Eastern Europe?",
    "Eastern Europe",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Eastern Europe"),
    (country) => evaluateSubregionMembership(country, "Eastern Europe"),
  ),
  makePredicateQuestion(
    "subregion:central-america",
    "Is your country in Central America?",
    "Central America",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Central America"),
    (country) => evaluateSubregionMembership(country, "Central America"),
  ),
  makePredicateQuestion(
    "subregion:caribbean",
    "Is your country in the Caribbean?",
    "Caribbean",
    "medium",
    "subregion",
    (country) => country.subregions.includes("Caribbean"),
    (country) => evaluateSubregionMembership(country, "Caribbean"),
  ),
  makePredicateQuestion(
    "trait:island",
    "Is your country an island or archipelago?",
    "Island",
    "medium",
    "trait",
    (country) => country.island,
  ),
  makePredicateQuestion(
    "trait:landlocked",
    "Is your country landlocked?",
    "Landlocked",
    "medium",
    "trait",
    (country) => country.landlocked,
  ),
  makePredicateQuestion(
    "trait:coastline",
    "Does your country have a coastline?",
    "Coastline",
    "medium",
    "trait",
    (country) => country.coastline,
  ),
  makePredicateQuestion(
    "trait:territory-like",
    "Is it a territory, disputed state, or something not fully sovereign?",
    "Territory-like",
    "narrow",
    "trait",
    (country) => country.territoryLike,
  ),
  makePredicateQuestion(
    "trait:transcontinental",
    "Is your country in more than one continent?",
    "Transcontinental",
    "narrow",
    "trait",
    (country) => country.transcontinental,
  ),
  makePredicateQuestion(
    "trait:archipelago",
    "Is your country mainly an archipelago?",
    "Archipelago",
    "narrow",
    "trait",
    (country) => country.archipelago,
  ),
  makePredicateQuestion(
    "trait:microstate",
    "Is your country a microstate or tiny territory?",
    "Microstate",
    "narrow",
    "trait",
    (country) => country.microstate,
  ),
  makePredicateQuestion(
    "trait:muslim-majority",
    "Is your country majority Muslim?",
    "Muslim-majority",
    "narrow",
    "culture",
    (country) => country.majorityMuslim,
  ),
  makePredicateQuestion(
    "trait:christian-majority",
    "Is Christianity the majority religion there?",
    "Christian-majority",
    "narrow",
    "culture",
    (country) => country.majorityChristian,
  ),
  makePredicateQuestion(
    "trait:hindu-majority",
    "Is Hinduism the majority religion there?",
    "Hindu-majority",
    "narrow",
    "culture",
    (country) => country.majorityHindu,
  ),
  makePredicateQuestion(
    "trait:buddhist-majority",
    "Is Buddhism the majority religion there?",
    "Buddhist-majority",
    "narrow",
    "culture",
    (country) => country.majorityBuddhist,
  ),
  makePredicateQuestion(
    "trait:english-official",
    "Is English an official language there?",
    "English official",
    "narrow",
    "language",
    (country) => country.englishOfficial,
  ),
  makePredicateQuestion(
    "trait:spanish-official",
    "Is Spanish an official language there?",
    "Spanish official",
    "narrow",
    "language",
    (country) => country.spanishOfficial,
  ),
  makePredicateQuestion(
    "trait:french-official",
    "Is French an official language there?",
    "French official",
    "narrow",
    "language",
    (country) => country.frenchOfficial,
  ),
  makePredicateQuestion(
    "trait:arabic-official",
    "Is Arabic an official language there?",
    "Arabic official",
    "narrow",
    "language",
    (country) => country.arabicOfficial,
  ),
  makePredicateQuestion(
    "trait:portuguese-official",
    "Is Portuguese an official language there?",
    "Portuguese official",
    "narrow",
    "language",
    (country) => country.portugueseOfficial,
  ),
  makePredicateQuestion(
    "org:eu",
    "Is your country in the European Union?",
    "EU",
    "narrow",
    "organization",
    (country) => country.eu,
  ),
  makePredicateQuestion(
    "org:nato",
    "Is your country in NATO?",
    "NATO",
    "narrow",
    "organization",
    (country) => country.nato,
  ),
  makePredicateQuestion(
    "org:g20",
    "Is your country in the G20?",
    "G20",
    "narrow",
    "organization",
    (country) => country.g20,
  ),
  makePredicateQuestion(
    "org:nordic",
    "Is your country part of the Nordic region?",
    "Nordic",
    "narrow",
    "organization",
    (country) => country.nordic,
  ),
  makePredicateQuestion(
    "org:balkans",
    "Is your country in the Balkans?",
    "Balkans",
    "narrow",
    "organization",
    (country) => country.balkans,
  ),
  makePredicateQuestion(
    "org:arab-league",
    "Is your country in the Arab League?",
    "Arab League",
    "narrow",
    "organization",
    (country) => country.arabLeague,
  ),
  makePredicateQuestion(
    "org:un-member",
    "Is your country a UN member state?",
    "UN member",
    "narrow",
    "organization",
    (country) => country.unMember,
  ),
  makePredicateQuestion(
    "org:kingdom",
    "Is your country a kingdom?",
    "Kingdom",
    "narrow",
    "organization",
    (country) => country.kingdom,
  ),
  makePredicateQuestion(
    "org:sub-saharan-africa",
    "Is your country in Sub-Saharan Africa?",
    "Sub-Saharan Africa",
    "medium",
    "organization",
    (country) => country.subSaharanAfrica,
  ),
  makePredicateQuestion(
    "border:china",
    "Does your country border China?",
    "Borders China",
    "narrow",
    "border",
    (country) => country.bordersChina,
  ),
  makePredicateQuestion(
    "border:brazil",
    "Does your country border Brazil?",
    "Borders Brazil",
    "narrow",
    "border",
    (country) => country.bordersBrazil,
  ),
  makePredicateQuestion(
    "border:russia",
    "Does your country border Russia?",
    "Borders Russia",
    "narrow",
    "border",
    (country) => country.bordersRussia,
  ),
  makePredicateQuestion(
    "border:india",
    "Does your country border India?",
    "Borders India",
    "narrow",
    "border",
    (country) => country.bordersIndia,
  ),
  makePredicateQuestion(
    "border:tanzania",
    "Does your country border Tanzania?",
    "Borders Tanzania",
    "narrow",
    "border",
    (country) => country.bordersTanzania,
  ),
  makePredicateQuestion(
    "border:saudi-arabia",
    "Does your country border Saudi Arabia?",
    "Borders Saudi Arabia",
    "narrow",
    "border",
    (country) => country.bordersSaudiArabia,
  ),
  makePredicateQuestion(
    "border:united-states",
    "Does your country border the United States?",
    "Borders United States",
    "narrow",
    "border",
    (country) => country.bordersUnitedStates,
  ),
  makePredicateQuestion(
    "border:nigeria",
    "Does your country border Nigeria?",
    "Borders Nigeria",
    "narrow",
    "border",
    (country) => country.bordersNigeria,
  ),
  makePredicateQuestion(
    "border:sudan",
    "Does your country border Sudan?",
    "Borders Sudan",
    "narrow",
    "border",
    (country) => country.bordersSudan,
  ),
  makePredicateQuestion(
    "border:algeria",
    "Does your country border Algeria?",
    "Borders Algeria",
    "narrow",
    "border",
    (country) => country.bordersAlgeria,
  ),
  makePredicateQuestion(
    "border:iran",
    "Does your country border Iran?",
    "Borders Iran",
    "narrow",
    "border",
    (country) => country.bordersIran,
  ),
  makePredicateQuestion(
    "border:pakistan",
    "Does your country border Pakistan?",
    "Borders Pakistan",
    "narrow",
    "border",
    (country) => country.bordersPakistan,
  ),
  makePredicateQuestion(
    "border:iraq",
    "Does your country border Iraq?",
    "Borders Iraq",
    "narrow",
    "border",
    (country) => country.bordersIraq,
  ),
  makePredicateQuestion(
    "border:mexico",
    "Does your country border Mexico?",
    "Borders Mexico",
    "narrow",
    "border",
    (country) => country.bordersMexico,
  ),
  makePredicateQuestion(
    "border:colombia",
    "Does your country border Colombia?",
    "Borders Colombia",
    "narrow",
    "border",
    (country) => country.bordersColombia,
  ),
  makePredicateQuestion(
    "border:greece",
    "Does your country border Greece?",
    "Borders Greece",
    "narrow",
    "border",
    (country) => country.bordersGreece,
  ),
  makePredicateQuestion(
    "border:hungary",
    "Does your country border Hungary?",
    "Borders Hungary",
    "narrow",
    "border",
    (country) => country.bordersHungary,
  ),
  makePredicateQuestion(
    "border:moldova",
    "Does your country border Moldova?",
    "Borders Moldova",
    "narrow",
    "border",
    (country) => country.bordersMoldova,
  ),
  makePredicateQuestion(
    "border:bosnia-and-herzegovina",
    "Does your country border Bosnia and Herzegovina?",
    "Borders Bosnia",
    "narrow",
    "border",
    (country) => country.bordersBosniaHerzegovina,
  ),
  makePredicateQuestion(
    "border:drc",
    "Does your country border the Democratic Republic of the Congo?",
    "Borders DRC",
    "narrow",
    "border",
    (country) => country.bordersDRC,
  ),
  makePredicateQuestion(
    "border:kazakhstan",
    "Does your country border Kazakhstan?",
    "Borders Kazakhstan",
    "narrow",
    "border",
    (country) => country.bordersKazakhstan,
  ),
  makePredicateQuestion(
    "border:france",
    "Does your country border France?",
    "Borders France",
    "narrow",
    "border",
    (country) => country.bordersFrance,
  ),
  makePredicateQuestion(
    "border:senegal",
    "Does your country border Senegal?",
    "Borders Senegal",
    "narrow",
    "border",
    (country) => country.bordersSenegal,
  ),
  makePredicateQuestion(
    "border:indonesia",
    "Does your country border Indonesia?",
    "Borders Indonesia",
    "narrow",
    "border",
    (country) => country.bordersIndonesia,
  ),
  makePredicateQuestion(
    "border:yemen",
    "Does your country border Yemen?",
    "Borders Yemen",
    "narrow",
    "border",
    (country) => country.bordersYemen,
  ),
  makePredicateQuestion(
    "border:panama",
    "Does your country border Panama?",
    "Borders Panama",
    "narrow",
    "border",
    (country) => country.bordersPanama,
  ),
  makePredicateQuestion(
    "border:costa-rica",
    "Does your country border Costa Rica?",
    "Borders Costa Rica",
    "narrow",
    "border",
    (country) => country.bordersCostaRica,
  ),
  makePredicateQuestion(
    "border:poland",
    "Does your country border Poland?",
    "Borders Poland",
    "narrow",
    "border",
    (country) => country.bordersPoland,
  ),
  makePredicateQuestion(
    "hemisphere:north",
    "Is your country entirely in the Northern Hemisphere?",
    "Northern Hemisphere",
    "medium",
    "direction",
    (country) => country.entirelyNorthernHemisphere,
    (country) =>
      country.entirelyNorthernHemisphere
        ? "Yes"
        : country.entirelySouthernHemisphere
          ? "No"
          : "Maybe",
  ),
  makePredicateQuestion(
    "hemisphere:south",
    "Is your country entirely in the Southern Hemisphere?",
    "Southern Hemisphere",
    "medium",
    "direction",
    (country) => country.entirelySouthernHemisphere,
    (country) =>
      country.entirelySouthernHemisphere
        ? "Yes"
        : country.entirelyNorthernHemisphere
          ? "No"
          : "Maybe",
  ),
  makePredicateQuestion(
    "hemisphere:east",
    "Is your country entirely in the Eastern Hemisphere?",
    "Eastern Hemisphere",
    "medium",
    "direction",
    (country) => country.entirelyEasternHemisphere,
    (country) =>
      country.entirelyEasternHemisphere
        ? "Yes"
        : country.entirelyWesternHemisphere
          ? "No"
          : "Maybe",
  ),
  makePredicateQuestion(
    "hemisphere:west",
    "Is your country entirely in the Western Hemisphere?",
    "Western Hemisphere",
    "medium",
    "direction",
    (country) => country.entirelyWesternHemisphere,
    (country) =>
      country.entirelyWesternHemisphere
        ? "Yes"
        : country.entirelyEasternHemisphere
          ? "No"
          : "Maybe",
  ),
  makePredicateQuestion(
    "geo:equator",
    "Does your country cross the Equator?",
    "Crosses Equator",
    "narrow",
    "direction",
    (country) => country.crossesEquator,
  ),
  makePredicateQuestion(
    "geo:prime-meridian",
    "Does your country cross the Prime Meridian?",
    "Crosses Prime Meridian",
    "narrow",
    "direction",
    (country) => country.crossesPrimeMeridian,
  ),
  makePredicateQuestion(
    "quarter:nw",
    "Is any part of your country in the northwestern quarter of the world?",
    "Northwest quarter",
    "medium",
    "direction",
    (country) => country.geoQuarters.includes("NW"),
  ),
  makePredicateQuestion(
    "quarter:ne",
    "Is any part of your country in the northeastern quarter of the world?",
    "Northeast quarter",
    "medium",
    "direction",
    (country) => country.geoQuarters.includes("NE"),
  ),
  makePredicateQuestion(
    "quarter:sw",
    "Is any part of your country in the southwestern quarter of the world?",
    "Southwest quarter",
    "medium",
    "direction",
    (country) => country.geoQuarters.includes("SW"),
  ),
  makePredicateQuestion(
    "quarter:se",
    "Is any part of your country in the southeastern quarter of the world?",
    "Southeast quarter",
    "medium",
    "direction",
    (country) => country.geoQuarters.includes("SE"),
  ),
  makePredicateQuestion(
    "geo:tropical",
    "Is any part of your country in the tropics?",
    "Tropical",
    "narrow",
    "direction",
    (country) => country.tropical,
  ),
  makePredicateQuestion(
    "geo:arctic",
    "Does any part of your country reach the Arctic?",
    "Arctic",
    "narrow",
    "direction",
    (country) => country.arctic,
  ),
  makePredicateQuestion(
    "population:giant",
    "Does your country have more than 100 million people?",
    "100M+ population",
    "narrow",
    "population",
    (country) => country.populationTier === "giant",
  ),
  makePredicateQuestion(
    "population:micro",
    "Is your country very small in population or size?",
    "Microstate / tiny",
    "narrow",
    "population",
    (country) =>
      country.populationTier === "micro" || country.populationTier === "small",
  ),
  makePredicateQuestion(
    "history:former-communist",
    "Has your country ever had a communist government?",
    "Communist history",
    "narrow",
    "history",
    (country) => country.formerCommunist,
  ),
  makePredicateQuestion(
    "geo:amazon-basin",
    "Does your country contain part of the Amazon rainforest or basin?",
    "Amazon basin",
    "narrow",
    "nature",
    (country) => country.amazonBasin,
  ),
  makePredicateQuestion(
    "geo:mediterranean",
    "Does your country have access to the Mediterranean Sea?",
    "Mediterranean access",
    "narrow",
    "nature",
    (country) => country.mediterraneanAccess,
  ),
  makePredicateQuestion(
    "geo:sahara",
    "Does your country include part of the Sahara Desert?",
    "Sahara",
    "narrow",
    "nature",
    (country) => country.saharaDesert,
  ),
  makePredicateQuestion(
    "geo:persian-gulf",
    "Does your country have a coast on the Persian Gulf?",
    "Persian Gulf coast",
    "narrow",
    "nature",
    (country) => country.persianGulfCoast,
  ),
  makePredicateQuestion(
    "geo:red-sea",
    "Does your country touch the Red Sea?",
    "Red Sea coast",
    "narrow",
    "nature",
    (country) => country.redSeaCoast,
  ),
  makePredicateQuestion(
    "geo:caribbean-sea",
    "Does your country touch the Caribbean Sea?",
    "Caribbean Sea",
    "narrow",
    "nature",
    (country) => country.caribbeanSeaCoast,
  ),
  makePredicateQuestion(
    "geo:pacific-ocean",
    "Does your country touch the Pacific Ocean?",
    "Pacific Ocean",
    "narrow",
    "nature",
    (country) => country.pacificOceanCoast,
  ),
  makePredicateQuestion(
    "geo:caspian-sea",
    "Does your country touch the Caspian Sea?",
    "Caspian Sea",
    "narrow",
    "nature",
    (country) => country.caspianSeaCoast,
  ),
];

const RELATIVE_ANCHORS = [
  "Tanzania",
  "Brazil",
  "China",
  "France",
  "Australia",
  "India",
  "United States",
];

const RELATIVE_QUESTIONS: GameQuestion[] = RELATIVE_ANCHORS.flatMap((anchorName) => {
  const anchorCountry = COUNTRIES_BY_NAME.get(anchorName);

  if (!anchorCountry) {
    return [];
  }

  return [
    makePredicateQuestion(
      `relative:south-of:${anchorName}`,
      `Is your country entirely south of ${anchorName}?`,
      `South of ${anchorName}`,
      "narrow",
      "direction",
      (country) => country.bounds.north < anchorCountry.bounds.south,
      (country) => evaluateRelativeLatitude(country, anchorCountry, "south"),
    ),
    makePredicateQuestion(
      `relative:north-of:${anchorName}`,
      `Is your country entirely north of ${anchorName}?`,
      `North of ${anchorName}`,
      "narrow",
      "direction",
      (country) => country.bounds.south > anchorCountry.bounds.north,
      (country) => evaluateRelativeLatitude(country, anchorCountry, "north"),
    ),
    makePredicateQuestion(
      `relative:east-of:${anchorName}`,
      `Is your country entirely east of ${anchorName}?`,
      `East of ${anchorName}`,
      "narrow",
      "direction",
      (country) => country.bounds.west > anchorCountry.bounds.east,
      (country) => evaluateRelativeLongitude(country, anchorCountry, "east"),
    ),
    makePredicateQuestion(
      `relative:west-of:${anchorName}`,
      `Is your country entirely west of ${anchorName}?`,
      `West of ${anchorName}`,
      "narrow",
      "direction",
      (country) => country.bounds.east < anchorCountry.bounds.west,
      (country) => evaluateRelativeLongitude(country, anchorCountry, "west"),
    ),
  ];
});

export const QUESTION_BANK = [...STATIC_QUESTIONS, ...RELATIVE_QUESTIONS];
const QUESTIONS_BY_ID = new Map(QUESTION_BANK.map((question) => [question.id, question]));
const LEARNABLE_QUESTION_TRAITS: Partial<Record<string, LearnableTraitKey>> = {
  "trait:island": "island",
  "trait:landlocked": "landlocked",
  "trait:coastline": "coastline",
  "trait:territory-like": "territoryLike",
  "trait:transcontinental": "transcontinental",
  "trait:archipelago": "archipelago",
  "trait:microstate": "microstate",
  "trait:muslim-majority": "majorityMuslim",
  "trait:christian-majority": "majorityChristian",
  "trait:hindu-majority": "majorityHindu",
  "trait:buddhist-majority": "majorityBuddhist",
  "trait:english-official": "englishOfficial",
  "trait:spanish-official": "spanishOfficial",
  "trait:french-official": "frenchOfficial",
  "trait:arabic-official": "arabicOfficial",
  "trait:portuguese-official": "portugueseOfficial",
  "org:eu": "eu",
  "org:nato": "nato",
  "org:g20": "g20",
  "org:nordic": "nordic",
  "org:balkans": "balkans",
  "org:arab-league": "arabLeague",
  "org:un-member": "unMember",
  "org:kingdom": "kingdom",
  "org:sub-saharan-africa": "subSaharanAfrica",
  "history:former-communist": "formerCommunist",
  "geo:amazon-basin": "amazonBasin",
  "geo:mediterranean": "mediterraneanAccess",
  "geo:sahara": "saharaDesert",
  "geo:persian-gulf": "persianGulfCoast",
  "geo:red-sea": "redSeaCoast",
  "geo:caribbean-sea": "caribbeanSeaCoast",
  "geo:pacific-ocean": "pacificOceanCoast",
  "geo:caspian-sea": "caspianSeaCoast",
  "border:china": "bordersChina",
  "border:brazil": "bordersBrazil",
  "border:russia": "bordersRussia",
  "border:india": "bordersIndia",
  "border:tanzania": "bordersTanzania",
  "border:saudi-arabia": "bordersSaudiArabia",
  "border:united-states": "bordersUnitedStates",
  "border:nigeria": "bordersNigeria",
  "border:sudan": "bordersSudan",
  "border:algeria": "bordersAlgeria",
  "border:iran": "bordersIran",
  "border:iraq": "bordersIraq",
  "border:pakistan": "bordersPakistan",
  "border:mexico": "bordersMexico",
  "border:colombia": "bordersColombia",
  "border:greece": "bordersGreece",
  "border:hungary": "bordersHungary",
  "border:moldova": "bordersMoldova",
  "border:bosnia-and-herzegovina": "bordersBosniaHerzegovina",
  "border:drc": "bordersDRC",
  "border:kazakhstan": "bordersKazakhstan",
  "border:france": "bordersFrance",
  "border:senegal": "bordersSenegal",
  "border:indonesia": "bordersIndonesia",
  "border:yemen": "bordersYemen",
  "border:panama": "bordersPanama",
  "border:costa-rica": "bordersCostaRica",
  "border:poland": "bordersPoland",
};

export const SUGGESTED_PLAYER_QUESTIONS = [
  "Is your country in Europe?",
  "Is your country in Asia?",
  "Is your country landlocked?",
  "Is your country an island?",
  "Is any part of your country in the northeastern quarter of the world?",
  "Does your country have over 100 million people?",
  "Is your country a kingdom?",
  "Is Christianity the majority religion there?",
  "Does your country border China?",
  "Is your country majority Muslim?",
  "Does your country contain part of the Amazon basin?",
  "Does your country touch the Mediterranean Sea?",
  "Does your country have a coast on the Persian Gulf?",
  "Does your country touch the Red Sea?",
  "Does your country touch the Caribbean Sea?",
  "Does your country touch the Pacific Ocean?",
  "Does your country include part of the Sahara Desert?",
  "Is your country in the EU?",
  "Has your country ever had a communist government?",
  "Is your country a UN member state?",
  "Does your country border Iran?",
  "Does your country border Iraq?",
  "Does your country border Mexico?",
  "Does your country border Colombia?",
  "Is your country entirely south of Tanzania?",
];

export function getPoolForDifficulty(difficulty: Difficulty) {
  if (difficulty === "easy") {
    return COUNTRIES.filter((country) => EASY_POOL.has(country.name));
  }

  if (difficulty === "medium") {
    const mediumSet = new Set(countrySource.medium);
    return COUNTRIES.filter((country) => mediumSet.has(country.name));
  }

  return COUNTRIES;
}

export function pickComputerCountry(difficulty: Difficulty) {
  const pool = getPoolForDifficulty(difficulty);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getLearnableTraitKey(questionId: string) {
  return LEARNABLE_QUESTION_TRAITS[questionId] ?? null;
}

export function applyLearnedTraitOverride(
  countryName: string,
  traitKey: LearnableTraitKey,
  value: boolean,
) {
  const country = COUNTRIES_BY_NAME.get(countryName);

  if (!country) {
    return false;
  }

  country[traitKey] = value;
  return true;
}

function scoreQuestion(
  question: GameQuestion,
  candidates: CountryRecord[],
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
  const size = candidates.length;
  let stageBonus = 0;
  let categoryBonus = 0;

  if (size > 70) {
    stageBonus =
      question.stage === "broad"
        ? 0.18
        : question.stage === "medium"
          ? 0.08
          : -0.02;
    categoryBonus =
      question.category === "continent"
        ? 0.08
        : question.category === "trait"
          ? 0.04
          : question.category === "subregion"
            ? 0.03
            : question.category === "border"
              ? -0.06
              : question.category === "direction"
                ? -0.18
                : 0;
  } else if (size > 20) {
    stageBonus =
      question.stage === "broad"
        ? 0.08
        : question.stage === "medium"
          ? 0.14
          : 0.03;
    categoryBonus =
      question.category === "border"
        ? 0.01
        : question.category === "direction"
          ? -0.04
          : 0;
  } else {
    stageBonus =
      question.stage === "narrow"
        ? 0.18
        : question.stage === "medium"
          ? 0.08
          : -0.02;
    categoryBonus =
      question.category === "border"
        ? 0.06
        : question.category === "nature"
          ? 0.04
          : question.category === "direction"
            ? 0.02
            : 0;
  }

  return {
    question,
    score: balance + stageBonus + categoryBonus,
  };
}

const OPENING_QUESTION_IDS = new Set([
  "continent:africa",
  "continent:asia",
  "continent:europe",
  "continent:north-america",
  "continent:south-america",
  "continent:oceania",
  "trait:island",
  "trait:landlocked",
  "subregion:western-asia",
  "org:sub-saharan-africa",
]);

function pickScoredQuestion(
  scoredQuestions: { question: GameQuestion; score: number }[],
  difficulty: Difficulty,
) {
  const sorted = [...scoredQuestions].sort((left, right) => right.score - left.score);

  if (sorted.length === 0) {
    return null;
  }

  const maxIndex =
    difficulty === "hard" ? Math.min(1, sorted.length - 1) : difficulty === "medium" ? Math.min(3, sorted.length - 1) : Math.min(7, sorted.length - 1);
  const selectedIndex = Math.floor(Math.random() * (maxIndex + 1));
  return sorted[selectedIndex].question;
}

export function chooseComputerQuestion(
  candidates: CountryRecord[],
  askedQuestionIds: Set<string>,
  difficulty: Difficulty,
) {
  const scored = QUESTION_BANK.map((question) =>
    scoreQuestion(question, candidates, askedQuestionIds),
  ).filter((value): value is { question: GameQuestion; score: number } => Boolean(value));

  if (askedQuestionIds.size <= 1) {
    const openingCandidates = scored
      .filter((entry) => OPENING_QUESTION_IDS.has(entry.question.id))
      .sort((left, right) => right.score - left.score);

    if (openingCandidates.length > 0) {
      const maxIndex = Math.min(7, openingCandidates.length - 1);
      return openingCandidates[Math.floor(Math.random() * (maxIndex + 1))].question;
    }
  }

  const sorted = [...scored].sort((left, right) => right.score - left.score);
  const bestFilter = sorted[0]?.question ?? null;
  const bestFilterScore = sorted[0]?.score ?? -1;
  const guessThreshold = 2;
  const shouldHoldGuessAtThree =
    candidates.length === 3 && bestFilter && bestFilterScore >= 0.45;

  if (candidates.length <= guessThreshold || (candidates.length === 3 && !shouldHoldGuessAtThree)) {
    const guessCountry = candidates.find(
      (country) => !askedQuestionIds.has(`guess:${country.name}`),
    );

    if (guessCountry && !askedQuestionIds.has(`guess:${guessCountry.name}`)) {
      return {
        id: `guess:${guessCountry.name}`,
        kind: "guess",
        prompt: `Is your country ${guessCountry.name}?`,
        shortLabel: guessCountry.name,
        stage: "narrow",
        category: "guess",
        test: (country: CountryRecord) => country.name === guessCountry.name,
        guessedCountry: guessCountry.name,
      } satisfies GameQuestion;
    }
  }

  if (sorted.length === 0) {
    const fallbackGuess = candidates.find(
      (country) => !askedQuestionIds.has(`guess:${country.name}`),
    );

    if (!fallbackGuess) {
      return null;
    }

    return {
      id: `guess:${fallbackGuess.name}`,
      kind: "guess",
      prompt: `Is your country ${fallbackGuess.name}?`,
      shortLabel: fallbackGuess.name,
      stage: "narrow",
      category: "guess",
      test: (country: CountryRecord) => country.name === fallbackGuess.name,
      guessedCountry: fallbackGuess.name,
    } satisfies GameQuestion;
  }

  return pickScoredQuestion(scored, difficulty);
}

export function applyComputerTurnAnswer(
  question: GameQuestion,
  answer: TurnAnswer,
  candidates: CountryRecord[],
) {
  if (question.kind === "guess") {
    if (answer === "yes") {
      return {
        candidates: candidates.filter((country) => country.name === question.guessedCountry),
        aiWon: true,
      } satisfies ComputerTurnResolution;
    }

    if (answer === "no") {
      return {
        candidates: candidates.filter((country) => country.name !== question.guessedCountry),
        aiWon: false,
      } satisfies ComputerTurnResolution;
    }

    return {
      candidates,
      aiWon: false,
    } satisfies ComputerTurnResolution;
  }

  if (answer === "idk") {
    return {
      candidates,
      aiWon: false,
    } satisfies ComputerTurnResolution;
  }

  const filtered =
    answer === "yes"
      ? candidates.filter(question.test)
      : candidates.filter((country) => !question.test(country));

  if (filtered.length === 0) {
    return {
      candidates,
      aiWon: false,
      inconsistencyWarning:
        "That answer would eliminate every possible country, so I kept the previous shortlist. This usually means a mistaken answer or a fuzzy geography edge case.",
    } satisfies ComputerTurnResolution;
  }

  return {
    candidates: filtered,
    aiWon: false,
  } satisfies ComputerTurnResolution;
}

function findMentionedCountry(text: string) {
  const normalized = normalizeText(text);

  for (const countryName of COUNTRY_NAMES_DESC) {
    const normalizedCountry = normalizedNameMap.get(countryName);

    if (normalizedCountry && normalized.includes(normalizedCountry)) {
      return countryName;
    }
  }

  return null;
}

function isGuessLikeText(text: string, countryName: string) {
  const normalized = normalizeText(text);
  const normalizedCountry = normalizeText(countryName);

  if (normalized === normalizedCountry) {
    return true;
  }

  return /(^|\b)(is it|is your country|your country is|my guess is|i guess|could it be|is the country|is it maybe|it is|its|it s)\b/.test(
    normalized,
  );
}

function parseRelativeQuestion(text: string) {
  const mentionedCountry = findMentionedCountry(text);

  if (!mentionedCountry) {
    return null;
  }

  const normalized = normalizeText(text);

  if (normalized.includes("south of")) {
    return QUESTIONS_BY_ID.get(`relative:south-of:${mentionedCountry}`) ?? null;
  }

  if (normalized.includes("north of")) {
    return QUESTIONS_BY_ID.get(`relative:north-of:${mentionedCountry}`) ?? null;
  }

  if (normalized.includes("east of")) {
    return QUESTIONS_BY_ID.get(`relative:east-of:${mentionedCountry}`) ?? null;
  }

  if (normalized.includes("west of")) {
    return QUESTIONS_BY_ID.get(`relative:west-of:${mentionedCountry}`) ?? null;
  }

  return null;
}

function parseBorderQuestion(text: string) {
  const mentionedCountry = findMentionedCountry(text);

  if (!mentionedCountry) {
    return null;
  }

  const borderIdLookup: Record<string, string> = {
    China: "border:china",
    Brazil: "border:brazil",
    Russia: "border:russia",
    India: "border:india",
    Iran: "border:iran",
    Iraq: "border:iraq",
    Pakistan: "border:pakistan",
    Tanzania: "border:tanzania",
    Mexico: "border:mexico",
    Colombia: "border:colombia",
    Greece: "border:greece",
    Hungary: "border:hungary",
    Moldova: "border:moldova",
    France: "border:france",
    Senegal: "border:senegal",
    Indonesia: "border:indonesia",
    Yemen: "border:yemen",
    Panama: "border:panama",
    Poland: "border:poland",
    Nigeria: "border:nigeria",
    Sudan: "border:sudan",
    Algeria: "border:algeria",
    Kazakhstan: "border:kazakhstan",
    "Bosnia and Herzegovina": "border:bosnia-and-herzegovina",
    "Democratic Republic of the Congo": "border:drc",
    "Costa Rica": "border:costa-rica",
    "Saudi Arabia": "border:saudi-arabia",
    "United States": "border:united-states",
  };

  const questionId = borderIdLookup[mentionedCountry];
  return questionId ? QUESTIONS_BY_ID.get(questionId) ?? null : null;
}

const KEYWORD_TO_QUESTION_ID: Array<[RegExp, string]> = [
  [/\bnorth america\b/, "continent:north-america"],
  [/\bsouth america\b/, "continent:south-america"],
  [/\boceania\b|\baustralia\b/, "continent:oceania"],
  [/\beurope\b/, "continent:europe"],
  [/\basia\b/, "continent:asia"],
  [/\bafrica\b/, "continent:africa"],
  [/\bnorth africa\b/, "subregion:northern-africa"],
  [/\bwest africa\b|\bwestern africa\b/, "subregion:western-africa"],
  [/\bcentral africa\b|\bmiddle africa\b/, "subregion:middle-africa"],
  [/\beast africa\b|\beastern africa\b/, "subregion:eastern-africa"],
  [/\bsouthern africa\b/, "subregion:southern-africa"],
  [/\bmiddle east\b|\bwestern asia\b/, "subregion:western-asia"],
  [/\bcentral asia\b/, "subregion:central-asia"],
  [/\bsouth asia\b/, "subregion:southern-asia"],
  [/\bsoutheast asia\b|\bsouth east asia\b/, "subregion:south-eastern-asia"],
  [/\beast asia\b|\beastern asia\b/, "subregion:eastern-asia"],
  [/\bnorthern europe\b/, "subregion:northern-europe"],
  [/\bwestern europe\b/, "subregion:western-europe"],
  [/\bsouthern europe\b/, "subregion:southern-europe"],
  [/\beastern europe\b/, "subregion:eastern-europe"],
  [/\bcentral america\b/, "subregion:central-america"],
  [/\bcaribbean\b/, "subregion:caribbean"],
  [/\bisland\b|\barchipelago\b/, "trait:island"],
  [/\blandlocked\b/, "trait:landlocked"],
  [/\bcoast\b|\bcoastal\b/, "trait:coastline"],
  [/\bterritory\b|\bsemi independent\b|\bsemi independent nation\b|\bdisputed\b/, "trait:territory-like"],
  [/\btranscontinental\b|\btwo continents\b|\bmore than one continent\b/, "trait:transcontinental"],
  [/\barchipelago\b/, "trait:archipelago"],
  [/\bmicrostate\b/, "trait:microstate"],
  [/\bmajority muslim\b|\bmuslim majority\b/, "trait:muslim-majority"],
  [/\bchristian\b|\bchristianity\b/, "trait:christian-majority"],
  [/\bhindu\b|\bhinduism\b/, "trait:hindu-majority"],
  [/\bbuddhist\b|\bbuddhism\b/, "trait:buddhist-majority"],
  [/\benglish\b/, "trait:english-official"],
  [/\bspanish\b/, "trait:spanish-official"],
  [/\bfrench\b/, "trait:french-official"],
  [/\barabic\b/, "trait:arabic-official"],
  [/\bportuguese\b/, "trait:portuguese-official"],
  [/\beuropean union\b|\beu\b/, "org:eu"],
  [/\bnato\b/, "org:nato"],
  [/\bg20\b/, "org:g20"],
  [/\bnordic\b/, "org:nordic"],
  [/\bbalkan\b/, "org:balkans"],
  [/\barab league\b/, "org:arab-league"],
  [/\bun member\b|\bmember of the un\b|\bpart of the un\b|\bunited nations\b/, "org:un-member"],
  [/\bkingdom\b/, "org:kingdom"],
  [/\bsub saharan\b/, "org:sub-saharan-africa"],
  [/\bamazon\b/, "geo:amazon-basin"],
  [/\bmediterranean\b/, "geo:mediterranean"],
  [/\bpersian gulf\b|\barabian gulf\b/, "geo:persian-gulf"],
  [/\bred sea\b/, "geo:red-sea"],
  [/\bcaribbean sea\b/, "geo:caribbean-sea"],
  [/\bpacific ocean\b|\bpacific coast\b/, "geo:pacific-ocean"],
  [/\bcaspian sea\b/, "geo:caspian-sea"],
  [/\bsahara\b/, "geo:sahara"],
  [/\bcommunist\b|\bcommunism\b/, "history:former-communist"],
  [/\bnorthern hemisphere\b/, "hemisphere:north"],
  [/\bsouthern hemisphere\b/, "hemisphere:south"],
  [/\beastern hemisphere\b/, "hemisphere:east"],
  [/\bwestern hemisphere\b/, "hemisphere:west"],
  [/\bnorthwest quarter\b|\bnorthwestern quarter\b|\bnorth west quarter\b/, "quarter:nw"],
  [/\bnortheast quarter\b|\bnortheastern quarter\b|\bnorth east quarter\b/, "quarter:ne"],
  [/\bsouthwest quarter\b|\bsouthwestern quarter\b|\bsouth west quarter\b/, "quarter:sw"],
  [/\bsoutheast quarter\b|\bsoutheastern quarter\b|\bsouth east quarter\b/, "quarter:se"],
  [/\bequator\b/, "geo:equator"],
  [/\bprime meridian\b/, "geo:prime-meridian"],
  [/\btropic\b|\btropical\b/, "geo:tropical"],
  [/\barctic\b/, "geo:arctic"],
  [/\b100 million\b|\bover 100 million\b|\b100m\b|\bover 100m\b/, "population:giant"],
  [/\bsmall\b|\btiny\b/, "population:micro"],
];

export function parsePlayerIntent(text: string): PlayerIntent {
  if (!text.trim()) {
    return { kind: "empty" };
  }

  const normalized = normalizeText(text);
  const borderQuestion = normalized.includes("border")
    ? parseBorderQuestion(text)
    : null;

  if (borderQuestion) {
    return { kind: "predicate", question: borderQuestion };
  }

  const relativeQuestion =
    normalized.includes("south of") ||
    normalized.includes("north of") ||
    normalized.includes("east of") ||
    normalized.includes("west of")
      ? parseRelativeQuestion(text)
      : null;

  if (relativeQuestion) {
    return { kind: "predicate", question: relativeQuestion };
  }

  const mentionedCountry = findMentionedCountry(text);

  if (
    mentionedCountry &&
    isGuessLikeText(text, mentionedCountry) &&
    !normalized.includes("border") &&
    !normalized.includes("south of") &&
    !normalized.includes("north of") &&
    !normalized.includes("east of") &&
    !normalized.includes("west of")
  ) {
    return { kind: "guess", countryName: mentionedCountry };
  }

  for (const [pattern, questionId] of KEYWORD_TO_QUESTION_ID) {
    if (pattern.test(normalized)) {
      const question = QUESTIONS_BY_ID.get(questionId);

      if (question) {
        return { kind: "predicate", question };
      }
    }
  }

  return { kind: "unknown" };
}

function explainMaybeAnswer(question: GameQuestion, country: CountryRecord) {
  if (question.category === "continent") {
    return `This country spans ${country.continents.join(" and ")}, so a plain continent question is only partly true.`;
  }

  if (question.category === "subregion") {
    return "This country touches multiple geographic subregions in the database, so that clue is only partly true.";
  }

  if (question.id.startsWith("relative:")) {
    const [, direction, anchorName] = question.id.split(":");
    return `It is not completely ${direction.replace("-", " ")} ${anchorName}; part of the country overlaps that comparison.`;
  }

  if (question.id.startsWith("hemisphere:")) {
    return "It crosses a hemisphere boundary, so that clue is only partly true.";
  }

  return "It only partly fits that clue because it sits on an edge case in the database.";
}

function explainResolvedAnswer(
  question: GameQuestion,
  country: CountryRecord,
  answer: "Yes" | "No" | "Maybe",
) {
  if (answer === "Maybe") {
    return explainMaybeAnswer(question, country);
  }

  if (answer === "Yes") {
    return "Yes. That clue fits.";
  }

  return "No. That clue does not fit.";
}

export function answerPlayerQuestion(
  playerIntent: PlayerIntent,
  computerCountry: CountryRecord,
) {
  if (playerIntent.kind === "empty") {
    return {
      answer: "Maybe",
      explanation: "You skipped your question this round, so I’m moving straight to my next clue.",
      playerWon: false,
    } satisfies ComputerReply;
  }

  if (playerIntent.kind === "unknown") {
    return {
      answer: "Maybe",
      explanation:
        "I couldn’t grade that one reliably from the current country database, so ask it in a more specific geography style like region, language, border, island, or a direct guess.",
      playerWon: false,
    } satisfies ComputerReply;
  }

  if (playerIntent.kind === "guess") {
    const correct = playerIntent.countryName === computerCountry.name;

    return {
      answer: correct ? "Yes" : "No",
      explanation: correct
        ? "Yes. You got it."
        : `No. It is not ${playerIntent.countryName}.`,
      playerWon: correct,
    } satisfies ComputerReply;
  }

  const result = playerIntent.question.evaluateForPlayer
    ? playerIntent.question.evaluateForPlayer(computerCountry)
    : makePlainAnswer(playerIntent.question.test(computerCountry));

  return {
    answer: result,
    explanation: explainResolvedAnswer(playerIntent.question, computerCountry, result),
    playerWon: false,
  } satisfies ComputerReply;
}

export function buildAssistantTurnMessage(parts: {
  computerReply: ComputerReply;
  nextQuestion?: GameQuestion | null;
  candidateCount: number;
  inconsistencyWarning?: string;
}) {
  const lines = [`About my country: ${parts.computerReply.answer}. ${parts.computerReply.explanation}`];

  if (parts.inconsistencyWarning) {
    lines.push(`Shortlist note: ${parts.inconsistencyWarning}`);
  } else {
    lines.push(`I’m down to ${parts.candidateCount} possible countries for you.`);
  }

  if (parts.nextQuestion) {
    lines.push(`My question: ${parts.nextQuestion.prompt}`);
  }

  return lines.join("\n\n");
}

export function getShortlistPreview(candidates: CountryRecord[], count = 8) {
  return candidates.slice(0, count);
}

export function getAtlasCountries(query: string) {
  const normalized = normalizeText(query);

  if (!normalized) {
    return COUNTRIES;
  }

  return COUNTRIES.filter((country) =>
    normalizeText(country.name).includes(normalized),
  );
}

export const REFERENCE_COUNTRY_NAMES = [
  "United States",
  "Brazil",
  "France",
  "Tanzania",
  "India",
  "China",
  "Australia",
];

export function toMapPoint(country: CountryRecord) {
  const longitude = (country.bounds.west + country.bounds.east) / 2;
  const latitude = (country.bounds.south + country.bounds.north) / 2;

  return {
    x: ((longitude + 180) / 360) * 100,
    y: ((90 - latitude) / 180) * 100,
  };
}

export function getContinentColor(continent: Continent) {
  switch (continent) {
    case "Africa":
      return "#f59e0b";
    case "Asia":
      return "#22c55e";
    case "Europe":
      return "#60a5fa";
    case "North America":
      return "#f97316";
    case "South America":
      return "#ec4899";
    case "Oceania":
      return "#a78bfa";
    default:
      return "#94a3b8";
  }
}

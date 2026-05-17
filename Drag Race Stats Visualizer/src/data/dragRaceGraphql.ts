import { buildSchema, graphqlSync } from 'graphql'
import type { ExecutionResult } from 'graphql'

export type Guest = {
  id: number
  name: string
  seasons: Season[]
  appearances: GuestJudgeAppearance[]
}

export type Season = {
  id: number
  name: string
  year: number
  queens: Queen[]
  appearances: QueenSeasonAppearance[]
  guestJudges: Guest[]
  guestJudgeAppearances: GuestJudgeAppearance[]
}

export type Queen = {
  id: number
  name: string
  seasons: Season[]
  appearances: QueenSeasonAppearance[]
  hometown: string
  state: string
  region: string
  lat: number
  lon: number
  challengeWins: number
  lipSyncs: number
  franchise: string
}

export type QueenSeasonAppearance = {
  queen: Queen
  season: Season
  placement: string
}

export type GuestJudgeAppearance = {
  guest: Guest
  season: Season
}

export type DashboardQueen = Omit<Queen, 'seasons' | 'appearances'> & {
  seasons: {
    id: number
    name: string
    year: number
    placement: string
  }[]
  primarySeasonName: string
  placementsLabel: string
}

export type DashboardGuest = {
  id: number
  name: string
  seasons: {
    id: number
    name: string
    year: number
  }[]
}

export type DashboardSeason = {
  id: number
  name: string
  year: number
  queens: {
    id: number
    name: string
    placement: string
  }[]
  guestJudges: {
    id: number
    name: string
  }[]
}

export type DashboardData = {
  queens: DashboardQueen[]
  seasons: DashboardSeason[]
  guests: DashboardGuest[]
}

export const dragRaceGraphqlSchema = /* GraphQL */ `
  type Queen {
    id: Int!
    name: String!
    seasons: [Season!]!
    appearances: [QueenSeasonAppearance!]!
    hometown: String!
    state: String!
    region: String!
    lat: Float!
    lon: Float!
    challengeWins: Int!
    lipSyncs: Int!
    franchise: String!
  }

  type Season {
    id: Int!
    name: String!
    year: Int!
    queens: [Queen!]!
    appearances: [QueenSeasonAppearance!]!
    guestJudges: [Guest!]!
    guestJudgeAppearances: [GuestJudgeAppearance!]!
  }

  type Guest {
    id: Int!
    name: String!
    seasons: [Season!]!
    appearances: [GuestJudgeAppearance!]!
  }

  type GuestJudgeAppearance {
    guest: Guest!
    season: Season!
  }

  # Placement belongs on this join type because it is specific to a queen's
  # appearance on a season, not to the queen globally or to the season globally.
  type QueenSeasonAppearance {
    queen: Queen!
    season: Season!
    placement: String!
  }

  type Query {
    queens: [Queen!]!
    seasons: [Season!]!
    guests: [Guest!]!
  }
`

export const dashboardQueensQuery = /* GraphQL */ `
  query DashboardQueens {
    queens {
      id
      name
      hometown
      state
      region
      lat
      lon
      challengeWins
      lipSyncs
      franchise
      seasons {
        id
        name
        year
      }
      appearances {
        season {
          id
          name
          year
        }
        placement
      }
    }
    seasons {
      id
      name
      year
      queens {
        id
        name
      }
      appearances {
        queen {
          id
          name
          franchise
        }
        placement
      }
      guestJudges {
        id
        name
      }
    }
    guests {
      id
      name
      seasons {
        id
        name
        year
      }
    }
  }
`

type QueenRecord = Omit<Queen, 'seasons' | 'appearances'>
type SeasonRecord = Omit<
  Season,
  'queens' | 'appearances' | 'guestJudges' | 'guestJudgeAppearances'
>
type GuestRecord = Omit<Guest, 'seasons' | 'appearances'>
type AppearanceRecord = {
  queenId: number
  seasonId: number
  placement: string
}

type GuestJudgeRecord = {
  guestId: number
  seasonId: number
}

const queenRecords: QueenRecord[] = [
  {
    id: 1,
    name: 'BeBe Zahara Benet',
    hometown: 'Minneapolis',
    state: 'Minnesota',
    region: 'US',
    lat: 44.9778,
    lon: -93.265,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 2,
    name: 'Nina Flowers',
    hometown: 'Denver',
    state: 'Colorado',
    region: 'US',
    lat: 39.7392,
    lon: -104.9903,
    challengeWins: 2,
    lipSyncs: 0,
    franchise: 'US',
  },
  {
    id: 3,
    name: 'Rebecca Glasscock',
    hometown: 'Fort Lauderdale',
    state: 'Florida',
    region: 'US',
    lat: 26.1224,
    lon: -80.1373,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 4,
    name: 'Shannel',
    hometown: 'Las Vegas',
    state: 'Nevada',
    region: 'US',
    lat: 36.1716,
    lon: -115.1391,
    challengeWins: 2,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 5,
    name: 'Ongina',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 6,
    name: 'Jade',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 7,
    name: 'Akashia',
    hometown: 'Cleveland',
    state: 'Ohio',
    region: 'US',
    lat: 41.4993,
    lon: -81.6944,
    challengeWins: 0,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 8,
    name: 'Tammie Brown',
    hometown: 'Long Beach',
    state: 'California',
    region: 'US',
    lat: 33.7701,
    lon: -118.1937,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 9,
    name: 'Victoria "Porkchop" Parker',
    hometown: 'Raleigh',
    state: 'North Carolina',
    region: 'US',
    lat: 35.7796,
    lon: -78.6382,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 10,
    name: 'Tyra Sanchez',
    hometown: 'Orlando',
    state: 'Florida',
    region: 'US',
    lat: 28.5383,
    lon: -81.3792,
    challengeWins: 3,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 11,
    name: 'Raven',
    hometown: 'Riverside',
    state: 'California',
    region: 'US',
    lat: 33.9806,
    lon: -117.3755,
    challengeWins: 2,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 12,
    name: 'Jujubee',
    hometown: 'Boston',
    state: 'Massachusetts',
    region: 'US',
    lat: 42.3601,
    lon: -71.0589,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 13,
    name: 'Tatianna',
    hometown: 'Falls Church',
    state: 'Virginia',
    region: 'US',
    lat: 38.8823,
    lon: -77.1711,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 14,
    name: 'Pandora Boxx',
    hometown: 'Rochester',
    state: 'New York',
    region: 'US',
    lat: 43.1566,
    lon: -77.6088,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 15,
    name: 'Jessica Wild',
    hometown: 'San Juan',
    state: 'Puerto Rico',
    region: 'PR',
    lat: 18.4655,
    lon: -66.1057,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 16,
    name: 'Morgan McMichaels',
    hometown: 'West Hollywood',
    state: 'California',
    region: 'US',
    lat: 34.09,
    lon: -118.3617,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 17,
    name: 'Sahara Davenport',
    hometown: 'Dallas',
    state: 'Texas',
    region: 'US',
    lat: 32.7767,
    lon: -96.797,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 18,
    name: 'Sonique',
    hometown: 'Atlanta',
    state: 'Georgia',
    region: 'US',
    lat: 33.749,
    lon: -84.388,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 19,
    name: 'Mystique Summers Madison',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 20,
    name: 'Nicole Paige Brooks',
    hometown: 'Atlanta',
    state: 'Georgia',
    region: 'US',
    lat: 33.749,
    lon: -84.388,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 21,
    name: 'Shangela',
    hometown: 'Paris',
    state: 'Texas',
    region: 'US',
    lat: 33.6609,
    lon: -95.5555,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 22,
    name: 'Raja',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 3,
    lipSyncs: 0,
    franchise: 'US',
  },
  {
    id: 23,
    name: 'Manila Luzon',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 24,
    name: 'Alexis Mateo',
    hometown: 'Miami',
    state: 'Florida',
    region: 'US',
    lat: 25.7617,
    lon: -80.1918,
    challengeWins: 3,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 25,
    name: 'Yara Sofia',
    hometown: 'Las Vegas',
    state: 'Nevada',
    region: 'US',
    lat: 36.1699,
    lon: -115.1398,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 26,
    name: 'Shangela',
    hometown: 'Paris',
    state: 'Texas',
    region: 'US',
    lat: 33.6609,
    lon: -95.5555,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 27,
    name: 'Carmen Carrera',
    hometown: 'Elmwood Park',
    state: 'New Jersey',
    region: 'US',
    lat: 40.9037,
    lon: -74.1185,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 28,
    name: 'Delta Work',
    hometown: 'Norwalk',
    state: 'California',
    region: 'US',
    lat: 33.9022,
    lon: -118.0817,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 29,
    name: 'Stacy Layne Matthews',
    hometown: 'Back Swamp',
    state: 'North Carolina',
    region: 'US',
    lat: 34.7352,
    lon: -78.8367,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 30,
    name: 'Mariah Balenciaga',
    hometown: 'Compton',
    state: 'California',
    region: 'US',
    lat: 33.8958,
    lon: -118.2201,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 31,
    name: 'India Ferrah',
    hometown: 'Las Vegas',
    state: 'Nevada',
    region: 'US',
    lat: 36.1699,
    lon: -115.1398,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 32,
    name: 'Phoenix',
    hometown: 'Atlanta',
    state: 'Georgia',
    region: 'US',
    lat: 33.749,
    lon: -84.388,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 33,
    name: 'Mimi Imfurst',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 34,
    name: 'Venus D-Lite',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 35,
    name: 'Sharon Needles',
    hometown: 'Pittsburgh',
    state: 'Pennsylvania',
    region: 'US',
    lat: 40.4406,
    lon: -79.9959,
    challengeWins: 4,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 36,
    name: 'Chad Michaels',
    hometown: 'San Diego',
    state: 'California',
    region: 'US',
    lat: 32.7157,
    lon: -117.1611,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 37,
    name: "Phi Phi O'Hara",
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 38,
    name: 'Latrice Royale',
    hometown: 'South Beach',
    state: 'Florida',
    region: 'US',
    lat: 25.7826,
    lon: -80.1341,
    challengeWins: 2,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 39,
    name: 'Kenya Michaels',
    hometown: 'Dorado',
    state: 'Puerto Rico',
    region: 'PR',
    lat: 18.4588,
    lon: -66.2677,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 40,
    name: 'Dida Ritz',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 41,
    name: 'Willam',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 42,
    name: 'Jiggly Caliente',
    hometown: 'Queens',
    state: 'New York',
    region: 'US',
    lat: 40.7282,
    lon: -73.7949,
    challengeWins: 0,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 43,
    name: 'Milan',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 44,
    name: 'Madame LaQueer',
    hometown: 'Carolina',
    state: 'Puerto Rico',
    region: 'PR',
    lat: 18.3808,
    lon: -65.9574,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 45,
    name: 'The Princess',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 46,
    name: 'Lashauwn Beyond',
    hometown: 'Fort Lauderdale',
    state: 'Florida',
    region: 'US',
    lat: 26.1224,
    lon: -80.1373,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 47,
    name: 'Alisa Summers',
    hometown: 'Tampa',
    state: 'Florida',
    region: 'US',
    lat: 27.9506,
    lon: -82.4572,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 48,
    name: 'Jinkx Monsoon',
    hometown: 'Seattle',
    state: 'Washington',
    region: 'US',
    lat: 47.6062,
    lon: -122.3321,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 49,
    name: 'Roxxxy Andrews',
    hometown: 'Orlando',
    state: 'Florida',
    region: 'US',
    lat: 28.5383,
    lon: -81.3792,
    challengeWins: 2,
    lipSyncs: 5,
    franchise: 'US',
  },
  {
    id: 50,
    name: 'Alaska',
    hometown: 'Pittsburgh',
    state: 'Pennsylvania',
    region: 'US',
    lat: 40.4406,
    lon: -79.9959,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 51,
    name: 'Detox',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 52,
    name: 'Coco Montrese',
    hometown: 'Las Vegas',
    state: 'Nevada',
    region: 'US',
    lat: 36.1699,
    lon: -115.1398,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 53,
    name: 'Alyssa Edwards',
    hometown: 'Mesquite',
    state: 'Texas',
    region: 'US',
    lat: 32.7668,
    lon: -96.5992,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 54,
    name: 'Ivy Winters',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 55,
    name: 'Jade Jolie',
    hometown: 'Gainesville',
    state: 'Florida',
    region: 'US',
    lat: 29.6516,
    lon: -82.3248,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 56,
    name: 'Lineysha Sparx',
    hometown: 'San Juan',
    state: 'Puerto Rico',
    region: 'PR',
    lat: 18.4655,
    lon: -66.1057,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 57,
    name: 'Monica Beverly Hillz',
    hometown: 'Owensboro',
    state: 'Kentucky',
    region: 'US',
    lat: 37.7719,
    lon: -87.1112,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 58,
    name: 'Honey Mahogany',
    hometown: 'San Francisco',
    state: 'California',
    region: 'US',
    lat: 37.7749,
    lon: -122.4194,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 59,
    name: 'Vivienne Pinay',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 60,
    name: 'Penny Tration',
    hometown: 'Cincinnati',
    state: 'Ohio',
    region: 'US',
    lat: 39.1031,
    lon: -84.512,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 61,
    name: 'Serena ChaCha',
    hometown: 'Tallahassee',
    state: 'Florida',
    region: 'US',
    lat: 30.4383,
    lon: -84.2807,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 62,
    name: 'Bianca Del Rio',
    hometown: 'New Orleans',
    state: 'Louisiana',
    region: 'US',
    lat: 29.9511,
    lon: -90.0715,
    challengeWins: 3,
    lipSyncs: 0,
    franchise: 'US',
  },
  {
    id: 63,
    name: 'Adore Delano',
    hometown: 'Azusa',
    state: 'California',
    region: 'US',
    lat: 34.1336,
    lon: -117.9076,
    challengeWins: 2,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 64,
    name: 'Courtney Act',
    hometown: 'Brisbane',
    state: 'Queensland',
    region: 'AU',
    lat: -27.4698,
    lon: 153.0251,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 65,
    name: 'Darienne Lake',
    hometown: 'Rochester',
    state: 'New York',
    region: 'US',
    lat: 43.1566,
    lon: -77.6088,
    challengeWins: 1,
    lipSyncs: 4,
    franchise: 'US',
  },
  {
    id: 66,
    name: 'BenDeLaCreme',
    hometown: 'Seattle',
    state: 'Washington',
    region: 'US',
    lat: 47.6062,
    lon: -122.3321,
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 67,
    name: 'Joslyn Fox',
    hometown: 'Worcester',
    state: 'Massachusetts',
    region: 'US',
    lat: 42.2626,
    lon: -71.8023,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 68,
    name: 'Trinity K. Bonet',
    hometown: 'Birmingham',
    state: 'Alabama',
    region: 'US',
    lat: 33.5186,
    lon: -86.8104,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 69,
    name: 'Laganja Estranja',
    hometown: 'Dallas',
    state: 'Texas',
    region: 'US',
    lat: 32.7767,
    lon: -96.797,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 70,
    name: 'Milk',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 71,
    name: 'Gia Gunn',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 72,
    name: 'April Carrion',
    hometown: 'Guaynabo',
    state: 'Puerto Rico',
    region: 'PR',
    lat: 18.3575,
    lon: -66.111,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 73,
    name: 'Vivacious',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 74,
    name: 'Kelly Mantle',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 75,
    name: 'Magnolia Crawford',
    hometown: 'Seattle',
    state: 'Washington',
    region: 'US',
    lat: 47.6062,
    lon: -122.3321,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 76,
    name: 'Violet Chachki',
    hometown: 'Atlanta',
    state: 'Georgia',
    region: 'US',
    lat: 33.749,
    lon: -84.388,
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 77,
    name: 'Pearl',
    hometown: 'Brooklyn',
    state: 'New York',
    region: 'US',
    lat: 40.6782,
    lon: -73.9442,
    challengeWins: 2,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 78,
    name: 'Ginger Minj',
    hometown: 'Orlando',
    state: 'Florida',
    region: 'US',
    lat: 28.5383,
    lon: -81.3792,
    challengeWins: 3,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 79,
    name: 'Kennedy Davenport',
    hometown: 'Dallas',
    state: 'Texas',
    region: 'US',
    lat: 32.7767,
    lon: -96.797,
    challengeWins: 2,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 80,
    name: 'Katya',
    hometown: 'Boston',
    state: 'Massachusetts',
    region: 'US',
    lat: 42.3601,
    lon: -71.0589,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 81,
    name: 'Trixie Mattel',
    hometown: 'Milwaukee',
    state: 'Wisconsin',
    region: 'US',
    lat: 43.0389,
    lon: -87.9065,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 82,
    name: 'Miss Fame',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 83,
    name: 'Jaidynn Diore Fierce',
    hometown: 'Nashville',
    state: 'Tennessee',
    region: 'US',
    lat: 36.1627,
    lon: -86.7816,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 84,
    name: 'Max',
    hometown: 'Hudson',
    state: 'Wisconsin',
    region: 'US',
    lat: 44.9747,
    lon: -92.7569,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 85,
    name: 'Mrs. Kasha Davis',
    hometown: 'Rochester',
    state: 'New York',
    region: 'US',
    lat: 43.1566,
    lon: -77.6088,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 86,
    name: 'Kandy Ho',
    hometown: 'Cayey',
    state: 'Puerto Rico',
    region: 'PR',
    lat: 18.1119,
    lon: -66.166,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 87,
    name: 'Jasmine Masters',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 88,
    name: 'Tempest DuJour',
    hometown: 'Tucson',
    state: 'Arizona',
    region: 'US',
    lat: 32.2226,
    lon: -110.9747,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 89,
    name: 'Sasha Belle',
    hometown: 'Iowa City',
    state: 'Iowa',
    region: 'US',
    lat: 41.6611,
    lon: -91.5302,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 90,
    name: 'Bob the Drag Queen',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 91,
    name: 'Kim Chi',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 2,
    lipSyncs: 0,
    franchise: 'US',
  },
  {
    id: 92,
    name: 'Naomi Smalls',
    hometown: 'Redlands',
    state: 'California',
    region: 'US',
    lat: 34.0556,
    lon: -117.1825,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 93,
    name: 'Chi Chi DeVayne',
    hometown: 'Shreveport',
    state: 'Louisiana',
    region: 'US',
    lat: 32.5252,
    lon: -93.7502,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 94,
    name: 'Derrick Barry',
    hometown: 'Las Vegas',
    state: 'Nevada',
    region: 'US',
    lat: 36.1699,
    lon: -115.1398,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 95,
    name: 'Thorgy Thor',
    hometown: 'Brooklyn',
    state: 'New York',
    region: 'US',
    lat: 40.6782,
    lon: -73.9442,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 96,
    name: 'Acid Betty',
    hometown: 'Brooklyn',
    state: 'New York',
    region: 'US',
    lat: 40.6782,
    lon: -73.9442,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 97,
    name: 'Robbie Turner',
    hometown: 'Seattle',
    state: 'Washington',
    region: 'US',
    lat: 47.6062,
    lon: -122.3321,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 98,
    name: 'Cynthia Lee Fontaine',
    hometown: 'Austin',
    state: 'Texas',
    region: 'US',
    lat: 30.2672,
    lon: -97.7431,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 99,
    name: 'Naysha Lopez',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 100,
    name: 'Laila McQueen',
    hometown: 'Gloucester',
    state: 'Massachusetts',
    region: 'US',
    lat: 42.6159,
    lon: -70.662,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 101,
    name: 'Dax ExclamationPoint',
    hometown: 'Savannah',
    state: 'Georgia',
    region: 'US',
    lat: 32.0809,
    lon: -81.0912,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 102,
    name: 'Sasha Velour',
    hometown: 'Brooklyn',
    state: 'New York',
    region: 'US',
    lat: 40.6782,
    lon: -73.9442,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 103,
    name: 'Peppermint',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 1,
    lipSyncs: 4,
    franchise: 'US',
  },
  {
    id: 104,
    name: 'Trinity Taylor',
    hometown: 'Orlando',
    state: 'Florida',
    region: 'US',
    lat: 28.5383,
    lon: -81.3792,
    challengeWins: 3,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 105,
    name: 'Shea Couleé',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 4,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 106,
    name: 'Alexis Michelle',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 107,
    name: 'Nina Bo’nina Brown',
    hometown: 'Atlanta',
    state: 'Georgia',
    region: 'US',
    lat: 33.749,
    lon: -84.388,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 108,
    name: 'Valentina',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 109,
    name: 'Farrah Moan',
    hometown: 'Las Vegas',
    state: 'Nevada',
    region: 'US',
    lat: 36.1699,
    lon: -115.1398,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 110,
    name: 'Aja',
    hometown: 'Brooklyn',
    state: 'New York',
    region: 'US',
    lat: 40.6782,
    lon: -73.9442,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 111,
    name: 'Cynthia Lee Fontaine',
    hometown: 'Austin',
    state: 'Texas',
    region: 'US',
    lat: 30.2672,
    lon: -97.7431,
    challengeWins: 0,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 112,
    name: 'Eureka',
    hometown: 'Johnson City',
    state: 'Tennessee',
    region: 'US',
    lat: 36.3134,
    lon: -82.3535,
    challengeWins: 0,
    lipSyncs: 0,
    franchise: 'US',
  },
  {
    id: 113,
    name: 'Charlie Hides',
    hometown: 'London',
    state: 'England',
    region: 'UK',
    lat: 51.5072,
    lon: -0.1276,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 114,
    name: 'Kimora Blac',
    hometown: 'Las Vegas',
    state: 'Nevada',
    region: 'US',
    lat: 36.1699,
    lon: -115.1398,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 115,
    name: 'Aquaria',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 116,
    name: 'Eureka',
    hometown: 'Johnson City',
    state: 'Tennessee',
    region: 'US',
    lat: 36.3134,
    lon: -82.3535,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 117,
    name: 'Kameron Michaels',
    hometown: 'Nashville',
    state: 'Tennessee',
    region: 'US',
    lat: 36.1627,
    lon: -86.7816,
    challengeWins: 1,
    lipSyncs: 6,
    franchise: 'US',
  },
  {
    id: 118,
    name: 'Asia O’Hara',
    hometown: 'Dallas',
    state: 'Texas',
    region: 'US',
    lat: 32.7767,
    lon: -96.797,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 119,
    name: 'Miz Cracker',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 2,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 120,
    name: 'Monét X Change',
    hometown: 'Brooklyn',
    state: 'New York',
    region: 'US',
    lat: 40.6782,
    lon: -73.9442,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 121,
    name: 'Monique Heart',
    hometown: 'Kansas City',
    state: 'Missouri',
    region: 'US',
    lat: 39.0997,
    lon: -94.5786,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 122,
    name: 'The Vixen',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 123,
    name: 'Blair St. Clair',
    hometown: 'Indianapolis',
    state: 'Indiana',
    region: 'US',
    lat: 39.7684,
    lon: -86.1581,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 124,
    name: 'Mayhem Miller',
    hometown: 'Riverside',
    state: 'California',
    region: 'US',
    lat: 33.9806,
    lon: -117.3755,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 125,
    name: 'Dusty Ray Bottoms',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 126,
    name: 'Yuhua Hamasaki',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 127,
    name: 'Kalorie Karbdashian-Williams',
    hometown: 'Albuquerque',
    state: 'New Mexico',
    region: 'US',
    lat: 35.0844,
    lon: -106.6504,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 156,
    name: 'Vanessa Vanjie Mateo',
    hometown: 'Tampa',
    state: 'Florida',
    region: 'US',
    lat: 27.9506,
    lon: -82.4572,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 128,
    name: 'Yvie Oddly',
    hometown: 'Denver',
    state: 'Colorado',
    region: 'US',
    lat: 39.7392,
    lon: -104.9903,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 129,
    name: 'Brooke Lynn Hytes',
    hometown: 'Toronto',
    state: 'Ontario',
    region: 'CA',
    lat: 43.6532,
    lon: -79.3832,
    challengeWins: 3,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 130,
    name: 'A’keria C. Davenport',
    hometown: 'Dallas',
    state: 'Texas',
    region: 'US',
    lat: 32.7767,
    lon: -96.797,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 131,
    name: 'Silky Nutmeg Ganache',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 2,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 132,
    name: 'Vanessa Vanjie Mateo',
    hometown: 'Tampa',
    state: 'Florida',
    region: 'US',
    lat: 27.9506,
    lon: -82.4572,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 133,
    name: 'Nina West',
    hometown: 'Columbus',
    state: 'Ohio',
    region: 'US',
    lat: 39.9612,
    lon: -82.9988,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 134,
    name: 'Shuga Cain',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 135,
    name: 'Plastique Tiara',
    hometown: 'Dallas',
    state: 'Texas',
    region: 'US',
    lat: 32.7767,
    lon: -96.797,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 136,
    name: 'Ra’Jah O’Hara',
    hometown: 'Dallas',
    state: 'Texas',
    region: 'US',
    lat: 32.7767,
    lon: -96.797,
    challengeWins: 0,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 137,
    name: 'Scarlet Envy',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 138,
    name: 'Honey Davenport',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 139,
    name: 'Ariel Versace',
    hometown: 'Cherry Hill',
    state: 'New Jersey',
    region: 'US',
    lat: 39.9348,
    lon: -75.0307,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 140,
    name: 'Soju',
    hometown: 'Chicago',
    state: 'Illinois',
    region: 'US',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 141,
    name: 'Kahanna Montrese',
    hometown: 'Las Vegas',
    state: 'Nevada',
    region: 'US',
    lat: 36.1699,
    lon: -115.1398,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 142,
    name: 'Mercedes Iman Diamond',
    hometown: 'Minneapolis',
    state: 'Minnesota',
    region: 'US',
    lat: 44.9778,
    lon: -93.265,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 143,
    name: 'Jaida Essence Hall',
    hometown: 'Milwaukee',
    state: 'Wisconsin',
    region: 'US',
    lat: 43.0389,
    lon: -87.9065,
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 144,
    name: 'Crystal Methyd',
    hometown: 'Springfield',
    state: 'Missouri',
    region: 'US',
    lat: 37.2089,
    lon: -93.2923,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 145,
    name: 'Gigi Goode',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 4,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 146,
    name: 'Jackie Cox',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 147,
    name: 'Heidi N Closet',
    hometown: 'Ramseur',
    state: 'North Carolina',
    region: 'US',
    lat: 35.7335,
    lon: -79.652,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 148,
    name: 'Widow Von’Du',
    hometown: 'Kansas City',
    state: 'Missouri',
    region: 'US',
    lat: 39.0997,
    lon: -94.5786,
    challengeWins: 1,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 149,
    name: 'Jan',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 150,
    name: 'Brita',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 3,
    franchise: 'US',
  },
  {
    id: 151,
    name: 'Aiden Zhane',
    hometown: 'Acworth',
    state: 'Georgia',
    region: 'US',
    lat: 34.0659,
    lon: -84.6769,
    challengeWins: 0,
    lipSyncs: 2,
    franchise: 'US',
  },
  {
    id: 152,
    name: 'Nicky Doll',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 153,
    name: 'Rock M. Sakura',
    hometown: 'San Francisco',
    state: 'California',
    region: 'US',
    lat: 37.7749,
    lon: -122.4194,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 154,
    name: 'Dahlia Sin',
    hometown: 'Los Angeles',
    state: 'California',
    region: 'US',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 0,
    lipSyncs: 1,
    franchise: 'US',
  },
  {
    id: 155,
    name: '🍒 Cherry Pie',
    hometown: 'New York City',
    state: 'New York',
    region: 'US',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'US',
  },
]

const seasonRecords: SeasonRecord[] = [
  {
    id: 1,
    name: 'RuPaul’s Drag Race Season 1',
    year: 2009,
  },
  {
    id: 2,
    name: 'RuPaul’s Drag Race Season 2',
    year: 2010,
  },
  {
    id: 3,
    name: 'RuPaul’s Drag Race Season 3',
    year: 2011,
  },
  {
    id: 4,
    name: 'RuPaul’s Drag Race Season 4',
    year: 2012,
  },
  {
    id: 5,
    name: 'RuPaul’s Drag Race Season 5',
    year: 2013,
  },
  {
    id: 6,
    name: 'RuPaul’s Drag Race Season 6',
    year: 2014,
  },
  {
    id: 7,
    name: 'RuPaul’s Drag Race Season 7',
    year: 2015,
  },
  {
    id: 8,
    name: 'RuPaul’s Drag Race Season 8',
    year: 2016,
  },
  {
    id: 9,
    name: 'RuPaul’s Drag Race Season 9',
    year: 2017,
  },
  {
    id: 10,
    name: 'RuPaul’s Drag Race Season 10',
    year: 2018,
  },
  {
    id: 11,
    name: 'RuPaul’s Drag Race Season 11',
    year: 2019,
  },
  {
    id: 12,
    name: 'RuPaul’s Drag Race Season 12',
    year: 2020,
  },
]

const guestRecords: GuestRecord[] = [
  { id: 1, name: 'Bob Mackie' },
  { id: 2, name: 'Mike Ruiz' },
  { id: 3, name: 'Frank Gatson Jr.' },
  { id: 4, name: 'Michelle Williams' },
  { id: 5, name: 'Howard Bragman' },
  { id: 6, name: 'Debra Wilson' },
  { id: 7, name: 'Gordon Espinet' },
  { id: 8, name: 'Jenny Shimizu' },
  { id: 9, name: 'Lucy Lawless' },
  { id: 10, name: 'Robin Antin' },
  { id: 11, name: 'Jeffrey Moran' },
  { id: 12, name: 'María Conchita Alonso' },
  { id: 13, name: 'Kathy Griffin' },
  { id: 14, name: 'Kim Coles' },
  { id: 15, name: 'Daphne Guinness' },
  { id: 16, name: 'Nicole Scherzinger' },
  { id: 17, name: 'Cloris Leachman' },
  { id: 18, name: 'Beth Ditto' },
  { id: 19, name: 'Rosie Perez' },
  { id: 20, name: 'Terri Nunn' },
  { id: 21, name: 'Debi Mazar' },
  { id: 22, name: 'Tatiana Ali' },
  { id: 23, name: "Tatum O'Neal" },
  { id: 24, name: 'Martha Wash' },
  { id: 25, name: "Aubrey O'Day" },
  { id: 26, name: 'Leslie Jordan' },
  { id: 27, name: 'Bruce Vilanch' },
  { id: 28, name: 'Mike Ruiz' },
  { id: 29, name: 'Vanessa Williams' },
  { id: 30, name: 'Lily Tomlin' },
  { id: 31, name: 'Alessandra Torresani' },
  { id: 32, name: 'La Toya Jackson' },
  { id: 33, name: 'Susan Powter' },
  { id: 34, name: 'Chloë Sevigny' },
  { id: 35, name: 'Debbie Matenopoulos' },
  { id: 36, name: 'Aisha Tyler' },
  { id: 37, name: 'Amber Rose' },
  { id: 38, name: 'Eliza Dushku' },
  { id: 39, name: 'Sara Rue' },
  { id: 40, name: 'Rita Rudner' },
  { id: 41, name: 'Arden Myrin' },
  { id: 42, name: 'Cheryl Tiegs' },
  { id: 43, name: 'Johnny Weir' },
  { id: 44, name: 'Jeffrey Moran' },
  { id: 45, name: 'Jody Watley' },
  { id: 46, name: 'Carmen Electra' },
  { id: 47, name: 'Cassandra Peterson' },
  { id: 48, name: 'Rick Fox' },
  { id: 49, name: 'John Salley' },
  { id: 50, name: 'Amber Riley' },
  { id: 51, name: 'Natalie Cole' },
  { id: 52, name: 'Nicole Sullivan' },
  { id: 53, name: 'Max Mutchnick' },
  { id: 54, name: 'Loretta Devine' },
  { id: 55, name: 'Ross Mathews' },
  { id: 56, name: 'Kelly Osbourne' },
  { id: 57, name: 'Pauley Perrette' },
  { id: 58, name: 'Regina King' },
  { id: 59, name: 'Pam Tillis' },
  { id: 60, name: 'Lucian Piane' },
  { id: 61, name: 'Pamela Anderson' },
  { id: 62, name: 'Jennifer Tilly' },
  { id: 63, name: 'Dan Savage' },
  { id: 64, name: 'Jeffrey Moran' },
  { id: 65, name: 'Jesse Tyler Ferguson' },
  { id: 66, name: 'Jennifer Love Hewitt' },
  { id: 67, name: 'Rose McGowan' },
  { id: 68, name: 'Wynonna Judd' },
  { id: 69, name: 'Lisa Vanderpump' },
  { id: 70, name: 'Candis Cayne' },
  { id: 71, name: 'Juliette Lewis' },
  { id: 72, name: 'Jenifer Lewis' },
  { id: 73, name: 'Vivica A. Fox' },
  { id: 74, name: 'Alyssa Milano' },
  { id: 75, name: 'Kristen Johnston' },
  { id: 76, name: 'Busy Philipps' },
  { id: 77, name: 'Denis O’Hare' },
  { id: 78, name: 'Coco Rocha' },
  { id: 79, name: 'Georgia Holt' },
  { id: 80, name: 'The Pointer Sisters' },
  { id: 81, name: 'Aubrey Plaza' },
  { id: 82, name: 'Idina Menzel' },
  { id: 83, name: 'Jody Watley' },
  { id: 84, name: 'Marg Helgenberger' },
  { id: 85, name: 'Bob Mackie' },
  { id: 86, name: 'Joan Van Ark' },
  { id: 87, name: 'Chaz Bono' },
  { id: 88, name: 'Love Connie' },
  { id: 89, name: 'Adam Lambert' },
  { id: 90, name: 'Mike Ruiz' },
  { id: 91, name: 'Gillian Jacobs' },
  { id: 92, name: 'Heather McDonald' },
  { id: 93, name: 'Khloé Kardashian' },
  { id: 94, name: 'Lena Headey' },
  { id: 95, name: 'Linda Blair' },
  { id: 96, name: 'Georges LeBar' },
  { id: 97, name: 'Neil Patrick Harris' },
  { id: 98, name: 'Trina' },
  { id: 99, name: 'Bianca Lawson' },
  { id: 100, name: 'Chaz Bono' },
  { id: 101, name: 'Courtney Love' },
  { id: 102, name: 'Cheyenne Jackson' },
  { id: 103, name: 'Paula Abdul' },
  { id: 104, name: 'Aubrey O’Day' },
  { id: 105, name: 'Josie Maran' },
  { id: 106, name: 'Georgia Holt' },
  { id: 107, name: 'Bruce Vilanch' },
  { id: 108, name: 'Rachel Zoe' },
  { id: 109, name: 'Kathy Griffin' },
  { id: 110, name: 'Olivia Newton-John' },
  { id: 111, name: 'Jordin Sparks' },
  { id: 112, name: 'Jessica Alba' },
  { id: 113, name: 'Kat Dennings' },
  { id: 114, name: 'Merle Ginsberg' },
  { id: 115, name: 'Leah Remini' },
  { id: 116, name: 'Ari Graynor' },
  { id: 117, name: 'Alyssa Milano' },
  { id: 118, name: 'Joely Fisher' },
  { id: 119, name: 'Janelle Monáe' },
  { id: 120, name: 'Thomas Roberts' },
  { id: 121, name: 'Shania Twain' },
  { id: 122, name: 'Aisha Tyler' },
  { id: 123, name: 'Santino Rice' },
  { id: 124, name: 'Mel B' },
  { id: 125, name: 'Scott Barnes' },
  { id: 126, name: 'Arsenio Hall' },
  { id: 127, name: 'David Burtka' },
  { id: 128, name: 'Tamron Hall' },
  { id: 129, name: 'Nicole Richie' },
  { id: 130, name: 'Gigi Hadid' },
  { id: 131, name: 'Jamison Hebert' },
  { id: 132, name: 'Debbie Harry' },
  { id: 133, name: 'Chris Stein' },
  { id: 134, name: 'Lucian Piane' },
  { id: 135, name: 'Uzo Aduba' },
  { id: 136, name: 'Ricky Martin' },
  { id: 137, name: 'Chaka Khan' },
  { id: 138, name: 'David and Tamela Mann' },
  { id: 139, name: 'Todrick Hall' },
  { id: 140, name: 'Aubrey O’Day' },
  { id: 141, name: 'Leigh-Allyn Baker' },
  { id: 142, name: 'Cheyenne Jackson' },
  { id: 143, name: 'Vivica A. Fox' },
  { id: 144, name: 'Thomas Roberts' },
  { id: 145, name: 'Faith Evans' },
  { id: 146, name: 'Robbie Amell' },
  { id: 147, name: 'Cheryl Burke' },
  { id: 148, name: 'Noomi Rapace' },
  { id: 149, name: 'Lady Gaga' },
  { id: 150, name: 'The B-52s' },
  { id: 151, name: 'Naya Rivera' },
  { id: 152, name: 'Jeffrey Bowyer-Chapman' },
  { id: 153, name: 'Todrick Hall' },
  { id: 154, name: 'Candis Cayne' },
  { id: 155, name: 'Lisa Kudrow' },
  { id: 156, name: 'JoJo' },
  { id: 157, name: 'Kesha' },
  { id: 158, name: 'Cheyenne Jackson' },
  { id: 159, name: 'Aubrey Plaza' },
  { id: 160, name: 'Chaz Bono' },
  { id: 161, name: 'Andie MacDowell' },
  { id: 162, name: 'Denis O’Hare' },
  { id: 163, name: 'Demi Lovato' },
  { id: 164, name: 'Joan Smalls' },
  { id: 165, name: 'Noah Galvin' },
  { id: 166, name: 'Karrueche Tran' },
  { id: 167, name: 'Nastia Liukin' },
  { id: 168, name: 'Wintergreen' },
  { id: 169, name: 'Christina Aguilera' },
  { id: 170, name: 'Halsey' },
  { id: 171, name: 'Padma Lakshmi' },
  { id: 172, name: 'Courtney Love' },
  { id: 173, name: 'Nico Tortorella' },
  { id: 174, name: 'Logan Browning' },
  { id: 175, name: 'Tisha Campbell' },
  { id: 176, name: 'Carrie Preston' },
  { id: 177, name: 'Shania Twain' },
  { id: 178, name: 'Emily V. Gordon' },
  { id: 179, name: 'Kumail Nanjiani' },
  { id: 180, name: 'Audra McDonald' },
  { id: 181, name: 'Kate Upton' },
  { id: 182, name: 'Andrew Rannells' },
  { id: 183, name: 'Billy Eichner' },
  { id: 184, name: 'Abbi Jacobson' },
  { id: 185, name: 'Ilana Glazer' },
  { id: 186, name: 'Miles Heizer' },
  { id: 187, name: 'Lizzo' },
  { id: 188, name: 'Lena Dunham' },
  { id: 189, name: 'Ashanti' },
  { id: 190, name: 'Todrick Hall' },
  { id: 191, name: 'Miley Cyrus' },
  { id: 192, name: 'Bobby Moynihan' },
  { id: 193, name: 'Sydelle Noel' },
  { id: 194, name: 'Guillermo Díaz' },
  { id: 195, name: 'Troye Sivan' },
  { id: 196, name: 'Joel McHale' },
  { id: 197, name: 'Tiffany Pollard' },
  { id: 198, name: 'Cara Delevingne' },
  { id: 199, name: 'Elvira, Mistress of the Dark' },
  { id: 200, name: 'Mirai Nagasu' },
  { id: 201, name: 'Adam Rippon' },
  { id: 202, name: 'Travis Wall' },
  { id: 203, name: 'Kandi Burruss' },
  { id: 204, name: 'Amber Valletta' },
  { id: 205, name: 'Clea DuVall' },
  { id: 206, name: 'Tony Hale' },
  { id: 207, name: 'Fortune Feimster' },
  { id: 208, name: 'Cheyenne Jackson' },
  { id: 209, name: 'Natasha Lyonne' },
  { id: 210, name: 'Katherine Langford' },
  { id: 211, name: 'Gina Rodriguez' },
  { id: 212, name: 'Wanda Sykes' },
  { id: 213, name: 'Lena Waithe' },
  { id: 214, name: 'Todrick Hall' },
  { id: 215, name: 'Nicki Minaj' },
  { id: 216, name: 'Robyn' },
  { id: 217, name: 'Thandiwe Newton' },
  { id: 218, name: 'Olivia Munn' },
  { id: 219, name: 'Leslie Jones' },
  { id: 220, name: 'Normani' },
  { id: 221, name: 'Daniel Franzese' },
  { id: 222, name: 'Jonathan Bennett' },
  { id: 223, name: 'Alexandria Ocasio-Cortez' },
  { id: 224, name: 'Winnie Harlow' },
  { id: 225, name: 'Chaka Khan' },
  { id: 226, name: 'Jeff Goldblum' },
  { id: 227, name: 'Rachel Bloom' },
  { id: 228, name: 'Daisy Ridley' },
  { id: 229, name: 'Whoopi Goldberg' },
  { id: 230, name: 'Jamal Sims' },
]

const guestJudgeRecords: GuestJudgeRecord[] = [
  ...guestRecords.slice(0, 12).map((guest) => ({
    guestId: guest.id,
    seasonId: 1,
  })),
  ...guestRecords.slice(12, 26).map((guest) => ({
    guestId: guest.id,
    seasonId: 2,
  })),
  ...guestRecords.slice(26, 46).map((guest) => ({
    guestId: guest.id,
    seasonId: 3,
  })),
  ...[47, 28, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68].map(
    (guestId) => ({
      guestId,
      seasonId: 4,
    }),
  ),
  ...guestRecords.slice(68, 88).map((guest) => ({
    guestId: guest.id,
    seasonId: 5,
  })),
  ...guestRecords.slice(88, 108).map((guest) => ({
    guestId: guest.id,
    seasonId: 6,
  })),
  ...guestRecords.slice(108, 128).map((guest) => ({
    guestId: guest.id,
    seasonId: 7,
  })),
  ...guestRecords.slice(128, 148).map((guest) => ({
    guestId: guest.id,
    seasonId: 8,
  })),
  ...guestRecords.slice(148, 168).map((guest) => ({
    guestId: guest.id,
    seasonId: 9,
  })),
  ...guestRecords.slice(168, 190).map((guest) => ({
    guestId: guest.id,
    seasonId: 10,
  })),
  ...guestRecords.slice(190, 214).map((guest) => ({
    guestId: guest.id,
    seasonId: 11,
  })),
  ...guestRecords.slice(214).map((guest) => ({
    guestId: guest.id,
    seasonId: 12,
  })),
]

const appearanceRecords: AppearanceRecord[] = [
  { queenId: 1, seasonId: 1, placement: 'Winner' },
  { queenId: 2, seasonId: 1, placement: 'Runner-Up' },
  { queenId: 3, seasonId: 1, placement: '3rd Place' },
  { queenId: 4, seasonId: 1, placement: '4th Place' },
  { queenId: 5, seasonId: 1, placement: '5th Place' },
  { queenId: 6, seasonId: 1, placement: '6th Place' },
  { queenId: 7, seasonId: 1, placement: '7th Place' },
  { queenId: 8, seasonId: 1, placement: '8th Place' },
  { queenId: 9, seasonId: 1, placement: '9th Place' },
  { queenId: 10, seasonId: 2, placement: 'Winner' },
  { queenId: 11, seasonId: 2, placement: 'Runner-Up' },
  { queenId: 12, seasonId: 2, placement: '3rd Place' },
  { queenId: 13, seasonId: 2, placement: '4th Place' },
  { queenId: 14, seasonId: 2, placement: '5th Place' },
  { queenId: 15, seasonId: 2, placement: '6th Place' },
  { queenId: 16, seasonId: 2, placement: '7th Place' },
  { queenId: 17, seasonId: 2, placement: '8th Place' },
  { queenId: 18, seasonId: 2, placement: '9th Place' },
  { queenId: 19, seasonId: 2, placement: '10th Place' },
  { queenId: 20, seasonId: 2, placement: '11th Place' },
  { queenId: 21, seasonId: 2, placement: '12th Place' },
  { queenId: 22, seasonId: 3, placement: 'Winner' },
  { queenId: 23, seasonId: 3, placement: 'Runner-Up' },
  { queenId: 24, seasonId: 3, placement: '3rd Place' },
  { queenId: 25, seasonId: 3, placement: '4th Place' },
  { queenId: 26, seasonId: 3, placement: '5th Place' },
  { queenId: 27, seasonId: 3, placement: '6th Place' },
  { queenId: 28, seasonId: 3, placement: '7th Place' },
  { queenId: 29, seasonId: 3, placement: '8th Place' },
  { queenId: 30, seasonId: 3, placement: '9th Place' },
  { queenId: 31, seasonId: 3, placement: '10th Place' },
  { queenId: 32, seasonId: 3, placement: '11th Place' },
  { queenId: 33, seasonId: 3, placement: '12th Place' },
  { queenId: 34, seasonId: 3, placement: '13th Place' },
  { queenId: 35, seasonId: 4, placement: 'Winner' },
  { queenId: 36, seasonId: 4, placement: 'Runner-Up' },
  { queenId: 37, seasonId: 4, placement: 'Runner-Up' },
  { queenId: 38, seasonId: 4, placement: '4th Place' },
  { queenId: 39, seasonId: 4, placement: '5th Place' },
  { queenId: 40, seasonId: 4, placement: '6th Place' },
  { queenId: 41, seasonId: 4, placement: '7th Place / Disqualified' },
  { queenId: 42, seasonId: 4, placement: '8th Place' },
  { queenId: 43, seasonId: 4, placement: '9th Place' },
  { queenId: 44, seasonId: 4, placement: '10th Place' },
  { queenId: 45, seasonId: 4, placement: '11th Place' },
  { queenId: 46, seasonId: 4, placement: '12th Place' },
  { queenId: 47, seasonId: 4, placement: '13th Place' },
  { queenId: 48, seasonId: 5, placement: 'Winner' },
  { queenId: 49, seasonId: 5, placement: 'Runner-Up' },
  { queenId: 50, seasonId: 5, placement: 'Runner-Up' },
  { queenId: 51, seasonId: 5, placement: '4th Place' },
  { queenId: 52, seasonId: 5, placement: '5th Place' },
  { queenId: 53, seasonId: 5, placement: '6th Place' },
  { queenId: 54, seasonId: 5, placement: '7th Place' },
  { queenId: 55, seasonId: 5, placement: '8th Place' },
  { queenId: 56, seasonId: 5, placement: '9th Place' },
  { queenId: 57, seasonId: 5, placement: '10th Place' },
  { queenId: 58, seasonId: 5, placement: '11th Place' },
  { queenId: 59, seasonId: 5, placement: '11th Place' },
  { queenId: 60, seasonId: 5, placement: '13th Place' },
  { queenId: 61, seasonId: 5, placement: '14th Place' },
  { queenId: 62, seasonId: 6, placement: 'Winner' },
  { queenId: 63, seasonId: 6, placement: 'Runner-Up' },
  { queenId: 64, seasonId: 6, placement: 'Runner-Up' },
  { queenId: 65, seasonId: 6, placement: '4th Place' },
  { queenId: 66, seasonId: 6, placement: '5th Place' },
  { queenId: 67, seasonId: 6, placement: '6th Place' },
  { queenId: 68, seasonId: 6, placement: '7th Place' },
  { queenId: 69, seasonId: 6, placement: '8th Place' },
  { queenId: 70, seasonId: 6, placement: '9th Place' },
  { queenId: 71, seasonId: 6, placement: '10th Place' },
  { queenId: 72, seasonId: 6, placement: '11th Place' },
  { queenId: 73, seasonId: 6, placement: '12th Place' },
  { queenId: 74, seasonId: 6, placement: '13th Place' },
  { queenId: 75, seasonId: 6, placement: '14th Place' },
  { queenId: 76, seasonId: 7, placement: 'Winner' },
  { queenId: 77, seasonId: 7, placement: 'Runner-Up' },
  { queenId: 78, seasonId: 7, placement: 'Runner-Up' },
  { queenId: 79, seasonId: 7, placement: '4th Place' },
  { queenId: 80, seasonId: 7, placement: '5th Place' },
  { queenId: 81, seasonId: 7, placement: '6th Place' },
  { queenId: 82, seasonId: 7, placement: '7th Place' },
  { queenId: 83, seasonId: 7, placement: '8th Place' },
  { queenId: 84, seasonId: 7, placement: '9th Place' },
  { queenId: 85, seasonId: 7, placement: '10th Place' },
  { queenId: 86, seasonId: 7, placement: '11th Place' },
  { queenId: 87, seasonId: 7, placement: '12th Place' },
  { queenId: 88, seasonId: 7, placement: '13th Place' },
  { queenId: 89, seasonId: 7, placement: '14th Place' },
  { queenId: 90, seasonId: 8, placement: 'Winner' },
  { queenId: 91, seasonId: 8, placement: 'Runner-Up' },
  { queenId: 92, seasonId: 8, placement: '3rd Place' },
  { queenId: 93, seasonId: 8, placement: '4th Place' },
  { queenId: 94, seasonId: 8, placement: '5th Place' },
  { queenId: 95, seasonId: 8, placement: '6th Place' },
  { queenId: 96, seasonId: 8, placement: '7th Place' },
  { queenId: 97, seasonId: 8, placement: '8th Place' },
  { queenId: 98, seasonId: 8, placement: '9th Place' },
  { queenId: 99, seasonId: 8, placement: '10th Place' },
  { queenId: 100, seasonId: 8, placement: '11th Place' },
  { queenId: 101, seasonId: 8, placement: '12th Place' },
  { queenId: 102, seasonId: 9, placement: 'Winner' },
  { queenId: 103, seasonId: 9, placement: 'Runner-Up' },
  { queenId: 104, seasonId: 9, placement: 'Runner-Up' },
  { queenId: 105, seasonId: 9, placement: 'Runner-Up' },
  { queenId: 106, seasonId: 9, placement: '5th Place' },
  { queenId: 107, seasonId: 9, placement: '6th Place' },
  { queenId: 108, seasonId: 9, placement: '7th Place' },
  { queenId: 109, seasonId: 9, placement: '8th Place' },
  { queenId: 110, seasonId: 9, placement: '9th Place' },
  { queenId: 111, seasonId: 9, placement: '10th Place' },
  { queenId: 112, seasonId: 9, placement: '11th Place / Withdrew' },
  { queenId: 113, seasonId: 9, placement: '12th Place' },
  { queenId: 114, seasonId: 9, placement: '13th Place' },
  { queenId: 115, seasonId: 10, placement: 'Winner' },
  { queenId: 116, seasonId: 10, placement: 'Runner-Up' },
  { queenId: 117, seasonId: 10, placement: 'Runner-Up' },
  { queenId: 118, seasonId: 10, placement: '4th Place' },
  { queenId: 119, seasonId: 10, placement: '5th Place' },
  { queenId: 120, seasonId: 10, placement: '6th Place' },
  { queenId: 122, seasonId: 10, placement: '7th Place' },
  { queenId: 121, seasonId: 10, placement: '8th Place' },
  { queenId: 123, seasonId: 10, placement: '9th Place' },
  { queenId: 124, seasonId: 10, placement: '10th Place' },
  { queenId: 125, seasonId: 10, placement: '11th Place' },
  { queenId: 126, seasonId: 10, placement: '12th Place' },
  { queenId: 127, seasonId: 10, placement: '13th Place' },
  { queenId: 156, seasonId: 10, placement: '14th Place' },
  { queenId: 128, seasonId: 11, placement: 'Winner' },
  { queenId: 129, seasonId: 11, placement: 'Runner-Up' },
  { queenId: 130, seasonId: 11, placement: '3rd/4th Place' },
  { queenId: 131, seasonId: 11, placement: '3rd/4th Place' },
  { queenId: 132, seasonId: 11, placement: '5th Place' },
  { queenId: 133, seasonId: 11, placement: '6th Place' },
  { queenId: 134, seasonId: 11, placement: '7th Place' },
  { queenId: 135, seasonId: 11, placement: '8th Place' },
  { queenId: 136, seasonId: 11, placement: '9th Place' },
  { queenId: 137, seasonId: 11, placement: '10th Place' },
  { queenId: 138, seasonId: 11, placement: '11th Place' },
  { queenId: 139, seasonId: 11, placement: '12th Place' },
  { queenId: 140, seasonId: 11, placement: '13th Place' },
  { queenId: 142, seasonId: 11, placement: '14th Place' },
  { queenId: 141, seasonId: 11, placement: '15th Place' },
  { queenId: 143, seasonId: 12, placement: 'Winner' },
  { queenId: 144, seasonId: 12, placement: 'Runner-Up' },
  { queenId: 145, seasonId: 12, placement: 'Runner-Up' },
  { queenId: 146, seasonId: 12, placement: '4th Place' },
  { queenId: 147, seasonId: 12, placement: '5th Place' },
  { queenId: 148, seasonId: 12, placement: '6th Place' },
  { queenId: 149, seasonId: 12, placement: '7th Place' },
  { queenId: 150, seasonId: 12, placement: '8th Place' },
  { queenId: 151, seasonId: 12, placement: '9th Place' },
  { queenId: 152, seasonId: 12, placement: '10th Place' },
  { queenId: 153, seasonId: 12, placement: '11th Place' },
  { queenId: 154, seasonId: 12, placement: '12th Place' },
  { queenId: 155, seasonId: 12, placement: 'Disqualified' },
]

type DragRaceQueryResult = {
  queens: (Omit<
    DashboardQueen,
    'seasons' | 'primarySeasonName' | 'placementsLabel'
  > & {
    seasons?: {
      id: number
      name: string
      year: number
    }[]
    appearances?: {
      season: {
        id: number
        name: string
        year: number
      }
      placement: string
    }[]
  })[]
  seasons: (Omit<DashboardSeason, 'queens' | 'guestJudges'> & {
    queens?: {
      id: number
      name: string
    }[]
    guestJudges?: {
      id: number
      name: string
    }[]
    appearances?: {
      queen: {
        id: number
        name: string
        franchise: string
      }
      placement: string
    }[]
  })[]
  guests: (Omit<DashboardGuest, 'seasons'> & {
    seasons?: {
      id: number
      name: string
      year: number
    }[]
  })[]
}

const dragRaceSchema = buildSchema(dragRaceGraphqlSchema)
const queenById = new Map(queenRecords.map((queen) => [queen.id, queen]))
const seasonById = new Map(seasonRecords.map((season) => [season.id, season]))
const guestById = new Map(guestRecords.map((guest) => [guest.id, guest]))

function requireRecord<T>(record: T | undefined, label: string): T {
  if (!record) {
    throw new Error(`Missing Drag Race GraphQL record: ${label}`)
  }

  return record
}

type ResolvedAppearance = {
  queen: ResolvedQueen
  season: ResolvedSeason
  placement: string
}

type ResolvedGuestJudgeAppearance = {
  guest: ResolvedGuest
  season: ResolvedSeason
}

type ResolvedQueen = QueenRecord & {
  seasons: () => ResolvedSeason[]
  appearances: () => ResolvedAppearance[]
}

type ResolvedSeason = SeasonRecord & {
  queens: () => ResolvedQueen[]
  appearances: () => ResolvedAppearance[]
  guestJudges: () => ResolvedGuest[]
  guestJudgeAppearances: () => ResolvedGuestJudgeAppearance[]
}

type ResolvedGuest = GuestRecord & {
  seasons: () => ResolvedSeason[]
  appearances: () => ResolvedGuestJudgeAppearance[]
}

function getAppearancesForQueen(queenId: number): ResolvedAppearance[] {
  return appearanceRecords
    .filter((appearance) => appearance.queenId === queenId)
    .map((appearance) => ({
      queen: getQueenById(appearance.queenId),
      season: getSeasonById(appearance.seasonId),
      placement: appearance.placement,
    }))
}

function getAppearancesForSeason(seasonId: number): ResolvedAppearance[] {
  return appearanceRecords
    .filter((appearance) => appearance.seasonId === seasonId)
    .map((appearance) => ({
      queen: getQueenById(appearance.queenId),
      season: getSeasonById(appearance.seasonId),
      placement: appearance.placement,
    }))
}

function getGuestJudgeAppearancesForGuest(
  guestId: number,
): ResolvedGuestJudgeAppearance[] {
  return guestJudgeRecords
    .filter((appearance) => appearance.guestId === guestId)
    .map((appearance) => ({
      guest: getGuestById(appearance.guestId),
      season: getSeasonById(appearance.seasonId),
    }))
}

function getGuestJudgeAppearancesForSeason(
  seasonId: number,
): ResolvedGuestJudgeAppearance[] {
  return guestJudgeRecords
    .filter((appearance) => appearance.seasonId === seasonId)
    .map((appearance) => ({
      guest: getGuestById(appearance.guestId),
      season: getSeasonById(appearance.seasonId),
    }))
}

function getQueenById(queenId: number): ResolvedQueen {
  const queen = requireRecord(queenById.get(queenId), `queen ${queenId}`)

  return {
    ...queen,
    appearances: () => getAppearancesForQueen(queen.id),
    seasons: () =>
      getAppearancesForQueen(queen.id).map((appearance) => appearance.season),
  }
}

function getSeasonById(seasonId: number): ResolvedSeason {
  const season = requireRecord(seasonById.get(seasonId), `season ${seasonId}`)

  return {
    ...season,
    appearances: () => getAppearancesForSeason(season.id),
    queens: () =>
      getAppearancesForSeason(season.id).map((appearance) => appearance.queen),
    guestJudgeAppearances: () => getGuestJudgeAppearancesForSeason(season.id),
    guestJudges: () =>
      getGuestJudgeAppearancesForSeason(season.id).map(
        (appearance) => appearance.guest,
      ),
  }
}

function getGuestById(guestId: number): ResolvedGuest {
  const guest = requireRecord(guestById.get(guestId), `guest ${guestId}`)

  return {
    ...guest,
    appearances: () => getGuestJudgeAppearancesForGuest(guest.id),
    seasons: () =>
      getGuestJudgeAppearancesForGuest(guest.id).map(
        (appearance) => appearance.season,
      ),
  }
}

const dragRaceResolvers = {
  queens: () => queenRecords.map((queen) => getQueenById(queen.id)),
  seasons: () => seasonRecords.map((season) => getSeasonById(season.id)),
  guests: () => guestRecords.map((guest) => getGuestById(guest.id)),
}

function assertDragRaceQueryData(
  result: ExecutionResult,
): asserts result is ExecutionResult<DragRaceQueryResult> & {
  data: DragRaceQueryResult
} {
  if (result.errors?.length) {
    throw new Error(
      result.errors
        .map((error: { message: string }) => error.message)
        .join('; '),
    )
  }

  if (!result.data) {
    throw new Error('Drag Race GraphQL query returned no data')
  }
}

type DashboardQueenAccumulator = Omit<
  DashboardQueen,
  'seasons' | 'primarySeasonName' | 'placementsLabel'
> & {
  seasonsById: Map<number, DashboardQueen['seasons'][number]>
}

function getQueenIdentityKey(queen: Pick<Queen, 'name' | 'franchise'>) {
  return `${queen.franchise}:${queen.name.trim().toLowerCase()}`
}

function getSeasonNamesLabel(seasons: DashboardQueen['seasons']) {
  return seasons.map((season) => season.name).join(', ') || 'Unknown season'
}

function getPlacementLabel(seasons: DashboardQueen['seasons']) {
  return seasons
    .map((season) => `${season.name}: ${season.placement}`)
    .join('; ')
}

function getSortedQueenSeasons(
  seasonsById: DashboardQueenAccumulator['seasonsById'],
) {
  return [...seasonsById.values()].sort(
    (seasonA, seasonB) => seasonA.id - seasonB.id,
  )
}

function normalizeDashboardQueens(
  queens: DragRaceQueryResult['queens'],
): DashboardQueen[] {
  const queensByIdentity = queens.reduce<Map<string, DashboardQueenAccumulator>>(
    (dedupedQueens, queen) => {
      const queenKey = getQueenIdentityKey(queen)
      const existingQueen = dedupedQueens.get(queenKey)
      const seasons = (queen.appearances ?? []).map((appearance) => ({
        id: appearance.season.id,
        name: appearance.season.name,
        year: appearance.season.year,
        placement: appearance.placement,
      }))

      if (existingQueen) {
        seasons.forEach((season) => {
          existingQueen.seasonsById.set(season.id, season)
        })
        existingQueen.challengeWins += queen.challengeWins
        existingQueen.lipSyncs += queen.lipSyncs

        return dedupedQueens
      }

      dedupedQueens.set(queenKey, {
        id: queen.id,
        name: queen.name,
        hometown: queen.hometown,
        state: queen.state,
        region: queen.region,
        lat: queen.lat,
        lon: queen.lon,
        challengeWins: queen.challengeWins,
        lipSyncs: queen.lipSyncs,
        franchise: queen.franchise,
        seasonsById: new Map(seasons.map((season) => [season.id, season])),
      })

      return dedupedQueens
    },
    new Map(),
  )

  return [...queensByIdentity.values()].map((queen) => {
    const seasons = getSortedQueenSeasons(queen.seasonsById)

    return {
      id: queen.id,
      name: queen.name,
      hometown: queen.hometown,
      state: queen.state,
      region: queen.region,
      lat: queen.lat,
      lon: queen.lon,
      challengeWins: queen.challengeWins,
      lipSyncs: queen.lipSyncs,
      franchise: queen.franchise,
      seasons,
      primarySeasonName: getSeasonNamesLabel(seasons),
      placementsLabel: getPlacementLabel(seasons),
    }
  })
}

function normalizeDashboardData(data: DragRaceQueryResult): DashboardData {
  const queens = normalizeDashboardQueens(data.queens)
  const canonicalQueenIdByIdentity = new Map(
    queens.map((queen) => [getQueenIdentityKey(queen), queen.id]),
  )

  return {
    queens,
    seasons: data.seasons.map((season) => ({
      id: season.id,
      name: season.name,
      year: season.year,
      guestJudges: season.guestJudges ?? [],
      queens: (season.appearances ?? []).map((appearance) => ({
        id:
          canonicalQueenIdByIdentity.get(getQueenIdentityKey(appearance.queen)) ??
          appearance.queen.id,
        name: appearance.queen.name,
        placement: appearance.placement,
      })),
    })),
    guests: data.guests.map((guest) => ({
      id: guest.id,
      name: guest.name,
      seasons: guest.seasons ?? [],
    })),
  }
}

export function queryDragRaceStore(query: string): DashboardData {
  const result = graphqlSync({
    schema: dragRaceSchema,
    source: query,
    rootValue: dragRaceResolvers,
  })

  assertDragRaceQueryData(result)

  return normalizeDashboardData(result.data)
}

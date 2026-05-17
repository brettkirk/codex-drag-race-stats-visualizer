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
  }[]
}

export type DashboardSeason = {
  id: number
  name: string
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
      }
      appearances {
        season {
          id
          name
        }
        placement
      }
    }
    seasons {
      id
      name
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
]

const seasonRecords: SeasonRecord[] = [
  {
    id: 1,
    name: 'RuPaul’s Drag Race Season 1',
  },
  {
    id: 2,
    name: 'RuPaul’s Drag Race Season 2',
  },
  {
    id: 3,
    name: 'RuPaul’s Drag Race Season 3',
  },
  {
    id: 4,
    name: 'RuPaul’s Drag Race Season 4',
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
]

type DragRaceQueryResult = {
  queens: (Omit<
    DashboardQueen,
    'seasons' | 'primarySeasonName' | 'placementsLabel'
  > & {
    seasons?: {
      id: number
      name: string
    }[]
    appearances?: {
      season: {
        id: number
        name: string
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

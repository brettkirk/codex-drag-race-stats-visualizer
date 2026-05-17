import { buildSchema, graphqlSync } from 'graphql'
import type { ExecutionResult } from 'graphql'

export type Guest = {
  id: number
  name: string
}

export type Season = {
  id: number
  name: string
  queens: Queen[]
  appearances: QueenSeasonAppearance[]
  guestJudges: Guest[]
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
  mapX: number
  mapY: number
}

export type QueenSeasonAppearance = {
  queen: Queen
  season: Season
  placement: string
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

export type DashboardSeason = {
  id: number
  name: string
  queens: {
    id: number
    name: string
    placement: string
  }[]
  guestJudges: Guest[]
}

export type DashboardData = {
  queens: DashboardQueen[]
  seasons: DashboardSeason[]
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
    mapX: Float!
    mapY: Float!
  }

  type Season {
    id: Int!
    name: String!
    queens: [Queen!]!
    appearances: [QueenSeasonAppearance!]!
    guestJudges: [Guest!]!
  }

  type Guest {
    id: Int!
    name: String!
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
      mapX
      mapY
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
        }
        placement
      }
      guestJudges {
        id
        name
      }
    }
  }
`

type QueenRecord = Omit<Queen, 'seasons' | 'appearances'>
type SeasonRecord = Omit<Season, 'queens' | 'appearances'>
type AppearanceRecord = {
  queenId: number
  seasonId: number
  placement: string
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
    mapX: 0,
    mapY: 0,
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
    mapX: 0,
    mapY: 0,
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
    mapX: 0,
    mapY: 0,
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
    mapX: 0,
    mapY: 0,
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
    mapX: 0,
    mapY: 0,
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
    mapX: 0,
    mapY: 0,
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
    mapX: 0,
    mapY: 0,
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
    mapX: 0,
    mapY: 0,
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
    mapX: 0,
    mapY: 0,
  },
]

const seasonRecords: SeasonRecord[] = [
  {
    id: 1,
    name: 'RuPaul’s Drag Race Season 1',
    guestJudges: [
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
    ],
  },
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
]

type DragRaceQueryResult = {
  queens: (Omit<DashboardQueen, 'seasons' | 'primarySeasonName' | 'placementsLabel'> & {
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
  seasons: (Omit<DashboardSeason, 'queens'> & {
    queens?: {
      id: number
      name: string
    }[]
    appearances?: {
      queen: {
        id: number
        name: string
      }
      placement: string
    }[]
  })[]
}

const dragRaceSchema = buildSchema(dragRaceGraphqlSchema)
const queenById = new Map(queenRecords.map((queen) => [queen.id, queen]))
const seasonById = new Map(seasonRecords.map((season) => [season.id, season]))

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

type ResolvedQueen = QueenRecord & {
  seasons: () => ResolvedSeason[]
  appearances: () => ResolvedAppearance[]
}

type ResolvedSeason = SeasonRecord & {
  queens: () => ResolvedQueen[]
  appearances: () => ResolvedAppearance[]
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

function getQueenById(queenId: number): ResolvedQueen {
  const queen = requireRecord(queenById.get(queenId), `queen ${queenId}`)

  return {
    ...queen,
    appearances: () => getAppearancesForQueen(queen.id),
    seasons: () => getAppearancesForQueen(queen.id).map((appearance) => appearance.season),
  }
}

function getSeasonById(seasonId: number): ResolvedSeason {
  const season = requireRecord(seasonById.get(seasonId), `season ${seasonId}`)

  return {
    ...season,
    appearances: () => getAppearancesForSeason(season.id),
    queens: () => getAppearancesForSeason(season.id).map((appearance) => appearance.queen),
  }
}

const dragRaceResolvers = {
  queens: () => queenRecords.map((queen) => getQueenById(queen.id)),
  seasons: () => seasonRecords.map((season) => getSeasonById(season.id)),
}

function assertDragRaceQueryData(
  result: ExecutionResult,
): asserts result is ExecutionResult<DragRaceQueryResult> & { data: DragRaceQueryResult } {
  if (result.errors?.length) {
    throw new Error(
      result.errors.map((error) => error.message).join('; '),
    )
  }

  if (!result.data) {
    throw new Error('Drag Race GraphQL query returned no data')
  }
}

function getPlacementLabel(
  appearances: DragRaceQueryResult['queens'][number]['appearances'] = [],
) {
  return appearances
    .map((appearance) => `${appearance.season.name}: ${appearance.placement}`)
    .join('; ')
}

function normalizeDashboardData(data: DragRaceQueryResult): DashboardData {
  return {
    queens: data.queens.map((queen) => {
      const seasons = (queen.appearances ?? []).map((appearance) => ({
        id: appearance.season.id,
        name: appearance.season.name,
        placement: appearance.placement,
      }))
      const primarySeason = seasons.at(-1)

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
        mapX: queen.mapX,
        mapY: queen.mapY,
        seasons,
        primarySeasonName: primarySeason?.name ?? 'Unknown season',
        placementsLabel: getPlacementLabel(queen.appearances),
      }
    }),
    seasons: data.seasons.map((season) => ({
      id: season.id,
      name: season.name,
      guestJudges: season.guestJudges,
      queens: (season.appearances ?? []).map((appearance) => ({
        id: appearance.queen.id,
        name: appearance.queen.name,
        placement: appearance.placement,
      })),
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

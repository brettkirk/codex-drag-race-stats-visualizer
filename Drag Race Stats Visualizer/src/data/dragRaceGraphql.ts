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
    name: 'Sasha Colby',
    hometown: 'Los Angeles',
    state: 'CA',
    region: 'West',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 4,
    lipSyncs: 2,
    franchise: 'United States',
    mapX: 14,
    mapY: 61,
  },
  {
    id: 2,
    name: 'Symone',
    hometown: 'Los Angeles',
    state: 'CA',
    region: 'West',
    lat: 34.0522,
    lon: -118.2437,
    challengeWins: 4,
    lipSyncs: 3,
    franchise: 'United States',
    mapX: 16,
    mapY: 58,
  },
  {
    id: 3,
    name: 'Bianca Del Rio',
    hometown: 'New York City',
    state: 'NY',
    region: 'Northeast',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 3,
    lipSyncs: 0,
    franchise: 'United States',
    mapX: 87,
    mapY: 29,
  },
  {
    id: 4,
    name: 'Bob the Drag Queen',
    hometown: 'New York City',
    state: 'NY',
    region: 'Northeast',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'United States',
    mapX: 89,
    mapY: 33,
  },
  {
    id: 5,
    name: 'Jinkx Monsoon',
    hometown: 'Seattle',
    state: 'WA',
    region: 'West',
    lat: 47.6062,
    lon: -122.3321,
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'United States',
    mapX: 14,
    mapY: 15,
  },
  {
    id: 6,
    name: 'Willow Pill',
    hometown: 'Denver',
    state: 'CO',
    region: 'Mountain',
    lat: 39.7392,
    lon: -104.9903,
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'United States',
    mapX: 43,
    mapY: 45,
  },
  {
    id: 7,
    name: 'Jaida Essence Hall',
    hometown: 'Milwaukee',
    state: 'WI',
    region: 'Midwest',
    lat: 43.0389,
    lon: -87.9065,
    challengeWins: 3,
    lipSyncs: 2,
    franchise: 'United States',
    mapX: 64,
    mapY: 31,
  },
  {
    id: 8,
    name: 'Shea Couleé',
    hometown: 'Chicago',
    state: 'IL',
    region: 'Midwest',
    lat: 41.8781,
    lon: -87.6298,
    challengeWins: 2,
    lipSyncs: 3,
    franchise: 'All Stars',
    mapX: 66,
    mapY: 41,
  },
  {
    id: 9,
    name: 'Trixie Mattel',
    hometown: 'Milwaukee',
    state: 'WI',
    region: 'Midwest',
    lat: 43.0389,
    lon: -87.9065,
    challengeWins: 2,
    lipSyncs: 2,
    franchise: 'All Stars',
    mapX: 62,
    mapY: 28,
  },
  {
    id: 10,
    name: 'Aquaria',
    hometown: 'New York City',
    state: 'NY',
    region: 'Northeast',
    lat: 40.7128,
    lon: -74.006,
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'United States',
    mapX: 91,
    mapY: 31,
  },
  {
    id: 11,
    name: 'Kylie Sonique Love',
    hometown: 'Atlanta',
    state: 'GA',
    region: 'South',
    lat: 33.749,
    lon: -84.388,
    challengeWins: 1,
    lipSyncs: 4,
    franchise: 'All Stars',
    mapX: 76,
    mapY: 63,
  },
  {
    id: 12,
    name: 'Yvie Oddly',
    hometown: 'Denver',
    state: 'CO',
    region: 'Mountain',
    lat: 39.7392,
    lon: -104.9903,
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'United States',
    mapX: 45,
    mapY: 48,
  },
]

const seasonRecords: SeasonRecord[] = [
  { id: 1, name: 'US Season 2', guestJudges: [{ id: 1, name: 'Kathy Griffin' }] },
  { id: 2, name: 'US Season 5', guestJudges: [{ id: 2, name: 'Kristen Johnston' }] },
  { id: 3, name: 'US Season 6', guestJudges: [{ id: 3, name: 'Paula Abdul' }] },
  { id: 4, name: 'US Season 7', guestJudges: [{ id: 4, name: 'Ariana Grande' }] },
  { id: 5, name: 'US Season 8', guestJudges: [{ id: 5, name: 'Nicole Richie' }] },
  { id: 6, name: 'US Season 9', guestJudges: [{ id: 6, name: 'Lady Gaga' }] },
  { id: 7, name: 'US Season 10', guestJudges: [{ id: 7, name: 'Christina Aguilera' }] },
  { id: 8, name: 'US Season 11', guestJudges: [{ id: 8, name: 'Miley Cyrus' }] },
  { id: 9, name: 'US Season 12', guestJudges: [{ id: 9, name: 'Nicki Minaj' }] },
  { id: 10, name: 'US Season 13', guestJudges: [{ id: 10, name: 'Lizzo' }] },
  { id: 11, name: 'US Season 14', guestJudges: [{ id: 11, name: 'Alicia Keys' }] },
  { id: 12, name: 'US Season 15', guestJudges: [{ id: 12, name: 'Ariana Grande' }] },
  { id: 13, name: 'All Stars 3', guestJudges: [{ id: 13, name: 'Vanessa Williams' }] },
  { id: 14, name: 'All Stars 5', guestJudges: [{ id: 14, name: 'Ricky Martin' }] },
  { id: 15, name: 'All Stars 6', guestJudges: [{ id: 15, name: 'Tina Knowles' }] },
  { id: 16, name: 'All Stars 7', guestJudges: [{ id: 16, name: 'Cameron Diaz' }] },
]

const appearanceRecords: AppearanceRecord[] = [
  { queenId: 1, seasonId: 12, placement: 'Winner' },
  { queenId: 2, seasonId: 10, placement: 'Winner' },
  { queenId: 3, seasonId: 3, placement: 'Winner' },
  { queenId: 4, seasonId: 5, placement: 'Winner' },
  { queenId: 5, seasonId: 2, placement: 'Winner' },
  { queenId: 5, seasonId: 16, placement: 'Winner' },
  { queenId: 6, seasonId: 11, placement: 'Winner' },
  { queenId: 7, seasonId: 9, placement: 'Winner' },
  { queenId: 8, seasonId: 6, placement: '3rd/4th' },
  { queenId: 8, seasonId: 14, placement: 'Winner' },
  { queenId: 9, seasonId: 4, placement: '6th' },
  { queenId: 9, seasonId: 13, placement: 'Winner' },
  { queenId: 10, seasonId: 7, placement: 'Winner' },
  { queenId: 11, seasonId: 1, placement: '9th' },
  { queenId: 11, seasonId: 15, placement: 'Winner' },
  { queenId: 12, seasonId: 8, placement: 'Winner' },
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

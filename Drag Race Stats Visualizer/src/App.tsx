import { useMemo, useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import {
  dashboardQueensQuery,
  queryDragRaceStore,
  type DashboardQueen,
} from './data/dragRaceGraphql'
import './App.css'

type Page = 'map' | 'table' | 'charts'

type GeographyDatum = {
  id?: string | number
  rsmKey: string
  properties?: {
    name?: string
  }
}

const usStatesGeoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

const stateFipsByCode: Record<string, string> = {
  AL: '01',
  AK: '02',
  AZ: '04',
  AR: '05',
  CA: '06',
  CO: '08',
  CT: '09',
  DE: '10',
  DC: '11',
  FL: '12',
  GA: '13',
  HI: '15',
  ID: '16',
  IL: '17',
  IN: '18',
  IA: '19',
  KS: '20',
  KY: '21',
  LA: '22',
  ME: '23',
  MD: '24',
  MA: '25',
  MI: '26',
  MN: '27',
  MS: '28',
  MO: '29',
  MT: '30',
  NE: '31',
  NV: '32',
  NH: '33',
  NJ: '34',
  NM: '35',
  NY: '36',
  NC: '37',
  ND: '38',
  OH: '39',
  OK: '40',
  OR: '41',
  PA: '42',
  RI: '44',
  SC: '45',
  SD: '46',
  TN: '47',
  TX: '48',
  UT: '49',
  VT: '50',
  VA: '51',
  WA: '53',
  WV: '54',
  WI: '55',
  WY: '56',
}

const stateCodeByFips = Object.fromEntries(
  Object.entries(stateFipsByCode).map(([code, fips]) => [fips, code]),
)

const pinOffsets = [
  [0, 0],
  [-0.8, -0.55],
  [0.8, -0.45],
  [-0.65, 0.65],
  [0.65, 0.65],
] as const

const navItems: { id: Page; label: string }[] = [
  { id: 'map', label: 'Map' },
  { id: 'table', label: 'Statistics Table' },
  { id: 'charts', label: 'Charts' },
]

const dashboardData = queryDragRaceStore(dashboardQueensQuery)
const queenStats = dashboardData.queens

function App() {
  const [activePage, setActivePage] = useState<Page>('map')
  const [query, setQuery] = useState('')

  const filteredQueens = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return queenStats
    }

    return queenStats.filter((queen) =>
      [
        queen.name,
        queen.primarySeasonName,
        queen.hometown,
        queen.state,
        queen.region,
        queen.placementsLabel,
        queen.franchise,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [query])

  const stateTotals = useMemo(() => {
    return queenStats.reduce<Record<string, number>>((totals, queen) => {
      totals[queen.state] = (totals[queen.state] ?? 0) + 1
      return totals
    }, {})
  }, [])

  const regionTotals = useMemo(() => {
    return Object.entries(
      queenStats.reduce<Record<string, number>>((totals, queen) => {
        totals[queen.region] = (totals[queen.region] ?? 0) + 1
        return totals
      }, {}),
    ).sort(([, totalA], [, totalB]) => totalB - totalA)
  }, [])

  const maxRegionTotal = Math.max(...regionTotals.map(([, total]) => total))
  const totalChallengeWins = queenStats.reduce(
    (total, queen) => total + queen.challengeWins,
    0,
  )
  const totalLipSyncs = queenStats.reduce((total, queen) => total + queen.lipSyncs, 0)

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Drag Race Stats Visualizer</p>
          <h1>Track queens, hometowns, wins, and lip syncs.</h1>
          <p className="intro">
            A starter analytics dashboard for RuPaul's Drag Race with page-ready
            layouts for a US map, searchable queen statistics, and chart cards.
          </p>
        </div>
        <div className="hero-card" aria-label="Dataset summary">
          <span className="hero-number">{queenStats.length}</span>
          <span>featured queens in the starter dataset</span>
        </div>
      </header>

      <nav className="page-tabs" aria-label="Viewer pages">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activePage === item.id ? 'active' : ''}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main>
        {activePage === 'map' && <MapPage stateTotals={stateTotals} />}
        {activePage === 'table' && (
          <TablePage
            filteredQueens={filteredQueens}
            query={query}
            setQuery={setQuery}
          />
        )}
        {activePage === 'charts' && (
          <ChartsPage
            maxRegionTotal={maxRegionTotal}
            regionTotals={regionTotals}
            totalChallengeWins={totalChallengeWins}
            totalLipSyncs={totalLipSyncs}
          />
        )}
      </main>
    </div>
  )
}

function MapPage({ stateTotals }: { stateTotals: Record<string, number> }) {
  const uniqueStates = Object.keys(stateTotals).length
  const queensByState = queenStats.reduce<Record<string, DashboardQueen[]>>((groups, queen) => {
    groups[queen.state] = [...(groups[queen.state] ?? []), queen]
    return groups
  }, {})

  return (
    <section className="page-grid map-layout" aria-labelledby="map-title">
      <div className="panel map-panel">
        <div className="section-heading">
          <p className="eyebrow">Map</p>
          <h2 id="map-title">US hometown view</h2>
          <p>
            React Simple Maps now renders a geographic US state map with zoom and pan
            support. Highlighted states show where featured queens come from, while
            hometown markers use each queen's latitude and longitude.
          </p>
        </div>

        <div
          className="us-map"
          role="img"
          aria-label="Geographic map of the United States with queen hometown pins by state"
        >
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 1025 }}
            width={980}
            height={560}
          >
            <ZoomableGroup center={[-97, 38]} zoom={1} minZoom={1} maxZoom={4}>
              <Geographies geography={usStatesGeoUrl}>
                {({ geographies }: { geographies: unknown[] }) =>
                  (geographies as GeographyDatum[]).map((geography) => {
                    const stateFips = String(geography.id ?? '').padStart(2, '0')
                    const stateCode = stateCodeByFips[stateFips]
                    const totalQueens = stateCode ? stateTotals[stateCode] ?? 0 : 0
                    const represented = totalQueens > 0
                    const stateName = geography.properties?.name ?? stateCode ?? 'State'

                    return (
                      <Geography
                        aria-label={`${stateName}${
                          represented ? `, ${totalQueens} queens` : ''
                        }`}
                        className={represented ? 'state-geography represented' : 'state-geography'}
                        geography={geography}
                        key={geography.rsmKey}
                      />
                    )
                  })
                }
              </Geographies>

              {Object.entries(queensByState).flatMap(([state, queens]) =>
                queens.map((queen, queenIndex) => {
                  const [offsetLon, offsetLat] = pinOffsets[queenIndex % pinOffsets.length]

                  return (
                    <Marker
                      className="map-marker"
                      coordinates={[queen.lon + offsetLon, queen.lat + offsetLat]}
                      key={queen.id}
                    >
                      <title>{`${queen.name} — ${queen.hometown}, ${state}`}</title>
                      <circle className="map-pin-halo" r={8 + queens.length} />
                      <circle className="map-pin" r="5.2" />
                    </Marker>
                  )
                }),
              )}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>

      <aside className="panel stat-stack" aria-label="Map summary statistics">
        <article className="metric-card">
          <span>{uniqueStates}</span>
          <p>states represented</p>
        </article>
        <article className="metric-card">
          <span>{stateTotals.NY ?? 0}</span>
          <p>New York queens</p>
        </article>
        <article className="metric-card">
          <span>{stateTotals.CA ?? 0}</span>
          <p>California queens</p>
        </article>
        <div className="state-list">
          <h3>States in this sample</h3>
          {Object.entries(stateTotals).map(([state, total]) => (
            <div key={state}>
              <span>{state}</span>
              <strong>{total}</strong>
            </div>
          ))}
        </div>
      </aside>
    </section>
  )
}

function TablePage({
  filteredQueens,
  query,
  setQuery,
}: {
  filteredQueens: DashboardQueen[]
  query: string
  setQuery: (query: string) => void
}) {
  return (
    <section className="panel" aria-labelledby="table-title">
      <div className="table-toolbar">
        <div className="section-heading">
          <p className="eyebrow">Table</p>
          <h2 id="table-title">Searchable queen statistics</h2>
          <p>
            Filter by queen, city, state, region, season, placement, or franchise.
          </p>
        </div>
        <label className="search-box">
          <span>Search stats</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “New York”, “Winner”, or “All Stars”"
          />
        </label>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Queen</th>
              <th>Season</th>
              <th>Hometown</th>
              <th>Region</th>
              <th>Placement</th>
              <th>Wins</th>
              <th>Lip syncs</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueens.map((queen) => (
              <tr key={queen.id}>
                <td>{queen.name}</td>
                <td>{queen.primarySeasonName}</td>
                <td>
                  {queen.hometown}, {queen.state}
                </td>
                <td>{queen.region}</td>
                <td>{queen.placementsLabel}</td>
                <td>{queen.challengeWins}</td>
                <td>{queen.lipSyncs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredQueens.length === 0 && (
        <p className="empty-state">No queens match that search yet.</p>
      )}
    </section>
  )
}

function ChartsPage({
  maxRegionTotal,
  regionTotals,
  totalChallengeWins,
  totalLipSyncs,
}: {
  maxRegionTotal: number
  regionTotals: [string, number][]
  totalChallengeWins: number
  totalLipSyncs: number
}) {
  const topQueens = [...queenStats]
    .sort((queenA, queenB) => queenB.challengeWins - queenA.challengeWins)
    .slice(0, 5)

  return (
    <section className="page-grid charts-layout" aria-labelledby="charts-title">
      <div className="panel">
        <div className="section-heading">
          <p className="eyebrow">Charts</p>
          <h2 id="charts-title">Regional distribution</h2>
          <p>Simple CSS bars keep this first version dependency-free.</p>
        </div>

        <div className="bar-chart" aria-label="Queens by US region">
          {regionTotals.map(([region, total]) => (
            <div className="bar-row" key={region}>
              <span>{region}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(total / maxRegionTotal) * 100}%` }}
                />
              </div>
              <strong>{total}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="panel chart-card-list">
        <div className="section-heading">
          <p className="eyebrow">Performance</p>
          <h2>Challenge wins leaderboard</h2>
        </div>
        {topQueens.map((queen, index) => (
          <article className="leader-card" key={queen.id}>
            <span>#{index + 1}</span>
            <div>
              <h3>{queen.name}</h3>
              <p>{queen.primarySeasonName}</p>
            </div>
            <strong>{queen.challengeWins}</strong>
          </article>
        ))}
      </div>

      <div className="panel chart-summary">
        <article className="metric-card">
          <span>{totalChallengeWins}</span>
          <p>total challenge wins</p>
        </article>
        <article className="metric-card">
          <span>{totalLipSyncs}</span>
          <p>total lip syncs</p>
        </article>
      </div>
    </section>
  )
}

export default App

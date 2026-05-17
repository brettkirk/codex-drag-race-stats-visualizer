import { useMemo, useState } from 'react'
import {
  dashboardQueensQuery,
  queryDragRaceStore,
  type DashboardQueen,
} from './data/dragRaceGraphql'
import './App.css'

type Page = 'map' | 'table' | 'charts'

type StateTile = {
  code: string
  name: string
  x: number
  y: number
}

const stateTiles: StateTile[] = [
  { code: 'AK', name: 'Alaska', x: 0, y: 0 },
  { code: 'ME', name: 'Maine', x: 11, y: 0 },
  { code: 'VT', name: 'Vermont', x: 9, y: 1 },
  { code: 'NH', name: 'New Hampshire', x: 10, y: 1 },
  { code: 'WA', name: 'Washington', x: 1, y: 2 },
  { code: 'ID', name: 'Idaho', x: 2, y: 2 },
  { code: 'MT', name: 'Montana', x: 3, y: 2 },
  { code: 'ND', name: 'North Dakota', x: 4, y: 2 },
  { code: 'MN', name: 'Minnesota', x: 5, y: 2 },
  { code: 'IL', name: 'Illinois', x: 6, y: 2 },
  { code: 'WI', name: 'Wisconsin', x: 7, y: 2 },
  { code: 'MI', name: 'Michigan', x: 8, y: 2 },
  { code: 'NY', name: 'New York', x: 9, y: 2 },
  { code: 'MA', name: 'Massachusetts', x: 10, y: 2 },
  { code: 'OR', name: 'Oregon', x: 1, y: 3 },
  { code: 'NV', name: 'Nevada', x: 2, y: 3 },
  { code: 'WY', name: 'Wyoming', x: 3, y: 3 },
  { code: 'SD', name: 'South Dakota', x: 4, y: 3 },
  { code: 'IA', name: 'Iowa', x: 5, y: 3 },
  { code: 'IN', name: 'Indiana', x: 6, y: 3 },
  { code: 'OH', name: 'Ohio', x: 7, y: 3 },
  { code: 'PA', name: 'Pennsylvania', x: 8, y: 3 },
  { code: 'NJ', name: 'New Jersey', x: 9, y: 3 },
  { code: 'CT', name: 'Connecticut', x: 10, y: 3 },
  { code: 'RI', name: 'Rhode Island', x: 11, y: 3 },
  { code: 'CA', name: 'California', x: 1, y: 4 },
  { code: 'UT', name: 'Utah', x: 2, y: 4 },
  { code: 'CO', name: 'Colorado', x: 3, y: 4 },
  { code: 'NE', name: 'Nebraska', x: 4, y: 4 },
  { code: 'MO', name: 'Missouri', x: 5, y: 4 },
  { code: 'KY', name: 'Kentucky', x: 6, y: 4 },
  { code: 'WV', name: 'West Virginia', x: 7, y: 4 },
  { code: 'VA', name: 'Virginia', x: 8, y: 4 },
  { code: 'MD', name: 'Maryland', x: 9, y: 4 },
  { code: 'DE', name: 'Delaware', x: 10, y: 4 },
  { code: 'AZ', name: 'Arizona', x: 2, y: 5 },
  { code: 'NM', name: 'New Mexico', x: 3, y: 5 },
  { code: 'KS', name: 'Kansas', x: 4, y: 5 },
  { code: 'AR', name: 'Arkansas', x: 5, y: 5 },
  { code: 'TN', name: 'Tennessee', x: 6, y: 5 },
  { code: 'NC', name: 'North Carolina', x: 7, y: 5 },
  { code: 'SC', name: 'South Carolina', x: 8, y: 5 },
  { code: 'DC', name: 'District of Columbia', x: 9, y: 5 },
  { code: 'OK', name: 'Oklahoma', x: 4, y: 6 },
  { code: 'LA', name: 'Louisiana', x: 5, y: 6 },
  { code: 'MS', name: 'Mississippi', x: 6, y: 6 },
  { code: 'AL', name: 'Alabama', x: 7, y: 6 },
  { code: 'GA', name: 'Georgia', x: 8, y: 6 },
  { code: 'HI', name: 'Hawaii', x: 0, y: 7 },
  { code: 'TX', name: 'Texas', x: 4, y: 7 },
  { code: 'FL', name: 'Florida', x: 9, y: 7 },
]

const tileSize = 48
const tileGap = 6
const mapPadding = 10
const mapWidth = 12 * (tileSize + tileGap) + mapPadding * 2
const mapHeight = 8 * (tileSize + tileGap) + mapPadding * 2
const pinOffsets = [
  [0, 0],
  [-8, -7],
  [8, -5],
  [-7, 8],
  [7, 8],
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
  const statesWithQueens = new Set(Object.keys(stateTotals))
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
            A full US state tile map replaces the old placeholder blob. States with
            queens are highlighted, and hometown pins are grouped on their real
            state so this can scale into a richer SVG mapping component later.
          </p>
        </div>

        <div
          className="us-map"
          role="img"
          aria-label="Tile map of the United States with queen hometown pins by state"
        >
          <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} aria-hidden="true">
            <defs>
              <filter id="pin-shadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow
                  dx="0"
                  dy="3"
                  floodColor="#481f5d"
                  floodOpacity="0.22"
                  stdDeviation="3"
                />
              </filter>
            </defs>
            {stateTiles.map((tile) => {
              const tileQueens = queensByState[tile.code] ?? []
              const represented = statesWithQueens.has(tile.code)
              const x = mapPadding + tile.x * (tileSize + tileGap)
              const y = mapPadding + tile.y * (tileSize + tileGap)

              return (
                <g className="state-tile-group" key={tile.code}>
                  <rect
                    className={represented ? 'state-tile represented' : 'state-tile'}
                    height={tileSize}
                    rx="12"
                    width={tileSize}
                    x={x}
                    y={y}
                  >
                    <title>{`${tile.name}${
                      represented ? `: ${stateTotals[tile.code]} queens` : ''
                    }`}</title>
                  </rect>
                  <text
                    className={represented ? 'state-label represented' : 'state-label'}
                    x={x + tileSize / 2}
                    y={y + tileSize / 2 + 5}
                  >
                    {tile.code}
                  </text>
                  {tileQueens.map((queen, queenIndex) => {
                    const [offsetX, offsetY] = pinOffsets[queenIndex % pinOffsets.length]
                    return (
                      <g
                        className="map-pin-group"
                        key={queen.id}
                        transform={`translate(${x + tileSize / 2 + offsetX} ${
                          y + tileSize / 2 + offsetY
                        })`}
                      >
                        <title>{`${queen.name} — ${queen.hometown}, ${queen.state}`}</title>
                        <circle className="map-pin-halo" r={11 + tileQueens.length} />
                        <circle className="map-pin" r="5.2" />
                      </g>
                    )
                  })}
                </g>
              )
            })}
          </svg>
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

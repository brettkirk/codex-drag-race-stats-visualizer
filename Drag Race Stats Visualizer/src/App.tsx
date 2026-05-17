import { useMemo, useState } from 'react'
import './App.css'

type Page = 'map' | 'table' | 'charts'

type QueenStat = {
  id: number
  name: string
  season: string
  hometown: string
  state: string
  region: string
  placement: string
  challengeWins: number
  lipSyncs: number
  franchise: string
  mapX: number
  mapY: number
}

const queenStats: QueenStat[] = [
  {
    id: 1,
    name: 'Sasha Colby',
    season: 'US Season 15',
    hometown: 'Los Angeles',
    state: 'CA',
    region: 'West',
    placement: 'Winner',
    challengeWins: 4,
    lipSyncs: 2,
    franchise: 'United States',
    mapX: 14,
    mapY: 61,
  },
  {
    id: 2,
    name: 'Symone',
    season: 'US Season 13',
    hometown: 'Los Angeles',
    state: 'CA',
    region: 'West',
    placement: 'Winner',
    challengeWins: 4,
    lipSyncs: 3,
    franchise: 'United States',
    mapX: 16,
    mapY: 58,
  },
  {
    id: 3,
    name: 'Bianca Del Rio',
    season: 'US Season 6',
    hometown: 'New York City',
    state: 'NY',
    region: 'Northeast',
    placement: 'Winner',
    challengeWins: 3,
    lipSyncs: 0,
    franchise: 'United States',
    mapX: 87,
    mapY: 29,
  },
  {
    id: 4,
    name: 'Bob the Drag Queen',
    season: 'US Season 8',
    hometown: 'New York City',
    state: 'NY',
    region: 'Northeast',
    placement: 'Winner',
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'United States',
    mapX: 89,
    mapY: 33,
  },
  {
    id: 5,
    name: 'Jinkx Monsoon',
    season: 'US Season 5',
    hometown: 'Seattle',
    state: 'WA',
    region: 'West',
    placement: 'Winner',
    challengeWins: 2,
    lipSyncs: 1,
    franchise: 'United States',
    mapX: 14,
    mapY: 15,
  },
  {
    id: 6,
    name: 'Willow Pill',
    season: 'US Season 14',
    hometown: 'Denver',
    state: 'CO',
    region: 'Mountain',
    placement: 'Winner',
    challengeWins: 1,
    lipSyncs: 1,
    franchise: 'United States',
    mapX: 43,
    mapY: 45,
  },
  {
    id: 7,
    name: 'Jaida Essence Hall',
    season: 'US Season 12',
    hometown: 'Milwaukee',
    state: 'WI',
    region: 'Midwest',
    placement: 'Winner',
    challengeWins: 3,
    lipSyncs: 2,
    franchise: 'United States',
    mapX: 64,
    mapY: 31,
  },
  {
    id: 8,
    name: 'Shea Couleé',
    season: 'All Stars 5',
    hometown: 'Chicago',
    state: 'IL',
    region: 'Midwest',
    placement: 'Winner',
    challengeWins: 2,
    lipSyncs: 3,
    franchise: 'All Stars',
    mapX: 66,
    mapY: 41,
  },
  {
    id: 9,
    name: 'Trixie Mattel',
    season: 'All Stars 3',
    hometown: 'Milwaukee',
    state: 'WI',
    region: 'Midwest',
    placement: 'Winner',
    challengeWins: 2,
    lipSyncs: 2,
    franchise: 'All Stars',
    mapX: 62,
    mapY: 28,
  },
  {
    id: 10,
    name: 'Aquaria',
    season: 'US Season 10',
    hometown: 'New York City',
    state: 'NY',
    region: 'Northeast',
    placement: 'Winner',
    challengeWins: 3,
    lipSyncs: 1,
    franchise: 'United States',
    mapX: 91,
    mapY: 31,
  },
  {
    id: 11,
    name: 'Kylie Sonique Love',
    season: 'All Stars 6',
    hometown: 'Atlanta',
    state: 'GA',
    region: 'South',
    placement: 'Winner',
    challengeWins: 1,
    lipSyncs: 4,
    franchise: 'All Stars',
    mapX: 76,
    mapY: 63,
  },
  {
    id: 12,
    name: 'Yvie Oddly',
    season: 'US Season 11',
    hometown: 'Denver',
    state: 'CO',
    region: 'Mountain',
    placement: 'Winner',
    challengeWins: 1,
    lipSyncs: 3,
    franchise: 'United States',
    mapX: 45,
    mapY: 48,
  },
]

const navItems: { id: Page; label: string }[] = [
  { id: 'map', label: 'Map' },
  { id: 'table', label: 'Statistics Table' },
  { id: 'charts', label: 'Charts' },
]

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
        queen.season,
        queen.hometown,
        queen.state,
        queen.region,
        queen.placement,
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

  return (
    <section className="page-grid map-layout" aria-labelledby="map-title">
      <div className="panel map-panel">
        <div className="section-heading">
          <p className="eyebrow">Map</p>
          <h2 id="map-title">US hometown view</h2>
          <p>
            Pins are plotted as a lightweight US-only prototype. The data model
            already stores coordinates, so this can grow into a globe or
            interactive tile map later.
          </p>
        </div>

        <div
          className="us-map"
          role="img"
          aria-label="Map of the United States with queen hometown pins"
        >
          <svg viewBox="0 0 100 64" aria-hidden="true">
            <path
              className="map-shape"
              d="M8 18 L18 9 L32 11 L42 15 L54 13 L65 17 L79 17 L92 26 L88 39 L82 48 L72 52 L62 58 L48 55 L36 58 L24 51 L15 48 L9 38 Z"
            />
            <path className="map-shape alaska" d="M9 51 L18 49 L26 55 L18 61 L8 59 Z" />
            <path className="map-shape hawaii" d="M31 58 L34 57 L37 59 L34 61 Z" />
            {queenStats.map((queen) => (
              <g key={queen.id}>
                <circle
                  className="map-pin-halo"
                  cx={queen.mapX}
                  cy={queen.mapY}
                  r={5 + stateTotals[queen.state]}
                />
                <circle className="map-pin" cx={queen.mapX} cy={queen.mapY} r="2.4" />
              </g>
            ))}
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
  filteredQueens: QueenStat[]
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
                <td>{queen.season}</td>
                <td>
                  {queen.hometown}, {queen.state}
                </td>
                <td>{queen.region}</td>
                <td>{queen.placement}</td>
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
              <p>{queen.season}</p>
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

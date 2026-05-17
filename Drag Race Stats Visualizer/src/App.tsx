import { useMemo, useState } from 'react'
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  dashboardQueensQuery,
  queryDragRaceStore,
  type DashboardQueen,
} from './data/dragRaceGraphql'
import './App.css'

type Page = 'map' | 'table' | 'charts'

const mapStyleUrl = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

const pinOffsets = [
  [0, 0],
  [-0.08, -0.055],
  [0.08, -0.045],
  [-0.065, 0.065],
  [0.065, 0.065],
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
  const [selectedQueen, setSelectedQueen] = useState<DashboardQueen | null>(null)
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
            React Map GL and MapLibre render an interactive basemap with zoom,
            pan, and hometown markers. Select a pin to see queen, city, state,
            season, and placement details without needing a Mapbox token.
          </p>
        </div>

        <div
          className="us-map"
          role="region"
          aria-label="Interactive map of the United States with queen hometown pins by state"
        >
          <Map
            initialViewState={{
              latitude: 39.5,
              longitude: -98.35,
              zoom: 3.15,
            }}
            mapStyle={mapStyleUrl}
            maxBounds={[
              [-128, 22],
              [-64, 52],
            ]}
            maxZoom={8}
            minZoom={2.4}
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" showCompass={false} />

            {Object.entries(queensByState).flatMap(([state, queens]) =>
              queens.map((queen, queenIndex) => {
                const [offsetLon, offsetLat] = pinOffsets[queenIndex % pinOffsets.length]

                return (
                  <Marker
                    anchor="bottom"
                    key={queen.id}
                    latitude={queen.lat + offsetLat}
                    longitude={queen.lon + offsetLon}
                  >
                    <button
                      type="button"
                      className="map-marker"
                      aria-label={`${queen.name} from ${queen.hometown}, ${state}`}
                      onClick={() => setSelectedQueen(queen)}
                    >
                      <span className="map-pin-halo" />
                      <span className="map-pin" />
                    </button>
                  </Marker>
                )
              }),
            )}

            {selectedQueen && (
              <Popup
                anchor="top"
                className="queen-popup"
                closeButton
                closeOnClick={false}
                latitude={selectedQueen.lat}
                longitude={selectedQueen.lon}
                maxWidth="260px"
                offset={14}
                onClose={() => setSelectedQueen(null)}
              >
                <h3>{selectedQueen.name}</h3>
                <p>
                  {selectedQueen.hometown}, {selectedQueen.state}
                </p>
                <dl>
                  <div>
                    <dt>Season</dt>
                    <dd>{selectedQueen.primarySeasonName}</dd>
                  </div>
                  <div>
                    <dt>Placement</dt>
                    <dd>{selectedQueen.placementsLabel}</dd>
                  </div>
                </dl>
              </Popup>
            )}
          </Map>
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
